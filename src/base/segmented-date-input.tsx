import * as React from "react";

interface DateParts {
	month: string;
	day: string;
	year: string;
}

function formatDateParts(date: Date | undefined): DateParts {
	return {
		month: date ? String(date.getMonth() + 1) : "",
		day: date ? String(date.getDate()) : "",
		year: date ? String(date.getFullYear()) : "",
	};
}

function parseDateParts(
	month: string,
	day: string,
	year: string,
): Date | null | undefined {
	if (!month.trim() && !day.trim() && !year.trim()) return;
	if (!month.trim() || !day.trim() || !year.trim()) return null;

	const parsedMonth = Number(month);
	const parsedDay = Number(day);
	const parsedYear = Number(year);

	if (
		!Number.isInteger(parsedMonth) ||
		!Number.isInteger(parsedDay) ||
		!Number.isInteger(parsedYear)
	) {
		return null;
	}

	const parsedDate = new Date(parsedYear, parsedMonth - 1, parsedDay);
	if (
		parsedDate.getFullYear() !== parsedYear ||
		parsedDate.getMonth() !== parsedMonth - 1 ||
		parsedDate.getDate() !== parsedDay
	) {
		return null;
	}

	return parsedDate;
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

export interface SegmentedDateInputProps {
	value: Date | undefined;
	onChange: (date: Date | undefined) => void;
	ariaLabel: string;
	Icon?: React.ComponentType<{ className?: string }>;
}

export function SegmentedDateInput({
	value,
	onChange,
	ariaLabel,
	Icon,
}: SegmentedDateInputProps): React.JSX.Element {
	const [parts, setParts] = React.useState(() => formatDateParts(value));

	React.useEffect(() => {
		setParts(formatDateParts(value));
	}, [value]);

	const updatePart = (
		part: keyof DateParts,
		nextValue: string,
	): void => {
		const sanitizedValue = nextValue.replace(/\D/g, "");
		const trimmedValue =
			part === "year" ? sanitizedValue.slice(0, 4) : sanitizedValue.slice(0, 2);
		const nextParts = { ...parts, [part]: trimmedValue };
		setParts(nextParts);

		const parsedDate = parseDateParts(
			nextParts.month,
			nextParts.day,
			nextParts.year,
		);
		if (parsedDate !== null) {
			onChange(parsedDate);
		}
	};

	const resetParts = (): void => {
		setParts(formatDateParts(value));
	};

	return (
		<div className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-background px-2.5 py-1.5">
			<input
				type="text"
				inputMode="numeric"
				aria-label={`${ariaLabel} month`}
				value={parts.month}
				onChange={(event) => updatePart("month", event.target.value)}
				onBlur={resetParts}
				onFocus={(event) => event.currentTarget.select()}
				className="w-5 bg-transparent text-center text-sm font-medium text-foreground outline-none"
			/>
			<span className="text-muted-foreground">/</span>
			<input
				type="text"
				inputMode="numeric"
				aria-label={`${ariaLabel} day`}
				value={parts.day}
				onChange={(event) => updatePart("day", event.target.value)}
				onBlur={resetParts}
				onFocus={(event) => event.currentTarget.select()}
				className="w-5 bg-transparent text-center text-sm font-medium text-foreground outline-none"
			/>
			<span className="text-muted-foreground">/</span>
			<input
				type="text"
				inputMode="numeric"
				aria-label={`${ariaLabel} year`}
				value={parts.year}
				onChange={(event) => updatePart("year", event.target.value)}
				onBlur={resetParts}
				onFocus={(event) => event.currentTarget.select()}
				className="w-9 bg-transparent text-center text-sm font-medium text-foreground outline-none"
			/>
			{Icon ? (
				<Icon className="size-3.5 text-muted-foreground" />
			) : (
				renderDefaultCalendarIcon("size-3.5 text-muted-foreground")
			)}
		</div>
	);
}

