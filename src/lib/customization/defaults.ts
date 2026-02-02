import {
    LayoutDashboard,
    Users,
    Settings,
    ShieldCheck,
    Palette,
    FileText,
    Mail,
    Info,
    Bell,
    Sliders,
    Receipt,
    Wallet,
    GraduationCap,
    BookOpen,
    ClipboardCheck,
    TrendingUp,
    Briefcase,
    History,
    Activity,
    ClipboardList
} from "lucide-react"

export const ICON_MAP: Record<string, any> = {
    'dashboard': LayoutDashboard,
    'users': Users,
    'settings': Settings,
    'roles': ShieldCheck,
    'branding': Palette,
    'notices': Bell,
    'about': Info,
    'contact': Mail,
    'reports': FileText,
    'customization': Sliders,
    'attendance': GraduationCap,
    'fees': Receipt,
    'exams': BookOpen,
    'results': ClipboardCheck,
    'promotion': TrendingUp,
    'hr': Briefcase,
    'audit': History,
    'diagnostics': Activity,
}

export const DEFAULT_NAV = [
    { key: 'dashboard', labelKey: 'admin.nav.dashboard', route: '/admin', iconKey: 'dashboard', order: 1 },
    { key: 'attendance', labelKey: 'attendance.title', route: '/teacher/attendance', iconKey: 'attendance', order: 2, permissionRequired: 'attendance.take' },
    { key: 'users', labelKey: 'admin.nav.users', route: '/admin/users', iconKey: 'users', order: 3, permissionRequired: 'users.manage' },
    { key: 'hr', labelKey: 'admin.nav.hr', route: '/admin/hr', iconKey: 'hr', order: 3.5, permissionRequired: 'users.manage' },
    { key: 'roles', labelKey: 'admin.nav.roles', route: '/admin/settings/roles', iconKey: 'roles', order: 4, permissionRequired: 'roles.manage' },
    { key: 'branding', labelKey: 'admin.settings.branding.title', route: '/admin/settings/branding', iconKey: 'branding', order: 5, permissionRequired: 'settings.branding' },
    { key: 'customization', labelKey: 'admin.nav.customization', route: '/admin/settings/customization', iconKey: 'customization', order: 6, permissionRequired: 'settings.branding' },
    { key: 'fees', labelKey: 'fees.title', route: '/admin/accounting', iconKey: 'fees', order: 7, permissionRequired: 'fees.view' },
    { key: 'adminExams', labelKey: 'exams.title', route: '/admin/exams', iconKey: 'exams', order: 8, permissionRequired: 'results.publish' },
    { key: 'promotion', labelKey: 'promotion.title', route: '/admin/academic/promotions', iconKey: 'promotion', order: 9, permissionRequired: 'promotion.manage' },
    { key: 'reports', labelKey: 'admin.nav.reports', route: '/admin/reports', iconKey: 'reports', order: 10, permissionRequired: 'users.manage' },
    { key: 'audit', labelKey: 'admin.nav.audit', route: '/admin/audit', iconKey: 'audit', order: 11, permissionRequired: 'settings.branding' },
    { key: 'diagnostics', labelKey: 'admin.nav.diagnostics', route: '/admin/diagnostics', iconKey: 'diagnostics', order: 12, permissionRequired: 'settings.branding' },
]

export const DEFAULT_DASHBOARD = {
    layout: [
        { widget: 'student_stats', order: 1, enabled: true },
        { widget: 'attendance_summary', order: 2, enabled: true },
        { widget: 'quick_actions', order: 3, enabled: true },
    ]
}
