import { Injectable } from "@nestjs/common"
import { cwd } from "process"
import path from "path"
import * as fs from 'fs/promises'
import { randomUUID } from "crypto"
import { File } from "./constant"
import { DirType } from "src/common/utils"
import sharp from "sharp"
import { SupabaseService } from "src/supabase/supabase.service"
import { log } from "console"

@Injectable()
export class ImageService{
    constructor(
        private readonly supabaseService:SupabaseService
    ) {
    
    }
    async writeImage(
        file: File,
        fileName: string,
        folderName: string,
    ) {
        try {
            const compressedBuffer = await this.compressImage(
                file.buffer,
                file.mimeType,
            );

            const path = `${folderName}/${fileName}`;

            log("Path")
            log(path)
            const { error } = await this.supabaseService.client.storage
                .from(process.env.SUPABASE_BUCKET!)
                .upload(path, compressedBuffer, {
                    contentType: file.mimeType,
                    upsert: true,
                });

            if (error) {
                throw error;
            }

            return path;
        } catch (error) {
            throw error;
        }
    }

    async removeImage(path: string) {
        log("path remove")
        log(path)
        const { error } = await this.supabaseService.client.storage
            .from(process.env.SUPABASE_BUCKET!)
            .remove([path]);

        if (error) {
            throw error;
        }
    }
    makeFileName(oriFileName:string){
        const id = randomUUID()
        const ext = path.extname(oriFileName)
        const fileName = path.join(`${id}${ext}`)
        return fileName
    }

    async compressImage(buffer:Buffer,mimeType: string,) : Promise<Buffer>{
        const image = sharp(buffer)
        .resize({
            width:1920,
            fit:'inside',
            withoutEnlargement:true
        })
        switch(mimeType){
             case 'image/jpeg':
                return image.jpeg({
                    quality: 75,
                }).toBuffer();

            case 'image/png':
                return image.png({
                    compressionLevel: 9,
                }).toBuffer();

            case 'image/webp':
                return image.webp({
                    quality: 75,
                    effort: 6,
                }).toBuffer();

            default:
                return image.toBuffer();
        }
    }
}