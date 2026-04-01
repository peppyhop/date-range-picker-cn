import { Check, ExternalLink, Layers3, Sparkles } from "lucide-react";
import * as React from "react";
import { DateRangePicker } from "./base/date-range-picker";
import { DateRangePicker as DateRangePickerRadix } from "./radix/date-range-picker";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePayload {
  dateRange: DateRange;
  compareDateRange?: DateRange;
}

function formatDate(date: Date | undefined): string {
  if (!date) {return "—";}
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatPayload(payload: DateRangePayload): string {
  return JSON.stringify(
    {
      dateRange: {
        from: payload.dateRange.from?.toISOString() ?? null,
        to: payload.dateRange.to?.toISOString() ?? null,
      },
      ...(payload.compareDateRange
        ? {
            compareDateRange: {
              from: payload.compareDateRange.from?.toISOString() ?? null,
              to: payload.compareDateRange.to?.toISOString() ?? null,
            },
          }
        : {}),
    },
    null,
    2,
  );
}

export function App(): React.JSX.Element {
  const defaultTo = React.useMemo(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), []);
  const [basePayload, setBasePayload] = React.useState<DateRangePayload>({
    dateRange: {
      from: new Date(),
      to: defaultTo,
    },
  });
  const [radixPayload, setRadixPayload] = React.useState<DateRangePayload>({
    dateRange: {
      from: new Date(),
      to: defaultTo,
    },
  });

  const baseSummary = `${formatDate(basePayload.dateRange.from)} - ${formatDate(basePayload.dateRange.to)}`;
  const radixSummary = `${formatDate(radixPayload.dateRange.from)} - ${formatDate(radixPayload.dateRange.to)}`;

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--muted)/0.28))] text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 lg:px-8">
        <header className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="size-4 text-primary" />
            <span>Live preview of the date range picker</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Date Range Picker
            </h1>
            <p className="mx-auto max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
              Start and end date picker with quick shortcuts.
            </p>
          </div>
        </header>

        <main className="mt-10 flex flex-1 flex-col gap-8">
          <section className="mx-auto w-full max-w-4xl rounded-[28px] border border-border/70 bg-card/80 px-6 py-6 shadow-[0_24px_80px_-42px_hsl(var(--foreground)/0.35)] backdrop-blur">
            <div className="flex flex-col gap-5 border-b border-border/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-4 text-sm font-medium text-background shadow-sm transition hover:opacity-90"
              >
                <ExternalLink className="size-4" />
                GitHub
              </button>
              <div className="w-full min-w-0 sm:w-[320px]">
                <DateRangePicker
                  onUpdate={setBasePayload}
                  initialDateFrom={basePayload.dateRange.from}
                  initialDateTo={basePayload.dateRange.to}
                  align="end"
                  showCompare={false}
                />
              </div>
            </div>

            <div className="grid gap-5 pt-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-border/70 bg-background/90 p-5">
                  <p className="text-sm font-medium text-foreground">Selected range</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{baseSummary}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Quick shortcuts and easy to use on small screens.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {["Quick range shortcuts", "Keyboard accessible", "Works on small screens"].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/80 px-3 py-3 text-sm text-muted-foreground"
                      >
                        <Check className="size-4 text-primary" />
                        <span>{item}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/95 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Applied selection</p>
                    <p className="text-sm text-muted-foreground">{baseSummary}</p>
                  </div>
                  <div className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    Base UI
                  </div>
                </div>
                <pre className="mt-4 overflow-x-auto rounded-xl bg-muted/60 p-4 text-xs leading-6 text-foreground">
                  {formatPayload(basePayload)}
                </pre>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[24px] border border-border/70 bg-card/80 p-6 shadow-[0_20px_60px_-35px_hsl(var(--foreground)/0.4)]">
              <div className="flex flex-col gap-2 border-b border-border/70 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Base UI version</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Built with Base UI primitives.
                  </p>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Recommended
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="max-w-[360px]">
                  <DateRangePicker
                    onUpdate={setBasePayload}
                    initialDateFrom={basePayload.dateRange.from}
                    initialDateTo={basePayload.dateRange.to}
                    align="start"
                    showCompare={false}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {["Quick range shortcuts", "Keyboard accessible", "Apply or cancel changes"].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/80 px-3 py-3 text-sm text-muted-foreground"
                      >
                        <Check className="size-4 text-primary" />
                        <span>{item}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-border/70 bg-card/80 p-6 shadow-[0_20px_60px_-35px_hsl(var(--foreground)/0.4)]">
              <div className="flex items-center gap-2">
                <Layers3 className="size-5 text-primary" />
                <h2 className="text-2xl font-semibold tracking-tight">Radix UI version</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Built with Radix UI primitives.
              </p>
              <div className="mt-6 space-y-4">
                <div className="max-w-[360px]">
                  <DateRangePickerRadix
                    onUpdate={setRadixPayload}
                    initialDateFrom={radixPayload.dateRange.from}
                    initialDateTo={radixPayload.dateRange.to}
                    align="start"
                    showCompare={false}
                  />
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/95 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Current Radix selection</p>
                      <p className="text-sm text-muted-foreground">{radixSummary}</p>
                    </div>
                    <div className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      Radix
                    </div>
                  </div>
                  <pre className="mt-4 overflow-x-auto rounded-xl bg-muted/60 p-4 text-xs leading-6 text-foreground">
                    {formatPayload(radixPayload)}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-4xl rounded-[28px] border border-border/70 bg-card/80 px-6 py-8 shadow-[0_24px_80px_-42px_hsl(var(--foreground)/0.35)] backdrop-blur">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Installation</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  You can install the component via the shadcn CLI or as a standard npm package.
                </p>
              </div>

              <div className="mt-2">
                <h3 className="text-lg font-medium">Using shadcn CLI</h3>
                <div className="mt-4 grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-border/70 bg-background/90 p-5">
                    <h4 className="font-medium">Base UI variant (default)</h4>
                    <pre className="mt-3 overflow-x-auto rounded-xl bg-muted/60 p-4 text-sm text-foreground">
                      npx shadcn@latest add
                      https://raw.githubusercontent.com/peppyhop/date-range-picker-cn/main/registry/date-range-picker.json
                    </pre>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/90 p-5">
                    <h4 className="font-medium">Radix UI variant</h4>
                    <pre className="mt-3 overflow-x-auto rounded-xl bg-muted/60 p-4 text-sm text-foreground">
                      npx shadcn@latest add
                      https://raw.githubusercontent.com/peppyhop/date-range-picker-cn/main/registry/date-range-picker-radix.json
                    </pre>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium">Using npm</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                    react
                  </code>{" "}
                  and{" "}
                  <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                    react-dom
                  </code>{" "}
                  are peer dependencies (React 18+).
                </p>
                <div className="mt-4 grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-border/70 bg-background/90 p-5">
                    <h4 className="font-medium">Base UI variant (default)</h4>
                    <pre className="mt-3 overflow-x-auto rounded-xl bg-muted/60 p-4 text-sm text-foreground">
                      npm install date-range-picker-shadcn @base-ui/react react-day-picker
                    </pre>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/90 p-5">
                    <h4 className="font-medium">Radix UI variant</h4>
                    <pre className="mt-3 overflow-x-auto rounded-xl bg-muted/60 p-4 text-sm text-foreground">
                      npm install date-range-picker-shadcn radix-ui react-day-picker
                    </pre>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-semibold tracking-tight">Configuration</h2>

                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Tailwind CSS</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      Add the package to your content paths so Tailwind can generate the required
                      styles.
                    </p>

                    <div className="mt-3 space-y-4">
                      <div className="rounded-2xl border border-border/70 bg-background/90 p-5">
                        <p className="mb-3 text-sm font-medium">Tailwind v3 (tailwind.config.ts)</p>
                        <pre className="overflow-x-auto rounded-xl bg-muted/60 p-4 text-sm text-foreground">
                          {`export default {
  content: [
    // ...
    "./node_modules/date-range-picker-shadcn/dist/**/*.{js,mjs,cjs}",
  ],
};`}
                        </pre>
                      </div>

                      <div className="rounded-2xl border border-border/70 bg-background/90 p-5">
                        <p className="mb-3 text-sm font-medium">Tailwind v4 (CSS)</p>
                        <pre className="overflow-x-auto rounded-xl bg-muted/60 p-4 text-sm text-foreground">
                          {`@source "../node_modules/date-range-picker-cn/dist/**/*.{js,mjs,cjs}";`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Theme Tokens</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      The components use shadcn/ui color tokens (e.g.,{" "}
                      <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        bg-background
                      </code>
                      ,{" "}
                      <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        text-foreground
                      </code>
                      ,{" "}
                      <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        border-border
                      </code>
                      ). Ensure your app defines these CSS variables.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-semibold tracking-tight">Usage</h2>
                <div className="mt-4 rounded-2xl border border-border/70 bg-background/90 p-5">
                  <pre className="overflow-x-auto rounded-xl bg-muted/60 p-4 text-sm text-foreground">
                    {`import { DateRangePicker } from "date-range-picker-cn";

export function Example() {
  return (
    <DateRangePicker
      initialDateFrom={new Date()}
      placeholder="Select date range..."
      align="end"
      showCompare={false}
    />
  );
}`}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
