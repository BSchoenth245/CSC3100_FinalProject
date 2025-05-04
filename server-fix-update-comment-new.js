// Corrected version of the updated updateComment endpoint

app.patch('/updateComment', (req,res) => {
    const { OGComment, NewComment, isPrivate } = req.body
    const currentTime = new Date().toISOString()
    const updateSQL = `UPDATE tblComments SET Comment = ?, subittedDateTime = ?, private = ? WHERE UserID = ? AND Comment = ?`
    
    db.run(updateSQL, [NewComment, currentTime, isPrivate, currentUser, OGComment], (err) => {
      if (err) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(200).json({
        message: "Comment updated successfully"
      })
    })
})