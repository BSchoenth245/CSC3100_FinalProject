// Copy and paste this into your browser's console to test the updated updateComment endpoint

fetch('http://localhost:8000/updateComment', {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        OGComment: "Original comment text here", // The original comment text to find
        NewComment: "This is the updated comment text",
        isPrivate: 0 // 0 for public, 1 for private
    })
})
.then(response => {
    console.log('Status:', response.status);
    return response.json();
})
.then(data => {
    console.log('Update comment response:', data);
})
.catch(error => {
    console.error('Error:', error);
});

/* 
NOTE: There's still an issue with the updateComment endpoint in your server.js:

The SQL query has a syntax error:
`UPDATE tblComments SET Comment = ?, subittedDateTime = ?, private = ? WHERE UserID = ? AND WHERE Comment = ?`

The second "WHERE" keyword is incorrect. It should be:
`UPDATE tblComments SET Comment = ?, subittedDateTime = ?, private = ? WHERE UserID = ? AND Comment = ?`

A corrected version of the server code would be:

```javascript
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
```
*/