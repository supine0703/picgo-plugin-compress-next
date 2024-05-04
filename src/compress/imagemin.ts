import imagemin from 'imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import upng from 'imagemin-upng';
import { IPicGo } from 'picgo';
import { CommonParams, ImageInfo } from '../interface';
import { getImageBuffer, getImageInfo } from '../utils';

/**
 * Compresses an image using imagemin library with MozJPEG and UPNG plugins.
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function ImageminCompress(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  ctx.log.info('imagemin compression started');

  return getImageBuffer(ctx, imageUrl)
    .then((buffer) => imagemin.buffer(buffer, { plugins: [mozjpeg({ quality: 75, progressive: true }), upng()] }))
    .then((buffer) => {
      ctx.log.info('imagemin compression completed');
      return getImageInfo(imageUrl, buffer);
    });
}
