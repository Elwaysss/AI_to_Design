/**
 * Vite dev middleware — preview tokens + confirm export (dev only).
 */
import { exportDesign, previewMapped, loadCatalog } from '../../../../scripts/lib/design-export.mjs';
import { extractBrandPreviewMeta, mappedToBrandPreviewVars } from '../../../../scripts/lib/brand-preview-extract.mjs';
import { mappedToPreviewVars } from '../../../../scripts/lib/skill-to-design-mapper.mjs';

/** @param {import('node:http').IncomingMessage} req */
async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

/** @param {import('node:http').ServerResponse} res @param {number} status @param {unknown} data */
function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

/** @returns {import('vite').Plugin} */
export function designExportApiPlugin() {
  return {
    name: 'design-export-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/design/')) return next();

        try {
          if (req.url === '/api/design/catalog' && req.method === 'GET') {
            return json(res, 200, await loadCatalog());
          }

          if (req.url === '/api/design/preview' && req.method === 'POST') {
            const body = await readJsonBody(req);
            const result = await previewMapped(body.kind, body.slug, body.displayNameZh);
            const preview =
              body.kind === 'brand' && result.brandRaw
                ? mappedToBrandPreviewVars(
                    result.mapped,
                    extractBrandPreviewMeta(result.brandRaw, result.resolvedSlug ?? body.slug),
                    body.slug,
                    'brand'
                  )
                : mappedToPreviewVars(result.mapped, body.kind);
            return json(res, 200, { preview });
          }

          if (req.url === '/api/design/export' && req.method === 'POST') {
            const body = await readJsonBody(req);
            const out = await exportDesign({
              kind: body.kind,
              slug: body.slug,
              displayNameZh: body.displayNameZh,
              supplementNotes: body.supplementNotes,
              productSlug: body.productSlug ?? 'demo-saas'
            });
            return json(res, 200, out);
          }

          json(res, 404, { error: 'Not found' });
        } catch (err) {
          json(res, 500, { error: err instanceof Error ? err.message : String(err) });
        }
      });
    }
  };
}
