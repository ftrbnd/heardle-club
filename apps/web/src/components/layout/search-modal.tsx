'use client';

import { Search } from '@/components/icons/search';
import { cn } from '@/util';
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
							<Search />
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
