import axios from 'axios';
import absoluteUrl from 'next-absolute-url';
import {
	CHECK_BOOKING_REQUEST,
	CHECK_BOOKING_SUCCESS,
	CHECK_BOOKING_RESET,
	CHECK_BOOKING_FAIL,
	BOOKED_DATES_SUCCESS,
	BOOKED_DATES_FAIL,
	MY_BOOKINGS_SUCCESS,
	MY_BOOKINGS_FAIL,
	BOOKING_DETAILS_SUCCESS,
	BOOKING_DETAILS_FAIL,
	ADMIN_BOOKINGS_REQUEST,
	ADMIN_BOOKINGS_SUCCESS,
	ADMIN_BOOKINGS_FAIL,
	DELETE_BOOKING_REQUEST,
	DELETE_BOOKING_SUCCESS,
	DELETE_BOOKING_RESET,
	DELETE_BOOKING_FAIL,
	CLEAR_ERRORS,
} from './../constants/bookingConstants';

/*=============================================
         Check Booking 
================================================*/
export const checkBooking = (
	roomId,
	checkInDate,
	checkOutDate
) => async dispatch => {
	try {
		dispatch({ type: CHECK_BOOKING_REQUEST });

		let link = `/api/bookings/check?roomId=${roomId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;

		const { data } = await axios.get(link);

		dispatch({
			type: CHECK_BOOKING_SUCCESS,
			payload: data.isAvailable,
		});
	} catch (error) {
		dispatch({
			type: CHECK_BOOKING_FAIL,
			payload: error.response.data.message,
		});
	}
};

/*=============================================
         Clear Errors
================================================*/
export const clearErrors = () => async dispatch => {
	dispatch({
		type: CLEAR_ERRORS,
	});
};