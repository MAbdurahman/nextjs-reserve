import Room from '../models/roomModel';
import ErrorHandler from '../utils/errorHandler';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import APIFeatures from './../utils/apiFeatures';

/*===============================================================
            Get All Rooms => (GET)/api/rooms
==================================================================*/
const allRooms = catchAsyncErrors(async (req, res, next) => {
	const resultPerPage = 4;
	const roomsCount = await Room.countDocuments();
	const apiFeatures = new APIFeatures(Room.find(), req.query)
		.search()
		.filter();

	let rooms = await apiFeatures.query;
	let filteredRoomsCount = rooms.length;

	apiFeatures.pagination(resultPerPage);
	rooms = await apiFeatures.query;

	res.status(200).json({
		success: true,
		roomsCount,
		resultPerPage,
		filteredRoomsCount,
		rooms,
	});
});

/*===============================================================
            Create A New Room => (post)/api/rooms
==================================================================*/
const newRoom = catchAsyncErrors(async (req, res) => {
	try {
		const room = await Room.create(req.body);

		res.status(200).json({
			success: true,
			room,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
});

/*===============================================================
            Get Room Details => (GET)/api/rooms/:id
==================================================================*/
const getSingleRoom = catchAsyncErrors(async (req, res, next) => {
	const room = await Room.findById(req.query.id);

	if (!room) {
		return next(new ErrorHandler('A room with this ID was not found!', 404));
	}

	res.status(200).json({
		success: true,
		room,
	});
});

/*===============================================================
            Update Room Details => (PUT)/api/rooms/:id
==================================================================*/
const updateRoom = catchAsyncErrors(async (req, res, next) => {
	const room = await Room.findById(req.query.id);

	if (!room) {
		return next(new ErrorHandler('A room with this ID was not found!', 404));
	}

	const updateRoom = await Room.findByIdAndUpdate(req.query.id, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
		updateRoom,
	});
});

/*===============================================================
            Delete Room => (DELETE)/api/rooms/:id
==================================================================*/
const deleteRoom = catchAsyncErrors(async (req, res) => {
	const room = await Room.findById(req.query.id);

	if (!room) {
		return next(new ErrorHandler('A room with this ID was not found!', 404));
	}

	await room.remove();

	res.status(200).json({
		success: true,
		message: 'Room has been deleted!',
	});
});

export { allRooms, newRoom, getSingleRoom, updateRoom, deleteRoom };
