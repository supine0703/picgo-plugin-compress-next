import { CommonParams, ImageInfo } from '../../interface';
import { getImageBuffer, getImageInfo } from '../../utils';
import { Buffer2WebPBuffer } from './utils';
import { IPicGo } from 'picgo';
import { gwebp } from 'webp-converter';

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
