import { getSupabaseClient, isSupabaseReady } from './supabase';

export interface CustomerAnalytics {
  totalCustomers: number;
  totalRevenue: number;
  averageOrderValue: number;
  popularArchetypes: Record<string, number>;
  recentPurchases: any[];
  conversionMetrics: {
    totalVisitors?: number;
    quizCompletions?: number;
    purchaseConversions?: number;
    conversionRate?: number;
  };
  monthlyStats: {
    currentMonth: {
      customers: number;
      revenue: number;
      purchases: number;
    };
    previousMonth: {
      customers: number;
      revenue: number;
      purchases: number;
    };
    growth: {
      customers: number;
      revenue: number;
      purchases: number;
    };
  };
}

export interface CustomerInsight {
  id: string;
  email: string;
  name: string;
  totalPurchases: number;
  totalSpent: number;
  preferredArchetype: string;
  firstPurchaseDate: string;
  lastPurchaseDate: string;
  daysSinceLastPurchase: number;
  lifetimeValue: number;
  riskScore: number; // 0-100, higher = more likely to churn
}

/**
 * Get comprehensive customer analytics
 */
export const getCustomerAnalytics = async (): Promise<CustomerAnalytics | null> => {
  if (!isSupabaseReady()) {
    console.warn('⚠️ [ANALYTICS] Supabase not ready');
    return null;
  }

  const supabase = getSupabaseClient();
  console.log('📊 [ANALYTICS] Fetching comprehensive analytics...');

  try {
    // Get current month dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch all data in parallel
    const [
      customersResult,
      purchasesResult,
      recentPurchasesResult,
      currentMonthCustomersResult,
      currentMonthPurchasesResult,
      previousMonthCustomersResult,
      previousMonthPurchasesResult
    ] = await Promise.all([
      // Total customers
      supabase.from('customers').select('*', { count: 'exact', head: true }),
      
      // All paid purchases
      supabase
        .from('purchases')
        .select('amount_paid, archetype_name, created_at')
        .eq('payment_status', 'paid'),
      
      // Recent purchases for activity feed
      supabase
        .from('purchases')
        .select('*')
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false })
        .limit(10),
      
      // Current month customers
      supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', currentMonthStart.toISOString()),
      
      // Current month purchases
      supabase
        .from('purchases')
        .select('amount_paid')
        .eq('payment_status', 'paid')
        .gte('created_at', currentMonthStart.toISOString()),
      
      // Previous month customers
      supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', previousMonthStart.toISOString())
        .lt('created_at', currentMonthStart.toISOString()),
      
      // Previous month purchases
      supabase
        .from('purchases')
        .select('amount_paid')
        .eq('payment_status', 'paid')
        .gte('created_at', previousMonthStart.toISOString())
        .lt('created_at', currentMonthStart.toISOString())
    ]);

    // Process results
    const totalCustomers = customersResult.count || 0;
    const purchases = purchasesResult.data || [];
    const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount_paid || 0), 0) / 100; // Convert to dollars
    const averageOrderValue = purchases.length > 0 ? totalRevenue / purchases.length : 0;

    // Calculate popular archetypes
    const archetypeCounts = purchases.reduce((acc, purchase) => {
      const archetype = purchase.archetype_name;
      acc[archetype] = (acc[archetype] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Monthly stats
    const currentMonthCustomers = currentMonthCustomersResult.count || 0;
    const currentMonthPurchases = currentMonthPurchasesResult.data || [];
    const currentMonthRevenue = currentMonthPurchases.reduce((sum, p) => sum + (p.amount_paid || 0), 0) / 100;

    const previousMonthCustomers = previousMonthCustomersResult.count || 0;
    const previousMonthPurchases = previousMonthPurchasesResult.data || [];
    const previousMonthRevenue = previousMonthPurchases.reduce((sum, p) => sum + (p.amount_paid || 0), 0) / 100;

    // Calculate growth rates
    const customerGrowth = previousMonthCustomers > 0 
      ? ((currentMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100 
      : 0;
    
    const revenueGrowth = previousMonthRevenue > 0 
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : 0;
    
    const purchaseGrowth = previousMonthPurchases.length > 0 
      ? ((currentMonthPurchases.length - previousMonthPurchases.length) / previousMonthPurchases.length) * 100 
      : 0;

    const analytics: CustomerAnalytics = {
      totalCustomers,
      totalRevenue,
      averageOrderValue,
      popularArchetypes: archetypeCounts,
      recentPurchases: recentPurchasesResult.data || [],
      conversionMetrics: {
        purchaseConversions: purchases.length,
        conversionRate: totalCustomers > 0 ? (purchases.length / totalCustomers) * 100 : 0
      },
      monthlyStats: {
        currentMonth: {
          customers: currentMonthCustomers,
          revenue: currentMonthRevenue,
          purchases: currentMonthPurchases.length
        },
        previousMonth: {
          customers: previousMonthCustomers,
          revenue: previousMonthRevenue,
          purchases: previousMonthPurchases.length
        },
        growth: {
          customers: customerGrowth,
          revenue: revenueGrowth,
          purchases: purchaseGrowth
        }
      }
    };

    console.log('✅ [ANALYTICS] Analytics calculated successfully');
    return analytics;
  } catch (error) {
    console.error('💥 [ANALYTICS] Failed to fetch analytics:', error);
    return null;
  }
};

/**
 * Get detailed customer insights for business intelligence
 */
export const getCustomerInsights = async (): Promise<CustomerInsight[]> => {
  if (!isSupabaseReady()) {
    console.warn('⚠️ [ANALYTICS] Supabase not ready');
    return [];
  }

  const supabase = getSupabaseClient();
  console.log('🔍 [ANALYTICS] Fetching customer insights...');

  try {
    // Get customers with their purchase data
    const { data: customers, error } = await supabase
      .from('customers')
      .select(`
        *,
        purchases:purchases(
          amount_paid,
          created_at,
          payment_status
        )
      `);

    if (error) throw error;

    const insights: CustomerInsight[] = customers?.map(customer => {
      const paidPurchases = customer.purchases?.filter(p => p.payment_status === 'paid') || [];
      const totalSpent = paidPurchases.reduce((sum, p) => sum + (p.amount_paid || 0), 0) / 100;
      
      const purchaseDates = paidPurchases.map(p => new Date(p.created_at)).sort((a, b) => b.getTime() - a.getTime());
      const lastPurchaseDate = purchaseDates[0];
      const firstPurchaseDate = purchaseDates[purchaseDates.length - 1];
      
      const daysSinceLastPurchase = lastPurchaseDate 
        ? Math.floor((Date.now() - lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      // Calculate risk score (0-100, higher = more likely to churn)
      let riskScore = 0;
      if (daysSinceLastPurchase > 90) riskScore += 40;
      else if (daysSinceLastPurchase > 60) riskScore += 25;
      else if (daysSinceLastPurchase > 30) riskScore += 10;
      
      if (paidPurchases.length === 1) riskScore += 30; // Single purchase customers
      if (totalSpent < 20) riskScore += 20; // Low value customers
      
      riskScore = Math.min(100, riskScore);

      return {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        totalPurchases: paidPurchases.length,
        totalSpent,
        preferredArchetype: customer.preferred_archetype || 'Unknown',
        firstPurchaseDate: firstPurchaseDate?.toISOString() || customer.created_at,
        lastPurchaseDate: lastPurchaseDate?.toISOString() || customer.created_at,
        daysSinceLastPurchase,
        lifetimeValue: totalSpent,
        riskScore
      };
    }) || [];

    console.log(`✅ [ANALYTICS] Generated insights for ${insights.length} customers`);
    return insights.sort((a, b) => b.lifetimeValue - a.lifetimeValue);
  } catch (error) {
    console.error('💥 [ANALYTICS] Failed to fetch customer insights:', error);
    return [];
  }
};

/**
 * Get archetype performance metrics
 */
export const getArchetypeAnalytics = async () => {
  if (!isSupabaseReady()) {
    console.warn('⚠️ [ANALYTICS] Supabase not ready');
    return null;
  }

  const supabase = getSupabaseClient();
  console.log('🎭 [ANALYTICS] Fetching archetype analytics...');

  try {
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('archetype_name, amount_paid, created_at')
      .eq('payment_status', 'paid');

    if (error) throw error;

    const archetypeStats = purchases?.reduce((acc, purchase) => {
      const archetype = purchase.archetype_name;
      if (!acc[archetype]) {
        acc[archetype] = {
          name: archetype,
          totalPurchases: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          conversionRate: 0 // Would need quiz completion data to calculate
        };
      }
      
      acc[archetype].totalPurchases += 1;
      acc[archetype].totalRevenue += (purchase.amount_paid || 0) / 100;
      
      return acc;
    }, {} as Record<string, any>) || {};

    // Calculate average order values
    Object.values(archetypeStats).forEach((stats: any) => {
      stats.averageOrderValue = stats.totalPurchases > 0 
        ? stats.totalRevenue / stats.totalPurchases 
        : 0;
    });

    console.log('✅ [ANALYTICS] Archetype analytics calculated');
    return Object.values(archetypeStats);
  } catch (error) {
    console.error('💥 [ANALYTICS] Failed to fetch archetype analytics:', error);
    return null;
  }
};

/**
 * Track quiz completion for conversion analytics
 */
export const trackQuizCompletion = async (email?: string, archetype?: string) => {
  if (!isSupabaseReady()) {
    console.warn('⚠️ [ANALYTICS] Supabase not ready, skipping quiz tracking');
    return;
  }

  const supabase = getSupabaseClient();
  console.log('📝 [ANALYTICS] Tracking quiz completion');

  try {
    // Store quiz completion event
    await supabase
      .from('quiz_completions')
      .insert({
        email: email || null,
        archetype: archetype || null,
        completed_at: new Date().toISOString(),
        session_id: crypto.randomUUID()
      });

    console.log('✅ [ANALYTICS] Quiz completion tracked');
  } catch (error) {
    console.error('💥 [ANALYTICS] Failed to track quiz completion:', error);
  }
};

/**
 * Export customer data for marketing/CRM
 */
export const exportCustomerData = async (format: 'csv' | 'json' = 'csv') => {
  if (!isSupabaseReady()) {
    console.warn('⚠️ [ANALYTICS] Supabase not ready');
    return null;
  }

  const supabase = getSupabaseClient();
  console.log('📤 [ANALYTICS] Exporting customer data...');

  try {
    const { data: customers, error } = await supabase
      .from('customers')
      .select(`
        email,
        name,
        total_purchases,
        total_spent,
        preferred_archetype,
        marketing_consent,
        first_purchase_date,
        created_at
      `)
      .order('total_spent', { ascending: false });

    if (error) throw error;

    if (format === 'csv') {
      const headers = [
        'Email', 'Name', 'Total Purchases', 'Total Spent', 
        'Preferred Archetype', 'Marketing Consent', 'First Purchase', 'Created At'
      ];
      
      const csvContent = [
        headers.join(','),
        ...customers?.map(customer => [
          customer.email,
          `"${customer.name}"`,
          customer.total_purchases,
          (customer.total_spent / 100).toFixed(2),
          customer.preferred_archetype || '',
          customer.marketing_consent ? 'Yes' : 'No',
          customer.first_purchase_date || '',
          customer.created_at
        ].join(',')) || []
      ].join('\n');

      return csvContent;
    }

    return JSON.stringify(customers, null, 2);
  } catch (error) {
    console.error('💥 [ANALYTICS] Failed to export customer data:', error);
    return null;
  }
};