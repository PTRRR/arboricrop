export const getRandomDateRange = (startDate: Date, endDate: Date) => {
	const startTimestamp = startDate.getTime();
	const endTimestamp = endDate.getTime();
	const randomTimestamp = Math.random() * (endTimestamp - startTimestamp) + startTimestamp;
	return new Date(randomTimestamp);
};

export const formatDateToDDMMYYYY = (date: Date) => {
	const day = String(date.getDate()).padStart(2, '0'); // Get the day, pad with zero if needed
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month, pad with zero if needed (months are 0-based)
	const year = date.getFullYear(); // Get the full year

	return `${day}/${month}/${year}`;
};
