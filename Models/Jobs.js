const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    openings: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }

})


const Jobs = mongoose.model('Jobs', JobSchema)

module.exports = Jobs