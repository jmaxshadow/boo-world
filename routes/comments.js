'use strict';

const express = require('express');
const router = express.Router();
const { ensureAccountExists } = require('../controllers/account');
const { 
  addComment,
  processComments,
  likeComment,
  unlikeComment,
  ensureCommentExists
} = require('../controllers/comments');

module.exports = function() {

  // Middleware that applies to all routes with '/account/:id/comments'
  router.use('/account/:id/comments', ensureAccountExists);

  // Route handlers for '/account/:id/comments'
  router.route('/account/:id/comments')
    .post(addComment)
    .get(processComments);

  // Sub-route for operations on a specific comment
  const commentsRouter = express.Router({ mergeParams: true }); // mergeParams allows access to params from the parent router

  // Middleware specific to the commentId routes
  commentsRouter.use('/:commentId', ensureCommentExists);

  // PUT endpoints for like and unlike actions
  commentsRouter.put('/:commentId/like', likeComment);
  commentsRouter.put('/:commentId/unlike', unlikeComment);

  // Mount the commentsRouter on the main router
  router.use('/account/:id/comments', commentsRouter);

  return router;
}