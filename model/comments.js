const mongoose = require('mongoose');
const { enneagram, zodiac } = require('../types');

const commentSchema = new mongoose.Schema({
    ProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    AccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    title: String,
    text: String,
    date: { type: Date, default: Date.now },
    likes: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' } ],
    enneagram: typeof enneagram,
    zodiac: typeof zodiac
});
const Comments = mongoose.model('Comment', commentSchema);

module.exports = {
    Comments
};