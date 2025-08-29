import { Brain, FileText, Calendar, AlertTriangle, Zap, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import PDFPreview from './PDFPreview';
import type { InsightDocument } from '../types';

interface InsightsDisplayProps {
  insight: InsightDocument;
}

const InsightsDisplay = ({ insight }: InsightsDisplayProps) => {
  const [showPreview, setShowPreview] = useState(false);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const cleanSummary = (summary: string) => {
    // Remove <think> tags and everything between them
    return summary.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'sarvam':
        return <Zap className="h-4 w-4" />;
      case 'gemini':
        return <Brain className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'sarvam':
        return 'bg-blue-100 text-blue-800';
      case 'gemini':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-gray-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{insight.filename}</h3>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-500 flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(insight.upload_date)}</span>
                </span>
                <span className="text-sm text-gray-500">
                  {formatFileSize(insight.file_size)}
                </span>
              </div>
            </div>
            
            {/* Preview Button - Only show if preview is available */}
            {insight.has_preview && (
              <button
                onClick={() => setShowPreview(true)}
                className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 text-sm"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Provider Badge */}
            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getProviderColor(insight.provider)}`}>
              {getProviderIcon(insight.provider)}
              <span>{insight.provider.charAt(0).toUpperCase() + insight.provider.slice(1)} AI</span>
            </span>
            
            {/* Fallback Warning */}
            {insight.is_fallback && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <AlertTriangle className="h-3 w-3" />
                <span>Fallback</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Summary Content */}
      <div className="p-6">
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>AI Analysis Summary</span>
          </h4>
        </div>
        
        <div className="prose max-w-none">
          <div className={`p-4 rounded-lg ${insight.is_fallback ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'}`}>
            <div className="text-gray-800 leading-relaxed prose prose-sm max-w-none">
              <ReactMarkdown 
                components={{
                  h1: ({children}) => <h1 className="text-xl font-bold mb-3">{children}</h1>,
                  h2: ({children}) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
                  h3: ({children}) => <h3 className="text-base font-medium mb-2">{children}</h3>,
                  strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-3">{children}</ul>,
                  li: ({children}) => <li className="text-gray-700">{children}</li>,
                  p: ({children}) => <p className="mb-2">{children}</p>
                }}
              >
                {cleanSummary(insight.summary)}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {insight.is_fallback && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Fallback Analysis Used</p>
                <p className="mt-1">
                  AI analysis was unavailable, so we've provided the most frequent keywords from your document.
                  This gives you a basic overview of your document's content.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Document ID: {insight.id}</span>
          <span>
            Processed with {insight.provider.charAt(0).toUpperCase() + insight.provider.slice(1)} AI
            {insight.is_fallback && ' (Fallback)'}
          </span>
        </div>
      </div>
      
      {/* PDF Preview Modal */}
      <PDFPreview
        documentId={insight.id}
        filename={insight.filename}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};

export default InsightsDisplay;
