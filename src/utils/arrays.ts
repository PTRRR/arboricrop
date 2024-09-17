export const shuffle = <T>(array: T[]) => {
	const clone = [...array];
	let currentIndex = clone.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[clone[currentIndex], clone[randomIndex]] = [clone[randomIndex], clone[currentIndex]];
	}

	return clone;
};

export const filterNotEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
	return value !== null && value !== undefined;
};
