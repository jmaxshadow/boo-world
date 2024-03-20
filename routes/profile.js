'use strict';

const express = require('express');
const router = express.Router();
const { addProfile, getProfileById } = require('../controllers/profile');

module.exports = function() {

  router.get('/profile/:id', getProfileById);
  router.post('/profile', addProfile);

  return router;
}

