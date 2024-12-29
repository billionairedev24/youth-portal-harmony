import * as z from "zod";

export const settingsFormSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    whatsapp: z.boolean(),
  }),
  callPreference: z.enum(["morning", "afternoon", "evening"]),
  darkMode: z.boolean(),
  language: z.enum(["english", "spanish", "french"]),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export const defaultValues: SettingsFormValues = {
  notifications: {
    email: true,
    sms: false,
    whatsapp: false,
  },
  callPreference: "morning",
  darkMode: false,
  language: "english",
};