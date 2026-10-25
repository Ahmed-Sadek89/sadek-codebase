import type { INestApplication } from '@nestjs/common';
import type { Request, Response } from 'express';

// The site's "AS" monogram favicon (16/32/48px), the same file as
// apps/web/app/favicon.ico. Embedded rather than read from disk so it ships
// inside the Vercel function bundle.
const FAVICON_BASE64 =
  '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' +
  'WxXeRsX1P4cPc3Tk8bQGAAAAAElFTkSuQmCC';

const FAVICON = Buffer.from(FAVICON_BASE64, 'base64');

/** Serves GET /favicon.ico (browsers request it for Swagger UI and any API URL opened in a tab). */
export function setupFavicon(app: INestApplication): void {
  app
    .getHttpAdapter()
    .get('/favicon.ico', (_request: Request, response: Response) => {
      response
        .status(200)
        .type('image/x-icon')
        .set('Cache-Control', 'public, max-age=604800, immutable')
        .send(FAVICON);
    });
}
