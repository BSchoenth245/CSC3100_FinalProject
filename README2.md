# 📋 Quick Glance Summary

- Merge Brock/Mitchell's and John/Emerson's project features into one final system.
- Use Brock/Mitchell’s login system; preserve John/Emerson’s student dashboard.
- Combine surveys, comments, group creation, and instructor management features.
- Fix mobile issues: overlapping tabs, enable horizontal scrolling.
- Final tasks divided among Brock (database), Emerson (backend), John (frontend cards), Mitchell (CSS styling).

# Class Group and Review System  
_Final Iteration: Merging Brock/Mitchell's Team and John/Emerson's Team_

---

## Overview

This iteration combines two existing project bases into a single, cohesive system.  
The goal is to integrate functionality from both teams, resolve known issues, and deliver a polished, mobile-friendly final product.

---

## Project Integration Plan

### Authentication and User Role Management

- Implement the **login and registration system** from Brock and Mitchell’s team.
- Remove the manual selection of **student** or **professor** during registration.
- User roles will now be determined automatically through the registration system.

---

### Dashboard and Core Functionality

- **Student Dashboard** from John and Emerson’s team will be preserved and enhanced.
- **Surveys and Comments** functionality will be merged into the student dashboard:
  - Allow surveys to be filled out by group members.
  - Allow comments to be added and properly displayed within group tabs or cards.
  - Comments and surveys will either pop up in cards or have a dedicated tab for organization.

---

### Group Creation and Management

- Add functionality for an **Instructor / Course Owner** to act as a **Group Owner**.
- **Create Group Form** will include:
  - **Group Name** field (user input).
  - **Course Name** field (read-only, or pre-filled if needed).
  - **Generate Code** button (auto-generates a unique group code).
  - **Create Group** button (creates the group and associates it with the instructor).
- Students will **join groups** using the generated group code.
- Groups will **automatically populate** on the dashboard once created or joined.

---

### Frontend Improvements

- Replace or enhance group displays with **interactive cards**:
  - Each card will represent a group.
  - Cards will include **arrows** or visual indicators pointing to related groups or actions.

---

### Responsiveness and Mobile Support

- Fix **overlapping tabs** on smaller screens.
- Enable **horizontal scrolling** or responsive layouts to allow full dashboard access on mobile devices.
- General **CSS and styling improvements** to make the site visually appealing and mobile-friendly.

---

## Responsibilities by Team Member

| Team Member | Task |
| :--- | :--- |
| **Brock** | Database development and updates to support new features (group codes, ownership, surveys, comments). |
| **Emerson** | Backend API development and integration (group creation, survey submission, comment management). |
| **John** | Frontend development, focusing on dynamic HTML card generation for groups and survey displays. |
| **Mitchell** | CSS styling and responsive design improvements (fixing overlaps, ensuring mobile friendliness). |

---

## Known Issues to Address

- Overlapping tabs on small screen devices.
- Inability to scroll or view full dashboard on mobile.
- Separation of comments and surveys — needs unified, organized display.
- Lack of distinction between instructors and students when creating or managing groups.

---

# 🚀  
**Final Step:** Combine, fix, polish — and deliver a seamless experience for students and instructors!

---


