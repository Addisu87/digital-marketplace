export const PRODUCT_CATEGORIES = [
	{
		label: 'UI kits',
		value: 'ui_kits' as const,
		featured: [
			{
				name: 'Editor picks',
				href: '#',
				imageSrc: '/nav/ui-kits/mixed.jpg',
			},
			{
				name: 'New Arrivals',
				href: '#',
				imageSrc: '/nav/ui-kits/blue.jpg',
			},
			{
				name: 'Best Sellers',
				href: '#',
				imageSrc: '/nav/ui-kits/purple.jpg',
			},
		],
	},
	{
		label: 'FilterSets',
		value: 'filter_sets' as const,
		featured: [
			{
				name: 'New Arrivals',
				href: '#',
				imageSrc: '/nav/filter-set/glass.jpg',
			},
			{
				name: 'Bestselling Filter',
				href: '#',
				imageSrc: '/nav/filter-set/fontana-kendra.jpg',
			},
			{
				name: 'Favorite',
				href: '#',
				imageSrc: '/nav/filter-set/lotus-herb.png',
			},
		],
	},
];
