---
description: Read this before creating or modifying any UI components in the Link Shortener project.  
---
# UI Components Standard

This document establishes the mandatory standard for all UI component usage in the Link Shortener project. **All UI elements MUST use Shadcn UI components. Do not create custom components.**

## Core Rule

✅ **REQUIRED**: Use Shadcn UI components for all UI elements  
❌ **FORBIDDEN**: Create custom UI components

## When to Use Shadcn UI

- All buttons → Use `<Button>`
- All form inputs → Use Shadcn form components (`<Input>`, `<Select>`, `<Checkbox>`, etc.)
- All modals/dialogs → Use `<Dialog>`
- All navigation → Use Shadcn navigation components
- All cards/containers → Use `<Card>`
- All dropdowns → Use `<DropdownMenu>`
- All alerts/notifications → Use `<Alert>`
- All tables → Use `<Table>` (with Shadcn styling)
- All tooltips → Use `<Tooltip>`
- All tabs → Use `<Tabs>`
- All badges → Use `<Badge>`
- All loaders/spinners → Use Shadcn spinner patterns

## Benefits of This Approach

- **Consistency**: All UI components follow the same design system
- **Maintainability**: Single source of truth for component styling
- **Performance**: Reduced bundle size from shared Shadcn styles
- **Accessibility**: Shadcn components include WCAG compliance built-in
- **Development Speed**: Use proven, tested components instead of building from scratch

## How to Use Shadcn UI

### 1. Import Components
```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
```

### 2. Apply Tailwind Styling
Extend Shadcn components with Tailwind classes as needed:
```typescript
<Button className="w-full bg-blue-600 hover:bg-blue-700">
  Submit Form
</Button>

<Input 
  className="border-gray-300 focus:border-blue-500" 
  placeholder="Enter your name"
/>
```

### 3. Compose Complex UI
Build complex interfaces by combining Shadcn components:
```typescript
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Link</DialogTitle>
    </DialogHeader>
    <form className="space-y-4">
      <Input placeholder="Enter URL" />
      <Button>Create</Button>
    </form>
  </DialogContent>
</Dialog>
```

## Component Variants

Most Shadcn UI components support variants. Always use these instead of creating alternatives:
```typescript
// Use variants instead of custom component
<Button variant="outline">Outline Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Ghost Button</Button>

<Input variant="default" />
<Alert variant="destructive" />
```

## Common Patterns

### Form Handling
Use Shadcn form utilities with React Hook Form:
```typescript
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

<FormField
  control={form.control}
  name="url"
  render={({ field }) => (
    <FormItem>
      <FormLabel>URL</FormLabel>
      <FormControl>
        <Input {...field} placeholder="https://example.com" />
      </FormControl>
    </FormItem>
  )}
/>
```

### Conditional Styling
Use Shadcn components with Tailwind for conditional styles:
```typescript
<Button 
  variant={isActive ? 'default' : 'outline'}
  className={cn(isLoading && 'opacity-50 cursor-not-allowed')}
>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

## What NOT to Do

❌ **Don't** create custom button, input, or dialog components  
❌ **Don't** write custom styled components from scratch  
❌ **Don't** import UI components from other UI libraries  
❌ **Don't** bypass Shadcn components to reduce bundle size  
❌ **Don't** add extensive custom CSS to change component appearance  

## If Shadcn Doesn't Have What You Need

If a required UI pattern is not available in Shadcn UI:

1. **Check** the [Shadcn UI documentation](https://ui.shadcn.com/) for all available components
2. **Compose** multiple Shadcn components to create the needed pattern
3. **Style** using Tailwind CSS classes for custom appearance
4. **Only if absolutely necessary** and documented, extend a Shadcn component with minimal custom logic

Document the decision and rationale in code comments.

## Verification

Before committing code:
- ✅ All buttons use `<Button>`
- ✅ All inputs use Shadcn form components
- ✅ All modals use `<Dialog>`
- ✅ No custom styled components created
- ✅ All styling uses Tailwind classes or Shadcn variants

---

**Last Updated**: May 5, 2026  
**Version**: 1.0.0
