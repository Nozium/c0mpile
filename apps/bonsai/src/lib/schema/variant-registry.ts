import { z } from "zod";

export const VariantStatusSchema = z.enum([
  "draft",
  "generating",
  "ready",
  "validated",
  "archived",
]);
export type VariantStatus = z.infer<typeof VariantStatusSchema>;

export const ArtifactSchema = z.object({
  type: z.string(),
  url: z.string(),
  label: z.string().optional(),
  captured_at: z.string().optional(),
});
export type Artifact = z.infer<typeof ArtifactSchema>;

export const VariantRegistryEntrySchema = z.object({
  id: z.string(),
  proposal_id: z.string(),
  execution_packet_id: z.string().nullable(),
  constitution_id: z.string(),
  variant_number: z.number().int().min(1),
  rork_project_url: z.string().nullable(),
  github_repo: z.string().nullable(),
  preview_url: z.string().nullable(),
  artifact_urls: z.array(z.string()),
  artifacts: z.array(ArtifactSchema).optional(),
  github_connected: z.boolean(),
  status: VariantStatusSchema,
  created_at: z.string(),
  operator_memo: z.string().nullable(),
});
export type VariantRegistryEntry = z.infer<typeof VariantRegistryEntrySchema>;

export const VariantReturnMetadataSchema = z.object({
  variant_id: z.string(),
  proposal_id: z.string(),
  preview_url: z.string().nullable(),
  github_repo: z.string().nullable(),
  artifacts: z.array(ArtifactSchema),
  operator_memo: z.string().nullable(),
  returned_at: z.string(),
});
export type VariantReturnMetadata = z.infer<
  typeof VariantReturnMetadataSchema
>;
