import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import { CommonParams, ImageInfo } from '../interface.js';
import { getImageBuffer, getImageInfo } from '../utils.js';
import { IPicGo } from 'picgo';

/**
 * Compresses an image to WebP format using imagemin-webp plugin.
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function Image2WebPCompress(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  ctx.log.info('Image2WebP compression started');

  return getImageBuffer(ctx, imageUrl)
    .then((buffer) => {
      ctx.log.info('Converting image to WebP');
      return imagemin.buffer(buffer, { plugins: [imageminWebp({ quality: 100, number: 6, lossless: true })] });
    })
    .then((buffer) => {
      ctx.log.info('Image2WebP compression successful');
      const info = getImageInfo(imageUrl, buffer);
      const extname = '.webp';
      const fileName = info.fileName.replace(info.extname, extname);
      return {
        ...info,
        fileName,
        extname,
      };
    });
}
