import { Logger } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';

const logger = new Logger('ApidogSync');

/**
 * Pushes the generated OpenAPI spec to Apidog, so Apidog updates on every dev
 * start / watch reload instead of waiting for a scheduled import.
 * Runs only when APIDOG_ACCESS_TOKEN and APIDOG_PROJECT_ID are set, and never
 * in production. Fire-and-forget: a failed sync logs a warning, never blocks startup.
 */
export function syncToApidog(document: OpenAPIObject): void {
  const token = process.env.APIDOG_ACCESS_TOKEN;
  const projectId = process.env.APIDOG_PROJECT_ID;
  if (!token || !projectId || process.env.NODE_ENV === 'production') return;

  const baseUrl = process.env.APIDOG_API_URL ?? 'https://api.apidog.com';
  void fetch(`${baseUrl}/v1/projects/${projectId}/import-openapi?locale=en-US`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Apidog-Api-Version': '2024-03-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: JSON.stringify(document),
      options: {
        // Merge keeps examples, tests and mock rules edited in Apidog.
        endpointOverwriteBehavior: 'AUTO_MERGE',
        schemaOverwriteBehavior: 'AUTO_MERGE',
        updateFolderOfChangedEndpoint: true,
        prependBasePath: false,
        deleteUnmatchedResources: process.env.APIDOG_DELETE_UNMATCHED === 'true',
      },
    }),
  })
    .then(async (response) => {
      const body = await response.json().catch(() => undefined);
      if (!response.ok) {
        logger.warn(`Apidog import failed (${response.status}): ${JSON.stringify(body)}`);
        return;
      }
      const counters = body?.data?.counters ?? {};
      logger.log(
        `Apidog synced: ${counters.endpointCreated ?? 0} created, ${counters.endpointUpdated ?? 0} updated, ${counters.endpointFailed ?? 0} failed`,
      );
      for (const error of body?.data?.errors ?? []) {
        logger.warn(`Apidog: ${error.code} ${error.message}`);
      }
    })
    .catch((error: unknown) => {
      logger.warn(`Apidog import failed: ${error instanceof Error ? error.message : String(error)}`);
    });
}
