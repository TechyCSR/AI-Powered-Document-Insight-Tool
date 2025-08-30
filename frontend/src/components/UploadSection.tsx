import { useState, useRef } from 'react';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { useApiService } from '../lib/api';
import PDFPreview from './PDFPreview';
import type { AIProvider, InsightDocument } from '../types';

interface UploadSectionProps {
  onUploadSuccess: (insight: InsightDocument) => void;
}

const UploadSection = ({ onUploadSuccess }: UploadSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [provider, setProvider] = useState<AIProvider>('sarvam');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadResume } = useApiService();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    setSuccess(null);
    
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
      setSuccess(null);
    } else {
      setError('Please drop a PDF file');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const response = await uploadResume(selectedFile, provider);
      
      if (response.success) {
        setSuccess(`Document analyzed successfully using ${response.provider}!`);
        
        // Create insight object for parent component
        const insight: InsightDocument = {
          id: response.document_id,
          user_id: '', // Will be filled by the API
          filename: response.filename,
          upload_date: response.upload_date,
          provider: response.provider,
          summary: response.summary,
          is_fallback: response.is_fallback,
          file_size: selectedFile.size,
          has_preview: true, // New uploads always have preview
        };
        
        onUploadSuccess(insight);
        
        // Reset form
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
          <Upload className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span>Upload Document</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Upload your document in PDF format and choose an AI provider for analysis
        </p>
      </div>

      {/* AI Provider Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Choose AI Provider
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setProvider('sarvam')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              provider === 'sarvam'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 dark:border-blue-400'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="font-semibold dark:text-white">Sarvam AI</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Default & Indigenous AI</div>
          </button>
          
          <button
            onClick={() => setProvider('gemini')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              provider === 'gemini'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 dark:border-blue-400'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="font-semibold dark:text-white">Gemini AI</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Alternative Option but Recommended</div>
          </button>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {/* Preview Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering file input
                setShowPreview(true);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-800"
            >
              <Eye className="h-4 w-4" />
              <span>Preview Document</span>
            </button>
          </div>
        ) : (
          <div>
            <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drop your PDF here or click to browse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Maximum file size: 10MB
            </p>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="mt-6">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
            !selectedFile || uploading
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing Document...</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <span>Upload and Analyze</span>
            </>
          )}
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-green-700 dark:text-green-300">{success}</p>
        </div>
      )}
      
      {/* PDF Preview Modal */}
      <PDFPreview
        file={selectedFile}
        filename={selectedFile?.name}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};

export default UploadSection;
