// Corrected version of the updateComment endpoint

app.patch('/updateComment', (req, res) => {
    const { CommentID, NewComment, isPrivate } = req.body
    const currentTime = new Date().toISOString()
    const updateSQL = `UPDATE tblComments SET Comment = ?, subittedDateTime = ?, private = ? WHERE CommentID = ?`
    
    db.run(updateSQL, [NewComment, currentTime, isPrivate, CommentID], (err) => {
      if (err) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(200).json({
        message: "Comment updated successfully"
      })
    })
})