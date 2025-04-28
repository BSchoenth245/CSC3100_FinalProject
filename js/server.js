const express = require('express')
const cors = require('cors')
const {v4:uuidv4} = require('uuid')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt')
const intSalt = 10;
 
const dbSource = "groupApp.db"
const HTTP_PORT = 8000
const db = new sqlite3.Database(dbSource)
 
var app = express()
app.use(cors())
app.use(express.json())

app.post('/registration', async (req, res) => {
    try {
        // Get request data
        const { firstName, lastName, email, password } = req.body
        const userId = uuidv4()
        const currentTime = new Date().toISOString()
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, intSalt)

        const sql = `INSERT INTO tblUsers (UserID, fName, lName, Email, Password, CreationDateTime, LastLogDateTime) 
                     VALUES (?,?,?,?,?,?,?)`
        
        db.run(sql, [userId, firstName, lastName, email, hashedPassword, currentTime, null], (err) => {
            if (err) {
                res.status(400).json({ error: err.message })
                return
            }
            res.status(201).json({
                userId: userId,
                message: "User created successfully"
            })
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`)
})