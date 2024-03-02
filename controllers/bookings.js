const Booking = require("../models/Booking");
const Dentist = require("../models/Dentist");

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Appointment" });
  }
};

exports.addBooking = async (req, res, next) => {
  try {
    req.body.id = req.params.dentistId;
    const dentist = await Dentist.findById(req.params.dentistId);

    if (!dentist) {
      return res.status(404).json({
        succes: false,
        message: `None of dentist has the id of ${req.params.dentistId}`,
      });
    }

    req.body.user = req.user.id;

    const existedBooking = await Booking.find({ user: req.user.id });

    if (existedBooking.length >= 1 && req.user.role !== "admin") {
      return res.status(400).json({
        succes: false,
        message: `The user with ID ${req.user.id} has already booked`,
      });
    }

    const booking = await Booking.create(req.body);

    res.status(200).json({
      succes: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      succes: false,
      message: "Cannot create Booking",
    });
  }
};

exports.updateBooking = async (req, res, next) => {
    
};