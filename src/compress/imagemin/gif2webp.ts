import imagemin from 'imagemin';
import imageminGif2webp from 'imagemin-gif2webp';
import { CommonParams, ImageInfo } from '../../interface';
import { getImageBuffer, getImageInfo } from '../../utils';
import { IPicGo } from 'picgo';

/**
 * Compresses an Gif to WebP format using imagemin-webp plugin.
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function Gif2WebP(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  ctx.log.info('The imagemin-gif2webp compression started');

  return getImageBuffer(ctx, imageUrl)
    .then((buffer) => {
      ctx.log.info('Converting Gif to WebP');
      return imagemin.buffer(buffer, { plugins: [imageminGif2webp({ quality: 80, method: 6, lossy: true })] });
    })
    .then((buffer) => {
      ctx.log.info('The imagemin-webp compression successful');
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
