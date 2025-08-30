import { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Brain, Upload, History, FileText, Clock, User } from 'lucide-react';
import UploadSection from './UploadSection';
import InsightsDisplay from './InsightsDisplay';
import HistoryTab from './HistoryTab';
import ThemeToggle from './ThemeToggle';
import DeveloperProfile from './DeveloperProfile';
import { useApiService } from '../lib/api';
import type { InsightDocument } from '../types';

type TabType = 'upload' | 'history';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [insights, setInsights] = useState<InsightDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [latestInsight, setLatestInsight] = useState<InsightDocument | null>(null);
  const [showDeveloperProfile, setShowDeveloperProfile] = useState(false);
  
  const { user } = useUser();
  const { getInsights } = useApiService();

  // Load insights when component mounts and when switching to history tab
  const loadInsights = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await getInsights();
      setInsights(response.insights);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load insights on component mount to populate dashboard metrics
  useEffect(() => {
    loadInsights();
  }, []);

  // Also load insights when switching to history tab
  useEffect(() => {
    if (activeTab === 'history') {
      loadInsights();
    }
  }, [activeTab]);

  // Set up periodic refresh every 30 seconds to keep dashboard updated
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'upload') {
        loadInsights(true); // Refresh data in background
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleUploadSuccess = (newInsight: InsightDocument) => {
    setLatestInsight(newInsight);
    // Add to insights list and refresh metrics
    setInsights(prevInsights => [newInsight, ...prevInsights]);
  };

  // Refresh dashboard data
  const refreshDashboard = async () => {
    await loadInsights(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">DocInsight AI</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">AI-Powered Document Analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={refreshDashboard}
                disabled={refreshing}
                className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  refreshing 
                    ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Refresh Dashboard"
              >
                <Clock className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <User className="h-4 w-4" />
                <span>Welcome, {user?.firstName || 'User'}</span>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Resume Specialization Note */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <span className="text-blue-600 dark:text-blue-400">📄</span>
            <span className="text-blue-800 dark:text-blue-200 font-medium">
              This application is specialized for resume analysis - prefer to upload resumes for best results
            </span>
            <span className="text-blue-600 dark:text-blue-400">✨</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('upload');
                // Refresh dashboard data when switching to upload tab
                if (activeTab !== 'upload') {
                  loadInsights(true);
                }
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>Upload & Analyze</span>
            </button>
            
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <History className="h-4 w-4" />
              <span>History</span>
              {insights.length > 0 && (
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
                  {insights.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'upload' && (
          <div className="space-y-8">
            {/* Upload Section */}
            <UploadSection onUploadSuccess={handleUploadSuccess} />
            
            {/* Latest Insight Display */}
            {latestInsight && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span>Latest Analysis</span>
                </h2>
                <InsightsDisplay insight={latestInsight} />
              </div>
            )}
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {loading ? '...' : insights.length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                    <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Analyses</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {loading ? '...' : insights.filter(i => !i.is_fallback).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Upload</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {loading ? '...' : (latestInsight ? new Date(latestInsight.upload_date).toLocaleDateString() : 'None')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <HistoryTab 
            insights={insights} 
            loading={loading} 
            onRefresh={loadInsights}
          />
        )}
      </main>

      {/* Modern Footer */}
      <footer className="relative mt-32 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur-lg opacity-50" />
                <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold text-white">DocInsight AI</span>
            </div>
            
            {/* Divider */}
            <div className="w-32 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-6" />
            
            {/* Developer Credit */}
            <p className="text-gray-300 text-lg">
              Developed by{' '}
              <button
                onClick={() => setShowDeveloperProfile(true)}
                className="font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text hover:from-blue-300 hover:to-purple-300 transition-all duration-300 underline decoration-blue-400/50 hover:decoration-blue-400 underline-offset-4 hover:scale-105 inline-block transform"
              >
                @TechyCSR
              </button>
            </p>
          </div>
        </div>
      </footer>

      {/* Developer Profile Popup */}
      <DeveloperProfile 
        isOpen={showDeveloperProfile}
        onClose={() => setShowDeveloperProfile(false)}
      />
    </div>
  );
};

export default Dashboard;
