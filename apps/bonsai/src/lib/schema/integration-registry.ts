import { z } from "zod";

export const IntegrationServiceSchema = z.enum([
  "rork",
  "blaxel",
  "github",
  "unbound",
]);
export type IntegrationService = z.infer<typeof IntegrationServiceSchema>;

export const IntegrationRegistryEntrySchema = z.object({
  id: z.string(),
  service: IntegrationServiceSchema,
  resource_type: z.string(),
  resource_id: z.string(),
  github_repo: z.string().nullable(),
  connected: z.boolean(),
  connection_verified_at: z.string().nullable(),
  notes: z.string().nullable(),
});
export type IntegrationRegistryEntry = z.infer<
  typeof IntegrationRegistryEntrySchema
>;
