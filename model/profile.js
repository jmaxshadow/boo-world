const mongoose = require('mongoose');
    
const profileSchema = new mongoose.Schema({
    name: String,
    bio: String,
    image: { type: String, default: 'default_image_url.jpg' }
});
const Profile = mongoose.model('Profile', profileSchema);

module.exports = {
    Profile
};

// const newProfile = new Profile({
//     "id": 1,
//     "name": "A Martinez",
//     "description": "Adolph Larrue Martinez III.",
//     "mbti": "ISFJ",
//     "enneagram": "9w3",
//     "variant": "sp/so",
//     "tritype": 725,
//     "socionics": "SEE",
//     "sloan": "RCOEN",
//     "psyche": "FEVL",
//     "image": "https://soulverse.boo.world/images/1.png",
// });
// newProfile.save();