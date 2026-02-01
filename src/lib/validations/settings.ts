import { z } from "zod"

export const settingsSchema = z.object({
    schoolNameBn: z.string().min(1, "Bangla name is required"),
    schoolNameEn: z.string().min(1, "English name is required"),
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color code"),
    secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color code").optional().or(z.literal("")),
    email: z.string().email(),
    phone: z.string().min(1),
    addressBn: z.string().min(1),
    addressEn: z.string().min(1),
    footerTextBn: z.string(),
    footerTextEn: z.string(),
    logoUrl: z.string().optional(),
})






