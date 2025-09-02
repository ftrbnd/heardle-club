'use client';

import { customToast } from '@/client/components/toast';
import { removeClub, setClubActiveStatus } from '@/server/actions/db';
import { Pause } from '@/server/components/icons/pause';
import { Play } from '@/server/components/icons/play';
import { SelectClub } from '@repo/database/postgres';
import { useActionState, useEffect } from 'react';

interface ManageClubProps {
	club: SelectClub;
}

export function ManageClub({ club }: ManageClubProps) {
	const removeClubWithId = removeClub.bind(null, club.id);

	const [deleteState, deleteFormAction, deleteActionIsPending] = useActionState(
		removeClubWithId,
		{
			error: undefined,
			success: false,
		}
	);

	const setClubStatusWithId = setClubActiveStatus.bind(
		null,
		club.id,
		club.isActive ? false : true
	);
	const [statusState, statusFormAction, statusActionIsPending] = useActionState(
		setClubStatusWithId,
		{
			error: undefined,
			success: false,
		}
	);

	useEffect(() => {
		if (deleteActionIsPending || statusActionIsPending) {
			customToast({
				message: deleteActionIsPending
					? `Deleting ${club.displayName}...`
					: `Setting club to ${club.isActive ? 'inactive' : 'active'}...`,
				type: 'loading',
			});
		} else if (deleteState.error || statusState.error) {
			customToast({
				message: deleteState.error || statusState.error || 'Error',
				type: 'error',
			});
		} else if (deleteState.success || statusState.success) {
			customToast({
				message: deleteState.success
					? `Successfully deleted ${club.displayName}!`
					: `Set club to ${club.isActive ? 'active' : 'inactive'}`,
				type: 'success',
			});
		}
	}, [
		deleteActionIsPending,
		deleteState,
		club.displayName,
		club.isActive,
		statusActionIsPending,
		statusState.error,
		statusState.success,
	]);

	const openModal = () => {
		const modal = document.getElementById(
			'delete_club_modal'
		) as HTMLDialogElement;
		if (!modal) return;

		modal.showModal();
	};

	return (
		<div className='flex flex-col gap-2'>
			<div className='flex items-center gap-2 justify-between'>
				<p>
					<span className='font-bold'>{club.displayName}</span> is currently{' '}
					<span className='font-bold'>
						{club.isActive ? 'active' : 'inactive'}.
					</span>
				</p>
				<form action={statusFormAction}>
					<button
						type='submit'
						className={`btn ${club.isActive ? 'btn-secondary' : 'btn-primary'}`}>
						{club.isActive ? <Pause /> : <Play />}
						{club.isActive ? 'Pause' : 'Activate'} club
					</button>
				</form>
			</div>

			<button
				className='btn btn-error self-end'
				onClick={openModal}>
				Delete club
			</button>
			<dialog
				id='delete_club_modal'
				className='modal modal-bottom sm:modal-middle'>
				<div className='modal-box'>
					<h3 className='font-bold text-lg'>Are you sure?</h3>
					<p className='py-4'>
						This will permanently delete the club and all statistics.
					</p>

					<div className='modal-action'>
						<form action={deleteFormAction}>
							<button
								type='submit'
								className='btn btn-error btn-outline'>
								Delete {club.displayName}
							</button>
						</form>
					</div>
				</div>
				<form
					method='dialog'
					className='modal-backdrop'>
					<button>close</button>
				</form>
			</dialog>
		</div>
	);
}
