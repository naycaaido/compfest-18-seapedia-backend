import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function uploadSeedImage(
    folder: string,
    fileName: string,
) {
    const filePath = path.join(
        process.cwd(),
        "public",
        folder,
        fileName
    );

    const buffer = await fs.readFile(filePath);

    const objectKey = `${folder}/${fileName}`;

    const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET!)
        .upload(objectKey, buffer, {
            upsert: true,
        });

    if (error) throw error;

    return objectKey;
}