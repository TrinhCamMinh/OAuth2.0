const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userName: String,
        googleID: String,
        thumbnail: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model('user', userSchema);
