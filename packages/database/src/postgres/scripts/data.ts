import { InsertClub, InsertUser } from '../schema/types';

export const defaultUser: InsertUser = {
	id: '001',
	email: 'giosalas25@gmail.com',
	displayName: 'giosalad',
};

export const defaultClub: InsertClub = {
	id: '001',
	ownerId: defaultUser.id,
	artistId: '2sSGPbdZJkaSE2AbcGOACx',
	displayName: 'The Marías',
	subdomain: 'themarias',
	isActive: true,
};

export const defaultClubs: Omit<InsertClub, 'ownerId'>[] = [
	{
		artistId: '3l0CmX0FuQjFxr8SK7Vqag',
		displayName: 'Clairo',
		subdomain: 'clairo',
		id: '002',
	},
	{
		artistId: '5069JTmv5ZDyPeZaCCXiCg',
		displayName: 'wave to earth',
		subdomain: 'wavetoearth',
		id: '003',
	},
	{
		artistId: '4q3ewBCX7sLwd24euuV69X',
		displayName: 'Bad Bunny',
		subdomain: 'badbunny',
		id: '004',
	},
	{
		artistId: '3Sz7ZnJQBIHsXLUSo0OQtM',
		displayName: 'Mac DeMarco',
		subdomain: 'macdemarco',
		id: '005',
	},
	{
		artistId: '3zmfs9cQwzJl575W1ZYXeT',
		displayName: 'Men I Trust',
		subdomain: 'menitrust',
		id: '006',
	},
	{
		artistId: '1t20wYnTiAT0Bs7H1hv9Wt',
		displayName: 'EDEN',
		subdomain: 'eden',
		id: '007',
	},
	{
		artistId: '163tK9Wjr9P9DmM0AVK7lm',
		displayName: 'Lorde',
		subdomain: 'lorde',
		id: '008',
	},
	{
		artistId: '07D1Bjaof0NFlU32KXiqUP',
		displayName: 'Lucy Dacus',
		subdomain: 'lucydacus',
		id: '009',
	},
	{
		artistId: '0NIPkIjTV8mB795yEIiPYL',
		displayName: 'Wallows',
		subdomain: 'wallows',
		id: '010',
	},
	{
		artistId: '1oPRcJUkloHaRLYx0olBLJ',
		displayName: 'Magdalena Bay',
		subdomain: 'magdalenabay',
		id: '011',
	},
];

export type StorageBucket = 'club.songs' | 'user.avatars';
export const SONGS_BUCKET = 'club.songs' as const;
export const AVATARS_BUCKET = 'user.avatars' as const;
