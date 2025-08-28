import { useState } from 'react';
import { RefreshCw, FileText, Calendar, Brain, Search, AlertTriangle, Zap } from 'lucide-react';
import { InsightDocument } from '../types';
import InsightsDisplay from './InsightsDisplay';

interface HistoryTabProps {
  insights: InsightDocument[];
  loading: boolean;
  onRefresh: () => void;
}

const HistoryTab = ({ insights, loading, onRefresh }: HistoryTabProps) => {
  const [selectedInsight, setSelectedInsight] = useState<InsightDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvider, setFilterProvider] = useState<'all' | 'sarvam' | 'gemini'>('all');

  // Filter insights based on search term and provider
  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = filterProvider === 'all' || insight.provider === filterProvider;
    return matchesSearch && matchesProvider;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'sarvam':
        return <Zap className="h-4 w-4 text-blue-600" />;
      case 'gemini':
        return <Brain className="h-4 w-4 text-purple-600" />;
      default:
        return <Brain className="h-4 w-4 text-gray-600" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'sarvam':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'gemini':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (selectedInsight) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => setSelectedInsight(null)}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
          >
            <span>← Back to History</span>
          </button>
        </div>
        <InsightsDisplay insight={selectedInsight} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Document History</h2>
          <p className="text-gray-600 mt-1">
            View and manage your previously analyzed documents
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Provider Filter */}
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Providers</option>
            <option value="sarvam">Sarvam AI</option>
            <option value="gemini">Gemini AI</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading insights...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && insights.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-600 mb-4">
            Upload your first resume to get started with AI analysis
          </p>
        </div>
      )}

      {/* No Results */}
      {!loading && insights.length > 0 && filteredInsights.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matching documents</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Documents Grid */}
      {!loading && filteredInsights.length > 0 && (
        <div className="grid gap-4">
          {filteredInsights.map((insight, index) => (
            <div
              key={index}
              onClick={() => setSelectedInsight(insight)}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <FileText className="h-8 w-8 text-gray-600 mt-1 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate mb-1">
                      {insight.filename}
                    </h3>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(insight.upload_date)}</span>
                      </span>
                      <span>{formatFileSize(insight.file_size)}</span>
                    </div>
                    
                    <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                      {insight.summary}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2 ml-4">
                  {/* Provider Badge */}
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getProviderColor(insight.provider)}`}>
                    {getProviderIcon(insight.provider)}
                    <span>{insight.provider.charAt(0).toUpperCase() + insight.provider.slice(1)}</span>
                  </span>
                  
                  {/* Fallback Badge */}
                  {insight.is_fallback && (
                    <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Fallback</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {!loading && insights.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-medium text-gray-900 mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
              <p className="text-sm text-gray-600">Total Documents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {insights.filter(i => i.provider === 'sarvam').length}
              </p>
              <p className="text-sm text-gray-600">Sarvam AI</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {insights.filter(i => i.provider === 'gemini').length}
              </p>
              <p className="text-sm text-gray-600">Gemini AI</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {insights.filter(i => i.is_fallback).length}
              </p>
              <p className="text-sm text-gray-600">Fallback Used</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
