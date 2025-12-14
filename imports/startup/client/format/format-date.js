import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(advancedFormat);
dayjs.extend(localizedFormat);

const FALLBACK = "--/--";

Template.registerHelper("formatDate", function (date, showHours, friendly) {
	if (!date) return FALLBACK;

	const d = dayjs(date);

	if (showHours !== undefined) {
		return d.format("MM/DD/YYYY");
	}

	if (friendly === undefined) {
		return d.format("MM/DD/YYYY hh:mm:ss a");
	}

	return d.format("MMMM Do YYYY, h:mm a");
});

Template.registerHelper("formatDateEvent", function (date, showHours, friendly) {
	if (!date) return FALLBACK;

	const d = dayjs(date);
	return d.format("ddd M.D.YY");
});

Template.registerHelper("formatDateView", function (date, showHours, friendly) {
	if (!date) return FALLBACK;

	const d = dayjs(date);
	return d.format("dddd, MMMM D, YYYY");
});

Template.registerHelper("formatHourDate", function (date, showHours, friendly) {
	if (!date) return FALLBACK;

	const d = dayjs(date);
	return d.format("LT");
});

formatHourDate = (date) => {
	if (!date) return FALLBACK;
	return dayjs(date).format("LT");
};

formatDate = (date) => {
	if (!date) return FALLBACK;
	return dayjs(date).format("MM/DD/YYYY hh:mm:ss a");
};

formatDateEvent = (date) => {
	if (!date) return FALLBACK;
	return dayjs(date).format("ddd M.D.YY");
};

formatDateView = (date) => {
	if (!date) return FALLBACK;
	return dayjs(date).format("dddd, MMMM D, YYYY");
};
