'use client';

import { cn } from '@/lib/cn';
import { ClassValue } from 'clsx';
import { Dispatch, FormEvent, ReactNode, SetStateAction } from 'react';

interface SearchModalProps {
	modalId: string;
	query: string;
	buttonLabel: string;
	modalLabel: string;
	placeholder: string;
	setQuery: Dispatch<SetStateAction<string>>;
	openModal: () => void;
	handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
	buttonClassName: ClassValue;
	children: ReactNode;
}

export function SearchModal(props: SearchModalProps) {
	return (
		<div>
			<button
				className={cn('btn', props.buttonClassName)}
				onClick={props.openModal}>
				{props.buttonLabel}
			</button>
			<dialog
				id={props.modalId}
				className='modal'>
				<div className='modal-box flex flex-col gap-2'>
					<h3 className='font-bold text-lg'>{props.modalLabel}</h3>
					<form onSubmit={(e) => props.handleSubmit(e)}>
						<label className='input w-full'>
							<svg
								className='h-[1em] opacity-50'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'>
								<g
									strokeLinejoin='round'
									strokeLinecap='round'
									strokeWidth='2.5'
									fill='none'
									stroke='currentColor'>
									<circle
										cx='11'
										cy='11'
										r='8'></circle>
									<path d='m21 21-4.3-4.3'></path>
								</g>
							</svg>
							<input
								type='search'
								placeholder={props.placeholder}
								value={props.query}
								onChange={(e) => props.setQuery(e.target.value)}
							/>
						</label>
					</form>
					<div className='carousel carousel-vertical rounded-box h-96 flex flex-col gap-2'>
						{props.children}
					</div>
				</div>
				<form
					method='dialog'
					className='modal-backdrop'>
					<button>close</button>
				</form>
			</dialog>
		</div>
	);
}
