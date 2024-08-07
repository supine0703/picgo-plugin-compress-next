import imagemin from 'imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import upng from 'imagemin-upng';
import { IPicGo } from 'picgo';
import { extname } from 'path';
import { CommonParams, ImageInfo } from '../../interface';
import { Compress } from '../compress';

/**
 * Compresses an image using imagemin library with MozJPEG and UPNG plugins.
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function Image(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  const [module, plugin]: ['imagemin-mozjpeg' | 'imagemin-upng', any] = (() => {
    switch (extname(imageUrl).toLowerCase()) {
      case '.jpg':
      case '.jpeg':
        return ['imagemin-mozjpeg', mozjpeg];
      case '.png':
        return ['imagemin-upng', upng];
      default:
        throw new TypeError('The image type can be only jpg/jpeg or png');
    }
  })();

  return Compress(ctx, imageUrl, {
    module: module,
    optionType: 'object',
    toCompressBuffer: (buffer: Buffer, option: {}) => imagemin.buffer(buffer, { plugins: [plugin(option)] }),
  });
}
