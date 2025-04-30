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

app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Use a promise-based approach with proper error handling
      const getUserByEmail = () => {
        return new Promise((resolve, reject) => {
          const sql = `SELECT UserID, Password FROM tblUsers WHERE Email = ?`;
          db.get(sql, [email], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });
      };
  
      // Get user from database
      const user = await getUserByEmail();
      
      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: "Invalid email or password." });
      }
      
      // Verify password
      const match = await bcrypt.compare(password, user.Password);
      if (!match) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // If we reach here, login is successful
      const currentTime = new Date().toISOString();
      const SessionID = uuidv4();
      const strStatus = "Active";
      
      // Execute both database operations in a single transaction
      await new Promise((resolve, reject) => {
        // Begin transaction
        db.serialize(() => {
          db.run('BEGIN TRANSACTION');
          
          // Update last login time
          db.run(
            `UPDATE tblUsers SET LastLogDateTime = ? WHERE UserID = ?`,
            [currentTime, user.UserID],
            function(err) {
              if (err) {
                return reject(err);
              }
            }
          );
          
          // Insert session record
          db.run(
            `INSERT INTO tblSession (SessionID, UserID, StartDateTime, LastUsedDateTime, Status)
             VALUES (?, ?, ?, ?, ?)`,
            [SessionID, user.UserID, currentTime, currentTime, strStatus],
            function(err) {
              if (err) {
                return reject(err);
              }
            }
          );
        });
      });
      
      // Send successful response
      return res.status(200).json({
        message: "Login successful",
        sessionId: SessionID,
        userId: user.UserID
      });
      
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ 
        error: "Database error during login",
        details: err.message 
      });
    }
  });

  app.post('/createcourse', async (req, res) => {
    try{
      const { CourseName, CourseNumber, CourseSection, CourseTerm, StartDate, EndDate } = req.body
      const CourseID = uuidv4()
      const comInsert = `INSERT INTO tblCourses (CourseID, CourseName, CourseNumber, CourseSection, CourseTerm, StartDate, EndDate)
      VALUES (?, ?, ?, ?, ?, ?, ?)`

      db.run(comInsert, [CourseID, CourseName, CourseNumber, CourseSection, CourseTerm, StartDate, EndDate], (err) => {
        if (err) {
          res.status(400).json({ error: err.message })
          return
        }
        res.status(201).json({
          CourseID: CourseID,
          message: "Course created successfully"
        })
      })
    }catch{
      err => {
        res.status(500).json({ error: err.message })
      }
    }
  })

  app.post('/creategroup', async (req, res) => {
    try{
      const { GroupName, CourseName, CourseSection } = req.body
      const GroupID = uuidv4()

      const comSelect = `SELECT CourseID FROM tblCourses WHERE CourseName = ? AND CourseSection = ?`
      const comInsert = `INSERT INTO tblCourseGroups (GroupID, GroupName, CourseID)
      VALUES (?, ?, ?)`

      db.get(comSelect, [CourseName, CourseSection], (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message })
          return
        }
        if(!row) {
          res.status(400).json({ error: "Course not found" })
          return
        }
        db.run(comInsert, [GroupID, GroupName, row.CourseID], (err) => {
          if (err) {
            res.status(400).json({ error: err.message })
            return
          }
          res.status(201).json({
            GroupID: GroupID,
            message: "Group created successfully"
          })
        })
        })
      }catch{
      err => {
        res.status(500).json({ error: err.message })
      }
    }
  })


app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`)
})