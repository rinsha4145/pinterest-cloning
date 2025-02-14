const Posts = require("../../Models/postSchema");

// comment on a post
const commentOnPin = async (req, res) => {
  const { comment } = req.body;
  if (!comment || comment.trim() === "") {
    return res.status(400).json({ message: "Comment is required" });
  }
  const pin = await Posts.findById(req.params.id).populate("comments.user");
  if (!pin) {
    return res.status(404).json({ message: "No Pin found with this ID" });
  }

  pin.comments.push({
    user: req.userId,
    comment,
  });
  await pin.save();

  res.status(200).json({ message: "Comment added successfully", pin });
};

//delete a comment 
const deleteComment = async (req, res) => {
  try {
    const pin = await Posts.findOne({ "comments._id": req.params.id });

    console.log("Comment ID:", req.params.id);
    console.log("Authenticated user:", req.userId);

    if (!pin) {
      return res.status(400).json({
        message: "No post found containing this comment",
      });
    }

    const commentIndex = pin.comments.findIndex(
      (item) => item._id.toString() === req.params.id.toString()
    );

    if (commentIndex === -1) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const comment = pin.comments[commentIndex];
    console.log("Comment being deleted:", comment);

    if (comment.user.toString() === req.userId.toString()) {
      pin.comments.splice(commentIndex, 1);
      console.log("Comments after deletion:", pin.comments);

      await pin.save();

      return res.json({
        message: "Comment Deleted",
        pin,
      });
    } else {
      return res.status(403).json({
        message: "You are not the owner of this comment",
      });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

// edit a comment
const editComment = async (req, res) => {
  const { comment } = req.body;
  if (!comment || comment.trim() === "") {
    return res.status(400).json({ message: "Comment is required" });
  }
  const pin = await Posts.findOne({ "comments._id": req.params.id });

  if (!pin) {
    return res
      .status(400)
      .json({ message: "No post found containing this comment" });
  }

  const commentIndex = pin.comments.findIndex(
    (item) => item._id.toString() === req.params.id.toString()
  );

  if (commentIndex === -1) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const existingComment = pin.comments[commentIndex];

  if (existingComment.user.toString() !== req.userId.toString()) {
    return res
      .status(403)
      .json({ message: "You are not the owner of this comment" });
  }

  pin.comments[commentIndex].comment = comment;
  await pin.save();
  return res.status(200).json({
    message: "Comment updated successfully",
    pin,
  });
};

// get a comment by ID
const getCommentById = async (req, res) => {
  const pin = await Posts.findOne({ "comments._id": req.params.id }).populate(
    "comments.user"
  );

  if (!pin) {
    return res
      .status(404)
      .json({ message: "No post found containing this comment" });
  }
  const comment = pin.comments.find(
    (item) => item._id.toString() === req.params.id.toString()
  );

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  return res.status(200).json({ message: "Comment found", comment });
};

// replay to a comment
const replyToComment = async (req, res) => {
  const { reply } = req.body;
  if (!reply || reply.trim() === "") {
    return res.status(400).json({ message: "Reply is required" });
  }
  const post = await Posts.findOne({ "comments._id": req.params.commentId });

  if (!post) {
    return res
      .status(404)
      .json({ message: "No post found containing this comment" });
  }

  const comment = post.comments.find(
    (item) => item._id.toString() === req.params.commentId.toString()
  );

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  comment.replies.push({
    user: req.userId,
    reply,
  });

  await post.save();

  return res.status(200).json({
    message: "Reply added successfully",
    post,
  });
};

module.exports = {
  commentOnPin,
  deleteComment,
  editComment,
  getCommentById,
  replyToComment,
};
