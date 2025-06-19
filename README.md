# LSS ReGrade

A modern, responsive web app for displaying student grade data exported from the Letran School System Portal, with animated transitions and custom dropdown selectors.

## Features
- **Responsive UI:** Fully adapts to desktop and mobile, with smooth animated transitions for table changes and container resizing.
- **Custom Dropdowns:** Toggle between years, semesters, and grading periods using accessible, animated dropdowns.
- **Student Info:** Displays student name, ID, and course in a stylized, copyable format with instant feedback.
- **Animated Table:** Grade table fades and resizes smoothly when switching data or showing empty states.
- **Mobile Friendly:** Touch-friendly controls, horizontal table scrolling, and full-viewport layout on small screens.
- **Data Driven:** Loads all grade and student data from an external `grades.json` file exported from the Letran School System Portal.

## How to Export Grades from Letran School System Portal
1. Open the Letran School System Portal in your browser and log in.
2. Select the desired year and semester.
3. Open your browser's Developer Tools (usually F12 or right-click → Inspect).
4. Go to the **Network** tab.
5. Select the grading period in the LSS Portal.
6. Look for a request named **GetStudentGrades** in the network list.
7. Click it, go to the **Preview** tab, expand the object, and find the key `d`.
8. Right-click the value of `d` and copy it as a string (JSON literal).
9. Paste this value into your `grades.json` file, or merge it with your existing data as needed.

## grades.json Format Example
```json
{
  "id": "2004111",
  "firstname": "Jane",
  "middlename": "Rat",
  "lastname": "Doe",
  "course": "Bachelor of Science in Course",
  "grades": {
    "1st": {
      "1": {
        "prelim": "<table>...</table>",
        "midterm": "<table>...</table>"
      },
      "2": {
        "prelim": "<table>...</table>"
      }
    },
    "2nd": { ... },
    "3rd": { ... },
    "4th": { ... }
  }
}
```
- Table HTML should be copied from the Letran School System Portal. All inline styles/classes will be stripped for a consistent, clean appearance.

## Customization
- Edit `style.css` for color, font, or layout changes.
- Adjust dropdown options in `main.js` if your school uses different year/semester/period names.

## Accessibility
- Dropdowns are keyboard accessible.
- Copy buttons provide instant feedback.

## About
This tool helps make your Letran School System Portal grade exports look neat, modern, and easy to use for printing or sharing.