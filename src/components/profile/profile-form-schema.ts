import * as z from "zod";

export const profileFormSchema = z.object({
  nickname: z.string().min(2, "Nickname must be at least 2 characters."),
  x: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  facebook: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters."),
  bio: z.string().max(160, "Bio must not be longer than 160 characters."),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;