"use client"

import { Menu, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DynamicNav } from "./dynamic-nav"
import { useState } from "react"
import { useTranslation } from "@/lib/i18n/i18n-provider"

interface MobileNavProps {
    items: any[]
}

export function MobileNav({ items }: MobileNavProps) {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-none bg-white">
                <div className="flex flex-col h-full bg-white">
                    <div className="p-6 border-b flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <h2 className="font-bold text-lg tracking-tight text-slate-900">{t('admin.portalName')}</h2>
                    </div>
                    <nav className="flex-1 p-4 overflow-y-auto" onClick={() => setOpen(false)}>
                        <DynamicNav items={items} />
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    )
}
