'use client';

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
	children: ReactNode;
}

export function SearchModal(props: SearchModalProps) {
	return (
		<div>
			<button
				className='btn btn-primary'
				onClick={props.openModal}>
				{props.buttonLabel}
			</button>
			<dialog
				id={props.modalId}
				className='modal'>
				<div className='modal-box flex flex-col gap-2'>
					<h3 className='font-bold text-lg'>{props.modalLabel}</h3>
					<form onSubmit={(e) => props.handleSubmit(e)}>
						<input
							type='text'
							placeholder={props.placeholder}
							className='input input-bordered w-full'
							value={props.query}
							onChange={(e) => props.setQuery(e.target.value)}
						/>
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
