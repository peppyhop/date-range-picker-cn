# date-range-picker-cn

Date range picker components for shadcn-based React applications with both Base UI and Radix UI variants.

## Packages

- `date-range-picker-cn` exports the Base UI variant from the root entry point
- `date-range-picker-cn/base` exposes Base UI components and types directly
- `date-range-picker-cn/radix` exposes Radix UI components and types directly

## Installation

You can install the component via the shadcn CLI or as a standard npm package.

### Using AI Agents

This library provides skills for AI coding agents via [TanStack Intent](https://tanstack.com/intent). If you use an AI agent (like Cursor, Copilot, or Claude), run the following command to install the agent skills:

```bash
npx @tanstack/intent@latest install
```

### Using shadcn CLI

```bash
# Base UI variant (default)
npx shadcn@latest add https://raw.githubusercontent.com/peppyhop/date-range-picker-cn/main/registry/date-range-picker.json

# Radix UI variant
npx shadcn@latest add https://raw.githubusercontent.com/peppyhop/date-range-picker-cn/main/registry/date-range-picker-radix.json
```

### Using npm

`react` and `react-dom` are peer dependencies (React 18+).

#### Base UI variant (default export)

```bash
npm install date-range-picker-cn @base-ui/react react-day-picker
```

#### Radix UI variant

```bash
npm install date-range-picker-cn radix-ui react-day-picker
```

## Web configuration

### Tailwind CSS (required)

This package ships Tailwind class names, so your Tailwind build must scan the package files in `node_modules` to generate the required styles.

- Tailwind v3: add the package to `content` in `tailwind.config.{js,ts}`

```ts
export default {
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/date-range-picker-cn/dist/**/*.{js,mjs,cjs}",
	],
};
```

- Tailwind v4: ensure your CSS entry includes the package as a source (adjust the relative path if needed)

```css
@source "../node_modules/date-range-picker-cn/dist/**/*.{js,mjs,cjs}";
```

### shadcn/ui theme tokens

The components use shadcn/ui color tokens (for example `bg-background`, `text-foreground`, `border-border`). Make sure your app defines the corresponding CSS variables (as in shadcn/ui).

### Next.js App Router

Use the picker from a Client Component (a file that starts with `use client`).

## Usage

```tsx
import { DateRangePicker } from "date-range-picker-cn";

export function Example() {
	return (
		<DateRangePicker
			initialDateFrom={new Date()}
			placeholder="Select date range..."
		/>
	);
}
```

```tsx
import { DateRangePicker } from "date-range-picker-cn/radix";

export function Example() {
	return <DateRangePicker align="end" showCompare={false} />;
}
```

## Icons

Both variants render built-in SVG icons by default. If you want to use your own icon set, pass the `icons` prop (for example, from `lucide-react`).

## API Docs

- Generated API docs live in `docs/api`
- `npm run docs:api` refreshes the generated markdown locally
- Pushes to `main` automatically regenerate and commit API docs when the public API changes

## Conventional Commits

This repository validates commit messages against the Conventional Commits specification.

Examples:

- `feat: add preset ranges`
- `fix: correct compare range calculation`
- `docs: refresh usage examples`
- `chore: update typedoc config`

## Development

```bash
npm install
npm run dev
```

Useful scripts:

- `npm run build`
- `npm run lint`
- `npm run format:check`
- `npm run docs:api`
