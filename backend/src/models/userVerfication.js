const mongoose = require("mongoose");

const userVerficationSchema = new mongoose.Schema({
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    verficationCode: {
        type: String,
        default: ''
    },
    createdAt: { type: Date, expires: '4m', default: Date.now }
})

const UserVerfication = new mongoose.model("UserVerfication", userVerficationSchema);

module.exports = UserVerfication;