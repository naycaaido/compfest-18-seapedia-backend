import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { SupabaseService } from "src/supabase/supabase.service";

@Module({
  exports:[ImageService],
  providers: [ImageService,SupabaseService],
})
export class ImageModule {}