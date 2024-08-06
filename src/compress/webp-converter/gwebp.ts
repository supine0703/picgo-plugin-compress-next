import { CommonParams, ImageInfo } from '../../interface';
import { getImageBuffer, getImageInfo } from '../../utils';
import { Buffer2WebPBuffer } from './utils';
import { IPicGo } from 'picgo';
import { gwebp } from 'webp-converter';
import { getOption } from '../option';

/**
 * Compresses an Gif to WebP format using gwebp from webp-converter plugin.
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function GWebP(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  ctx.log.info('The webp-converter (gif 2 webp) compression started');

  return (async () => {
    const buffer = await getImageBuffer(ctx, imageUrl);
    ctx.log.info('Converting Gif to WebP');

    const module = 'webp-converter-gwebp';
    const result = await getOption(module).then((option) => {
      if (typeof option !== 'string') {
        throw new TypeError('The option is not a string');
      }
      ctx.log.info(module, option);
      return Buffer2WebPBuffer(buffer, '.gif', gwebp, option);
    });

    if (buffer.length <= result.length) {
      ctx.log.warn('The compressed image is larger than the original image. Skipping compression');
      return getImageInfo(imageUrl, buffer, result.length / buffer.length);
    }

    ctx.log.info('The webp-converter (gif 2 webp) compression successful');
    const info = getImageInfo(imageUrl, result);
    const webpExtname = '.webp';
    const fileName = info.fileName.replace(info.extname, webpExtname);
    return {
      ...info,
      fileName,
      webpExtname,
    };
  })();
}
