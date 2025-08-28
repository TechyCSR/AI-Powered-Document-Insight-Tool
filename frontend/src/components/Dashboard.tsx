import { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Brain, Upload, History, FileText, Clock, User } from 'lucide-react';
import UploadSection from './UploadSection';
import InsightsDisplay from './InsightsDisplay';
import HistoryTab from './HistoryTab';
import { useApiService } from '../lib/api';
import { InsightDocument } from '../types';

type TabType = 'upload' | 'history';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [insights, setInsights] = useState<InsightDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [latestInsight, setLatestInsight] = useState<InsightDocument | null>(null);
  
  const { user } = useUser();
  const { getInsights } = useApiService();

  // Load insights when component mounts or when switching to history tab
  const loadInsights = async () => {
    try {
      setLoading(true);
      const response = await getInsights();
      setInsights(response.insights);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      loadInsights();
    }
  }, [activeTab]);

  const handleUploadSuccess = (newInsight: InsightDocument) => {
    setLatestInsight(newInsight);
    // Add to insights list if we have it loaded
    if (insights.length > 0) {
      setInsights([newInsight, ...insights]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">DocInsight AI</h1>
                <p className="text-sm text-gray-500">AI-Powered Document Analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Welcome, {user?.firstName || 'User'}</span>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>Upload & Analyze</span>
            </button>
            
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <History className="h-4 w-4" />
              <span>History</span>
              {insights.length > 0 && (
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Latest Analysis</span>
                </h2>
                <InsightsDisplay insight={latestInsight} />
              </div>
            )}
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Documents</p>
                    <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Brain className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Analyses</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {insights.filter(i => !i.is_fallback).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Upload</p>
                    <p className="text-sm font-bold text-gray-900">
                      {latestInsight ? new Date(latestInsight.upload_date).toLocaleDateString() : 'None'}
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
    </div>
  );
};

export default Dashboard;
