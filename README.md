
# Chat with Data

Chat with Data is an AI-powered document processing and conversation platform where users can upload PDF documents, have them processed through an AI workflow, and engage in conversations about the content of the documents through a chat interface.

![Chat with Data Preview](https://github.com/user-attachments/assets/da78c0b0-de9d-4e57-8662-3d49e43c8875)

## Features

- **Document Processing**: Upload PDF documents which are processed using an AI workflow.
- **AI Workflow**: Utilizes Langchain for document analysis and Next.js with Vercel AI SDK for document handling.
- **Vector Embeddings**: Extracts vector embeddings of documents and stores them in Supabase Vector Store.
- **Chat Interface**: Enables users to discuss document contents via a chat interface.
- **Document Preview**: Provides a preview of the uploaded document within the chat interface.
- **Scalable Storage**: Uses Vercel Blob Storage for managing document files securely.
- **Export Chat as Detailed PDF**: Users can export their chat history, including AI analysis and document excerpts, into a PDF for offline viewing.
- **Fork Chat**: Allows users to fork a conversation from shared chat.

## Tech Stack

- **Langchain**: Powers the AI workflow for document processing.
- **Next.js**: Frontend framework for building the web application.
- **Vercel**: Hosts the application and utilizes Vercel Blob Storage.
- **AI SDK**: Integrates AI capabilities for document analysis.
- **Supabase**: Stores vector embeddings of documents in Supabase Vector Store.
- **Gemini**: Possibly used for enhancing chat functionalities or backend operations.

## Installation and Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/chat-with-docs.git
   cd chat-with-docs
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and add the following:

   ```plaintext
   BLOB_READ_WRITE_TOKEN="your-vercel-blob-read-write-token"
   GOOGLE_API_KEY="your-google-api-key"
   SUPABASE_PRIVATE_KEY="your-supabase-private-key"
   SUPABASE_URL="https://your-supabase-url.co"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
   CLERK_SECRET_KEY="your-clerk-secret-key"
   MONGODB_URL="mongodb+srv://username:password@your-mongodb-url"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
   NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN="your-nextjs-blob-read-write-token"
   # NEXT_CLERK_WEBHOOK_SECRET="your-clerk-webhook-secret"
   ```

4. **Start the application**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Visit `http://localhost:3000` to see the application running.



## Deployment

The application is deployed and accessible at [Deployment Link](https://chat-with-data-bice.vercel.app/).

## License

This project is licensed under the [MIT License](link-to-license-file).

---

With these new features integrated, the application now offers better user engagement, document interaction, and scalability. Feel free to adjust the wording or add further technical details based on how the features are implemented in your project.
