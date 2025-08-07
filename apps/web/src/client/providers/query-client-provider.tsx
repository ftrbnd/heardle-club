'use client';

import {
	QueryClient,
	QueryClientProvider as TanstackQueryProvider,
} from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 24 * 60 * 60 * 1000, // one day
		},
	},
});

export function QueryClientProvider({ children }: { children: ReactNode }) {
	return (
		<TanstackQueryProvider client={queryClient}>
			{children}
		</TanstackQueryProvider>
	);
}
