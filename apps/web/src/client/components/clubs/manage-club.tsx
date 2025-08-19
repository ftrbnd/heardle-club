'use client';

import { customPromiseToast } from '@/client/components/toast';
import { removeClub, setClubActiveStatus } from '@/server/actions/db';
import { Pause } from '@/server/components/icons/pause';
import { Play } from '@/server/components/icons/play';
import { SelectClub } from '@repo/database/postgres';

interface ManageClubProps {
	club: SelectClub;
}

export function ManageClub({ club }: ManageClubProps) {
	const setClubStatus = async () => {
		const newStatus = club.isActive ? 'inactive' : 'active';
		const isActive = club.isActive ? false : true;

		customPromiseToast({
			promise: setClubActiveStatus(club.id, isActive),
			loadingText: `Setting club to ${newStatus}...`,
			successText: `Set club to ${newStatus}`,
			errorText: `Failed to set club to ${newStatus}`,
		});
	};

	const openModal = () => {
		const modal = document.getElementById(
			'delete_club_modal'
		) as HTMLDialogElement;
		if (!modal) return;

		modal.showModal();
	};

	const handleDelete = async () => {
		customPromiseToast({
			promise: removeClub(club.id),
			loadingText: `Deleting ${club.displayName}...`,
			successText: `Successfully deleted ${club.displayName}`,
			errorText: `Failed to delete ${club.displayName}`,
		});
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
				<button
					onClick={setClubStatus}
					className={`btn ${club.isActive ? 'btn-secondary' : 'btn-primary'}`}>
					{club.isActive ? <Pause /> : <Play />}
					{club.isActive ? 'Pause' : 'Activate'} club
				</button>
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
						<button
							className='btn btn-error btn-outline'
							onClick={handleDelete}>
							Delete {club.displayName}
						</button>
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
