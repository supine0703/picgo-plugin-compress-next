import { CommonParams, ImageInfo } from '../../interface';
import { getImageBuffer, getImageInfo } from '../../utils';
import { IPicGo } from 'picgo';
import { gwebp } from 'webp-converter';
import { join } from 'path';
import { writeFileSync, readFileSync, existsSync, mkdirSync, rmdirSync } from 'fs';

const uuid = require('uuid').v4;

async function gif2webpBuffer(buffer: Buffer, option: string, extraPath: string): Promise<Buffer> {
  const filename = uuid();
  const inputGif = `${extraPath}${filename}.gif`;
  const outputWebP = `${extraPath}${filename}.webp`;

  try {
    writeFileSync(inputGif, buffer);
    return gwebp(inputGif, outputWebP, option).then(() => Buffer.from(readFileSync(outputWebP)));
  } catch (err) {
    throw err;
  }
}

export function GWebP(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  ctx.log.info('The webp-converter (gif 2 webp) compression started');
  const extraPath = join(__dirname, '/temp/');
  if (!existsSync(extraPath)) {
    mkdirSync(extraPath, { recursive: true });
  }

  return getImageBuffer(ctx, imageUrl)
    .then((buffer) => {
      ctx.log.info('Converting Gif to WebP');
      return gif2webpBuffer(buffer, '-q 80 -m 6 -lossy', extraPath);
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
