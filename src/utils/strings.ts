export const dashify = (string: string) => string.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

export const addElipsis = (text: string, size: number = 20) => {
	return text.length > size ? `${text.slice(0, size)}...` : text;
};
