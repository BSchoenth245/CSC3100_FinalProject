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



app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`)
})