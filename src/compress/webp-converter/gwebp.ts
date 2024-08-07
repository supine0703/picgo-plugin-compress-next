import { IPicGo } from 'picgo';
import { gwebp } from 'webp-converter';
import { Buffer2WebPBuffer } from './utils';
import { CommonParams, ImageInfo } from '../../interface';
import { Compress } from '../compress';

/**
 * Compresses an Gif to WebP format using gwebp from webp-converter plugin.
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function GWebP(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  return Compress(ctx, imageUrl, {
    module: 'webp-converter-gwebp',
    optionType: 'string',
    toCompressBuffer: (buffer: Buffer, option: string) =>
      Buffer2WebPBuffer(buffer, '.gif', gwebp, option),
    toWebP: true,
  });
}
