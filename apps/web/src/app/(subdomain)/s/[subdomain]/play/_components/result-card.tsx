import { ChartLine } from '@/components/icons/chart-line';
import { Check } from '@/components/icons/check';
import { Clipboard } from '@/components/icons/clipboard';
import { Trophy } from '@/components/icons/trophy';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/util';
import { getShareableSquares } from '@/util/game';
import { SelectBaseSong, SelectClub } from '@repo/database/postgres/schema';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
	CSSProperties,
	useState,
	useEffect,
	MouseEvent,
	ComponentProps,
} from 'react';

interface ResultCardProps extends ComponentProps<'div'> {
	club: SelectClub;
	song: SelectBaseSong;
	guessedSong: boolean;
}

export function ResultCard({
	club,
	song,
	guessedSong,
	className,
}: ResultCardProps) {
	const [copied, setCopied] = useState(false);
	const { guesses } = useUser();

	const copyToClipboard = async (e: MouseEvent) => {
		e.preventDefault();
		if (copied || !guesses) return;

		setCopied(true);
		await navigator.clipboard.writeText(
			`${club?.displayName} Heardle #${club?.heardleDay} ${getShareableSquares(guesses)}`,
		);

		setTimeout(() => {
			setCopied(false);
		}, 3000);
	};

	return (
		<div
			className={cn(
				'card bg-base-100 shadow-xl image-full overflow-hidden mb-4 mt-4',
				className,
			)}>
			<figure>
				<Image
					src={song.image ?? '/artist_placeholder.jpg'}
					alt={song.title}
					fill
					style={{ objectFit: 'cover' }}
					priority
				/>
			</figure>
			<div className='card-body items-center'>
				<h2 className='font-bold text-center text-lg sm:text-xl md:text-2xl'>
					{guessedSong
						? `Great job on today's puzzle!`
						: `The song was ${song.title}`}
				</h2>
				<div className='flex flex-col items-center gap-2 list-none'>
					<p className='text-md'>
						{guessedSong
							? 'Check back tomorrow for a new song.'
							: 'Try again tomorrow!'}
					</p>
					<Countdown />
					<div className='flex justify-between gap-2 w-full'>
						<button className='btn btn-secondary'>
							View Statistics
							<ChartLine />
						</button>
						<button
							className={`btn ${copied ? 'btn-success' : 'btn-primary'}`}
							onClick={(e) => copyToClipboard(e)}>
							{copied ? 'Copied!' : 'Share'}
							{copied ? <Check /> : <Clipboard />}
						</button>
					</div>
					<label
						htmlFor={'play_page_drawer'}
						className='btn drawer-button btn-accent lg:hidden'>
						{"Today's leaderboard"}
						<Trophy />
					</label>
				</div>
			</div>
		</div>
	);
}

interface CSSPropertiesWithVars extends CSSProperties {
	'--value': number;
}

function Countdown() {
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);

	const router = useRouter();

	useEffect(() => {
		const now = new Date();

		const currentUTCHours = now.getUTCHours();
		const currentUTCMinutes = now.getUTCMinutes();
		const currentUTCSeconds = now.getUTCSeconds();

		// 4am UTC
		const targetHour = 3;
		const targetMinute = 0;
		const targetSecond = 0;

		let hoursRemaining = (targetHour - currentUTCHours + 24) % 24;
		let minutesRemaining = (targetMinute - currentUTCMinutes + 60) % 60;
		let secondsRemaining = (targetSecond - currentUTCSeconds + 60) % 60;

		const intervalId = setInterval(() => {
			secondsRemaining--;
			setSeconds(secondsRemaining);
			setMinutes(minutesRemaining);
			setHours(hoursRemaining);

			if (secondsRemaining < 0) {
				secondsRemaining = 59;
				minutesRemaining--;
				setSeconds(secondsRemaining);
				setMinutes(minutesRemaining);

				if (minutesRemaining < 0) {
					minutesRemaining = 59;
					hoursRemaining--;
					setMinutes(minutesRemaining);
					setHours(hoursRemaining);

					if (hoursRemaining < 0) {
						setHours(hoursRemaining);
						console.log('Countdown to 4 AM UTC has reached 0!');
						router.replace('/');

						clearInterval(intervalId);
					}
				}
			}
		}, 1000);

		return () => clearInterval(intervalId);
	}, [router]);

	return (
		<div className='card-actions justify-center'>
			<div className={`grid grid-flow-col gap-5 text-center auto-cols-max `}>
				<div className='flex flex-col p-2 rounded-box bg-base-100'>
					<span className='countdown font-mono text-3xl sm:text-5xl'>
						<span
							id='hours'
							style={{ '--value': hours } as CSSPropertiesWithVars}></span>
					</span>
					hours
				</div>
				<div className='flex flex-col p-2 rounded-box bg-base-100'>
					<span className='countdown font-mono text-3xl sm:text-5xl'>
						<span
							id='minutes'
							style={{ '--value': minutes } as CSSPropertiesWithVars}></span>
					</span>
					min
				</div>
				<div className='flex flex-col p-2 rounded-box bg-base-100'>
					<span className='countdown font-mono text-3xl sm:text-5xl'>
						<span
							id='seconds'
							style={{ '--value': seconds } as CSSPropertiesWithVars}></span>
					</span>
					sec
				</div>
			</div>
		</div>
	);
}
