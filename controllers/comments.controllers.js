const apiModels = require("../models/comments.models.js");

//DELETE /api/comments/:comment_id
//* deletes a comment by comment_id
const deleteComment = (req,res) => {
    const {comment_id} = req.params;
    res.status(204); 
    
    apiModels.deleteComment(comment_id)
    .then(() => {
        res.send();
    })
}

module.exports = {deleteComment};