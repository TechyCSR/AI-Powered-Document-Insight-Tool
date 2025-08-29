import { useState, useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw, Maximize, Minimize, Loader2 } from 'lucide-react';

interface PDFPreviewProps {
  file?: File | null;
  documentId?: string;
  filename?: string;
  isOpen: boolean;
  onClose: () => void;
}

const PDFPreview = ({ file, documentId, filename, isOpen, onClose }: PDFPreviewProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  console.log('PDFPreview props:', { file: !!file, documentId, filename, isOpen });

  useEffect(() => {
    if (isOpen && file) {
      // Create URL for file preview (new uploads)
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setLoading(false);
      setError(null);
      
      // Cleanup function
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (isOpen && documentId) {
      // For processed documents, fetch from backend
      fetchDocumentPreview(documentId);
    } else if (!isOpen) {
      // Clean up when modal closes
      if (pdfUrl && !file) {
        // Only revoke URLs for backend documents
        URL.revokeObjectURL(pdfUrl);
      }
      setPdfUrl(null);
      setError(null);
      setLoading(false);
    }
  }, [isOpen, file, documentId]);

  const fetchDocumentPreview = async (docId: string) => {
    setLoading(true);
    setError(null);
    
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    
    try {
      const token = await (window as any).Clerk?.session?.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${apiBaseUrl}/document/${docId}/preview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, response.statusText, errorText);
        
        if (response.status === 404) {
          throw new Error('Document preview not available for older documents. Please re-upload to enable preview.');
        } else if (response.status === 401) {
          throw new Error('Authentication failed');
        } else if (response.status === 403) {
          throw new Error('Access denied');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setLoading(false);
      
      // Store the URL for cleanup
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (err: any) {
      console.error('Failed to fetch document preview:', err);
      console.error('Document ID:', docId);
      console.error('API URL:', `${apiBaseUrl}/document/${docId}/preview`);
      setError(err.message || 'Failed to load document preview');
      setLoading(false);
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleFullscreen = () => setIsFullscreen(prev => !prev);

  const handleDownload = () => {
    if (pdfUrl && filename) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClose = () => {
    setZoom(100);
    setRotation(0);
    setIsFullscreen(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`relative h-full w-full flex flex-col ${isFullscreen ? 'p-0' : 'p-4'}`}>
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col h-full ${isFullscreen ? 'rounded-none' : ''}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {filename || file?.name || 'Document Preview'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {file && `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                </p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-1 bg-white dark:bg-gray-700 rounded-lg border dark:border-gray-600 px-2 py-1">
                <button
                  onClick={handleZoomOut}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-300"
                  disabled={zoom <= 25}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium w-12 text-center text-gray-700 dark:text-gray-300">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors text-gray-700 dark:text-gray-300"
                  disabled={zoom >= 300}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
              
              {/* Action Buttons */}
              <button
                onClick={handleRotate}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                title="Rotate"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              
              {pdfUrl && (
                <button
                  onClick={handleDownload}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={handleFullscreen}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
              
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900">
            {loading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">Loading preview...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md mx-auto p-6">
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Preview Not Available</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                  {error.includes('older documents') ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                        <strong>Note:</strong> Preview is only available for documents uploaded after the preview feature was added.
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        To enable preview for this document, please re-upload it using the upload form.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You can re-upload the document to enable preview functionality.
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {pdfUrl && !loading && !error && (
              <div className="h-full overflow-auto p-4">
                <div className="flex justify-center">
                  <div 
                    className="bg-white shadow-lg border border-gray-200 transition-transform"
                    style={{ 
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transformOrigin: 'center top'
                    }}
                  >
                    <iframe
                      src={pdfUrl}
                      className="w-[210mm] h-[297mm] border-0"
                      title="PDF Preview"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {file ? 'Original Document' : 'Processed Document'}
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">ESC</kbd>
              <span className="text-xs text-gray-500 dark:text-gray-400">to close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
