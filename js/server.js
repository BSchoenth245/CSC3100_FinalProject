const express = require('express')
const cors = require('cors')
const {v4:uuidv4} = require('uuid')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt')
const intSalt = 10;

  const dbSource = "groupApp.db"
  const HTTP_PORT = 8000
  const db = new sqlite3.Database(dbSource)
  const currentUser = 'test'

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

  app.post('/checkemail', async (req, res) => {
      const strEmail = req.body
      const strCommand = `SELECT COUNT(*) as count FROM tblUsers WHERE Email = ?`
      db.get(strCommand, [strEmail], (err, row) => {
          if (err) {
              res.status(400).json({ error: err.message })
              return
          }
          if (row.count === 1) {
              res.status(200).json({ exists: false })
          } else {
              res.status(200).json({ exists: true })
          }
      })
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
          db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            db.run(
              `UPDATE tblUsers SET LastLogDateTime = ? WHERE UserID = ?`,
              [currentTime, user.UserID],
              function(err) {
                if (err) {
                  db.run('ROLLBACK');
                  return reject(err);
                }
              }
            );
            
            db.run(
              `INSERT INTO tblSession (SessionID, UserID, StartDateTime, LastUsedDateTime, Status)
               VALUES (?, ?, ?, ?, ?)`,
              [SessionID, user.UserID, currentTime, currentTime, strStatus],
              function(err) {
                if (err) {
                  db.run('ROLLBACK');
                  return reject(err);
                }
                db.run('COMMIT');
                resolve();
              }
            );
          });
        });
        // Send successful response
        return res.status(200).json({
          message: "Login successful",
          userId: user.UserID
        });
        
      } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ 
          details: err.message
      })
    }
  });

  app.post('/createcourse', async (req, res) => {
    try {
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
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  app.post('/creategroup', async (req, res) => {
    try {
      const { GroupName, CourseName, CourseSection } = req.body
      const GroupID = uuidv4()
      const groupCode = uuidv4().substring(0, 6)

      const comSelect = `SELECT CourseID FROM tblCourses WHERE CourseName = ? AND CourseSection = ?`
      const comInsert = `INSERT INTO tblCourseGroups (GroupID, GroupName, CourseID, groupCode)
      VALUES (?, ?, ?, ?)`

      db.get(comSelect, [CourseName, CourseSection], (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message })
          return
        }
        if(!row) {
          res.status(400).json({ error: "Course not found" })
          return
        }
        db.run(comInsert, [GroupID, GroupName, row.CourseID, groupCode], (err) => {
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
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  app.post('/joingroup', async (req, res) => {
    try {
        const { GroupName, groupCode } = req.body
        
        if (!GroupName || !groupCode) {
            return res.status(400).json({ 
                error: "GroupName and groupCode are required" 
            })
        }

        const memberID = uuidv4()

        // First verify the group exists and get CourseID
        const groupSql = `
            SELECT GroupID, CourseID, groupCode 
            FROM tblCourseGroups 
            WHERE GroupName = ? AND groupCode = ?`

        db.get(groupSql, [GroupName, groupCode], (err, groupRow) => {
            if (err) {
                return res.status(500).json({ error: err.message })
            }
            if (!groupRow) {
                return res.status(404).json({ 
                    error: "Group not found or invalid group code" 
                })
            }

            // Check if user is already in the group
            const checkMemberSql = `
                SELECT COUNT(*) as memberCount 
                FROM tblGroupMembers 
                WHERE GroupID = ? AND UserID = ?`

            db.get(checkMemberSql, [groupRow.GroupID, currentUser], (err, memberRow) => {
                if (err) {
                    return res.status(500).json({ error: err.message })
                }
                if (memberRow.memberCount > 0) {
                    return res.status(409).json({ 
                        error: "User is already a member of this group" 
                    })
                }

                // Check if user needs to be enrolled in the course
                const enrollmentSql = `
                    SELECT COUNT(*) as enrollCount 
                    FROM tblEnrollements 
                    WHERE CourseID = ? AND UserID = ?`

                db.get(enrollmentSql, [groupRow.CourseID, currentUser], (err, enrollRow) => {
                    if (err) {
                        return res.status(500).json({ error: err.message })
                    }

                    // If not enrolled, add enrollment first
                    if (enrollRow.enrollCount === 0) {
                        const enrollID = uuidv4()
                        const addEnrollSql = `
                            INSERT INTO tblEnrollements (EnrollmentID, CourseID, UserID)
                            VALUES (?, ?, ?)`

                        db.run(addEnrollSql, [enrollID, groupRow.CourseID, currentUser], (err) => {
                            if (err) {
                                return res.status(500).json({ error: err.message })
                            }
                            
                            // Now add the group membership
                            const insertSql = `
                                INSERT INTO tblGroupMembers (MemberID, UserID, GroupID) 
                                VALUES (?, ?, ?)`

                            db.run(insertSql, [memberID, currentUser, groupRow.GroupID], (err) => {
                                if (err) {
                                    return res.status(500).json({ error: err.message })
                                }
                                return res.status(201).json({
                                    message: "Successfully joined group and enrolled in course",
                                    memberID: memberID,
                                    enrollmentID: enrollID
                                })
                            })
                        })
                    } else {
                        // Already enrolled, just add group membership
                        const insertSql = `
                            INSERT INTO tblGroupMembers (MemberID, UserID, GroupID) 
                            VALUES (?, ?, ?)`

                        db.run(insertSql, [memberID, currentUser, groupRow.GroupID], (err) => {
                            if (err) {
                                return res.status(500).json({ error: err.message })
                            }
                            return res.status(201).json({
                                message: "Successfully joined group",
                                memberID: memberID
                            })
                        })
                    }
                })
            })
        })
    } catch (err) {
        console.error('Error in joingroup:', err)
        return res.status(500).json({ 
            error: "Internal server error",
            details: err.message 
        })
    }
  })

  app.post('/addSocial', async (req, res) => {
    try {
      const { SocialType, Username, isPrivate } = req.body
      const SocialID = uuidv4()
      const insertSql = `INSERT INTO tblSocials VALUES (?,?,?,?)`
      
      db.run(insertSql, [SocialID, SocialType, Username, currentUser], (err) => {
        if (err) {
          res.status(400).json({ error: err.message })
          return
        }
        res.status(201).json({
          SocialID: SocialID,
          message: "Social added successfully"
        })
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  app.post('/addComment', async (req, res) => {
    try {
      const { GroupName, Comment, isPrivate } = req.body
      const CommentID = uuidv4()
      const currentTime = new Date().toISOString()

      const CommentSQL = `INSERT INTO tblComments Values (?,?,?,?,?,?)`
      const GroupSQL = `SELECT GroupID FROM tblCourseGroups WHERE GroupName = ?`
      const MemberSQL = `SELECT GroupID FROM tblGroupMembers WHERE UserID = ?`

      db.get(GroupSQL, [GroupName], (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message })
          return
        }
        if(!row) {
          res.status(400).json({ error: "Group not found" })
          return
        }
        db.get(MemberSQL, [currentUser], (err, row) => {
          if (err) {
            res.status(400).json({ error: err.message })
            return
          }
          if(!row) {
            res.status(400).json({ error: "User not found" })
            return
          }
          if(isPrivate == 'Public'){
            db.run(CommentSQL, [CommentID, row.GroupID, currentUser, Comment, currentTime, 0], (err) => {
              if (err) {
                res.status(400).json({ error: err.message })
                return
              }
              res.status(201).json({
                CommentID: CommentID,
                message: "Comment added successfully"
              })
            })
          } else {
            db.run(CommentSQL, [CommentID, row.GroupID, currentUser, Comment, currentTime, 1], (err) => {
              if (err) {
                res.status(400).json({ error: err.message })
                return
              }
              res.status(201).json({
                CommentID: CommentID,
                message: "Comment added successfully"
              })
            })
          }
        })
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

  app.post('/UserInfo', async (req, res) => {
    try {
      const { UserEmail } = req.body
      const userSQL = `SELECT * FROM tblUsers WHERE Email = ?`
      
      db.get(userSQL, [UserEmail], (err, row) => {
        try {
          if (err) {
            return res.status(400).json({ error: err.message })
          }
          if (!row) {
            return res.status(404).json({ error: "User not found" })
          }

          // Get social info after finding the user
          const SocialSQL = `SELECT * FROM tblSocials WHERE UserID = ?`
          
          db.get(SocialSQL, [row.UserID], (err, social) => {
            try {
              // Prepare the response object with user data
              const responseData = {
                UserID: row.UserID,
                FirstName: row.Fname,
                LastName: row.Lname,
                UserEmail: row.Email,
                LastLogDateTime: row.LastLogDateTime,
                message: "User found successfully"
              }

              // Add social data if available
              if (social) {
                responseData.social = {
                  SocialType: social.SocialType,
                  Username: social.Username
                }
                responseData.message += " with social info"
              }

              // Send a single response with all data
              return res.status(200).json(responseData)
            } catch (err) {
              return res.status(500).json({ error: "Error processing social data", details: err.message })
            }
          })
        } catch (err) {
          return res.status(500).json({ error: "Error processing user data", details: err.message })
        }
      })
    } catch (err) {
      return res.status(500).json({ error: "Internal server error", details: err.message })
    }
  })

  app.get('/groups', (req, res) => {
    console.log('Groups endpoint called');
    console.log('Current user:', currentUser);
    
    // Check if currentUser is defined
    if (!currentUser) {
      return res.status(400).json({ error: "User not authenticated" });
    }
  
    const sqlGroups = `SELECT DISTINCT GroupID, GroupName, CourseName, CourseNumber, CourseSection, CourseTerm, StartDate, EndDate 
                      FROM tblGroupMembers 
                      LEFT JOIN tblCourseGroups ON tblGroupMembers.GroupID = tblCourseGroups.GroupID 
                      LEFT JOIN tblCourses ON tblCourseGroups.CourseID = tblCourses.CourseID
                      WHERE UserID = ?`
    
    console.log('Executing SQL:', sqlGroups);
    console.log('With parameter:', currentUser);
    
    // Use db.all to get multiple rows
    db.all(sqlGroups, [currentUser], (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(400).json({ error: err.message });
      }
      
      console.log('Query results:', rows);
      
      // Check if any groups were found
      if (!rows || rows.length === 0) {
        return res.status(200).json({ 
          message: "No groups found for this user",
          groups: []
        });
      }
      
      const response = {
        message: "Groups retrieved successfully",
        count: rows.length,
        groups: rows
      };
      
      console.log('Sending response:', response);
      return res.status(200).json(response);
    });
  });
  
  app.get('/members', (req,res) => {
    const membersSQL = `SELECT * FROM tblGroupMembers
                        left join tblCourseGroups on tblGroupMembers.GroupID = tblCourseGroups.GroupID WHERE UserID = ?`
    db.all(membersSQL, [currentUser], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message })
      }
      if (!rows) {
        return res.status(404).json({ error: "No members found" })
      }
      return res.status(200).json({
        message: "Members retrieved successfully",
        count: rows.length,
        members: rows
      })
    })
  })

  app.get('/comments', (req, res) => {
    const commentsSQL = `SELECT * FROM tblComments
                        left join tblGroupMembers on tblComments.GroupID = tblGroupMembers.GroupID WHERE UserID = ?`
    db.all(commentsSQL, [currentUser], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message })
      }
      if (!rows) {
        return res.status(404).json({ error: "No comments found" })
      }
      return res.status(200).json({
        message: "Comments retrieved successfully",
        count: rows.length,
        comments: rows
      })
    })
  })

  app.patch('/updateUser', (req, res) => {
    const { Fname, Lname, Email, Password } = req.body
    const CryptPass = bcrypt.hashSync(Password, intSalt)
    const updateSQL = `UPDATE tblUsers SET Fname = ?, Lname = ?, Email = ?, Password = ? WHERE UserID = ?`
    db.run(updateSQL, [Fname, Lname, Email, CryptPass, currentUser], (err) => {
      if (err) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(200).json({
        message: "User updated successfully"
      })
    })
  })

  app.patch('/updateSocial', (req, res) => {
    const { SocialType, Username } = req.body
    const updateSQL = `UPDATE tblSocials SET SocialType = ?, Username = ? WHERE UserID = ?`
    db.run(updateSQL, [SocialType, Username, currentUser], (err) => {
      if (err) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(200).json({
        message: "Social updated successfully"
      })
    })
  })

  app.listen(HTTP_PORT, () => {
      console.log(`Server running on port ${HTTP_PORT}`)
  })
