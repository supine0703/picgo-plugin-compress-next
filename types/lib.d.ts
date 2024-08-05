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
  export function buffer2webpbuffer(
    buffer: Buffer,
    image_type: string,
    option: string,
    extra_path?: string,
  ): Promise<Buffer>;

  export function cwebp(
    input_image: string,
    output_image: string,
    option: string,
    logging:string ='-quiet'
  ): Promise<any>;

  export function gwebp(
    input_image: string,
    output_image: string,
    option: string,
    logging:string ='-quiet'
  ): Promise<any>;
}
