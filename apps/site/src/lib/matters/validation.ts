import { z } from "zod";

export const matterRowSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name is too long."),
  last_name: z.string().trim().min(1, "Last name is required.").max(100, "Last name is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email format.")
    .max(254, "Email address is too long."),
  petition_type: z
    .string()
    .trim()
    .min(1, "Petition type is required.")
    .max(40, "Petition type is too long."),
  sponsor_employer: z.string().trim().max(160, "Sponsor or employer is too long.").default(""),
  field_of_endeavor: z.string().trim().max(240, "Field of endeavor is too long.").default(""),
});

export type MatterRow = z.infer<typeof matterRowSchema>;

export const createMatterSchema = matterRowSchema;
