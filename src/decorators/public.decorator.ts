import { SetMetadata } from '@nestjs/common';
export const PUBLICK_KEY = 'publicKey'
export const Public = () => SetMetadata(PUBLICK_KEY, true);
