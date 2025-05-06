
// Everything added Monday May 5th for the survey

function getSurveyQuestions(groupId = '', groupName = '') {
    fetch('../survey.html')
        .then(response => response.text())
        .then(html => {
            const modalContainer = document.createElement('div');
            modalContainer.className = 'survey-modal';
            modalContainer.innerHTML = `
                <div class="survey-modal-content">
                    <div class="survey-modal-header">
                        <h2>Survey for ${groupName}</h2>
                        <button class="survey-modal-close">&times;</button>
                    </div>
                    <div class="survey-modal-body">
                        ${html}
                    </div>
                </div>
            `;
            document.body.appendChild(modalContainer);

            // Populate group member dropdown (you can later replace with real data)
            const select = modalContainer.querySelector('#selGroupMemberSurvey');
            let strOptions = '<option disabled selected hidden>Select a group member</option>';
            mockGroupMembers.forEach(m => {
                strOptions += `<option value="${m.name}">${m.name}</option>`;
            });
            if (select) select.innerHTML = strOptions;

            // Fetch survey questions from backend
            fetch(`http://localhost:8000/getAssessmentQuestions?groupId=${groupId}`)
                .then(res => res.json())
                .then(questions => {
                    const container = modalContainer.querySelector('#dynamicSurveyQuestions');
                    if (!container) return;
                    container.innerHTML = '';

                    questions.forEach((q, index) => {
                        const id = `question_${index}`;
                        const label = `<label class="form-label">${q.QuestionNumber}. ${q.QuestionNarrative}</label>`;
                        let html = `<div class="mb-3">${label}`;

                        if (q.QuestionType === '1' || q.QuestionType === 1) {
                            // Likert scale
                            html += `
                                <input type="range" class="form-range" min="1" max="10" value="5" id="${id}">
                                <div class="d-flex justify-content-between">
                                    <small>1 - Poor</small><small>10 - Excellent</small>
                                </div>
                            `;
                        } else {
                            // Open response
                            html += `<textarea class="form-control" id="${id}" rows="3" placeholder="Your response..."></textarea>`;
                        }

                        html += `</div>`;
                        container.insertAdjacentHTML('beforeend', html);
                    });
                })
                .catch(err => {
                    console.error('[Survey] Failed to load questions:', err);
                    const container = modalContainer.querySelector('#dynamicSurveyQuestions');
                    if (container) {
                        container.innerHTML = `<p class="text-danger">Failed to load survey questions.</p>`;
                    }
                });

            // Close modal
            modalContainer.querySelector('.survey-modal-close')?.addEventListener('click', () => {
                modalContainer.remove();
            });

            modalContainer.querySelector('#btnBackToDashboardSurvey')?.addEventListener('click', () => {
                modalContainer.remove();
            });

            setTimeout(() => modalContainer.classList.add('active'), 10);
        })
        .catch(error => console.error('[Survey] Error loading survey.html:', error));
}

document.getElementById('btnAddSurveyQuestion').addEventListener('click', () => {
    const QuestionText = document.getElementById('txtSurveyQuestion').value.trim();
    const QuestionType = document.getElementById('questionTypeValue').value;
    const AssessmentId = document.getElementById('selSurveyAssessment').value;

    let blnError = false;
    let strMessage = '';

    if (!questionText) {
        blnError = true;
        strMessage += '<p>Question text cannot be blank.</p>';
    }

    if (!assessmentId) {
        blnError = true;
        strMessage += '<p>Please select an assessment.</p>';
    }

    if (blnError) {
        Swal.fire({
            title: 'Oops!',
            html: strMessage,
            icon: 'error'
        });
        return;
    }

    fetch('http://localhost:8000/addAssessmentQuestion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            AssessmentId,
            QuestionText,
            QuestionType
        })
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to add question');
        return res.json();
    })
    .then(data => {
        Swal.fire({
            title: 'Success!',
            text: 'Survey question added.',
            icon: 'success'
        });

        // Refresh preview list
        loadInstructorSurveyQuestions(AssessmentId);

        // Reset form
        document.getElementById('txtSurveyQuestion').value = '';
        document.getElementById('questionTypeValue').value = 'open';
        document.getElementById('questionTypeToggle').checked = true;

        // Optional: reset toggle styles if you have active-option classes
        document.getElementById('openResponseLabel').classList.add('active-option');
        document.getElementById('likertScaleLabel').classList.remove('active-option');
    })
    .catch(err => {
        console.error('[Instructor] Failed to add question:', err);
        Swal.fire({
            title: 'Error',
            text: 'There was a problem saving your question.',
            icon: 'error'
        });
    });
});


function loadInstructorSurveyQuestions(AssessmentId) {
    fetch(`http://localhost:8000/getAssessmentQuestions?AssessmentId=${AssessmentId}`)
        .then(res => res.json())
        .then(questions => {
            const container = document.getElementById('surveyQuestionPreviewList');
            container.innerHTML = ''; // Clear any existing previews

            if (!questions.length) {
                container.innerHTML = '<p class="text-muted">No questions created yet.</p>';
                return;
            }

            questions.forEach((q) => {
                const questionHTML = `
                    <div class="card mb-2 p-3">
                        <strong>Q${q.QuestionNumber}:</strong> ${q.QuestionNarrative}<br>
                        <span class="badge bg-secondary">
                            ${q.QuestionType === 'scale' || q.QuestionType === '1' ? 'Likert Scale' : 'Open Response'}
                        </span>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', questionHTML);
            });
        })
        .catch(err => {
            console.error('[Instructor] Failed to load questions:', err);
            document.getElementById('surveyQuestionPreviewList').innerHTML = '<p class="text-danger">Failed to load questions.</p>';
        });
}



// function getSurveyQuestions(groupName = '') {
//     fetch('./survey.html')
//     .then(response => response.text())
//     .then(data => {
//         // Create a modal container for the survey
//         const modalContainer = document.createElement('div');
//         modalContainer.className = 'survey-modal';
//         modalContainer.innerHTML = `
//             <div class="survey-modal-content">
//                 <div class="survey-modal-header">
//                     <h2>Survey for ${groupName}</h2>
//                     <button class="survey-modal-close">&times;</button>
//                 </div>
//                 <div class="survey-modal-body">
//                     ${data}
//                 </div>
//             </div>
//         `;
        
//         // Add the modal to the body
//         document.body.appendChild(modalContainer);
        
//         // Populate the group member dropdown
//         let strHTML = '<option disabled selected hidden>Select a group member</option>';
//         mockGroupMembers.forEach(member => {
//             strHTML += `<option value="${member.name}" aria-label="${member.name}">${member.name}</option>`;
//         });
        
//         // Find and populate the select element within the modal
//         const selectElement = modalContainer.querySelector('#selGroupMemberSurvey');
//         if (selectElement) {
//             selectElement.innerHTML = strHTML;
//         }
        
//         // Add event listener to close button
//         const closeButton = modalContainer.querySelector('.survey-modal-close');
//         if (closeButton) {
//             closeButton.addEventListener('click', () => {
//                 document.body.removeChild(modalContainer);
//             });
//         }
        
//         // Add event listener to the back button if it exists in the survey
//         const backButton = modalContainer.querySelector('#btnBackToDashboardSurvey');
//         if (backButton) {
//             backButton.addEventListener('click', () => {
//                 document.body.removeChild(modalContainer);
//             });
//         }
        
//         // Show the modal with animation
//         setTimeout(() => {
//             modalContainer.classList.add('active');
//         }, 10);
//     })
//     .catch(error => console.error('Error loading survey questions:', error));
// }

// document.querySelector('#btnSubmitFeedback').addEventListener('click', function () {
//     const group = document.querySelector('#selGroup').value;
//     const feedback = document.querySelector('#txtFeedback').value.trim();
//     const visibility = document.querySelector('#commentVisibilityValue').value;

//     let blnError = false;
//     let strMessage = "";

//     if (!feedback) {
//         blnError = true;
//         strMessage += "<p>Feedback cannot be empty.</p>";
//     }

//     if (blnError) {
//         Swal.fire({
//             title: "Error",
//             html: strMessage,
//             icon: "error"
//         });
//         return;
//     }

//     // Get current date and time
//     const now = new Date();
//     const formattedDate = now.toLocaleString("en-US", {
//         dateStyle: "long",
//         timeStyle: "short"
//     });

//     // Create comment element
//     const commentHTML = `
//         <div class="comment-card sent-comment">
//             <div class="comment-header">
//                 <div class="comment-sender">Brock The Rock</div>
//                 <div class="comment-timestamp">${formattedDate}</div>
//             </div>
//             <div class="comment-group">To: ${group || 'All Groups'}</div>
//             <div class="comment-text">${feedback}</div>
//         </div>
//     `;

//     // Remove empty state message if it exists
//     const emptyMessage = document.querySelector('#sentComments .empty-comments');
//     if (emptyMessage) {
//         emptyMessage.remove();
//     }

//     // Insert comment into Sent Comments column
//     document.querySelector('#sentComments').insertAdjacentHTML('afterbegin', commentHTML);

//     // Clear form
//     document.querySelector('#selGroup').value = '';
//     document.querySelector('#txtFeedback').value = '';
//     document.querySelector('#commentVisibilityToggle').checked = true;
//     document.querySelector('#commentVisibilityValue').value = 'public';

//     Swal.fire({
//         title: "Success!",
//         text: "Your feedback has been added.",
//         icon: "success"
//     });
// });

document.addEventListener('DOMContentLoaded', function () {
    const questionTypeToggle = document.getElementById('questionTypeToggle');
    const questionTypeValue = document.getElementById('questionTypeValue');
    const openResponseLabel = document.getElementById('openResponseLabel');
    const likertScaleLabel = document.getElementById('likertScaleLabel');

    if (questionTypeToggle && questionTypeValue) {
        // Default state: Likert scale is selected if toggle is checked
        questionTypeValue.value = questionTypeToggle.checked ? 'scale' : 'open';

        if (questionTypeToggle.checked) {
            likertScaleLabel.classList.add('active-option');
            openResponseLabel.classList.remove('active-option');
        } else {
            openResponseLabel.classList.add('active-option');
            likertScaleLabel.classList.remove('active-option');
        }

        questionTypeToggle.addEventListener('change', function () {
            const isScale = this.checked;

            // Update the hidden input's value
            questionTypeValue.value = isScale ? 'scale' : 'open';

            // Update the UI labels
            if (isScale) {
                likertScaleLabel.classList.add('active-option');
                openResponseLabel.classList.remove('active-option');
            } else {
                openResponseLabel.classList.add('active-option');
                likertScaleLabel.classList.remove('active-option');
            }
        });
    }
});


// Add functionality to the Create Survey button
document.addEventListener('DOMContentLoaded', function() {
    const createSurveyBtn = document.getElementById('btnCreateSurvey');
    const courseSelectionSection = document.getElementById('courseSelectionSection');
    const surveyBuilderSection = document.getElementById('surveyBuilderSection');
    const surveyQuestionPreview = document.getElementById('surveyQuestionPreview');
    
    if (createSurveyBtn && courseSelectionSection && surveyBuilderSection) {
        createSurveyBtn.addEventListener('click', function() {
            const selectedCourse = document.getElementById('selCourse').value;
            
            if (!selectedCourse) {
                // Show error if no course is selected
                Swal.fire({
                    title: "Error",
                    text: "Please select a course first.",
                    icon: "error"
                });
                return;
            }
            
            // Hide course selection and show survey builder
            courseSelectionSection.style.display = 'none';
            surveyBuilderSection.style.display = 'block';
            surveyQuestionPreview.style.display = 'block';
            
            // Check if course header already exists to avoid duplicates
            if (!document.querySelector('.course-header')) {
                // Create a small header with course info and back button
                const courseTitle = document.createElement('div');
                courseTitle.className = 'course-header';
                courseTitle.innerHTML = `
                    <h3>Course: ${document.getElementById('selCourse').options[document.getElementById('selCourse').selectedIndex].text}</h3>
                    <button type="button" id="btnBackToCourses" class="btn-back">Back</button>
                `;
                
                // Insert at the top of the survey builder section
                surveyBuilderSection.insertBefore(courseTitle, surveyBuilderSection.firstChild);
                
                // Add event listener to the back button
                document.getElementById('btnBackToCourses').addEventListener('click', function() {
                    // Remove the course title element
                    courseTitle.remove();
                    
                    // Show course selection and hide survey builder
                    courseSelectionSection.style.display = 'block';
                    surveyBuilderSection.style.display = 'none';
                    surveyQuestionPreview.style.display = 'none';
                });
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const createSurveyBtn = document.getElementById('btnCreateSurvey');
    const courseDropdown = document.getElementById('selSurveyCourse');

    if (createSurveyBtn && courseDropdown) {
        createSurveyBtn.addEventListener('click', async () => {
            const selectedOption = courseDropdown.options[courseDropdown.selectedIndex];
            const courseId = selectedOption.value;
            const courseName = selectedOption.text;

            if (!courseId) {
                Swal.fire({
                    title: 'Missing Course',
                    text: 'Please select a course before creating a survey.',
                    icon: 'error'
                });
                return;
            }

            // Build request payload
            const payload = {
                CourseID: courseId,
                StartDate: new Date().toISOString(),  // or get from course info if required
                EndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // temporary 1-month end date
                Name: courseName,
                Owner: currentUser  // must be declared globally or retrieved from session
            };

            try {
                const res = await fetch('http://localhost:8000/AddAssessment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) throw new Error('Failed to create survey');

                const data = await res.json();

                Swal.fire({
                    title: 'Survey Created!',
                    text: `Survey for "${courseName}" has been initialized.`,
                    icon: 'success'
                });

                // Optionally: store the returned AssessmentID somewhere (e.g., global var)
                console.log('New Assessment Created:', data);

                // Now populate groups for this course
                loadGroupsForCourse(courseId);

            } catch (err) {
                console.error('[Survey] Failed to create assessment:', err);
                Swal.fire({
                    title: 'Error',
                    text: 'There was a problem creating the survey.',
                    icon: 'error'
                });
            }
        });
    }
});

function loadGroupsForCourse(courseId) {
    fetch(`http://localhost:8000/groups?courseId=${courseId}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(groups => {
            const groupSelect = document.getElementById('selSurveyGroup');
            if (!groupSelect) return;

            groupSelect.innerHTML = '<option disabled selected hidden>Select a group</option>';

            if (groups.length === 0) {
                groupSelect.innerHTML += `<option disabled>No groups found for this course</option>`;
                return;
            }

            groups.forEach(group => {
                groupSelect.innerHTML += `
                    <option value="${group.GroupID}">
                        ${group.GroupName}
                    </option>`;
            });
        })
        .catch(err => {
            console.error('[Survey] Failed to load groups for course:', err);
            Swal.fire({
                title: 'Error',
                text: 'Unable to load groups for this course.',
                icon: 'error'
            });
        });
}

