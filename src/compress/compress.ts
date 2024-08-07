import { IPicGo } from 'picgo';
import { CommonParams, ImageInfo } from '../interface';
import { getImageBuffer, getImageInfo } from '../utils';
import { getOption, OptionModule } from './option';

interface CompressFn {
  module: OptionModule;
  optionType: 'object' | 'string';
  toCompressBuffer: (buffer: Buffer, option: any) => Promise<Buffer>;
  toWebP?: boolean;
}

/**
 * Compresses an image to WebP format using cwebp from webp-converter plugin.
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function Compress(ctx: IPicGo, imageUrl: string, fn: CompressFn): Promise<ImageInfo> {
  ctx.log.info(`The ${fn.module} compression started`);

  return (async () => {
    const buffer = await getImageBuffer(ctx, imageUrl);

    let getInfo = getImageInfo;
    if (fn.toWebP) {
      ctx.log.info('Converting image to WebP');
      getInfo = (url: string, buffer: Buffer) => {
        const info = getImageInfo(url, buffer);
        const extname = '.webp';
        const fileName = info.fileName.replace(info.extname, extname);
        return { ...info, fileName, extname };
      };
    }

    const result = await getOption(fn.module).then((option) => {
      if (typeof option !== fn.optionType) {
        throw new TypeError(`The option is not a ${fn.optionType}`);
      }
      ctx.log.info(fn.module, JSON.stringify(option));
      return fn.toCompressBuffer(buffer, option);
    });

    if (buffer.length <= result.length) {
      ctx.log.warn('The compressed image is larger than the original image. Skipping compression');
      return getImageInfo(imageUrl, buffer, result.length / buffer.length);
    }

    ctx.log.info(`The ${fn.module} compression successful`);
    return getInfo(imageUrl, result);
  })();
}
