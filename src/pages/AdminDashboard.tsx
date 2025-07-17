import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Settings, Database, Shield, Download } from 'lucide-react';
import Layout from '../components/layout/Layout';
import AnalyticsDashboard from '../components/ui/AnalyticsDashboard';
import { SupabaseConnectionTest } from '../components/ui/SupabaseConnectionTest';
import StripeConnectionTest from '../components/ui/StripeConnectionTest';
import SupabaseSetup from '../components/ui/SupabaseSetup';
import DatabaseSetupHelper from '../components/ui/DatabaseSetupHelper';
import CredentialVerifier from '../components/ui/CredentialVerifier';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

type TabType = 'analytics' | 'customers' | 'settings' | 'integrations';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');

  const tabs = [
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
    { id: 'customers' as TabType, label: 'Customers', icon: Users },
    { id: 'integrations' as TabType, label: 'Integrations', icon: Database },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard />;
      
      case 'customers':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Management</h3>
              <p className="text-gray-600 mb-4">
                Manage customer data, view purchase history, and handle support requests.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  View All Customers
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Customer Data
                </Button>
                <Button variant="outline" className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
              </div>
            </Card>
          </div>
        );
      
      case 'integrations':
        return (
          <div className="space-y-6">
            <CredentialVerifier />
            <SupabaseSetup />
            <DatabaseSetupHelper />
            <SupabaseConnectionTest />
            <StripeConnectionTest />
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Application Settings</h3>
              <p className="text-gray-600 mb-4">
                Configure application settings, manage API keys, and update business rules.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Premium Report Price
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    defaultValue="19"
                    min="1"
                    max="999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Questions Count
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    defaultValue="15"
                    min="5"
                    max="50"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenance-mode"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="maintenance-mode" className="ml-2 block text-sm text-gray-700">
                    Enable maintenance mode
                  </label>
                </div>
              </div>
              <div className="mt-6">
                <Button>Save Settings</Button>
              </div>
            </Card>
          </div>
        );
      
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your Affinity AI application and monitor performance</p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mb-8"
          >
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;