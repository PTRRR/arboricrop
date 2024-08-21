type Query = { name: string; value?: string | boolean | number | undefined };

export const parseQueries = (queryString: string) => {
	const params = new URLSearchParams(queryString);

	const queries: Query[] = [];

	params.forEach((value, name) => {
		let parsedValue: Query['value'] | undefined = undefined;

		// Parse the value as boolean, number, or leave as string
		if (value.toLowerCase() === 'true') {
			parsedValue = true;
		} else if (value.toLowerCase() === 'false') {
			parsedValue = false;
		} else if (!isNaN(value as unknown as number)) {
			parsedValue = Number(value);
		} else if (value === '') {
			parsedValue = undefined;
		} else {
			parsedValue = value;
		}

		queries.push({ name, value: parsedValue });
	});

	return queries;
};

export const formatQueries = (queries: Query[]) =>
	queries
		.map((it) => (typeof it.value !== 'undefined' ? `${it.name}=${it.value}` : it.name))
		.join('&');

export const createUrlBuilder = (baseUrl?: string) => {
	return {
		getUrl: () => {
			if (!window) return '';
			const url = baseUrl || window.location.pathname;
			const queries = parseQueries(window.location.search);
			const formattedQueries = formatQueries(queries);
			return `${url}${queries.length > 0 ? `?${formattedQueries}` : ''}`;
		},
		resetQueries: (queries: Query[]) => {
			if (!window) return '';

			const url = baseUrl || window.location.pathname;
			const formattedQueries = formatQueries(queries);
			return `${url}${queries.length > 0 ? `?${formattedQueries}` : ''}`;
		},
		addQuery: (query: Query) => {
			if (!window) return '';

			const url = baseUrl || window.location.pathname;
			const queries = parseQueries(window.location.search).filter((it) => it.name !== query.name);
			queries.push(query);

			const formattedQueries = formatQueries(queries);
			return `${url}${queries.length > 0 ? `?${formattedQueries}` : ''}`;
		},
		removeQuery: (query: Query) => {
			if (!window) return '';

			const url = baseUrl || window.location.pathname;
			const queries = parseQueries(window.location.search).filter((it) => it.name !== query.name);

			const formattedQueries = formatQueries(queries);
			return `${url}${queries.length > 0 ? `?${formattedQueries}` : ''}`;
		}
	};
};
