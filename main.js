let gradeData = null;
let studentInfo = {};
const gradeTableDiv = document.getElementById('grade-table');
const studentInfoDiv = document.getElementById('student-info');
// Custom dropdown data
const dropdowns = [
    {
        id: 'year',
        label: 'Year',
        options: [
            { value: '1st', label: '1st Year' },
            { value: '2nd', label: '2nd Year' },
            { value: '3rd', label: '3rd Year' },
            { value: '4th', label: '4th Year' }
        ],
        default: '1st'
    },
    {
        id: 'sem',
        label: 'Semester',
        options: [
            { value: '1', label: '1st Semester' },
            { value: '2', label: '2nd Semester' }
        ],
        default: '1'
    },
    {
        id: 'period',
        label: 'Grading Period',
        options: [
            { value: 'prelim', label: 'Preliminary' },
            { value: 'midterm', label: 'Midterm' },
            { value: 'prefinal', label: 'Pre-final' },
            { value: 'final', label: 'Final' }
        ],
        default: 'prelim'
    }
];

function cleanTableHtml(html) {
    // Remove all style and class attributes from HTML string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    function removeAttrs(node) {
        if (node.nodeType === 1) {
            node.removeAttribute('style');
            node.removeAttribute('class');
            for (let i = 0; i < node.children.length; i++) {
                removeAttrs(node.children[i]);
            }
        }
    }
    Array.from(tempDiv.children).forEach(removeAttrs);
    return tempDiv.innerHTML;
}
function renderStudentInfo() {
    if (!studentInfo.firstname) {
        studentInfoDiv.innerHTML = '';
        return;
    }
    const middleInitial = studentInfo.middlename ? studentInfo.middlename.charAt(0) + '.' : '';
    const fullName = `${studentInfo.firstname} ${middleInitial} ${studentInfo.lastname}`.replace(/  +/g, ' ');
    const infoRows = [
        { key: 'Name', value: fullName, id: 'name' },
        { key: 'Student ID', value: studentInfo.id, id: 'id' },
        { key: 'Course', value: studentInfo.course, id: 'course' }
    ];
    studentInfoDiv.innerHTML = infoRows.map(row => `
        <div class="student-info-row">
            <div class="student-info-key">${row.key}</div>
            <div class="student-info-value" id="student-info-value-${row.id}">
                <span>${row.value}</span>
                <button class="student-info-copy-btn" title="Copy" onclick="copyStudentInfo('${row.id}')">
                    <svg viewBox='0 0 20 20'><rect x='6' y='6' width='9' height='12' rx='2' fill='none' stroke='currentColor' stroke-width='1.5'/><rect x='3' y='2' width='9' height='12' rx='2' fill='none' stroke='currentColor' stroke-width='1.5'/></svg>
                </button>
            </div>
        </div>
    `).join('');
}
window.copyStudentInfo = function (id) {
    const el = document.getElementById('student-info-value-' + id);
    if (!el) return;
    const text = el.textContent;
    navigator.clipboard.writeText(text).then(() => {
        el.parentElement.querySelector('.student-info-copy-btn').classList.add('copied');
        setTimeout(() => {
            el.parentElement.querySelector('.student-info-copy-btn').classList.remove('copied');
        }, 900);
    });
}
function renderTable() {
    if (!gradeData) {
        gradeTableDiv.classList.remove('visible');
        gradeTableDiv.style.height = '0px';
        gradeTableDiv.innerHTML = '<div style="padding:32px; text-align:center; color:#888;">Loading data...</div>';
        return;
    }
    const year = getDropdownValue('year');
    const sem = getDropdownValue('sem');
    const period = getDropdownValue('period');
    const tableHtml = gradeData[year]?.[sem]?.[period];
    // Animate fade out and height
    const prevHeight = gradeTableDiv.offsetHeight;
    gradeTableDiv.style.height = prevHeight + 'px';
    gradeTableDiv.classList.remove('visible');
    setTimeout(() => {
        if (tableHtml) {
            gradeTableDiv.innerHTML = `<div id='table-inner-wrapper'>${cleanTableHtml(tableHtml.replace(/\"/g, '"'))}</div>`;
        } else {
            gradeTableDiv.innerHTML = '<div id="table-inner-wrapper" style="padding:32px; text-align:center; color:#888;">No data available for this selection.</div>';
        }
        void gradeTableDiv.offsetWidth;
        const inner = document.getElementById('table-inner-wrapper');
        let newHeight = 0;
        if (inner) {
            newHeight = inner.offsetHeight;
        } else {
            newHeight = gradeTableDiv.offsetHeight;
        }
        gradeTableDiv.style.transition = 'height 0.4s cubic-bezier(.4,0,.2,1), opacity 0.4s cubic-bezier(.4,0,.2,1)';
        gradeTableDiv.style.height = newHeight + 'px';
        setTimeout(() => {
            gradeTableDiv.classList.add('visible');
        }, 60);
        setTimeout(() => {
            gradeTableDiv.style.height = '';
            gradeTableDiv.style.transition = '';
        }, 420);
    }, 400);
}
async function fetchGrades() {
    gradeTableDiv.innerHTML = '<div style="padding:32px; text-align:center; color:#888;">Loading data...</div>';
    try {
        const response = await fetch('grades.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        studentInfo = {
            id: json.id,
            firstname: json.firstname,
            middlename: json.middlename,
            lastname: json.lastname,
            course: json.course
        };
        gradeData = json.grades;
    } catch (e) {
        gradeTableDiv.innerHTML = '<div style="padding:32px; text-align:center; color:#e74c3c;">Failed to load grade data.</div>';
        gradeData = null;
        studentInfo = {};
    }
    renderStudentInfo();
    renderTable();
}
function renderCustomDropdowns() {
    const container = document.getElementById('custom-selectors');
    container.innerHTML = dropdowns.map(dd => `
        <div class="custom-dropdown" id="dropdown-${dd.id}" tabindex="0" data-dropdown>
            <div class="custom-dropdown-selected" data-selected>${dd.options.find(o => o.value === (localStorage.getItem('dropdown-' + dd.id) || dd.default)).label}</div>
            <div class="custom-dropdown-options">
                ${dd.options.map(o => `<div class="custom-dropdown-option${o.value === (localStorage.getItem('dropdown-' + dd.id) || dd.default) ? ' selected' : ''}" data-value="${o.value}">${o.label}</div>`).join('')}
            </div>
        </div>
    `).join('');

    dropdowns.forEach(dd => {
        const dropdown = document.getElementById('dropdown-' + dd.id);
        const selected = dropdown.querySelector('[data-selected]');
        const options = dropdown.querySelector('.custom-dropdown-options');
        const optionEls = dropdown.querySelectorAll('.custom-dropdown-option');
        let open = false;
        let activeIdx = -1;

        function openDropdown() {
            dropdown.classList.add('open');
            open = true;
            const selectedEl = dropdown.querySelector('.custom-dropdown-option.selected');
            if (selectedEl) {
                selectedEl.scrollIntoView({ block: 'nearest' });
                activeIdx = Array.from(optionEls).indexOf(selectedEl);
            }
        }
        function closeDropdown() {
            dropdown.classList.remove('open');
            open = false;
            activeIdx = -1;
        }
        selected.addEventListener('click', e => {
            e.stopPropagation();
            if (open) closeDropdown();
            else openDropdown();
        });
        dropdown.addEventListener('blur', closeDropdown);
        optionEls.forEach((opt, idx) => {
            opt.addEventListener('click', e => {
                e.stopPropagation();
                optionEls.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                selected.textContent = opt.textContent;
                localStorage.setItem('dropdown-' + dd.id, opt.getAttribute('data-value'));
                closeDropdown();
                triggerDropdownChange();
            });
            opt.addEventListener('mouseenter', () => {
                optionEls.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                activeIdx = idx;
            });
        });
        // Keyboard navigation for dropdown
        dropdown.addEventListener('keydown', e => {
            if (!open && (e.key === 'Enter' || e.key === ' ')) {
                openDropdown();
                e.preventDefault();
            } else if (open) {
                if (e.key === 'ArrowDown') {
                    activeIdx = (activeIdx + 1) % optionEls.length;
                    optionEls.forEach(o => o.classList.remove('active'));
                    optionEls[activeIdx].classList.add('active');
                    optionEls[activeIdx].scrollIntoView({ block: 'nearest' });
                    e.preventDefault();
                } else if (e.key === 'ArrowUp') {
                    activeIdx = (activeIdx - 1 + optionEls.length) % optionEls.length;
                    optionEls.forEach(o => o.classList.remove('active'));
                    optionEls[activeIdx].classList.add('active');
                    optionEls[activeIdx].scrollIntoView({ block: 'nearest' });
                    e.preventDefault();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    if (activeIdx >= 0) {
                        optionEls[activeIdx].click();
                    }
                    e.preventDefault();
                } else if (e.key === 'Escape') {
                    closeDropdown();
                    e.preventDefault();
                }
            }
        });
        document.addEventListener('click', e => {
            if (!dropdown.contains(e.target)) closeDropdown();
        });
    });
}

function getDropdownValue(id) {
    const dd = dropdowns.find(d => d.id === id);
    return localStorage.getItem('dropdown-' + id) || dd.default;
}

function triggerDropdownChange() {
    renderTable();
}

// Initialize UI on page load
renderCustomDropdowns();
fetchGrades();
