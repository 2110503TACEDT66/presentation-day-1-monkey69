const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    bookDate : {
        type : Date,
        required: true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
    },
    dentist:{
        type:mongoose.Schema.ObjectId,
        ref: 'Dentist',
        required:true
    },
    priceId:{
        type:String,
        required:[true,'Please add priceId']
    },
    status:{
        type:String,
        enum:['finish','unfinish'],
        default: 'unfinish'
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Booking', BookingSchema);