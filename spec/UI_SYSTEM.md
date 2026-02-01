# UI System Specification

## Overview
This document defines the design system for the Bangladesh School Management Platform. The system prioritizes **clarity, accessibility, and mobile-first design** with minimal animations and a professional aesthetic.

---

## Design Principles

1. **Mobile-First**: Design for 320px+ screens, enhance for larger viewports
2. **Accessibility**: WCAG 2.1 AA compliance minimum
3. **Performance**: Minimal JavaScript, server-first rendering
4. **Consistency**: Reusable components, predictable patterns
5. **Localization**: All text via i18n keys (Bangla default)
6. **Professional**: Clean, minimal, trust-building design

---

## Typography

### Font Stack
```css
--font-sans: 'Geist', system-ui, -apple-system, sans-serif;
--font-mono: 'Geist Mono', 'Courier New', monospace;
```

### Type Scale
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Usage Guidelines
- **Headings**: Use semibold (600) or bold (700)
- **Body**: Use normal (400) or medium (500)
- **Labels**: Use medium (500)
- **Captions**: Use text-sm with normal weight

---

## Spacing System

### Scale (based on 4px grid)
```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### Usage
- **Component padding**: 4, 6
- **Section spacing**: 8, 12, 16
- **Element gaps**: 2, 3, 4
- **Page margins**: 4, 6, 8

---

## Color System

### Semantic Colors
```css
/* Primary (Brand) - Dynamic from SchoolSettings */
--primary: var(--brand-primary, #2563eb);
--primary-foreground: #ffffff;

/* Neutral */
--background: #ffffff;
--foreground: #09090b;
--muted: #f4f4f5;
--muted-foreground: #71717a;
--border: #e4e4e7;

/* Status */
--success: #16a34a;
--success-foreground: #ffffff;
--warning: #eab308;
--warning-foreground: #09090b;
--error: #dc2626;
--error-foreground: #ffffff;
--info: #0284c7;
--info-foreground: #ffffff;

/* Interactive */
--accent: #f4f4f5;
--accent-foreground: #09090b;
--destructive: #dc2626;
--destructive-foreground: #ffffff;
```

### Dark Mode (Optional Phase 2)
```css
@media (prefers-color-scheme: dark) {
  --background: #09090b;
  --foreground: #fafafa;
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
  --border: #27272a;
}
```

---

## Layout Patterns

### Container Widths
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### Grid System
- **Mobile**: 1 column
- **Tablet**: 2-3 columns
- **Desktop**: 3-4 columns
- **Gap**: space-4 to space-6

### Common Layouts

#### Page Shell
```tsx
<PageShell>
  <PageHeader title="..." actions={...} />
  <PageContent>
    {/* Main content */}
  </PageContent>
</PageShell>
```

#### Dashboard Layout
```tsx
<DashboardLayout>
  <Sidebar />
  <MainContent>
    <Topbar />
    <PageContent />
  </MainContent>
</DashboardLayout>
```

#### Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>...</Card>
</div>
```

---

## Component Naming Conventions

### File Structure
```
components/
  ui/              # Base primitives (shadcn/ui style)
    button.tsx
    input.tsx
    card.tsx
  layout/          # Layout components
    header.tsx
    sidebar.tsx
    page-shell.tsx
  state/           # State components
    empty-state.tsx
    loading-state.tsx
    error-state.tsx
  forms/           # Form components
    form-field.tsx
    form-section.tsx
  tables/          # Table components
    data-table.tsx
    table-pagination.tsx
```

### Naming Rules
- **PascalCase** for component files and exports
- **kebab-case** for file names
- **Prefix** with domain when needed: `student-card.tsx`, `teacher-list.tsx`
- **Suffix** with type: `*-form.tsx`, `*-table.tsx`, `*-modal.tsx`

---

## Button Variants

### Variants
```tsx
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link</Button>
```

### Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon Only</Button>
```

### Icon Rules
- **Left icon**: Use for primary action context
- **Right icon**: Use for navigation/external links
- **Icon only**: Use with `size="icon"` and `aria-label`
- **Icon size**: 16px (sm), 20px (default), 24px (lg)

---

## Form Patterns

### Stack
- **React Hook Form** for form state
- **Zod** for validation schemas
- **Server Actions** for submission

### Form Structure
```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormSection title="Basic Info">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('forms.name')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
    
    <FormActions>
      <Button type="button" variant="outline">
        {t('common.cancel')}
      </Button>
      <Button type="submit">
        {t('common.save')}
      </Button>
    </FormActions>
  </form>
</Form>
```

### Validation Display
- **Inline errors**: Below field
- **Summary errors**: Top of form (optional)
- **Success**: Toast notification
- **Loading**: Disable form + button spinner

---

## Table Patterns

### Server-Side Pagination Ready
```tsx
<DataTable
  columns={columns}
  data={data}
  pagination={{
    page: 1,
    pageSize: 10,
    total: 100,
  }}
  onPageChange={handlePageChange}
  loading={isLoading}
  emptyState={<EmptyState />}
/>
```

### Column Definition
```tsx
const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: t('tables.name'),
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];
```

### Table Features
- ✅ Sorting (server-side)
- ✅ Filtering (server-side)
- ✅ Pagination (server-side)
- ✅ Row selection (optional)
- ✅ Responsive (horizontal scroll on mobile)

---

## State Components

### Empty State
```tsx
<EmptyState
  icon={<FileIcon />}
  title={t('empty.noStudents')}
  description={t('empty.noStudentsDesc')}
  action={
    <Button onClick={handleCreate}>
      {t('actions.addStudent')}
    </Button>
  }
/>
```

### Loading State
```tsx
<LoadingState
  message={t('loading.fetchingData')}
  spinner={true}
/>
```

### Error State
```tsx
<ErrorState
  title={t('error.loadFailed')}
  message={error.message}
  retry={handleRetry}
/>
```

### Forbidden State
```tsx
<ForbiddenState
  message={t('error.noPermission')}
  backLink="/dashboard"
/>
```

---

## Modal & Drawer Patterns

### Modal (Dialog)
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{t('modals.confirmDelete')}</DialogTitle>
      <DialogDescription>
        {t('modals.confirmDeleteDesc')}
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        {t('common.cancel')}
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        {t('common.delete')}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Sheet (Drawer)
```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>{t('sheets.filters')}</SheetTitle>
    </SheetHeader>
    {/* Filter form */}
  </SheetContent>
</Sheet>
```

### Usage Guidelines
- **Modal**: Confirmations, short forms, alerts
- **Drawer**: Filters, settings, detailed forms
- **Mobile**: Prefer drawer (bottom sheet)

---

## Accessibility Guidelines

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus indicators
- Escape to close modals/drawers

### Screen Readers
- Semantic HTML (`<nav>`, `<main>`, `<article>`)
- ARIA labels for icon buttons
- ARIA live regions for dynamic content
- Skip links for navigation

### Color Contrast
- Text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### Focus Management
```css
.focus-visible:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

---

## Animation Guidelines

### Principles
- **Minimal**: Only when enhancing UX
- **Fast**: 150-300ms max
- **Purposeful**: Indicate state change or guide attention

### Allowed Animations
```css
/* Hover states */
.hover-lift {
  transition: transform 150ms ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
}

/* Loading spinners */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Fade in/out */
.fade-in {
  animation: fadeIn 200ms ease;
}
```

### Forbidden
- ❌ Auto-playing animations
- ❌ Parallax effects
- ❌ Excessive motion
- ❌ Animations longer than 500ms

---

## Responsive Breakpoints

```css
/* Mobile first */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Mobile Patterns
- **Navigation**: Hamburger menu → Sidebar
- **Tables**: Horizontal scroll or card view
- **Forms**: Single column
- **Modals**: Full screen on mobile

---

## Icon System

### Library
- **Lucide React** (already installed)
- Consistent 20px default size
- Stroke width: 2

### Usage
```tsx
import { User, Settings, LogOut } from 'lucide-react';

<Button>
  <User className="mr-2 h-4 w-4" />
  {t('nav.profile')}
</Button>
```

### Guidelines
- Use semantic icons
- Always pair with text (except icon-only buttons)
- Maintain consistent sizing within context

---

## Internationalization (i18n)

### Translation Keys Structure
```json
{
  "common": { "save": "সংরক্ষণ করুন", ... },
  "nav": { "dashboard": "ড্যাশবোর্ড", ... },
  "forms": { "name": "নাম", ... },
  "tables": { "actions": "কার্যক্রম", ... },
  "empty": { "noData": "কোনো তথ্য নেই", ... },
  "error": { "loadFailed": "লোড ব্যর্থ", ... }
}
```

### Usage in Components
```tsx
const { t } = useTranslation();

<Button>{t('common.save')}</Button>
<Label>{t('forms.email')}</Label>
<EmptyState title={t('empty.noStudents')} />
```

---

## Component Checklist

Before marking a component "done":
- [ ] Uses i18n keys (no hardcoded strings)
- [ ] Accessible (keyboard, screen reader, focus)
- [ ] Responsive (mobile-first)
- [ ] Consistent styling (follows design tokens)
- [ ] Documented props (TypeScript types)
- [ ] Error states handled
- [ ] Loading states handled

---

## File Organization

```
src/
  components/
    ui/           # shadcn/ui primitives
    layout/       # Page layouts
    state/        # Empty, Loading, Error states
    forms/        # Form components
    tables/       # Table components
  lib/
    ui/           # UI utilities
      cn.ts       # classnames helper
      tokens.ts   # Design tokens
```

---

## Summary

This UI system provides:
- ✅ Consistent design language
- ✅ Reusable component patterns
- ✅ Accessibility built-in
- ✅ Mobile-first responsive design
- ✅ i18n-ready components
- ✅ Clear naming conventions
- ✅ Scalable architecture

**Next**: See `FRONTEND_ARCHITECTURE.md` for implementation details.
