import { CommonParams, ImageInfo } from '../../interface';
import { getImageBuffer, getImageInfo } from '../../utils';
import { Buffer2WebPBuffer } from './utils';
import { IPicGo } from 'picgo';
import { cwebp } from 'webp-converter';
import { extname } from 'path';

export function CWebP(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  ctx.log.info('The webp-converter compression started');

  return getImageBuffer(ctx, imageUrl)
    .then((buffer) => {
      ctx.log.info('Converting image to WebP');
      return Buffer2WebPBuffer(buffer, extname(imageUrl), cwebp, '-q 80 -m 6 -mt -af');
    })
    .then((buffer) => {
      ctx.log.info('The webp-converter compression successful');
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
