export function TrackSkeleton() {
	return (
		<div className='flex gap-2 items-center'>
			<input
				disabled
				type='checkbox'
				className='checkbox'
			/>
			<div className='skeleton h-6 w-6'></div>
			<div className='flex-1'>
				<div className='skeleton h-6 w-32'></div>
			</div>
			<p className='font-mono self-end'>00:00</p>
		</div>
	);
}
