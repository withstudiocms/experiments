export const response = (status: number, data: string) =>
	new Response(data, {
		status,
		headers: {
			'Content-Type': 'application/json',
		},
	});
