import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Download,
  Calendar,
  Heart,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { getCustomerAnalytics, getCustomerInsights, getArchetypeAnalytics, exportCustomerData, CustomerAnalytics, CustomerInsight } from '../../lib/analytics';
import Button from './Button';
import Card from './Card';

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
  const [analytics, setAnalytics] = useState<CustomerAnalytics | null>(null);
  const [insights, setInsights] = useState<CustomerInsight[]>([]);
  const [archetypeStats, setArchetypeStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [analyticsData, insightsData, archetypeData] = await Promise.all([
        getCustomerAnalytics(),
        getCustomerInsights(),
        getArchetypeAnalytics()
      ]);

      setAnalytics(analyticsData);
      setInsights(insightsData || []);
      setArchetypeStats(archetypeData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const csvData = await exportCustomerData('csv');
      if (csvData) {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `customer-data-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to export data:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-8 text-center border-red-200 bg-red-50">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Analytics Error</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={loadAnalytics} variant="outline">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-8 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Data Available</h3>
          <p className="text-gray-600">Analytics data is not available yet.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Customer insights and business metrics</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={loadAnalytics}>
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalCustomers.toLocaleString()}</p>
                <p className={`text-sm ${analytics.monthlyStats.growth.customers >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(analytics.monthlyStats.growth.customers)} from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
                <p className={`text-sm ${analytics.monthlyStats.growth.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(analytics.monthlyStats.growth.revenue)} from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.averageOrderValue)}</p>
                <p className="text-sm text-gray-500">Per customer purchase</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.conversionMetrics.conversionRate?.toFixed(1) || '0.0'}%
                </p>
                <p className="text-sm text-gray-500">Quiz to purchase</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Archetypes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Popular Archetypes</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {Object.entries(analytics.popularArchetypes)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([archetype, count], index) => {
                  const percentage = (count / Object.values(analytics.popularArchetypes).reduce((a, b) => a + b, 0)) * 100;
                  return (
                    <div key={archetype} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-primary-${(index + 1) * 100}`} />
                        <span className="text-sm font-medium text-gray-700">{archetype}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900">{count}</span>
                        <span className="text-xs text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        </motion.div>

        {/* Monthly Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {analytics.monthlyStats.currentMonth.customers} customers
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(analytics.monthlyStats.currentMonth.revenue)} revenue
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Last Month</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {analytics.monthlyStats.previousMonth.customers} customers
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(analytics.monthlyStats.previousMonth.revenue)} revenue
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Growth Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customer Growth</span>
                    <span className={`text-sm font-medium ${analytics.monthlyStats.growth.customers >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(analytics.monthlyStats.growth.customers)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue Growth</span>
                    <span className={`text-sm font-medium ${analytics.monthlyStats.growth.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(analytics.monthlyStats.growth.revenue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Customer Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
            <Heart className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Archetype</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Purchases</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Lifetime Value</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {insights.slice(0, 10).map((customer, index) => (
                  <tr key={customer.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-700">{customer.preferredArchetype}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900">{customer.totalPurchases}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(customer.lifetimeValue)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          customer.riskScore < 30 ? 'bg-green-500' :
                          customer.riskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm text-gray-700">{customer.riskScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {insights.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No customer data available yet</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Purchases</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analytics.recentPurchases.slice(0, 5).map((purchase, index) => (
              <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{purchase.name}</p>
                    <p className="text-sm text-gray-500">{purchase.archetype_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatCurrency((purchase.amount_paid || 0) / 100)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(purchase.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            
            {analytics.recentPurchases.length === 0 && (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent purchases</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;