import * as React from "react";

export type DateInputIcon = React.ComponentType<{ className?: string }>;

export interface DateInputIcons {
	Calendar?: DateInputIcon;
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

export interface DateRange {
	from: Date | undefined;
	to: Date | undefined;
}

export interface DateInputProps {
	dateRange: DateRange;
	setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	locale?: string;
	icons?: DateInputIcons;
}

function formatDate(date: Date, locale: string = "en-US"): string {
	return new Intl.DateTimeFormat(locale, {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

function isValidDate(date: Date): boolean {
	return !Number.isNaN(date.getTime());
}

function parseDate(value: string): Date | null {
	const parsed = new Date(value);
	return isValidDate(parsed) ? parsed : null;
}

export function DateInput({
	dateRange,
	setDateRange,
	placeholder = "Select date range...",
	disabled = false,
	className = "",
	locale = "en-US",
	icons,
}: DateInputProps): React.JSX.Element {
		const CalendarIcon = icons?.Calendar;
	const [inputValue, setInputValue] = React.useState("");
	const [isFocused, setIsFocused] = React.useState(false);

	const formatDateRange = (range: DateRange): string => {
		if (!range.from && !range.to) return placeholder;
		if (range.from && !range.to) return formatDate(range.from, locale);
		if (!range.from && range.to) return formatDate(range.to, locale);
		if (range.from && range.to) {
			return `${formatDate(range.from, locale)} - ${formatDate(range.to, locale)}`;
		}
		return placeholder;
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const value = e.target.value;
		setInputValue(value);

		const parts = value.split(" - ");
		if (parts.length === 2) {
			const fromDate = parseDate(parts[0].trim());
			const toDate = parseDate(parts[1].trim());
			if (fromDate && toDate) {
				setDateRange({ from: fromDate, to: toDate });
			}
		}
	};

	const handleBlur = (): void => {
		setIsFocused(false);
		setInputValue("");
	};

	const handleFocus = (): void => {
		setIsFocused(true);
	};

	return (
		<div className={`relative ${className}`}>
			<input
				type="text"
				value={isFocused ? inputValue : formatDateRange(dateRange)}
				onChange={handleInputChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				placeholder={placeholder}
				disabled={disabled}
				className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			/>
				{CalendarIcon ? (
					<CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
				) : (
					renderDefaultCalendarIcon(
						"absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none",
					)
				)}
		</div>
	);
}
