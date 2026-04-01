import { Popover } from "@base-ui/react/popover";
import { Select } from "@base-ui/react/select";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "./date-input";
import { SegmentedDateInput } from "./segmented-date-input.tsx";

export type DateRangePickerIcon = React.ComponentType<{ className?: string }>;

export interface DateRangePickerIcons {
  Calendar?: DateRangePickerIcon;
  Check?: DateRangePickerIcon;
  ChevronLeft?: DateRangePickerIcon;
  ChevronRight?: DateRangePickerIcon;
}

function renderDefaultCalendarIcon(className?: string): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function renderDefaultChevronLeftIcon(className?: string): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function renderDefaultChevronRightIcon(className?: string): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function renderDefaultCheckIcon(className?: string): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export interface CompareDateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface PresetDateRange {
  label: string;
  dateRange: DateRange;
}

export interface DateRangePickerProps {
  onUpdate?: (values: { dateRange: DateRange; compareDateRange?: CompareDateRange }) => void;
  initialDateFrom?: Date | string;
  initialDateTo?: Date | string;
  initialCompareFrom?: Date | string;
  initialCompareTo?: Date | string;
  align?: "start" | "center" | "end";
  locale?: string;
  showCompare?: boolean;
  placeholder?: string;
  disabled?: boolean;
  icons?: DateRangePickerIcons;
}

function toDate(value: Date | string | undefined): Date | undefined {
  if (!value) {return;}
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {return;}
    return value;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {return;}
  return parsed;
}

function formatDate(date: Date, locale: string = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function renderTriggerLabel(
  dateRange: DateRange,
  locale: string,
  placeholder: string,
): React.JSX.Element {
  const {from} = dateRange;
  const {to} = dateRange;

  if (!from && !to) {return <>{placeholder}</>;}
  if (from && !to) {return <>{formatDate(from, locale)}</>;}
  if (!from && to) {return <>{formatDate(to, locale)}</>;}
  if (!from || !to) {return <>{placeholder}</>;}

  return (
    <>
      {formatDate(from, locale)}
      {" - "}
      {formatDate(to, locale)}
    </>
  );
}

function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getStartOfWeek(date: Date): Date {
  const nextDate = new Date(date);
  const day = nextDate.getDay();
  nextDate.setDate(nextDate.getDate() - day);
  return nextDate;
}

function getEndOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function getSubMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() - months, date.getDate());
}

function getAddMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  return addDays(start, 6);
}

function startOfDay(date: Date): Date {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function getPreviousPeriod(range: DateRange): CompareDateRange | undefined {
  if (!range.from || !range.to) {return;}
  const from = startOfDay(range.from);
  const to = startOfDay(range.to);
  const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1) - 1;
  const previousTo = addDays(from, -1);
  const previousFrom = addDays(previousTo, -days);
  return {
    from: previousFrom,
    to: previousTo,
  };
}

function formatDateInput(date: Date | undefined): string {
  if (!date) {return "";}
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = (): void => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return (): void => mediaQuery.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

export function DateRangePicker({
  onUpdate,
  initialDateFrom,
  initialDateTo,
  initialCompareFrom,
  initialCompareTo,
  align = "end",
  locale = "en-US",
  showCompare = true,
  placeholder = "Select date range...",
  disabled = false,
  icons,
}: DateRangePickerProps): React.JSX.Element {
  const CalendarIcon = icons?.Calendar;
  const ChevronLeftIcon = icons?.ChevronLeft;
  const ChevronRightIcon = icons?.ChevronRight;
  const CheckIcon = icons?.Check;
  const isMobile = useIsMobile();
  const initialRange = React.useMemo<DateRange>(
    () => ({
      from: toDate(initialDateFrom) || new Date(),
      to: toDate(initialDateTo),
    }),
    [initialDateFrom, initialDateTo],
  );
  const initialCompareRange = React.useMemo<CompareDateRange | undefined>(() => {
    const explicitCompareRange = {
      from: toDate(initialCompareFrom),
      to: toDate(initialCompareTo),
    };
    if (explicitCompareRange.from && explicitCompareRange.to) {
      return explicitCompareRange;
    }
    return getPreviousPeriod(initialRange);
  }, [initialCompareFrom, initialCompareTo, initialRange]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange>(initialRange);
  const [compareEnabled, setCompareEnabled] = React.useState(Boolean(initialCompareRange));
  const [compareDateRange, setCompareDateRange] = React.useState<CompareDateRange | undefined>(
    initialCompareRange,
  );
  const [draftDateRange, setDraftDateRange] = React.useState<DateRange>(initialRange);
  const [draftCompareEnabled, setDraftCompareEnabled] = React.useState(
    Boolean(initialCompareRange),
  );
  const [draftCompareDateRange, setDraftCompareDateRange] = React.useState<
    CompareDateRange | undefined
  >(initialCompareRange);
  const [visibleMonth, setVisibleMonth] = React.useState<Date>(
    startOfDay(initialRange.from ?? new Date()),
  );

  const today = React.useMemo(() => new Date(), []);

  const presetDateRanges: PresetDateRange[] = React.useMemo(
    () => [
      {
        dateRange: { from: new Date(today), to: new Date(today) },
        label: "Today",
      },
      {
        dateRange: { from: getDaysAgo(1), to: getDaysAgo(1) },
        label: "Yesterday",
      },
      {
        dateRange: { from: getDaysAgo(6), to: new Date(today) },
        label: "Last 7 days",
      },
      {
        dateRange: { from: getDaysAgo(13), to: new Date(today) },
        label: "Last 14 days",
      },
      {
        dateRange: { from: getDaysAgo(29), to: new Date(today) },
        label: "Last 30 days",
      },
      {
        dateRange: { from: getStartOfWeek(today), to: new Date(today) },
        label: "This Week",
      },
      {
        dateRange: {
          from: getStartOfWeek(addDays(today, -7)),
          to: getEndOfWeek(addDays(today, -7)),
        },
        label: "Last Week",
      },
      {
        dateRange: { from: getStartOfMonth(today), to: new Date(today) },
        label: "This month",
      },
      {
        dateRange: {
          from: getStartOfMonth(getSubMonths(today, 1)),
          to: getEndOfMonth(getSubMonths(today, 1)),
        },
        label: "Last month",
      },
    ],
    [today],
  );

  const syncDraftState = React.useCallback(() => {
    setDraftDateRange(dateRange);
    setDraftCompareEnabled(compareEnabled);
    setDraftCompareDateRange(compareDateRange);
  }, [compareDateRange, compareEnabled, dateRange]);

  const handleDateRangeChange = React.useCallback(
    (range: DateRange) => {
      setDraftDateRange(range);
      if (draftCompareEnabled) {
        setDraftCompareDateRange(getPreviousPeriod(range));
      }
    },
    [draftCompareEnabled],
  );

  const handlePresetClick = (preset: PresetDateRange): void => {
    handleDateRangeChange(preset.dateRange);
    setVisibleMonth(startOfDay(preset.dateRange.from ?? new Date()));
  };

  const applyChanges = (): void => {
    setDateRange(draftDateRange);
    setCompareEnabled(draftCompareEnabled);
    setCompareDateRange(draftCompareDateRange);
    let nextCompareDateRange: CompareDateRange | undefined;
    if (showCompare && draftCompareEnabled) {
      nextCompareDateRange = draftCompareDateRange;
    }
    onUpdate?.({
      compareDateRange: nextCompareDateRange,
      dateRange: draftDateRange,
    });
    setIsOpen(false);
  };

  const cancelChanges = (): void => {
    syncDraftState();
    setIsOpen(false);
  };

  const activePresetLabel = React.useMemo(() => presetDateRanges.find((preset) => {
      return (
        formatDateInput(preset.dateRange.from) === formatDateInput(draftDateRange.from) &&
        formatDateInput(preset.dateRange.to) === formatDateInput(draftDateRange.to)
      );
    })?.label, [draftDateRange.from, draftDateRange.to, presetDateRanges]);

  const monthsToShow = isMobile ? 1 : 2;

  React.useEffect(() => {
    if (isOpen) {
      setVisibleMonth(startOfDay(draftDateRange.from ?? new Date()));
    }
  }, [draftDateRange.from, isOpen]);

  return (
    <div className="flex flex-col gap-2">
      <Popover.Root
        open={isOpen}
        onOpenChange={(open) => {
          if (open) {
            syncDraftState();
          }
          setIsOpen(open);
        }}
      >
        <Popover.Trigger
          render={
            <button
              type="button"
              disabled={disabled}
              className="group flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-border/70 bg-background px-4 text-sm shadow-sm transition hover:border-border hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          }
        >
          <span className="min-w-0 flex-1 truncate text-left font-medium text-foreground">
            {renderTriggerLabel(dateRange, locale, placeholder)}
          </span>
          {CalendarIcon ? (
            <CalendarIcon className="size-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
          ) : (
            renderDefaultCalendarIcon(
              "size-4 shrink-0 text-muted-foreground transition group-hover:text-foreground",
            )
          )}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner align={align} sideOffset={8}>
            <Popover.Popup className="w-[min(96vw,688px)] overflow-hidden rounded-[16px] border border-border/70 bg-popover text-popover-foreground shadow-[0_24px_60px_-34px_hsl(var(--foreground)/0.5)] outline-none">
              <div className="flex flex-col">
                <div className="flex items-center justify-end px-4 py-2.5 md:px-4">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <SegmentedDateInput
                      value={draftDateRange.from}
                      onChange={(from) =>
                        handleDateRangeChange({
                          from,
                          to: draftDateRange.to,
                        })
                      }
                      ariaLabel="Start date"
                      Icon={CalendarIcon}
                    />
                    <span className="text-muted-foreground">-</span>
                    <SegmentedDateInput
                      value={draftDateRange.to}
                      onChange={(to) =>
                        handleDateRangeChange({
                          from: draftDateRange.from,
                          to,
                        })
                      }
                      ariaLabel="End date"
                      Icon={CalendarIcon}
                    />
                  </div>
                </div>

                {isMobile && (
                  <div className="px-4 pb-3">
                    <Select.Root
                      items={presetDateRanges.map((preset) => ({
                        label: preset.label,
                        value: preset.label,
                      }))}
                      value={activePresetLabel ?? null}
                      onValueChange={(value) => {
                        const preset = presetDateRanges.find((item) => item.label === value);
                        if (preset) {
                          handlePresetClick(preset);
                        }
                      }}
                    >
                      <Select.Trigger className="flex h-11 w-full items-center justify-between rounded-xl border border-border/70 bg-background px-4 text-sm font-medium text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring/60">
                        <Select.Value placeholder="Select preset" />
                        <Select.Icon>
                          {ChevronRightIcon ? (
                            <ChevronRightIcon className="size-4 rotate-90 text-muted-foreground" />
                          ) : (
                            renderDefaultChevronRightIcon("size-4 rotate-90 text-muted-foreground")
                          )}
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Positioner align="start" sideOffset={8}>
                          <Select.Popup className="z-50 max-h-72 w-[var(--anchor-width)] overflow-auto rounded-xl border border-border/70 bg-popover p-1 text-popover-foreground shadow-lg outline-none">
                            <Select.List>
                              {presetDateRanges.map((preset) => (
                                <Select.Item
                                  key={preset.label}
                                  value={preset.label}
                                  className="flex cursor-default items-center rounded-lg px-3 py-2 text-sm text-foreground outline-none transition data-[highlighted]:bg-muted"
                                >
                                  <Select.ItemText>{preset.label}</Select.ItemText>
                                </Select.Item>
                              ))}
                            </Select.List>
                          </Select.Popup>
                        </Select.Positioner>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                )}

                <div className="flex flex-col md:grid md:grid-cols-[520px_136px] md:items-start md:px-4">
                  <div className="px-4 pb-3 md:px-0 md:pb-4">
                    <div className="relative mx-auto w-fit">
                      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setVisibleMonth(getAddMonths(visibleMonth, -1))}
                          className="pointer-events-auto inline-flex size-8 items-center justify-center rounded-lg border border-border/70 bg-background text-foreground transition hover:bg-accent"
                        >
                          {ChevronLeftIcon ? (
                            <ChevronLeftIcon className="size-4" />
                          ) : (
                            renderDefaultChevronLeftIcon("size-4")
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setVisibleMonth(getAddMonths(visibleMonth, 1))}
                          className="pointer-events-auto inline-flex size-8 items-center justify-center rounded-lg border border-border/70 bg-background text-foreground transition hover:bg-accent"
                        >
                          {ChevronRightIcon ? (
                            <ChevronRightIcon className="size-4" />
                          ) : (
                            renderDefaultChevronRightIcon("size-4")
                          )}
                        </button>
                      </div>
                      <DayPicker
                        mode="range"
                        showOutsideDays
                        hideNavigation
                        pagedNavigation
                        month={visibleMonth}
                        onMonthChange={setVisibleMonth}
                        selected={draftDateRange}
                        onSelect={(range) =>
                          handleDateRangeChange({
                            from: range?.from,
                            to: range?.to,
                          })
                        }
                        numberOfMonths={monthsToShow}
                        className="pt-10"
                        classNames={{
                          caption_label: "text-sm font-semibold text-foreground",
                          day: "relative p-0 text-center text-sm",
                          day_button:
                            "flex size-9 items-center justify-center rounded-md text-sm text-foreground transition hover:bg-accent",
                          month: "w-fit space-y-3",
                          month_caption: "flex items-center justify-center h-8",
                          months:
                            "flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-4",
                          outside: "text-muted-foreground/45 [&>button]:text-muted-foreground/45",
                          range_end:
                            "[&>button]:rounded-md [&>button]:bg-[#0f172a] [&>button]:text-white [&>button]:hover:bg-[#0f172a] [&>button]:hover:text-white",
                          range_middle:
                            "bg-muted/70 text-foreground [&>button]:rounded-none [&>button]:bg-transparent [&>button]:text-foreground",
                          range_start:
                            "[&>button]:rounded-md [&>button]:bg-[#0f172a] [&>button]:text-white [&>button]:hover:bg-[#0f172a] [&>button]:hover:text-white",
                          selected: "[&>button]:text-foreground",
                          today: "font-medium text-foreground",
                          week: "mt-1.5 flex w-[252px]",
                          weekday: "w-9 text-center text-[13px] font-medium text-muted-foreground",
                          weekdays: "flex w-[252px]",
                        }}
                      />
                    </div>
                  </div>

                  <div className="hidden flex-col gap-0.5 px-4 pb-4 md:flex md:self-end md:px-0 md:pb-5 md:pt-1 md:pr-0">
                    {presetDateRanges.map((preset) => {
                      const isActive = activePresetLabel === preset.label;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handlePresetClick(preset)}
                          className={`flex items-center justify-end gap-2 rounded-lg px-2 py-2 text-right text-sm font-medium transition-colors ${
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {isActive &&
                            (CheckIcon ? (
                              <CheckIcon className="size-4 text-primary" />
                            ) : (
                              renderDefaultCheckIcon("size-4 text-primary")
                            ))}
                          <span>{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end px-4 pb-4 md:px-4 md:pb-5">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={cancelChanges}
                      className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={applyChanges}
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0f172a] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#1e293b]"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
