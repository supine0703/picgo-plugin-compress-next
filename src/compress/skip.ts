import { IPicGo } from 'picgo';
import { getImageBuffer, getImageInfo } from '../utils.js';
import { CommonParams, ImageInfo } from '../interface.js';

export function SkipCompress(ctx: IPicGo, { imageUrl }: CommonParams): Promise<ImageInfo> {
  return getImageBuffer(ctx, imageUrl).then((buffer) => getImageInfo(imageUrl, buffer))
}
