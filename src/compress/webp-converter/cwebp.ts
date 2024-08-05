import { CommonParams, ImageInfo } from '../../interface';
import { getImageBuffer, getImageInfo } from '../../utils';
import { IPicGo } from 'picgo';
import { buffer2webpbuffer } from 'webp-converter';
import { extname, join } from 'path';
import { existsSync, mkdirSync, rmdirSync } from 'fs';

export function CWebP(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  ctx.log.info('The webp-converter compression started');
  const extPath = join(__dirname, '/temp/');
  if (!existsSync(extPath)) {
    mkdirSync(extPath, { recursive: true });
  }

  return getImageBuffer(ctx, imageUrl)
    .then((buffer) => {
      ctx.log.info('Converting image to WebP');
      return buffer2webpbuffer(buffer, extname(imageUrl).slice(1), '-q 80 -m 6 -mt -af', extPath);
    })
    .then((buffer) => {
      rmdirSync(extPath);
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
