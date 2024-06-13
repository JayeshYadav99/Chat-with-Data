// "use server"
import { put } from "@vercel/blob";
interface Props {
    file : File;
    }
    export const runtime = 'nodejs';

export async function UploadToVercelStorage(file: File) {


try {
const file_key ="uploads/" + Date.now().toString() + file .name.replace(" ", "-");
const blob  = await put(file_key, file , { access: 'public',token:process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN });


return {
    success: true,
    data:{
    url: blob.url,
    file_key,
    file_name: file .name
    }

}


} catch (error) {
    console.log(error);
}

  throw new Error('Failed to upload file');
}