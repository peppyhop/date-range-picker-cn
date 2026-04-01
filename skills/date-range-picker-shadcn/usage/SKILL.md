---
name: date-range-picker-shadcn/usage
description: >
  Date range picker components for shadcn-based React applications.
  Use this skill to correctly install, configure Tailwind CSS, and implement both Base UI and Radix UI variants of date-range-picker-shadcn.
type: core
library: date-range-picker-shadcn
library_version: "0.0.1"
sources:
  - "peppyhop/date-range-picker-cn:README.md"
---

# Date Range Picker Shadcn

This skill covers the installation, configuration, and usage of the `date-range-picker-shadcn` library, which provides date range picker components with both Base UI and Radix UI variants.

## Setup

### Installation via shadcn CLI (Recommended)

```bash
# Base UI variant (default)
npx shadcn@latest add https://raw.githubusercontent.com/peppyhop/date-range-picker-cn/main/registry/date-range-picker.json

# Radix UI variant
npx shadcn@latest add https://raw.githubusercontent.com/peppyhop/date-range-picker-cn/main/registry/date-range-picker-radix.json
```

### Installation via npm

Ensure `react` and `react-dom` (18+) are installed as peer dependencies.

```bash
# Base UI variant
npm install date-range-picker-shadcn @base-ui/react react-day-picker

# Radix UI variant
npm install date-range-picker-shadcn radix-ui react-day-picker
```

### Tailwind CSS Configuration

The package ships Tailwind class names. Your Tailwind build must scan the package files to generate the required styles.

For Tailwind v3 (`tailwind.config.ts`):
```ts
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/date-range-picker-shadcn/dist/**/*.{js,mjs,cjs}",
  ],
};
```

For Tailwind v4 (in your main CSS file):
```css
@source "../node_modules/date-range-picker-shadcn/dist/**/*.{js,mjs,cjs}";
```

Ensure your app defines standard shadcn/ui color tokens (e.g., `--background`, `--foreground`, `--border`).

## Core Patterns

### Base UI Variant Usage

The default export uses Base UI.

```tsx
import { DateRangePicker } from "date-range-picker-shadcn";

export function Example() {
  return (
    <DateRangePicker
      initialDateFrom={new Date()}
      placeholder="Select date range..."
      align="end"
      showCompare={false}
    />
  );
}
```

### Radix UI Variant Usage

Import from the `/radix` subpath for the Radix UI variant.

```tsx
import { DateRangePicker } from "date-range-picker-shadcn/radix";

export function Example() {
  return (
    <DateRangePicker 
      align="end" 
      showCompare={false} 
    />
  );
}
```

## Common Mistakes

### CRITICAL Missing Tailwind Content Configuration

Wrong:
```ts
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
```

Correct:
```ts
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/date-range-picker-shadcn/dist/**/*.{js,mjs,cjs}",
  ],
};
```
Without the node_modules path in the content array (or `@source` in v4), the component will render without styles because Tailwind won't generate the necessary utility classes.
Source: README.md

### HIGH Incorrect Import for Radix Variant

Wrong:
```tsx
import { DateRangePicker } from "date-range-picker-shadcn";
// Attempting to use Radix UI without the correct import path
```

Correct:
```tsx
import { DateRangePicker } from "date-range-picker-shadcn/radix";
```
The root export exposes the Base UI variant. To use the Radix UI variant, you must import from `date-range-picker-shadcn/radix`.
Source: README.md

### HIGH Missing Peer Dependencies

Wrong:
```bash
npm install date-range-picker-shadcn
```

Correct:
```bash
npm install date-range-picker-shadcn @base-ui/react react-day-picker
```
The library requires peer dependencies to function correctly. If installing via npm, you must explicitly install the required peer dependencies depending on the variant you choose.
Source: README.md
