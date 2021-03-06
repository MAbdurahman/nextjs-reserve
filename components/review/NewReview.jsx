import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import {
	newReview,
	checkReviewAvailability,
	clearErrors,
} from './../../redux/actions/roomActions';
import { NEW_REVIEW_RESET } from './../../redux/constants/roomConstants';

export default function NewReview() {
	//**************** variables ****************//
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const dispatch = useDispatch();
	const router = useRouter();

	const { error, success } = useSelector(state => state.newReview);
	const { reviewAvailable } = useSelector(state => state.checkReview);

	const { id } = router.query;
	//**************** functions ****************//
	useEffect(() => {
		if (id !== undefined) {
			dispatch(checkReviewAvailability(id));
		}

		if (error) {
			toast.error(error);
			dispatch(clearErrors());
		}

		if (success) {
			toast.success('Review has been posted!');
			dispatch({ type: NEW_REVIEW_RESET });

			router.push(`/room/${id}`);
		}
	}, [dispatch, success, error, id]);

	const submitHandler = () => {
		setIsSubmitting(true);
		const reviewData = {
			rating,
			comment,
			roomId: id,
		};
		setTimeout(() => {
			dispatch(newReview(reviewData));

		}, 2500)
		setTimeout(() => {
			setIsSubmitting(false);
		}, 2000);
	};

	function setUserRatings() {
		const stars = document.querySelectorAll('.star');

		stars.forEach((star, index) => {
			star.starValue = index + 1;

			['click', 'mouseover', 'mouseout'].forEach(function (e) {
				star.addEventListener(e, showRatings);
			});
		});

		function showRatings(e) {
			stars.forEach((star, index) => {
				if (e.type === 'click') {
					if (index < this.starValue) {
						star.classList.add('red');

						setRating(this.starValue);
					} else {
						star.classList.remove('red');
					}
				}

				if (e.type === 'mouseover') {
					if (index < this.starValue) {
						star.classList.add('light-red');
					} else {
						star.classList.remove('light-red');
					}
				}

				if (e.type === 'mouseout') {
					star.classList.remove('light-red');
				}
			});
		}
	}
	return (
		<>
			{reviewAvailable && (
				<button
					id='review_btn'
					type='button'
					className='button-3d mt-1 mb-4'
					data-toggle='modal'
					data-target='#ratingModal'
					onClick={setUserRatings}
				>
					Write A Review
				</button>
			)}
			<div
				className='modal fade'
				id='ratingModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='ratingModalLabel'
				aria-hidden='true'
			>
				<div className='modal-dialog' role='document'>
					<div className='modal-content review-box'>
						<div className='modal-header'>
							<h5 className='modal-title' id='ratingModalLabel'>
								Room Review
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'
							>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<ul className='stars'>
								<li className='star'>
									<i className='fa fa-star'></i>
								</li>
								<li className='star'>
									<i className='fa fa-star'></i>
								</li>
								<li className='star'>
									<i className='fa fa-star'></i>
								</li>
								<li className='star'>
									<i className='fa fa-star'></i>
								</li>
								<li className='star'>
									<i className='fa fa-star'></i>
								</li>
							</ul>

							<textarea
								name='review'
								id='review'
								className='form-control mt-3'
								value={comment}
								onChange={e => setComment(e.target.value)}
							>
								{''}
							</textarea>

							<button
								className='button-3d my-3 float-right px-4 text-white'
								data-dismiss='modal'
								aria-label='Close'
								disabled={isSubmitting}
								onClick={submitHandler}
							>
							{isSubmitting ? 'Submitting...' : 'Submit Review'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
