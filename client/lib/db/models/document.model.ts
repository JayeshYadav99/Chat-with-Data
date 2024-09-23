import { Document, Schema, model,models } from 'mongoose';

interface IDocument extends Document {
  content: string;
  metadata: Record<string, any>; // Metadata stored as JSON
  embedding: number[]; // Array of numbers representing the vector (768 dimensions)
}

const DocumentSchema = new Schema<IDocument>({
    content: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed, // JSONB equivalent
      required: true,
    },
    embedding: {
      type: [Number], // Array of numbers
      required: true,
      validate: {
        validator: function(arr: number[]) {
          return arr.length === 768;
        },
        message: 'Embedding must be a 768-dimensional vector',
      },
    },
  });
  
  // Export the model
  const DocumentModel = models?.Document || model<IDocument>('Document', DocumentSchema);
  export default DocumentModel;
  