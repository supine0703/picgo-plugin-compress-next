import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import { IPicGo } from 'picgo';
import { CommonParams, ImageInfo } from '../../interface';
import { getImageBuffer, getImageInfo } from '../../utils';
import { getOption } from '../option';

/**
 * Compresses an image to WebP format using imagemin-gif2webp plugin.
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function Webp(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  ctx.log.info('The imagemin-webp compression started');

  return (async () => {
    const buffer = await getImageBuffer(ctx, imageUrl);
    ctx.log.info('Converting image to WebP');

    const module = 'imagemin-webp';
    const result = await getOption(module).then((option) => {
      if (typeof option !== 'object') {
        throw new TypeError('The option is not a object');
      }
      ctx.log.info(module, JSON.stringify(option));
      return imagemin.buffer(buffer, { plugins: [imageminWebp(option)] });
    });

    if (buffer.length <= result.length) {
      ctx.log.warn('The compressed image is larger than the original image. Skipping compression');
      return getImageInfo(imageUrl, buffer, result.length / buffer.length);
    }

    ctx.log.info('The imagemin-webp compression successful');
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
