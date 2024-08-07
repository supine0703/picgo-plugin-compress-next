import { IPicGo } from 'picgo';
import { cwebp } from 'webp-converter';
import { extname } from 'path';
import { Buffer2WebPBuffer } from './utils';
import { CommonParams, ImageInfo } from '../../interface';
import { Compress } from '../compress';

/**
 * Compresses an image to WebP format using cwebp from webp-converter plugin.
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function CWebP(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  return Compress(ctx, imageUrl, {
    module: 'webp-converter-cwebp',
    optionType: 'string',
    toCompressBuffer: (buffer: Buffer, option: string) =>
      Buffer2WebPBuffer(buffer, extname(imageUrl), cwebp, option),
    toWebP: true,
  });
}
