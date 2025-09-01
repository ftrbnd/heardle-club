import { User } from '@/app/api/auth/_user';
import { cn } from '@/lib/cn';
import { User as UserIcon } from '@/server/components/icons/user';
import Image, { ImageProps } from 'next/image';

interface UserAvatarProps extends Omit<ImageProps, 'src' | 'alt'> {
	user?: User | null;
}
export function UserAvatar({ user, className, ...props }: UserAvatarProps) {
	return user && user.imageURL ? (
		<Image
			{...props}
			src={user.imageURL}
			className={cn('self-start w-full md:max-w-96 max-h-96', className)}
			alt={user?.displayName ?? 'User avatar'}
			height={100}
			width={100}
		/>
	) : (
		<UserIcon className={cn('self-start w-full h-full', className)} />
	);
}
