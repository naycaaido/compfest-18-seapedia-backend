import { Injectable } from "@nestjs/common"
import { cwd } from "process"
import path from "path"
import * as fs from 'fs/promises'
import { randomUUID } from "crypto"
import { File } from "./constant"
import { DirType } from "src/common/utils"
import sharp from "sharp"

@Injectable()
export class ImageService{
    async writeImage(file:File,fileName:string,folderName:string){
        try {
            const dir = path.join(cwd(),'public',folderName)
            const filePath = path.join(dir,fileName)

            await fs.mkdir(dir,{recursive:true})
            const compressedBuffer  = await this.compressImage(file.buffer,file.mimeType)
            await fs.writeFile(filePath,compressedBuffer)
            return `${fileName}`
        } catch(error){
            throw error
        }
    }

    async removeImage(filePath:string) {
        const dir = `${cwd()}/public/${filePath}`
        try {
            await fs.unlink(dir)
        } catch (error) {
            throw error
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