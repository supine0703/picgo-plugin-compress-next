import { Buffer2WebPBuffer } from './utils';
import { IPicGo } from 'picgo';
import { cwebp } from 'webp-converter';
import { extname as getExtname } from 'path';
import { CommonParams, ImageInfo } from '../../interface';
import { getImageBuffer, getImageInfo } from '../../utils';
import { getOption } from '../option';

/**
 * Compresses an image to WebP format using cwebp from webp-converter plugin.
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function CWebP(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  ctx.log.info('The webp-converter compression started');

  return (async () => {
    const buffer = await getImageBuffer(ctx, imageUrl);
    ctx.log.info('Converting image to WebP');

    const module = 'webp-converter-cwebp';
    const result = await getOption(module).then((option) => {
      if (typeof option !== 'string') {
        throw new TypeError('The option is not a string');
      }
      ctx.log.info(module, option);
      return Buffer2WebPBuffer(buffer, getExtname(imageUrl), cwebp, option);
    });

    if (buffer.length <= result.length) {
      ctx.log.warn('The compressed image is larger than the original image. Skipping compression');
      return getImageInfo(imageUrl, buffer, result.length / buffer.length);
    }

    ctx.log.info('The webp-converter compression successful');
    const info = getImageInfo(imageUrl, result);
    const extname = '.webp';
    const fileName = info.fileName.replace(info.extname, extname);
    return {
      ...info,
      fileName,
      extname,
    };
  })();
}
