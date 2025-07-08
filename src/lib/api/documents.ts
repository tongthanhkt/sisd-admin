import { IDocument } from '@/models/Document';
import {
  CreateDocumentRequest,
  DocumentsResponse,
  UpdateDocumentRequest
} from '@/types';
import { api } from '../api';

// Documents API slice
export const documentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all documents
    getDocuments: builder.query<
      DocumentsResponse,
      { page: number; perPage: number; search: string; category: string }
    >({
      query: ({ page, perPage, search, category }) =>
        `documents?page=${page}&perPage=${perPage}&search=${search}&category=${category}`,
      providesTags: (result) =>
        result
          ? [
              ...result.documents.map(({ _id }) => ({
                type: 'Document' as const,
                id: _id
              })),
              { type: 'Document', id: 'LIST' }
            ]
          : [{ type: 'Document', id: 'LIST' }]
    }),

    // Get single document by ID
    getDocument: builder.query<IDocument, string>({
      query: (id) => ({
        url: `documents/${id}`,
        method: 'GET'
      }),
      providesTags: ['Document']
    }),

    // Create new document
    createDocument: builder.mutation<Document, CreateDocumentRequest>({
      query: (document) => ({
        url: 'documents',
        method: 'POST',
        body: document
      }),
      invalidatesTags: [{ type: 'Document', id: 'LIST' }]
    }),

    // Update document
    updateDocument: builder.mutation<Document, UpdateDocumentRequest>({
      query: ({ id, ...document }) => ({
        url: `documents/${id}`,
        method: 'PUT',
        body: document
      }),
      invalidatesTags: ['Document']
    }),

    // Delete document
    deleteDocument: builder.mutation<void, string>({
      query: (id) => ({
        url: `documents/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Document', id },
        { type: 'Document', id: 'LIST' }
      ]
    })
  })
});

export const {
  useGetDocumentsQuery,
  useGetDocumentQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation
} = documentsApi;
