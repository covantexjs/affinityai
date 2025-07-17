import { createClient } from '@supabase/supabase-js';

// Get environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Single client instance to prevent multiple GoTrueClient instances
let supabase: any = null;
let currentCredentials: { url: string; key: string } | null = null;

// Initialize Supabase client if credentials are available
const initializeSupabase = () => {
  if (supabaseUrl && supabaseAnonKey) {
    console.log('🔗 [SUPABASE] Initializing client with provided credentials');
    try {
      // Check if we already have a client with these credentials
      if (supabase && currentCredentials?.url === supabaseUrl && currentCredentials?.key === supabaseAnonKey) {
        console.log('🔄 [SUPABASE] Client already initialized with these credentials');
        return true;
      }
      
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      });
      
      currentCredentials = { url: supabaseUrl, key: supabaseAnonKey };
      return true;
    } catch (error) {
      console.error('❌ [SUPABASE] Failed to initialize client:', error);
      return false;
    }
  }
  return false;
};

// Try to initialize on load
const isInitialized = initializeSupabase();

// Export a function to manually initialize Supabase
export const initializeSupabaseWithCredentials = (url: string, anonKey: string) => {
  console.log('🔗 [SUPABASE] Manually initializing with new credentials');
  
  // Check if we already have a client with these exact credentials
  if (supabase && currentCredentials?.url === url && currentCredentials?.key === anonKey) {
    console.log('✅ [SUPABASE] Client already initialized with these credentials');
    return supabase;
  }
  
  try {
    // Clear any existing client first
    if (supabase) {
      console.log('🧹 [SUPABASE] Clearing existing client to prevent multiple instances');
      supabase = null;
      currentCredentials = null;
    }
    
    supabase = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        // Add a unique storage key to prevent conflicts
        storageKey: `supabase-auth-${url.replace(/[^a-zA-Z0-9]/g, '')}`
      }
    });
    
    currentCredentials = { url, key: anonKey };
    
    // Store credentials in sessionStorage for persistence during the session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('supabase_url', url);
      sessionStorage.setItem('supabase_anon_key', anonKey);
    }
    
    console.log('✅ [SUPABASE] Client initialized successfully');
    return supabase;
  } catch (error) {
    console.error('❌ [SUPABASE] Failed to initialize with new credentials:', error);
    supabase = null;
    currentCredentials = null;
    throw error;
  }
};

// Try to restore from sessionStorage if available
if (typeof window !== 'undefined' && !supabase) {
  const storedUrl = sessionStorage.getItem('supabase_url');
  const storedKey = sessionStorage.getItem('supabase_anon_key');
  
  if (storedUrl && storedKey) {
    console.log('🔄 [SUPABASE] Restoring from session storage');
    try {
      initializeSupabaseWithCredentials(storedUrl, storedKey);
    } catch (error) {
      console.warn('⚠️ [SUPABASE] Failed to restore from session storage:', error);
      // Clear invalid stored credentials
      sessionStorage.removeItem('supabase_url');
      sessionStorage.removeItem('supabase_anon_key');
    }
  }
}

// Export a getter for the Supabase client
export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase not initialized. Please provide credentials first.');
  }
  return supabase;
};

// Check if Supabase is ready
export const isSupabaseReady = () => {
  // Check if we have a client instance (either from env vars or manual initialization)
  if (supabase) return true;
  
  // Check if we have environment variables
  return !!supabaseUrl && !!supabaseAnonKey;
};

// Get current configuration
export const getSupabaseConfig = () => {
  // Return current credentials if available
  if (currentCredentials) {
    return {
      url: currentCredentials.url,
      hasAnonKey: true,
      isInitialized: !!supabase
    };
  }
  
  // Try to get from sessionStorage first
  if (typeof window !== 'undefined') {
    const storedUrl = sessionStorage.getItem('supabase_url');
    const storedKey = sessionStorage.getItem('supabase_anon_key');
    
    if (storedUrl && storedKey) {
      return {
        url: storedUrl,
        hasAnonKey: true,
        isInitialized: !!supabase
      };
    }
  }
  
  // Fallback to environment variables
  return {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    isInitialized: !!supabase
  };
};

// Function to clear current client (useful for testing or switching projects)
export const clearSupabaseClient = () => {
  console.log('🧹 [SUPABASE] Clearing client and credentials');
  supabase = null;
  currentCredentials = null;
  
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('supabase_url');
    sessionStorage.removeItem('supabase_anon_key');
  }
};

// Enhanced customer tracking interfaces
export interface CustomerProfile {
  id?: string;
  email: string;
  name: string;
  first_purchase_date?: string;
  total_purchases?: number;
  total_spent?: number;
  preferred_archetype?: string;
  marketing_consent?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PurchaseRecord {
  id?: string;
  customer_id?: string;
  email: string;
  name: string;
  archetype_id: string;
  archetype_name: string;
  dimension_scores: {
    emotional_depth: number;
    relational_style: number;
    values_alignment: number;
    communication_style: number;
  };
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  payment_status: string;
  amount_paid?: number;
  currency?: string;
  purchase_type: 'premium_report' | 'subscription' | 'addon';
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionData {
  id?: string;
  customer_id: string;
  stripe_subscription_id?: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing';
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  plan_name?: string;
  plan_price?: number;
  created_at?: string;
  updated_at?: string;
}

// Customer management functions
export const createOrUpdateCustomer = async (customerData: CustomerProfile): Promise<CustomerProfile> => {
  if (!supabase) {
    console.warn('⚠️ [SUPABASE] Not initialized, skipping customer creation');
    return customerData;
  }

  console.log('👤 [SUPABASE] Creating/updating customer:', customerData.email);
  
  try {
    // Check if customer exists
    const { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customerData.email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new customers
      throw fetchError;
    }

    if (existingCustomer) {
      // Update existing customer
      const { data: updatedCustomer, error: updateError } = await supabase
        .from('customers')
        .update({
          name: customerData.name,
          total_purchases: (existingCustomer.total_purchases || 0) + 1,
          total_spent: (existingCustomer.total_spent || 0) + (customerData.total_spent || 0),
          preferred_archetype: customerData.preferred_archetype || existingCustomer.preferred_archetype,
          marketing_consent: customerData.marketing_consent ?? existingCustomer.marketing_consent,
          updated_at: new Date().toISOString()
        })
        .eq('email', customerData.email)
        .select()
        .single();

      if (updateError) throw updateError;
      
      console.log('✅ [SUPABASE] Customer updated successfully');
      return updatedCustomer;
    } else {
      // Create new customer
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({
          email: customerData.email,
          name: customerData.name,
          first_purchase_date: new Date().toISOString(),
          total_purchases: 1,
          total_spent: customerData.total_spent || 0,
          preferred_archetype: customerData.preferred_archetype,
          marketing_consent: customerData.marketing_consent || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) throw createError;
      
      console.log('✅ [SUPABASE] New customer created successfully');
      return newCustomer;
    }
  } catch (error) {
    console.error('💥 [SUPABASE] Failed to create/update customer:', error);
    throw error;
  }
};

// Enhanced purchase tracking
export const recordPurchase = async (purchaseData: PurchaseRecord): Promise<PurchaseRecord> => {
  if (!supabase) {
    console.warn('⚠️ [SUPABASE] Not initialized, skipping purchase recording');
    return purchaseData;
  }
  
  try {
    console.log('💰 [SUPABASE] Recording purchase:', {
      email: purchaseData.email,
      amount: purchaseData.amount_paid,
      type: purchaseData.purchase_type
    });
    
    // First, create or update customer profile
    let customer;
    try {
      customer = await createOrUpdateCustomer({
        email: purchaseData.email,
        name: purchaseData.name,
        preferred_archetype: purchaseData.archetype_id,
        total_spent: purchaseData.amount_paid || 0
      });
    } catch (customerError) {
      console.warn('⚠️ [SUPABASE] Failed to create/update customer, continuing with purchase:', customerError);
    }

    // Record the purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        customer_id: customer?.id || null, // May be null if customer creation failed
        email: purchaseData.email,
        name: purchaseData.name,
        archetype_id: purchaseData.archetype_id,
        archetype_name: purchaseData.archetype_name,
        dimension_scores: purchaseData.dimension_scores,
        stripe_session_id: purchaseData.stripe_session_id,
        stripe_payment_intent_id: purchaseData.stripe_payment_intent_id,
        payment_status: purchaseData.payment_status,
        amount_paid: purchaseData.amount_paid,
        currency: purchaseData.currency || 'usd',
        purchase_type: purchaseData.purchase_type,
        metadata: purchaseData.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (purchaseError) throw purchaseError;
    
    console.log('✅ [SUPABASE] Purchase recorded successfully');
    return purchase;
  } catch (error: any) {
    console.error('💥 [SUPABASE] Failed to record purchase:', error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const storeQuizPurchase = async (data: any) => {
  return recordPurchase({
    email: data.email,
    name: data.name,
    archetype_id: data.archetype_id,
    archetype_name: data.archetype_name,
    dimension_scores: data.dimension_scores,
    stripe_session_id: data.stripe_session_id,
    stripe_payment_intent_id: data.stripe_payment_intent_id,
    payment_status: data.payment_status || 'pending',
    amount_paid: data.amount_paid,
    currency: data.currency || 'usd',
    purchase_type: 'premium_report'
  });
};

// Customer lookup functions
export const getCustomerByEmail = async (email: string): Promise<CustomerProfile | null> => {
  if (!supabase) {
    console.warn('⚠️ [SUPABASE] Not initialized, cannot fetch customer');
    return null;
  }

  console.log('🔍 [SUPABASE] Looking up customer:', email);
  
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('💥 [SUPABASE] Failed to get customer:', error);
    return null;
  }
};

export const getCustomerPurchases = async (email: string): Promise<PurchaseRecord[]> => {
  if (!supabase) {
    console.warn('⚠️ [SUPABASE] Not initialized, cannot fetch purchases');
    return [];
  }

  console.log('📊 [SUPABASE] Getting purchase history for:', email);
  
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    console.log(`✅ [SUPABASE] Found ${data?.length || 0} purchases`);
    return data || [];
  } catch (error) {
    console.error('💥 [SUPABASE] Failed to get purchases:', error);
    return [];
  }
};

// Analytics functions
export const getCustomerAnalytics = async () => {
  if (!supabase) {
    console.warn('⚠️ [SUPABASE] Not initialized, cannot fetch analytics');
    return null;
  }

  console.log('📈 [SUPABASE] Fetching customer analytics...');
  
  try {
    // Get total customers
    const { count: totalCustomers } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    // Get total revenue
    const { data: revenueData } = await supabase
      .from('purchases')
      .select('amount_paid')
      .eq('payment_status', 'paid');

    const totalRevenue = revenueData?.reduce((sum, purchase) => sum + (purchase.amount_paid || 0), 0) || 0;

    // Get popular archetypes
    const { data: archetypeData } = await supabase
      .from('purchases')
      .select('archetype_name')
      .eq('payment_status', 'paid');

    const archetypeCounts = archetypeData?.reduce((acc, purchase) => {
      acc[purchase.archetype_name] = (acc[purchase.archetype_name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Get recent purchases
    const { data: recentPurchases } = await supabase
      .from('purchases')
      .select('*')
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .limit(10);

    const analytics = {
      totalCustomers: totalCustomers || 0,
      totalRevenue: totalRevenue / 100, // Convert from cents to dollars
      popularArchetypes: archetypeCounts,
      recentPurchases: recentPurchases || [],
      averageOrderValue: totalCustomers ? (totalRevenue / totalCustomers) / 100 : 0
    };

    console.log('✅ [SUPABASE] Analytics fetched successfully');
    return analytics;
  } catch (error) {
    console.error('💥 [SUPABASE] Failed to fetch analytics:', error);
    return null;
  }
};

// Legacy functions for backward compatibility
export const getQuizPurchaseByEmail = async (email: string) => {
  const purchases = await getCustomerPurchases(email);
  return purchases.find(p => p.payment_status === 'paid') || null;
};

export const getQuizPurchaseBySessionId = async (sessionId: string) => {
  if (!supabase) {
    console.warn('⚠️ [SUPABASE] Not initialized, cannot fetch purchase');
    return null;
  }

  console.log('🔍 [SUPABASE] Getting purchase by session ID:', sessionId);
  
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('💥 [SUPABASE] Failed to get purchase by session:', error);
    return null;
  }
};

// Test Supabase connection with better error handling
export const testSupabaseConnection = async () => {
  if (!supabase) {
    console.warn('⚠️ [SUPABASE] Cannot test connection - not initialized');
    return false;
  }

  console.log('🧪 [SUPABASE] Testing connection...');
  
  try {
    const startTime = Date.now();
    
    // Try a simple query with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const { data, error } = await Promise.race([
      supabase
        .from('customers')
        .select('id')
        .limit(1)
        .abortSignal(controller.signal),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      )
    ]);
    
    clearTimeout(timeoutId);

    const responseTime = Date.now() - startTime;

    if (error) {
      console.error('❌ [SUPABASE] Connection test failed:', error);
      
      // Check for specific error types
      if (error.code === '42P01') {
        console.log('ℹ️ [SUPABASE] Table does not exist - this is expected for new setups');
        return false;
      }
      
      return false;
    }

    console.log('✅ [SUPABASE] Connection test successful:', {
      responseTime: `${responseTime}ms`,
      recordsFound: data?.length || 0
    });
    return true;
  } catch (error) {
    console.error('💥 [SUPABASE] Connection test error:', error);
    return false;
  }
};

// Get connection status with detailed info
export const getSupabaseStatus = async () => {
  if (!supabase) {
    return {
      connected: false,
      error: 'Not initialized - please configure your Supabase credentials',
      responseTime: null,
      needsSetup: true,
      tableExists: false
    };
  }

  console.log('📊 [SUPABASE] Getting detailed status...');
  
  try {
    const startTime = Date.now();
    
    // Test basic connectivity with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    let healthCheck, healthError;
    
    try {
      const result = await Promise.race([
        supabase
          .from('customers')
          .select('id')
          .limit(1)
          .abortSignal(controller.signal),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 8000)
        )
      ]);
      
      healthCheck = result.data;
      healthError = result.error;
    } catch (timeoutError: any) {
      healthError = timeoutError;
    } finally {
      clearTimeout(timeoutId);
    }

    const responseTime = Date.now() - startTime;

    if (healthError) {
      console.log('ℹ️ [SUPABASE] Status check detected issue:', healthError);
      
      // Handle network/timeout errors
      if (healthError.name === 'AbortError' || healthError.message?.includes('timeout')) {
        return {
          connected: false,
          error: 'Connection timeout - check your network connection and Supabase URL',
          responseTime: responseTime,
          needsSetup: false,
          tableExists: false
        };
      }
      
      // Check if it's a table not found error
      const isTableMissing = healthError.code === '42P01' ||
                           healthError.status === 404 ||
                           healthError.message?.includes('relation "customers" does not exist');
      
      if (isTableMissing) {
        console.log('ℹ️ [SUPABASE] Database tables missing - setup required');
        return {
          connected: false,
          error: 'Database setup required - customer tracking tables do not exist',
          responseTime: responseTime,
          needsSetup: true,
          tableExists: false
        };
      }
      
      return {
        connected: false,
        error: healthError.message || 'Connection failed',
        responseTime: responseTime,
        needsSetup: false,
        tableExists: false
      };
    }

    // Get customer count
    let count = 0;
    try {
      const { count: customerCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });
      count = customerCount || 0;
    } catch (countError) {
      console.warn('⚠️ [SUPABASE] Could not get customer count:', countError);
    }

    console.log('✅ [SUPABASE] Status check successful:', {
      responseTime: `${responseTime}ms`,
      customerCount: count
    });

    return {
      connected: true,
      responseTime,
      recordCount: count,
      needsSetup: false,
      tableExists: true
    };
  } catch (error: any) {
    console.log('ℹ️ [SUPABASE] Status check caught error:', error);
    
    return {
      connected: false,
      error: error.message || 'Unknown error',
      responseTime: null,
      needsSetup: false,
      tableExists: false
    };
  }
};