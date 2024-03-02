const mongoose = require('mongoose');

const DentistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add name'],
        
    },
    yearsOfExperience: {
        type: String,
        required: [true, 'Please add years of experience']
    },
    areaOfExpertise: {
        type: String,
        required: [true, 'Please add area of expertise']
    }
})