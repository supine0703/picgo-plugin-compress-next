import { ToWebP } from 'webp-converter';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync } from 'fs';

import { v4 as uuid } from 'uuid';

export async function Buffer2WebPBuffer(
  buffer: Buffer,
  extname: string,
  toWebP: ToWebP,
  option: string,
): Promise<Buffer> {
  const extraPath = join(__dirname, '/temp/');
  if (!existsSync(extraPath)) {
    mkdirSync(extraPath, { recursive: true });
  }

  const filename = uuid();
  const input = `${extraPath}${filename}${extname}`;
  const output = `${extraPath}${filename}.webp`;

  writeFileSync(input, buffer);
  return toWebP(input, output, option).then(() => {
    const buf = Buffer.from(readFileSync(output));
    unlinkSync(input);
    unlinkSync(output);
    return buf;
  });
}
