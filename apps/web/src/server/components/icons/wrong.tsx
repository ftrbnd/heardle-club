import { cn } from '@/lib/cn';
import { Guess } from '@repo/database/redis/schema';

export function Wrong({ type }: { type: Omit<Guess['status'], 'correct'> }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={cn(
				'lucide lucide-x-icon lucide-x',
				type === 'wrong' ? 'stroke-error' : 'stroke-warning'
			)}>
			<path d='M18 6 6 18' />
			<path d='m6 6 12 12' />
		</svg>
	);
}
