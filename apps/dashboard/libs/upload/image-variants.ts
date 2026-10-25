import sharp from "sharp";

/** Open Graph / Twitter large card size (1.91:1). */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** JPEG quality for share images: JPEG is the one format every preview service reads. */
const OG_JPEG_QUALITY = 86;

/**
 * Turns any picture into a 1200×630 JPEG share image without cropping it:
 * the whole picture, fitted inside, centered on a blurred and darkened copy
 * of itself that fills the frame. Pictures that are already 1.91:1 simply
 * fill it. Server only (sharp).
 */
export async function toOgImage(input: Buffer) {
  const source = sharp(input).rotate();
  const background = await source
    .clone()
    .flatten({ background: "#000000" })
    .resize(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, { fit: "cover" })
    .blur(40)
    .modulate({ brightness: 0.45 })
    .toBuffer();
  const foreground = await source
    .clone()
    .resize(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, { fit: "inside" })
    .toBuffer({ resolveWithObject: true });

  return await sharp(background)
    .composite([
      {
        input: foreground.data,
        left: Math.round((OG_IMAGE_WIDTH - foreground.info.width) / 2),
        top: Math.round((OG_IMAGE_HEIGHT - foreground.info.height) / 2),
      },
    ])
    .flatten({ background: "#000000" })
    .jpeg({ quality: OG_JPEG_QUALITY, mozjpeg: true })
    .toBuffer();
}

/** Browser tab / home-screen icon size: one square PNG serves every size. */
export const ICON_SIZE = 512;

/**
 * Turns any picture into a 512×512 PNG icon: the whole picture fitted inside
 * the square (no cropping), on a transparent background. PNG, because browser
 * tabs and Apple home screens don't reliably accept WebP icons. Server only.
 */
export async function toIconImage(input: Buffer) {
  return await sharp(input)
    .rotate()
    .resize(ICON_SIZE, ICON_SIZE, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}
