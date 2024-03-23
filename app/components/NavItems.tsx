'use client';

import { useEffect, useRef, useState } from 'react';

import { PRODUCT_CATEGORIES } from '@/helpers';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import NavItem from './NavItem';

const NavItems = () => {
	const [activeIndex, setActiveIndex] = useState<null | number>(null);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setActiveIndex(null);
			}
		};
		document.addEventListener('keydown', handler);

		// Clean up
		return () => {
			document.removeEventListener('keydown', handler);
		};
	}, []);

	const isAnyOpen = activeIndex !== null;

	const navRef = useRef<HTMLDivElement | null>(null);

	useOnClickOutside(navRef, () => setActiveIndex(null));

	return (
		<div className='flex gap-4 h-full' ref={navRef}>
			{PRODUCT_CATEGORIES.map((category, i) => {
				const handleOpen = () => {
					if (activeIndex === i) {
						setActiveIndex(null);
					} else {
						setActiveIndex(i);
					}
				};

				const isOpen = i === activeIndex;

				const close = () => setActiveIndex(null);

				return (
					<NavItem
						key={category.value}
						category={category}
						handleOpen={handleOpen}
						close={close}
						isOpen={isOpen}
						isAnyOpen={isAnyOpen}
					/>
				);
			})}
		</div>
	);
};

export default NavItems;
