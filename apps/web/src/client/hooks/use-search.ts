'use client';

import { FormEvent, useDeferredValue, useState } from 'react';

interface UseSearchParams<T> {
	modalId: string;
	searchFn: (query: string) => Promise<T[]>;
}

export function useSearch<T>({ modalId, searchFn }: UseSearchParams<T>) {
	const [query, setQuery] = useState('');
	const deferredQuery = useDeferredValue(query);
	const [results, setResults] = useState<T[]>([]);
	const [dirty, setDirty] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (deferredQuery !== '') {
			const res = await searchFn(deferredQuery);
			setResults(res);
			setDirty(true);
		} else {
			setResults([]);
			setDirty(false);
		}
	};

	const openModal = () => {
		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (!modal) return;

		modal.showModal();
	};

	const closeModal = () => {
		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (!modal) return;

		modal.close();
	};

	return {
		query,
		setQuery,
		dirty,
		results,
		handleSubmit,
		openModal,
		closeModal,
	};
}
