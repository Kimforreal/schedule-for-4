document.addEventListener('DOMContentLoaded', () => {
    const viewModeButton = document.getElementById('view-mode');
    const editModeButton = document.getElementById('edit-mode');
    const calendarContainer = document.getElementById('calendar-container');
    const scheduleModal = document.getElementById('schedule-modal');
    const addScheduleButton = document.getElementById('add-schedule');
    const saveScheduleButton = document.getElementById('save-schedule');
    const cancelButton = document.getElementById('cancel');
    const scheduleDateInput = document.getElementById('schedule-date');
    const scheduleDescriptionInput = document.getElementById('schedule-description');
    const modalTitle = document.getElementById('modal-title');
    const passwordModal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmitButton = document.getElementById('password-submit');
    const passwordCancelButton = document.getElementById('password-cancel');

    const correctPassword = '1014';
    let editMode = false;

    viewModeButton.addEventListener('click', () => {
        if (editMode) return; // If already in edit mode, do nothing
        calendarContainer.classList.remove('hidden');
        addScheduleButton.classList.add('hidden'); // Hide add schedule button in view mode
        renderCalendar();
        scheduleModal.classList.add('hidden');
        passwordModal.classList.add('hidden');
    });

    editModeButton.addEventListener('click', () => {
        passwordModal.classList.remove('hidden');
    });

    passwordCancelButton.addEventListener('click', () => {
        passwordModal.classList.add('hidden');
    });

    passwordSubmitButton.addEventListener('click', () => {
        const enteredPassword = passwordInput.value;
        if (enteredPassword === correctPassword) {
            passwordModal.classList.add('hidden');
            editMode = true;
            calendarContainer.classList.remove('hidden');
            addScheduleButton.classList.remove('hidden'); // Show add schedule button in edit mode
            renderCalendar();
        } else {
            alert('비밀번호가 맞지 않습니다.');
        }
    });

    addScheduleButton.addEventListener('click', () => {
        modalTitle.textContent = '일정 추가';
        scheduleDateInput.value = '';
        scheduleDescriptionInput.value = '';
        scheduleModal.classList.remove('hidden');
    });

    cancelButton.addEventListener('click', () => {
        scheduleModal.classList.add('hidden');
    });

    saveScheduleButton.addEventListener('click', async () => {
        const date = scheduleDateInput.value;
        const description = scheduleDescriptionInput.value;
        if (date && description) {
            await addSchedule(date, description);
            scheduleModal.classList.add('hidden');
            renderCalendar();
        } else {
            alert('날짜와 일정을 입력해주세요.');
        }
    });

    async function renderCalendar() {
        // Clear previous calendar content
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const formattedDate = date.toISOString().split('T')[0];

            const row = document.createElement('tr');
            const cellDate = document.createElement('td');
            cellDate.textContent = formattedDate;
            row.appendChild(cellDate);

            const cellSchedule = document.createElement('td');
            const scheduleList = document.createElement('ul');
            scheduleList.className = 'schedule-item';

            const schedules = await getSchedulesForDate(formattedDate);
            schedules.forEach(schedule => {
                const listItem = document.createElement('li');
                listItem.textContent = schedule;

                if (editMode) {
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '삭제';
                    deleteButton.addEventListener('click', async () => {
                        await deleteSchedule(formattedDate, schedule);
                        renderCalendar();
                    });
                    listItem.appendChild(deleteButton);

                    const editButton = document.createElement('button');
                    editButton.textContent = '수정';
                    editButton.addEventListener('click', () => {
                        modalTitle.textContent = '일정 수정';
                        scheduleDateInput.value = formattedDate;
                        scheduleDescriptionInput.value = schedule;
                        scheduleModal.classList.remove('hidden');
                    });
                    listItem.appendChild(editButton);
                }
                scheduleList.appendChild(listItem);
            });

            cellSchedule.appendChild(scheduleList);
            row.appendChild(cellSchedule);
            calendar.appendChild(row);
        }
    }

    async function getSchedulesForDate(date) {
        const response = await fetch(`http://localhost:3000/schedules`);
        const schedules = await response.json();
        return schedules.filter(schedule => schedule.date === date).map(schedule => schedule.description);
    }

    async function addSchedule(date, description) {
        await fetch('http://localhost:3000/schedules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, description })
        });
    }

    async function deleteSchedule(date, description) {
        await fetch('http://localhost:3000/schedules', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, description })
        });
    }
});
