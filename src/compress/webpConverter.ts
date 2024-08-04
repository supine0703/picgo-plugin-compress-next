import { CommonParams, ImageInfo } from '../interface';
import { getImageBuffer, getImageInfo } from '../utils';
import { IPicGo } from 'picgo';
import { buffer2webpbuffer } from 'webp-converter';
import { extname, join } from 'path';
import { existsSync, mkdirSync, rmdirSync } from 'fs';

export function WebPConverterCompress(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  ctx.log.info('webp-converter compression started');
  const extPath = join(__dirname, '../temp/');
  if (!existsSync(extPath)) {
    mkdirSync(extPath, { recursive: true });
  }

  return getImageBuffer(ctx, imageUrl)
    .then((buffer) => {
      ctx.log.info('Converting image to WebP');
      return buffer2webpbuffer(buffer, extname(imageUrl).slice(1), '-q 80', extPath); // -q 80 -m 6 -mt -af
    })
    .then((buffer) => {
      rmdirSync(extPath);
      ctx.log.info('CWebP compression successful');
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
