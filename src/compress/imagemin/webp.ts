import { IPicGo } from 'picgo';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import { CommonParams, ImageInfo } from '../../interface';
import { Compress } from '../compress';

/**
 * Compresses an image to WebP format using imagemin-gif2webp plugin.
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function Webp(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  return Compress(ctx, imageUrl, {
    module: 'imagemin-webp',
    optionType: 'object',
    toCompressBuffer: (buffer: Buffer, option: {}) => imagemin.buffer(buffer, { plugins: [imageminWebp(option)] }),
    toWebP: true,
  });
}
