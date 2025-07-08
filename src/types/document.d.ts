export interface Document {
  _id: string;
  filename?: string;
  file?: {
    name?: string;
    size?: number;
    url?: string;
    type?: string;
  };
  category?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response structure
export interface DocumentsResponse {
  documents: Document[];
  total_documents: number;
  current_page: number;
  total_pages: number;
}

export interface CreateDocumentRequest {
  filename?: string;
  file?: {
    name?: string;
    size?: number;
    url?: string;
    type?: string;
  };
  category?: string;
}

export interface UpdateDocumentRequest extends Partial<CreateDocumentRequest> {
  id: string;
}
