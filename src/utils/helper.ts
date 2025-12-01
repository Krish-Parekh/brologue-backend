export const getTodayString = (): string => {
	return new Date().toLocaleDateString("en-CA", {
		timeZone: "Australia/Melbourne",
	});
};
