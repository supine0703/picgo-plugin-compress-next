declare module 'imagemin-upng' {
  export default function upng(): any;
}

declare module 'imagemin-webp' {
  export default imageminWebp;
}

declare module 'imagemin-gif2webp' {
  export default imageminGif2webp;
}

declare module 'webp-converter' {
  export type ToWebP = (input_image: string, output_image: string, option: string, logging?: string) => Promise<any>;

  export const cwebp: ToWebP;
  export const gwebp: ToWebP;
}
