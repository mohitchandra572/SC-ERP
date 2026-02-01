import * as React from "react"
import { cn } from "@/lib/ui/cn"
import { ChevronDown } from "lucide-react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, label, ...props }, ref) => {
        return (
            <div className="relative w-full group">
                <select
                    className={cn(
                        "flex h-11 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:border-slate-300",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none transition-transform group-focus-within:rotate-180" />
            </div>
        )
    }
)

Select.displayName = "Select"

const SelectItem = ({ children, value, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) => {
    return (
        <option value={value} {...props} className="py-2 px-3 text-sm">
            {children}
        </option>
    )
}

const SelectTrigger = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("relative", className)}>{children}</div>
)

const SelectValue = ({ placeholder }: { placeholder?: string }) => (
    <span className="text-slate-500">{placeholder}</span>
)

const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>

export { Select, SelectItem, SelectTrigger, SelectValue, SelectContent }
