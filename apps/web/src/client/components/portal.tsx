'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
	selector: string;
	children: ReactNode;
}

export function Portal({ selector, children }: PortalProps) {
	const ref = useRef<Element | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		ref.current = document.getElementById(selector);
		setMounted(true);
	}, [selector]);

	if (!mounted || !ref.current) return null;

	return createPortal(children, ref.current);
}
