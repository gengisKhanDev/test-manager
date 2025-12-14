import { Template } from 'meteor/templating';

Template.registerHelper('$eq', (a, b) => a === b);
Template.registerHelper('$neq', (a, b) => a !== b);

Template.registerHelper('$lt', (a, b) => a < b);
Template.registerHelper('$lte', (a, b) => a <= b);
Template.registerHelper('$gt', (a, b) => a > b);
Template.registerHelper('$gte', (a, b) => a >= b);


Template.registerHelper('$and', (...args) => {
	args.pop();
	return args.every(Boolean);
});

Template.registerHelper('$or', (...args) => {
	args.pop();
	return args.some(Boolean);
});

Template.registerHelper('$not', (val) => !val);

Template.registerHelper('$exists', (val) => val !== undefined && val !== null);

Template.registerHelper('$mapped', function (arr, extended) {
	const useExtended = !!extended;

	if (!arr) return [];

	if (arr && typeof arr.fetch === 'function') {
		arr = arr.fetch();
	}

	if (!Array.isArray(arr)) {
		console.warn('$mapped: expected array or cursor but got:', typeof arr, arr);
		return [];
	}

	const length = arr.length;

	return arr.map((item, index) => {
		const newItem = { ...item };

		newItem.$length = length;
		newItem.$index = index;
		newItem.$first = index === 0;
		newItem.$last = index === length - 1;

		if (useExtended) {
			newItem.$nextEl = arr[index + 1];
			newItem.$prevEl = arr[index - 1];
			newItem.$firstEl = arr[0];
			newItem.$lastEl = arr[length - 1];
		}

		return newItem;
	});
});
