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

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const res = await searchFn(deferredQuery);
		setResults(res);
	};

	const openModal = () => {
		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (!modal) return;

		modal.showModal();
	};

	return {
		query,
		setQuery,
		results,
		handleSubmit,
		openModal,
	};
}
