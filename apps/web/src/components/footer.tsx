export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className='self-end footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4'>
			<aside>
				<p>Copyright © {year} - All right reserved by Heardle Club</p>
			</aside>
		</footer>
	);
}
