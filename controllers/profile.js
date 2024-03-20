const { Profile } = require('../model/profile');

const addProfile = async (req, res) => {
    try {
        const newProfile = new Profile(req.body);
        await newProfile.save();
        // const newProfile = {_id: '123', name: 'Jose Machado', bio: 'Top Programmer'};
        res.status(201).send(newProfile);
    } catch (error) {
        res.status
    }
}

const getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        // const profile = {_id: '123', name: 'Jose Machado', bio: 'Top Programmer'};
        res.render('profile_template', {
            profile: profile,
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    addProfile,
    getProfileById
};