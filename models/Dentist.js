const mongoose = require('mongoose');

const DentistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add name'],
        trim: [true]
    },
    yearsOfExperience: {
        type: Number,
        required: [true, 'Please add years of experience']
    },
    areaOfExpertise: {
        type: String,
        required: [true, 'Please add area of expertise']
    }
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

DentistSchema.pre('deleteOne', {document: true, query:false}, async function(next) {
    await this.model('Booking').deleteMany({dentist: this._id});
    next();
})

DentistSchema.virtual('bookings',{
    ref: 'Booking',
    localField: '_id',
    foreignField:'dentist',
    justOne:false
});

module.exports = mongoose.model('Dentist', DentistSchema);