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

    /*

    Login and registration endpoints

    */

  app.post('/registration', async (req, res) => {
    try {
        // Get request data
        const { firstName, lastName, email, password, isFaculty } = req.body
        const UserID = uuidv4()
        const currentTime = new Date().toISOString()
        
        // Check if email already exists
        const checkEmailSql = `SELECT COUNT(*) as count FROM tblUsers WHERE Email = ?`
        
        db.get(checkEmailSql, [email], async (err, row) => {
            if (err) {
                res.status(400).json({ error: err.message })
                return
            }
            
            if (row.count > 0) {
                res.status(409).json({ error: "Email already registered" })
                return
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, intSalt)
            const InsertSql = `INSERT INTO tblUsers (UserID, fName, lName, Email, Password, CreationDateTime, LastLogDateTime, isFaculty) 
                        VALUES (?,?,?,?,?,?,?,?)`

            if(isFaculty == 'Student'){
                db.run(InsertSql, [UserID, firstName, lastName, email, hashedPassword, currentTime, null, 0], (err) => {
                    if (err) {
                        res.status(400).json({ error: err.message })
                        return
                    }
                    res.status(201).json({
                        UserID: UserID,
                        message: "Registration successful"
                    })
                })
            } else {
                db.run(InsertSql, [UserID, firstName, lastName, email, hashedPassword, currentTime, null, 1], (err) => {
                    if (err) {
                        res.status(400).json({ error: err.message })
                        return
                    }
                    res.status(201).json({
                        UserID: UserID,
                        message: "Registration Successful"
                    })
                })
            }
        })
    }
    catch (err) {
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

    /*

    Login and registration endpoint

    */

//====================================================================================

    /*

    Group and course endpoints

    */

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

  app.get('/courses', (req, res) => {
  const coursesSQL = `SELECT DISTINCT * 
                      FROM tblCourses
                      LEFT JOIN tblEnrollements ON tblCourses.CourseID = tblEnrollements.CourseID 
                      WHERE UserID = ?`

  db.all(coursesSQL, [currentUser], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message })
    }
    
    if (!rows || rows.length === 0) {
      return res.status(200).json({
        message: "No courses found for this user",
        courses: []
      })
    }

    return res.status(200).json({
      message: "Courses retrieved successfully", 
      count: rows.length,
      courses: rows
    })
  })
})

app.patch('/updatecourse', async (req, res) => {
    try {
      const { CourseName, CourseNumber, CourseSection, CourseTerm, StartDate, EndDate, CourseID} = req.body
      const comUpdate = `UPDATE tblCourses
      SET CourseName = ?, CourseNumber = ?, CourseSection = ?, CourseTerm = ?, StartDate = ?, EndDate = ?
      WHERE CourseID = ?`

      db.run(comUpdate, [CourseName, CourseNumber, CourseSection, CourseTerm, StartDate, EndDate, CourseID], (err) => {
        if (err) {
          res.status(400).json({ error: err.message })
          return
        }
        res.status(201).json({
          CourseID: CourseID,
          message: "Course updated successfully"
        })
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

app.delete('/deleteCourse', async (req, res) => {
    try {
      const { CourseID } = req.body
      const comDelete = `DELETE FROM tblCourses WHERE CourseID = ?`

      db.run(comDelete, [CourseID], (err) => {
        if (err) {
          res.status(400).json({ error: err.message })
          return
        }
        res.status(201).json({
          CourseID: CourseID,
          message: "Course deleted successfully"
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

  app.delete('/deleteGroup', (req,res) => {
    const { GroupName, CourseName, CourseNumber, CourseSection } = req.body
    
    // Get GroupID from course details
    const getGroupSQL = `SELECT GroupID FROM tblCourseGroups 
                        LEFT JOIN tblCourses ON tblCourseGroups.CourseID = tblCourses.CourseID
                        WHERE GroupName = ? AND CourseName = ? AND CourseNumber = ? AND CourseSection = ?`
    db.get(getGroupSQL, [GroupName, CourseName, CourseNumber, CourseSection], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message })
        }
        if (!row) {
            return res.status(404).json({ error: "Group not found" })
        }

        // Delete group members first
        const deleteMembersSQL = `DELETE FROM tblGroupMembers WHERE GroupID = ?`
        db.run(deleteMembersSQL, [row.GroupID], (err) => {
            if (err) {
                return res.status(400).json({ error: err.message })
            }

            // Then delete the group
            const deleteGroupSQL = `DELETE FROM tblCourseGroups WHERE GroupID = ?`
            db.run(deleteGroupSQL, [row.GroupID], (err) => {
                if (err) {
                    return res.status(400).json({ error: err.message })
                }
                return res.status(200).json({
                    GroupID: row.GroupID,
                    message: "Group and members deleted successfully"
                })
            })
        })
    })
})

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

    /*

    Group and course endpoints

    */

//====================================================================================

    /*

    Socials and comments endpoints

    */


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

  app.get('/socials', (req, res) => {
    const socialsSQL = `SELECT * FROM tblSocials WHERE UserID = ?`
    db.all(socialsSQL, [currentUser], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message })
      }
      if (!rows) {
        return res.status(404).json({ error: "No socials found" })
      }
      return res.status(200).json({
        message: "Socials retrieved successfully",
        count: rows.length,
        socials: rows
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

  app.patch('/updateComment', (req,res) => {
    const { OGComment, NewComment, isPrivate } = req.body
    const currentTime = new Date().toISOString()
    const updateSQL = `UPDATE tblComments SET Comment = ?, subittedDateTime = ?, private = ? WHERE GroupMemberID = ? AND Comment = ?`
    
    db.run(updateSQL, [NewComment, currentTime, isPrivate, currentUser, OGComment], (err) => {
      if (err) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(200).json({
        message: "Comment updated successfully"
      })
    })
})
    /*

    Socials and comments endpoints


    */

//====================================================================================

    /*

    User Management endpoints

    */

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

  app.get('/getUserRole', async (req, res) => {
    try {
      // In a real implementation, you would get the current user from the session
      // For now, we're using the currentUser variable
      const sql = `SELECT isFaculty FROM tblUsers WHERE UserID = ?`;
      
      db.get(sql, [currentUser], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!row) {
          return res.status(404).json({ error: "User not found" });
        }
        
        // Return the user role based on the isFaculty boolean
        const userRole = row.isFaculty ? 'Staff' : 'Student';
        return res.status(200).json({ 
          userRole: userRole
        });
      });
    } catch (err) {
      console.error('Error getting user role:', err);
      return res.status(500).json({ 
        error: "Internal server error",
        details: err.message 
      });
    }
  });
  

    /*

    User Management endpoints

    */

//====================================================================================

    /*

    Assessment Related Endpoint

    */

app.post("/AddAssessment", (req, res) => {
  const { CourseName, CourseNumber, CourseSection, StartDate, EndDate, Name } = req.body
  const AssessmentID = uuidv4()

  const Assessmentsql = `INSERT INTO tblAssessments VALUES (?,?,?,?,?)`
  const CourseIDsql = `SELECT CourseID FROM tblCourses WHERE CourseName = ? AND CourseNumber = ? AND CourseSection = ?`

  db.all(CourseIDsql, [CourseName, CourseNumber, CourseSection], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message })
    }
    if (!rows) {
      return res.status(404).json({ error: "Course not found" })
    }
    db.run(Assessmentsql, [AssessmentID, rows[0].CourseID, StartDate, EndDate, Name], (err) => {
      if (err) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(201).json({
        AssessmentID: AssessmentID,
        message: "Assessment added successfully"
      })
    })
  })
})

app.post('/addAssessmentQuestion', (req,res) => {
  const { AssessmentName, QType, Options, Narrative, QNumber } = req.body
  const QuestionID = uuidv4()

  const Questionsql = `INSERT INTO tblAssessmentQuestions VALUES (?,?,?,?,?,?)`
  const AssessmentIDsql = `SELECT AssessmentID FROM tblAssessments WHERE Name = ? AND owner = ?`

  db.all(AssessmentIDsql, [AssessmentName, currentUser], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message })
    }
    if (!rows) {
      return res.status(404).json({ error: "Assessment not found" })
    }
    const AssessmentID = rows[0].AssessmentID

    db.run(Questionsql, [QuestionID, AssessmentID, QType, Options, Narrative, QNumber], (err) => {
      if (err) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(201).json({
        QuestionID: QuestionID,
        message: "Question added successfully"
      })
    })
  })
  })

  app.post('/addAssessmentResponse', (req, res) => {
    const { AssessmentName, QNumber, Response } = req.body
    const ResponseID = uuidv4()

    const Responsesql = `INSERT INTO tblAssessmentResponses VALUES (?, ?, ?, ?)`
    const QuestionIDsql = `SELECT QuestionID FROM tblAssessmentQuestions WHERE AssessmentID = 
                          (SELECT AssessmentID FROM tblAssessments WHERE Name = ? and owner = ?)
                          AND QuestionNumber = ?`
    db.all(QuestionIDsql, [AssessmentName, currentUser, QNumber], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message })
      }
      if (!rows) {
        return res.status(404).json({ error: "Question not found" })
      }
      const QuestionID = rows[0].QuestionID

      db.run(Responsesql, [ResponseID, QuestionID, Response, currentUser], (err) => {
        if (err) {
          return res.status(400).json({ error: err.message })
        }
        return res.status(201).json({
          ResponseID: ResponseID,
          message: "Response added successfully"
        })
      })
    })
  })

    /*

    Assessment Related Endpoint

    */



  app.listen(HTTP_PORT, () => {
      console.log(`Server running on port ${HTTP_PORT}`)
  })