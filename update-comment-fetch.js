// Copy and paste this into your browser's console to test the updateComment endpoint

fetch('http://localhost:8000/updateComment', {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        CommentID: "comment-uuid-here", // Replace with an actual comment ID from your database
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
NOTE: There appears to be an issue with the updateComment endpoint in your server.js:

1. The SQL query is:
   `UPDATE tblComments SET Comment = ?, subittedDateTime = ?, private = ? WHERE UserID = ?`

2. But the parameters passed are:
   [NewComment, currentTime, CommentID]

3. Issues:
   - The WHERE clause uses UserID but you're passing CommentID
   - There are 4 placeholders (?) but only 3 parameters
   - The parameter 'isPrivate' from the request body isn't used in the query

A corrected version of the server code would be:

```javascript
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
```
*/