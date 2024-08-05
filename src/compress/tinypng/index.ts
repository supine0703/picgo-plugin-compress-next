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
 * @param key The TinyPng API key(s).
 * @param refresh Whether to automatically update across months.
 * @returns A Promise that resolves to an ImageInfo object containing information about the compressed image.
 */
export function TinyPngKeyCompress(
  ctx: IPicGo,
  { imageUrl, key }: CommonParams & ITinyPngOptions,
  refresh: boolean,
): Promise<ImageInfo> {
  return TinyPng.init({ ctx, keys: key!.split(',').map((k) => k.trim()) }, refresh)
    .then(() => {
      return TinyPng.upload(imageUrl);
    })
    .then((buffer) => {
      ctx.log.info('TinyPng upload successful');
      return getImageInfo(imageUrl, buffer);
    });
}

/**
 * Function to refresh or clear TinyPng API key
 * @param ctx The PicGo instance.
 * @param clear A boolean indicating whether to clear the key.
 */
export function RefreshTinyPngConfig(ctx: IPicGo, clear: boolean = false): Promise<string> {
  return TinyPng.init({ ctx, keys: [] }).then(() => {
    return TinyPng.refresh(clear);
  });
}
