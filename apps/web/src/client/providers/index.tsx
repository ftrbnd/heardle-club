import { ReactNode } from 'react';
import { QueryClientProvider } from '@/client/providers/query-client-provider';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider>
			<Toaster />
			{children}
		</QueryClientProvider>
	);
}
