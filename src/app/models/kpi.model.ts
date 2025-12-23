export interface SelectOption<T = string | number | boolean> {
	value: T;
	label: string;
}

export type SupportedLabelMonths =
	| "january"
	| "february"
	| "march"
	| "april"
	| "may"
	| "june"
	| "july"
	| "august"
	| "september"
	| "october"
	| "november"
	| "december";

export const MONTHS_LABELS: SelectOption<SupportedLabelMonths>[] = [
	{ value: "january", label: "January" },
	{ value: "february", label: "February" },
	{ value: "march", label: "March" },
	{ value: "april", label: "April" },
	{ value: "may", label: "May" },
	{ value: "june", label: "June" },
	{ value: "july", label: "July" },
	{ value: "august", label: "August" },
	{ value: "september", label: "September" },
	{ value: "october", label: "October" },
	{ value: "november", label: "November" },
	{ value: "december", label: "December" },
];

export const MONEY_VALUES: SelectOption[] = [
	{ value: 10, label: "10" },
	{ value: 25, label: "25" },
	{ value: 50, label: "50" },
	{ value: 100, label: "100" },
	{ value: 150, label: "150" },
	{ value: 200, label: "200" },
	{ value: 250, label: "250" },
	{ value: 300, label: "300" },
	{ value: 350, label: "350" },
	{ value: 400, label: "400" },
	{ value: 450, label: "450" },
	{ value: 500, label: "500" },
	{ value: 600, label: "600" },
	{ value: 700, label: "700" },
	{ value: 800, label: "800" },
	{ value: 900, label: "900" },
	{ value: 1000, label: "1000" },
	{ value: 1500, label: "1500" },
	{ value: 2000, label: "2000" },
	{ value: 2500, label: "2500" },
	{ value: 3000, label: "3000" },
	{ value: 3500, label: "3500" },
	{ value: 4000, label: "4000" },
	{ value: 4500, label: "4500" },
	{ value: 5000, label: "5000" },
	{ value: 5500, label: "5500" },
	{ value: 6000, label: "6000" },
	{ value: 6000, label: "6000" },
	{ value: 7000, label: "7000" },
	{ value: 7500, label: "7500" },
	{ value: 8000, label: "8000" },
	{ value: 8500, label: "8500" },
	{ value: 9000, label: "9000" },
	{ value: 9500, label: "9500" },
	{ value: 10000, label: "10000" },
];
