window.addEventListener('load', () => {
    document.getElementById('date').value = new Date().toISOString().split('T')[0];

    // Populate year picker
    const yearPicker = document.getElementById('year-picker');
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 2000; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearPicker.appendChild(option);
    }

    // Populate month picker
    const monthPicker = document.getElementById('month-picker');
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = (index + 1).toString().padStart(2, '0'); // Format to two digits
        option.textContent = month;
        monthPicker.appendChild(option);
    });
});

document.getElementById('expense-display').addEventListener('change', (e) => {
    const value = e.target.value;
    document.getElementById('daily-form').classList.toggle('hide', value !== "daily");
    document.getElementById('monthly-form').classList.toggle('hide', value !== "monthly");
    document.getElementById('yearly-form').classList.toggle('hide', value !== "yearly");
    document.getElementById('weekly').classList.toggle('hide', value !== "weekly");

    // If weekly, display it immediately
    if (value === "weekly") {
        displayWeekly();
    }
});

document.getElementById('daily-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const date = e.target.date.value;

    try {
        const res = await axios.post('http://localhost:3000/report/getdate', { date }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const tbody = document.querySelector('#daily table tbody');
        let total = 0;
        tbody.innerHTML = ``;
        document.querySelector('#daily h3 span').textContent = date;

        res.data.forEach(elem => {
            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            td1.textContent = elem.description;
            td2.textContent = elem.expense;
            total += +elem.expense;

            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
        });

        document.getElementById('daily-total').textContent = total;
        document.getElementById('daily').classList.remove('hide');
    } catch (e) {
        console.log(e);
    }
});

document.getElementById('monthly-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const month = `${e.target['year-picker'].value}-${e.target['month-picker'].value}`;

    try {
        const res = await axios.post('http://localhost:3000/report/getMonthly', { month }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const tbody = document.querySelector('#monthly table tbody');
        let total = 0;
        tbody.innerHTML = ``;
        document.querySelector('#monthly h3 span').textContent = e.target['month-picker'].options[e.target['month-picker'].selectedIndex].text;

        res.data.forEach(elem => {
            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            td1.textContent = elem.date;
            td2.textContent = elem.totalAmount;
            total += +elem.totalAmount;

            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
        });

        document.getElementById('monthly-total').textContent = total;
        document.getElementById('monthly').classList.remove('hide');
    } catch (e) {
        console.log(e);
    }
});

document.getElementById('yearly-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const year = e.target['year-picker'].value;

    try {
        const res = await axios.post('http://localhost:3000/report/getYearly', { year }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const tbody = document.querySelector('#yearly table tbody');
        let total = 0;
        tbody.innerHTML = ``;
        document.querySelector('#yearly h3 span').textContent = year;

        res.data.forEach(elem => {
            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            td1.textContent = elem.month;
            td2.textContent = elem.totalAmount;
            total += +elem.totalAmount;

            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
        });

        document.getElementById('yearly-total').textContent = total;
        document.getElementById('yearly').classList.remove('hide');
    } catch (e) {
        console.log(e);
    }
});

// Function to fetch and display weekly report
async function displayWeekly() {
    const token = localStorage.getItem('token');

    try {
        const res = await axios.post('http://localhost:3000/report/getWeekly', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const tbody = document.querySelector('#weekly table tbody');
        let total = 0;
        tbody.innerHTML = ``;

        res.data.forEach(elem => {
            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            td1.textContent = `Week ${elem.week}`; // Displaying the week number
            td2.textContent = elem.totalAmount;
            total += +elem.totalAmount;

            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
        });

        document.getElementById('weekly-total').textContent = total;
        document.getElementById('weekly').classList.remove('hide');
    } catch (e) {
        console.log(e);
    }
}
 