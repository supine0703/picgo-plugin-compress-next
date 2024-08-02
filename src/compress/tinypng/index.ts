import { IPicGo } from 'picgo';
import { getImageInfo } from '../../utils';
import { CommonParams, ImageInfo } from '../../interface';
import TinyPng from './tinypng';

// Interface for TinyPng options
export interface ITinyPngOptions {
  key: string;
}

/**
 * Function to compress image using TinyPng API key
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function TinyPngKeyCompress(ctx: IPicGo, { imageUrl, key }: CommonParams & ITinyPngOptions): Promise<ImageInfo> {
  return TinyPng.init({ ctx, keys: key!.split(',').map((k) => k.trim()) })
    .then(() => {
      return TinyPng.upload(imageUrl);
    })
    .then((buffer) => {
      ctx.log.info('TinyPng upload successful');
      return getImageInfo(imageUrl, buffer);
    });
}
