import * as fs from 'fs-extra';
import { IPicGo } from 'picgo';
import { imageSize } from 'image-size';
import { extname, basename } from 'path';
import { ImageInfo } from './interface';
import { ExecException, exec } from 'child_process';

// Check if the URL is a network URL
export function isNetworkUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

// Fetch image data from a URL
export async function fetchImage(ctx: IPicGo, url: string): Promise<Buffer> {
  return await ctx
    .request({
      method: 'GET',
      url,
      resolveWithFullResponse: true,
      responseType: 'arraybuffer',
    })
    .then((resp) => {
      const contentType = resp.headers['content-type'];
      if (contentType?.includes('image')) {
        return resp.data as Buffer;
      }
      throw new Error(`${url} is not an image`);
    });
}

// Get image buffer either from network or local file
export function getImageBuffer(ctx: IPicGo, imageUrl: string): Promise<Buffer> {
  if (isNetworkUrl(imageUrl)) {
    ctx.log.info('Fetching image from network');
    return fetchImage(ctx, imageUrl);
  } else {
    ctx.log.info('Reading local image file');
    return fs.readFile(imageUrl);
  }
}

// Get image information from image buffer
export function getImageInfo(imageUrl: string, buffer: Buffer, compressRatio?: number): ImageInfo {
  const { width, height } = imageSize(buffer);
  const ratio = compressRatio || buffer.length / fs.statSync(imageUrl).size;
  return {
    buffer,
    width: width as number,
    height: height as number,
    fileName: basename(imageUrl),
    extname: extname(imageUrl),
    compressionRatio: `${(ratio * 100).toFixed(1)}%`,
  };
}

// Get information about the URL
export function getUrlInfo(imageUrl: string) {
  return {
    fileName: basename(imageUrl),
    extname: extname(imageUrl),
  };
}

// Log execution time
export function logExecutionTime<T>(log: (info: string) => void, what: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  log(`${what} Time: ${(end - start).toFixed(2)}ms`);
  return result;
}

export function openFile(
  file: string,
  callback?: (error: ExecException | null, stdout: string, stderr: string) => void,
): void {
  const command =
    process.platform === 'win32'
      ? `start "" "${file}"`
      : process.platform === 'darwin'
      ? `open "${file}"`
      : `xdg-open "${file}"`;

  exec(command, callback);
}
