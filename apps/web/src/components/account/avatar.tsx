import { User } from '@/app/actions/_user';
import { cn } from '@/util';
import { User as UserIcon } from '@/components/icons/user';
import Image, { ImageProps } from 'next/image';

interface UserAvatarProps extends Omit<ImageProps, 'src' | 'alt'> {
	user?: User | null;
	imageSize?: number;
}
export function UserAvatar({
	user,
	imageSize,
	className,
	...props
}: UserAvatarProps) {
	return user && user.imageURL && imageSize ? (
		<Image
			{...props}
			src={user.imageURL}
			className={cn('self-start w-full md:max-w-96 max-h-96', className)}
			alt={user?.displayName ?? 'User avatar'}
			height={imageSize}
			width={imageSize}
		/>
	) : (
		<UserIcon className={cn('self-start w-full h-full', className)} />
	);
}
