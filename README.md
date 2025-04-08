# Chat with Docs

Chat with Docs is an AI-powered document processing and conversation platform where users can upload PDF documents, have them processed through an AI workflow, and engage in conversations about the content of the documents through a chat interface.

![Chat with Data Preview](https://github.com/user-attachments/assets/5f3f303d-dd93-4f57-8d31-8f7876f226c8)


## RAG WORKFLOW

![RAG Workflow](https://github.com/user-attachments/assets/b861169d-c071-493c-81db-b22d76c85b6c)

---

## Features

- **Document Processing**: Upload PDF documents which are processed using an AI workflow.
- **AI Workflow**: Utilizes Langchain for document analysis and Next.js with Vercel AI SDK for document handling.
- **Vector Embeddings**: Extracts vector embeddings of documents and stores them in Supabase Vector Store.
- **Chat Interface**: Enables users to discuss document contents via a chat interface.
- **Document Preview**: Provides a preview of the uploaded document within the chat interface.
- **Secure File Storage**: Uses **Supabase Buckets** for managing and retrieving uploaded document files.
- **Export Chat as Detailed PDF**: Users can export their chat history, including AI analysis and document excerpts, into a PDF.
- **Fork Chat**: Allows users to fork a conversation from shared chat.

---

## Tech Stack

- **Langchain**: Powers the AI workflow for document processing.
- **Next.js**: Frontend framework for building the web application.
- **Vercel**: Hosting platform.
- **AI SDK**: Integrates AI capabilities for document analysis.
- **Supabase**: Used for vector embeddings, auth, and storage (via Buckets).
- **Clerk**: Handles authentication and session management.
- **Gemini**: Optionally used for chat enhancement or backend AI operations.

---

## 🔐 Setting Up Clerk with Supabase Storage Access

To secure file access and manage storage per user, you’ll use **Clerk JWT Templates** with Supabase policies:

### ✅ Steps:

1. **Create a Supabase JWT template in Clerk**
   - Go to Clerk dashboard → JWT Templates → Create Template
   - Use Supabase’s recommended settings and ensure the `sub` claim maps to the user's ID.

2. **Attach the token to Supabase client requests**
   - In your Supabase client:
     ```ts
     const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
       global: {
         headers: {
           Authorization: `Bearer ${await getToken({ template: 'supabase' })}`,
         },
       },
     });
     ```
   # Working of supabase buckets storage
   ![clerk supabase file storage](https://github.com/user-attachments/assets/39bce522-63eb-4f40-8802-646cc4427e59)


3. **Write RLS policies on `storage.objects`**
   In Supabase SQL Editor:
   ```sql
   -- Allow users to insert/select their own files
   create policy "Users can insert their own files"
   on storage.objects
   for insert
   to  authenticated
   with check (auth.role() = 'authenticated'::text);


   create policy "Users can read their own files"
   on storage.objects
   for select
   to  authenticated
   with check (auth.role() = 'authenticated'::text);
   ```

   Ensure the bucket is private.

---

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

   Create a `.env` file in the root directory and add:

   ```env
   GOOGLE_API_KEY="your-google-api-key"
   SUPABASE_PRIVATE_KEY="your-supabase-private-key"
   SUPABASE_URL="https://your-supabase-url.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
   CLERK_SECRET_KEY="your-clerk-secret-key"
   MONGODB_URL="mongodb+srv://username:password@your-mongodb-url"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
   ```

4. **Start the application**

   ```bash
   npm run dev
   ```

5. **Visit in browser**

   Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

The application is deployed at:  
🔗 [https://chat-with-data-bice.vercel.app](https://chat-with-data-bice.vercel.app)
