import { useState, useRef } from 'react';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useApiService } from '../lib/api';
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
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload Resume</span>
        </h2>
        <p className="text-gray-600">
          Upload your resume in PDF format and choose an AI provider for analysis
        </p>
      </div>

      {/* AI Provider Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose AI Provider
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setProvider('sarvam')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              provider === 'sarvam'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold">Sarvam AI</div>
            <div className="text-sm text-gray-500 mt-1">Default • Recommended</div>
          </button>
          
          <button
            onClick={() => setProvider('gemini')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              provider === 'gemini'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold">Gemini AI</div>
            <div className="text-sm text-gray-500 mt-1">Alternative Option</div>
          </button>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
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
          <div className="flex items-center justify-center space-x-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your PDF here or click to browse
            </p>
            <p className="text-sm text-gray-500">
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
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
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
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700">{success}</p>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
