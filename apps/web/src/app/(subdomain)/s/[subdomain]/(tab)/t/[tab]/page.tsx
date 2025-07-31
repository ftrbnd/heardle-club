interface PageParams {
	params: Promise<{ subdomain: string; tab: string }>;
}
export default async function Page({ params }: PageParams) {
	const { tab } = await params;
	return <div>TODO: {tab}</div>;
}
