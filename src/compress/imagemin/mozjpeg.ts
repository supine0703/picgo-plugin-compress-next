import imagemin from 'imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import upng from 'imagemin-upng';
import { IPicGo } from 'picgo';
import { extname as getExtname } from 'path';
import { CommonParams, ImageInfo } from '../../interface';
import { getImageBuffer, getImageInfo } from '../../utils';
import { getOption } from '../option';

/**
 * Compresses an image using imagemin library with MozJPEG and UPNG plugins.
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function Image(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  const [module, plugin]: ['imagemin-mozjpeg' | 'imagemin-upng', any] = (() => {
    switch (getExtname(imageUrl).toLowerCase()) {
      case '.jpg':
      case '.jpeg':
        return ['imagemin-mozjpeg', mozjpeg];
      case '.png':
        return ['imagemin-upng', upng];
      default:
        throw new TypeError('The image type can be only jpg/jpeg or png');
    }
  })();
  ctx.log.info(`The ${module} compression started`);

  return (async () => {
    const buffer = await getImageBuffer(ctx, imageUrl);

    const result = await getOption(module).then((option) => {
      if (typeof option !== 'object') {
        throw new TypeError('The option is not a object');
      }
      ctx.log.info(module, JSON.stringify(option));
      return imagemin.buffer(buffer, { plugins: [plugin(option)] });
    });

    if (buffer.length <= result.length) {
      ctx.log.warn('The compressed image is larger than the original image. Skipping compression');
      return getImageInfo(imageUrl, buffer, result.length / buffer.length);
    }

    ctx.log.info(`The ${module} compression successful`);
    return getImageInfo(imageUrl, result);
  })();
}
