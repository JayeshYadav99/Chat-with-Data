// "use se

export const runtime = "nodejs";



export async function UploadToSupabaseBucket(file: File, client: any, userId: string) {
  if (!client) {
    throw new Error("Supabase client is not initialized");
  }
  if (!userId) {
    throw new Error("User ID is not provided");
  }
  try {
    const safeName = file.name.replace(/\s+/g, "-");
    const file_key = `uploads/${userId}/${Date.now()}-${safeName}`;


    const { data: blob, error: UploadError } = await client.storage.from('file-documents').upload(file_key, file, {
      upsert: false,
      // 👇 Prevents default owner_id override by providing explicit metadata
      cacheControl: '3600',
      contentType: file.type,
    });
    console.log("supabase data", blob);

    if (UploadError) {
      throw new Error(UploadError.message);
    }

    // Generate a signed URL valid for one year (31,536,000 seconds)
    const { data: signedUrlData, error: signedUrlError } = await client.storage
      .from('file-documents')
      .createSignedUrl(file_key, 31536000); // 1 year in seconds

    if (signedUrlError) {
      throw new Error(signedUrlError.message);
    }
    return {
      success: true,
      data: {
        url: signedUrlData.signedUrl,
        file_key,
        file_name: file.name,
      },
    };
  } catch (error) {
    console.log(error);
  }

  throw new Error("Failed to upload file");
}