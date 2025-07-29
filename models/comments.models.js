const db = require("../db/connection")

//DELETE /api/comments/:comment_id
//* deletes a comment by comment_id
const deleteComment = (comment_id) => {
    return db.query("DELETE FROM comments WHERE comment_id= " + comment_id)
    .then(() => {
        return;
    })
}

module.exports = {deleteComment};