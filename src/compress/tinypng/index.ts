import { IPicGo } from 'picgo';
import { getImageInfo } from '../../utils.js';
import { CommonParams, ImageInfo } from '../../interface.js';
import Tinypng from './tinypng.js';

// Interface for Tinypng options
export interface ITinypngOptions {
  key: string;
}

/**
 * Function to compress image using Tinypng API key
 * @param ctx The PicGo instance.
 * @param imageUrl The URL of the image to be compressed.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function TinypngKeyCompress(ctx: IPicGo, { imageUrl, key }: CommonParams & ITinypngOptions): Promise<ImageInfo> {
  return Tinypng.init({ ctx, keys: key!.split(',') })
    .then(() => {
      return Tinypng.upload(imageUrl);
    })
    .then((buffer) => {
      ctx.log.info('Tinypng upload successful');
      return getImageInfo(imageUrl, buffer);
    });
}
