const { Comments } = require('../model/comments');

const ensureCommentExists = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const comment = await Comments.findById(commentId);

        if (!comment) {
            return res.status(404).send({ message: "Comment not found" });
        }

        req.comment = comment; // Attach the account to the request object
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error while retrieving the comment." });
    }
}

const addComment = async (req, res) => {
    const newComment = new Comments(req.body);
    await newComment.save();
    res.status(201).send(newComment);
}

const processComments = async (req, res) => {
    const { sort, filterBy, filterValue } = req.query; // Add filter parameters

    try {
        const account = req.account;

        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }
        let comments = await Comments.find({ AccountId: account._id });

        // Filter comments if filter parameters are provided
        if (filterBy && filterValue !== undefined) {
            comments = comments.filter(comment => String(comment[filterBy]) === String(filterValue));
        }

        // Sort comments if sort parameter is provided
        if (sort) {
            comments.sort((a, b) => {
                if (sort === 'likes') {
                    // descending order
                    return b.likes.length - a.likes.length;
                } else if (sort === 'date') {
                    // descending order
                    return new Date(b.date) - new Date(a.date);
                }
                return 0; // No sorting applied if sort parameter is not recognized
            });
        }

        res.send(comments);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while processing the comments." });
    }
};

const likeComment = async (req, res) => {
    const { profileId } = req.body;
    const comment = req.comment;
    comment.likes.push(profileId);
    await comment.save();
    res.send(comment);
};

const unlikeComment = async (req, res) => {
    const { profileId } = req.body;
    const comment = req.comment;
    comment.likes = comment.likes.filter(id => id.toString() !== profileId);
    await comment.save();
    res.send(comment);
}

module.exports = {
    addComment,
    processComments,
    likeComment,
    unlikeComment,
    ensureCommentExists
};