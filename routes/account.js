'use strict';

const express = require('express');
const router = express.Router();
const { 
  addAccount,
  getAccountById,
  ensureAccountExists
} = require('../controllers/account');

module.exports = function() {

  router.post('/account', addAccount);
  router.get('/account/:id', ensureAccountExists, getAccountById);

  return router;
}

