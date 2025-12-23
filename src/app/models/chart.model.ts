import { SelectOption } from "./kpi.model";

export const CHART_LABEL_QUARTERS: string[] = ["Q1", "Q2", "Q3", "Q4"];

export type SupportedChartTypes = "bar" | "line" | "doughnut";

export const CHART_TYPES: SelectOption<SupportedChartTypes>[] = [
	{ value: "line", label: "Line" },
	{ value: "bar", label: "Bar" },
	{ value: "doughnut", label: "Doughnut" },
];

export const CHART_LABEL_MONTHS: string[] = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
