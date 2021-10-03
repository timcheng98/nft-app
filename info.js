const moment = require('moment');
const _ = require('lodash');
let tz = 'Etc/GMT-8"';
const debug = require('debug')('app:model/booking/info');

const generateBookingSections = async (itemRc, looping) => {
	// set buffer default 0
	const buffer = 0;

	let {
		section_duration: duration,
		pid,
		start_day,
		end_day,
		prebooking_type,
		no_end_day,
		start_time,
		end_time,
		type,
	} = itemRc;

	// console.log('pid booking info detail', {
	//   section_duration: duration,
	//   pid,
	//   start_day: moment.unix(start_day).startOf('day'),
	//   end_day:  moment.unix(end_day).startOf('day'),
	//   start_time:  moment.unix(start_time),
	//   end_time:  moment.unix(end_time),
	//   prebooking_type,
	//   no_end_day,
	//   type
	// });

	let { numberOfDays, firstBookingDate, lastBookingDate } =
		getBookingDateDetail(
			start_day,
			end_day,
			prebooking_type,
			no_end_day,
			looping
		);

	console.log('PID booking info >>>', {
		section_duration: duration,
		pid,
		start_day: moment.unix(start_day).utcOffset(8),
		end_day: moment.unix(end_day).utcOffset(8),
		prebooking_type,
		no_end_day,
		start_time: moment.unix(start_time).utcOffset(8),
		end_time: moment.unix(end_time).utcOffset(8),
		type,
	});
	console.log('getBookingDetail >>>', {
		looping,
		numberOfDays,
		firstBookingDate,
		lastBookingDate,
	});

	let bookingDay = firstBookingDate.clone();
	_.times(numberOfDays, (n) => {
		// console.log('inside promiseLoopDays >>>', n);

		// let isFullDayAvailable = false
		// isFullDayAvailable = await checkFullDayAvailable(highestPriortyRuleset, bookingDay)
		// console.log('isFullDayAvailable>>>', isFullDayAvailable)

		// const { startTime, endTime } = await getStartEndTime(bookingDay)
		// const startTime = bookingDay.clone()

		// startTime.day()
		// const endTime = moment.unix(end_time).add(numberOfDays + 1, 'day')

		// console.log("startTime>>>", startTime)
		// console.log("endTime>>>", endTime)
		// console.log("duration>>>", duration)
		// console.log("buffer", buffer)
		if (type === 1) {
			// console.log('inside type === 1 >>>>')
			// TODO:: check sql result length >= quota
			// let isTimeslotExist = true
			// console.log('inserted booking info >>>>>', insertedBookingInfo);
			// if (_.isEmpty(insertedBookingInfo) || insertedBookingInfo.length < itemRc.quota) {
			//   isTimeslotExist = false
			// }
			const startTime = moment.unix(start_time).set({
				year: bookingDay.get('year'),
				month: bookingDay.get('month'),
				date: bookingDay.get('date'),
			});


     
      const sec = moment.duration(moment.unix(end_time).diff(moment.unix(start_time)))
			const endTime = startTime.clone().add(sec, 'seconds')
			createBookingTimeslot(startTime, endTime, duration, buffer, pid, itemRc);
			// console.log('bookingDay', bookingDay);
			bookingDay.add(1, 'day');
		}
	});
};

const getBookingDateDetail = (
	start_day,
	end_day,
	prebooking_type,
	no_end_day,
	looping
) => {
	let firstBookingDate = getFirstBookingDate(start_day);
	let lastBookingDate = getLastBookingDate(
		firstBookingDate,
		end_day,
		prebooking_type,
		no_end_day
	);
	let numberOfDays = moment
		.duration(lastBookingDate.diff(firstBookingDate))
		.asDays();
	numberOfDays = Math.ceil(numberOfDays);
	// latest day
	if (looping === 'last') {
		firstBookingDate.add(numberOfDays, 'day');
		numberOfDays = 0;

		if (firstBookingDate.unix() <= moment.unix(end_day).startOf('day').unix()) {
			numberOfDays = 1;
		}
		if (no_end_day) {
			numberOfDays = 1;
		}
	}
	return { numberOfDays, firstBookingDate, lastBookingDate };
};

const getLastBookingDate = (
	firstBookingDate,
	end_day,
	prebooking_type,
	no_end_day
) => {
	let startDay = firstBookingDate.clone();
	let endDay = moment.unix(end_day).utcOffset(8).startOf('day');
	let lastDay = moment().utcOffset(8).startOf('day');

	if (prebooking_type === 1) {
		lastDay = startDay.add(7, 'days').utcOffset(8).startOf('day');
	}

	if (prebooking_type === 2) {
		lastDay = startDay.add(1, 'months').startOf('day');
	}

	let lastBookingDate;

	if (no_end_day || endDay.unix() >= lastDay.unix()) {
		lastBookingDate = lastDay.clone();
		return lastBookingDate;
	}

	// has end day
	if (endDay.unix() <= lastDay.unix()) {
		lastBookingDate = endDay.clone();
		return lastBookingDate.utcOffset(8).startOf('day');
	}

	return lastBookingDate.utcOffset(8).startDay('day');
};

const getFirstBookingDate = (start_day) => {
	let firstBookingDate;
  let startDay = moment.unix(start_day).utcOffset(8).startOf('day')
	let startOfToday = moment().utcOffset(8).startOf('day').unix();

	console.log('startDay>>', startDay);
	console.log('start_day>>', moment.unix(start_day).utcOffset(8));
	console.log('startOfToday>>', moment.unix(startOfToday).utcOffset(8));
	if (startDay >= startOfToday) {
		return moment.unix(start_day);
	}

	firstBookingDate = moment.unix(startOfToday);

	console.log('firstBookingDate>>', firstBookingDate);
	return firstBookingDate;
};

const createBookingTimeslot = async (
	startTime,
	endTime,
	duration,
	buffer,
	pid,
	itemRc
) => {
	if (startTime.unix() === 0 || endTime.unix() === 0 || duration === 0) {
		return;
	}

	console.log('createBookingTimeslot start', startTime);
	console.log('createBookingTimeslot end', endTime);

	// check by date
	// const foundRecord = await checkBookingDateExist(startTime, endTime, pid)
	// if (foundRecord) return;

	let timeslotStartTS = startTime.clone();
	let timeslotEndTS = startTime.clone().add(duration, 'seconds').subtract(1);
	let EndTS = endTime.clone();

	const checkTimeslotsExistPromise = [];
	const createTimelotsPromises = [];

	const addTime = () => {
		timeslotStartTS.add(duration, 'seconds').add(buffer, 'seconds');
		timeslotEndTS.add(duration, 'seconds').add(buffer, 'seconds');
	};

	for (timeslotStartTS; timeslotEndTS.unix() <= EndTS.unix(); addTime()) {
    console.log(timeslotStartTS)
		// checkTimeslotsExistPromise.push(
		//   checkTimeslotExist(timeslotStartTS.clone(), timeslotEndTS.clone(), pid)
		// )
	}

	// const timeslotArr = await Promise.all(checkTimeslotsExistPromise)
	// _.map(timeslotArr, (item) => {
	//   if (item.isExist) return;
	//   const postData = {
	//     pid: itemRc.pid,
	//     car_park_id: itemRc.car_park_id,
	//     start_time: item.timeslotStartTS.unix(),
	//     end_time: item.timeslotEndTS.unix(),
	//     section_duration: itemRc.section_duration,
	//     section_price: itemRc.section_price,
	//     is_active: itemRc.is_active,
	//     status: exports.BOOKING_STATUS.available.key,
	//     remarks: '',
	//     uid: 0,
	//     ptx_id: 0
	//   }

	//   // createTimelotsPromises.push(exports.insertBookingInfo(postData))
	// })

	// return Promise.all(createTimelotsPromises)
};

exports.insertBookingSections = (looping) => {
	// const tz = -companyInfo.tz

	// @overide tz
	tz = 'Etc/GMT-8';

	// console.log('origin data record >>>', itemRc)
	let itemRc = {
		section_duration: 900,
		pid: '10001042',
		start_day: 1632870000,
		end_day: 1633388400,
		prebooking_type: 1,
		no_end_day: 1,
		start_time: 1632866400,
		end_time: 1632875399,
		type: 1,
	};
	console.log('object');
	generateBookingSections(itemRc, 'all');
};

exports.insertBookingSections();
