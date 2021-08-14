import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { MDBDataTable } from 'mdbreact';
import Loader from '../layout/Loader';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
	getAdminUsers,
	// deleteUser,
	clearErrors,
} from '../../redux/actions/userActions';
// import { DELETE_USER_RESET } from '../../redux/constants/userConstants';

export default function AllUsers() {
	//**************** variables ****************//
	const dispatch = useDispatch();

	const router = useRouter();

	const { loading, error, users } = useSelector(state => state.allUsers);
	const { error: deleteError, isDeleted } = useSelector(state => state.user);
	//**************** functions ****************//
	useEffect(() => {
		dispatch(getAdminUsers());

		if (error) {
			toast.error(error);
			dispatch(clearErrors());
		}

		/* if (deleteError) {
			toast.error(deleteError);
			dispatch(clearErrors());
		}

		if (isDeleted) {
			router.push('/admin/users');
			dispatch({ type: DELETE_USER_RESET });
		} */
	}, [dispatch]);

	const deleteUserHandler = id => {
		// dispatch(deleteUser(id));
      console.log(id);
	};

	const setUsers = () => {
		const data = {
			columns: [
				{
					label: 'User ID',
					field: 'id',
					sort: 'asc',
				},
				{
					label: 'Name',
					field: 'name',
					sort: 'asc',
				},
				{
					label: 'Email',
					field: 'email',
					sort: 'asc',
				},
				{
					label: 'Role',
					field: 'role',
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

		users &&
			users.forEach(user => {
				data.rows.push({
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					actions: (
						<>
							<Link href={`/admin/users/${user._id}`}>
								<a className='btn button-green'>
									<i className='fa fa-pencil'></i>
								</a>
							</Link>

							<button
								className='btn button-red mx-2'
								onClick={() => deleteUserHandler(user._id)}
							>
								<i className='fa fa-trash'></i>
							</button>
						</>
					),
				});
			});

		return data;
	};
	return (
		<div className='container container-fluid'>
			{loading ? (
				<Loader />
			) : (
				<>
					<h1 className='my-5'>{`${users && users.length} Users`}</h1>

					<MDBDataTable
						data={setUsers()}
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
