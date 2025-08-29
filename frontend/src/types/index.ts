export interface InsightDocument {
  id: string;
  user_id: string;
  filename: string;
  upload_date: string;
  provider: 'sarvam' | 'gemini';
  summary: string;
  is_fallback: boolean;
  file_size: number;
  has_preview?: boolean;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  summary: string;
  provider: 'sarvam' | 'gemini';
  is_fallback: boolean;
  filename: string;
  upload_date: string;
  document_id: string;
}

export interface InsightsResponse {
  success: boolean;
  insights: InsightDocument[];
  total_count: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error_code?: string;
}

export type AIProvider = 'sarvam' | 'gemini';

export interface UploadFormData {
  file: File;
  provider: AIProvider;
}
