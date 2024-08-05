import { CommonParams, ImageInfo } from '../../interface';
import { getImageBuffer, getImageInfo } from '../../utils';
import { Buffer2WebPBuffer } from './utils';
import { IPicGo } from 'picgo';
import { gwebp } from 'webp-converter';

/**
 * Compresses an Gif to WebP format using gwebp from webp-converter plugin.
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function GWebP(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  ctx.log.info('The webp-converter (gif 2 webp) compression started');

  return getImageBuffer(ctx, imageUrl)
    .then((buffer) => {
      ctx.log.info('Converting Gif to WebP');
      return Buffer2WebPBuffer(buffer, '.gif', gwebp, '-q 80 -m 6 -lossy');
    })
    .then((buffer) => {
      //   rmdirSync(extraPath);
      ctx.log.info('The webp-converter (gif 2 webp) compression successful');
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
