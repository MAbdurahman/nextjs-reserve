import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { MDBDataTable } from 'mdbreact';
import Loader from './../layout/Loader';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { getAdminRooms, deleteRoom } from './../../redux/actions/roomActions';
import { DELETE_ROOM_RESET } from './../../redux/constants/roomConstants';

export default function AllRooms() {
	//**************** variables ****************//
	const dispatch = useDispatch();
	const router = useRouter();

	const { loading, error, rooms } = useSelector(state => state.allRooms);
	const { error: deleteError, isDeleted } = useSelector(state => state.room);
	//**************** functions ****************//
	useEffect(() => {
		dispatch(getAdminRooms());

		if (error) {
			toast.error(error);
			dispatch(clearErrors());
		}

		if (deleteError) {
			toast.error(deleteError);
			dispatch(clearErrors());
		}

		if (isDeleted) {
			router.push('/admin/rooms');
			dispatch({ type: DELETE_ROOM_RESET });
		}
	}, [dispatch, deleteError, isDeleted]);

	const setRooms = () => {
		const data = {
			columns: [
				{
					label: 'Room ID',
					field: 'id',
					sort: 'asc',
				},
				{
					label: 'Name',
					field: 'name',
					sort: 'asc',
				},
				{
					label: 'Price / Night',
					field: 'price',
					sort: 'asc',
				},
				{
					label: 'Category',
					field: 'category',
					sort: 'asc',
				},
				{
					label: 'Actions',
					field: 'actions',
					sort: 'asc',
				},
			],
			rows: [],
		};

		rooms &&
			rooms.forEach(room => {
				data.rows.push({
					id: room._id,
					name: room.name,
					price: `$${room.pricePerNight}`,
					category: room.category,
					actions: (
						<>
							<Link href={`/admin/rooms/${room._id}`}>
								<a className='btn button-green'>
									<i className='fa fa-pencil'></i>
								</a>
							</Link>

							<button
								className='btn button-red mx-2'
								onClick={() => deleteRoomHandler(room._id)}
							>
								<i className='fa fa-trash'></i>
							</button>
						</>
					),
				});
			});

		return data;
	};

	const deleteRoomHandler = id => {
		dispatch(deleteRoom(id));
	};
	return (
		<div id='admin-all-rooms' className='container container-fluid'>
			{loading ? (
				<Loader />
			) : (
				<>
					<h1 className='my-5'>
						{`${rooms && rooms.length} Rooms`}

						<Link href='/admin/rooms/new'>
							<a className='mt-0 button-3d float-right'>
								Create New Room
							</a>
						</Link>
					</h1>

					<MDBDataTable
						responsive
						data={setRooms()}
						className='px-3'
						bordered
						striped
						hover
					/>
				</>
			)}
		</div>
	);
}
