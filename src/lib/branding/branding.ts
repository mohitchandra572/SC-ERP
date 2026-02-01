import { prisma } from "@/lib/db"
import { cache } from "react"

export const getSchoolSettings = cache(async () => {
    const settings = await prisma.schoolSettings.findFirst()
    return settings
})







