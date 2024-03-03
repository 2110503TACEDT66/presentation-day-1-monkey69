const Booking = require("../models/Booking");
const Dentist = require("../models/Dentist");

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('dentist');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin")
    {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
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
      .json({ success: false, message: "Cannot find Booking" });
  }
};

exports.getBookings = async (req, res, next) => {
    let query = Booking.find();

    if(req.user.role !== 'admin'){
        query=Booking.find({user:req.user.id}).populate('dentist');
    }else { 
        if(req.params.dentistId) {
            console.log(req.params.dentistId);

            query = Booking.find({hospital: req.params.dentistId}).populate('dentist');
        } else {
            query = Booking.find().populate('dentist');
        }
    }
    try {
        const booking = await query;

        res.status(200).json({
            success:true,
            count:booking.length,
            data: booking
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:
        error.message});
    }
};

exports.addBooking = async (req, res, next) => {
  try {
    req.body.dentist = req.params.dentistId;
    const dentist = await Dentist.findById(req.params.dentistId);

    if (!dentist) {
      return res.status(404).json({
        success: false,
        message: `None of dentist has the id of ${req.params.dentistId}`,
      });
    }

    req.body.user = req.user.id;

    const existedBooking = await Booking.find({ user: req.user.id });

    if (existedBooking.length >= 1 && req.user.role !== "admin") 
    {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already booked`,
      });
    }

    const booking = await Booking.create(req.body);

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `There is no booking with id of ${req.params.id}`,
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin")
    {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Booking" });
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res
        .status(404)
        .json({
          success: false,
          message: `There is no booking with the id of ${req.params.id}`,
        });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin")
    {
      return res
        .status(401)
        .json({
          success: false,
          message: `User ${req.user.id} is not authorized to delete this bootcamp`,
        });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Booking" });
  }
};