export const getDevices = (count: number = 30) =>
	new Array(count).fill({}).map((_, index) => ({
		name: `Device ${index.toString().padStart(3, '0')}`,
		id: `device${index.toString().padStart(3, '0')}`,
		active: true,
		battery: Math.floor(Math.random() * 100)
	}));
