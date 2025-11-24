export const getTodayString = (): string => {
	const isoString = new Date().toISOString();
	const datePart = isoString.split("T")[0];
	if (!datePart) {
		throw new Error("Failed to extract date from ISO string");
	}
	return datePart;
};
