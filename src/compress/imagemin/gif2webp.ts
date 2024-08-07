import imagemin from 'imagemin';
import imageminGif2webp from 'imagemin-gif2webp';
import { IPicGo } from 'picgo';
import { CommonParams, ImageInfo } from '../../interface';
import { Compress } from '../compress';

/**
 * Compresses an Gif to WebP format using imagemin-webp plugin.
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function Gif2WebP(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  return Compress(ctx, imageUrl, {
    module: 'imagemin-gif2webp',
    optionType: 'object',
    toCompressBuffer: (buffer: Buffer, option: {}) => imagemin.buffer(buffer, { plugins: [imageminGif2webp(option)] }),
    toWebP: true,
  });
}
