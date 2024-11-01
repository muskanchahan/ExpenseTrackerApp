document.addEventListener('DOMContentLoaded', () => {
    fetchLeaderboard();
});

async function fetchLeaderboard() {
    try {
        const token = localStorage.getItem('token'); // Assuming you store JWT in localStorage
        
        // Use Axios to send the GET request
        const response = await axios.get('/api/leaderboard', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });        

        // Axios automatically parses the response data, so you can directly access it
        populateLeaderboard(response.data);
    } catch (error) {
        console.error('Error:', error);
        alert('Unable to load leaderboard. Please try again later.');
    }
}

function populateLeaderboard(data) {
    const tbody = document.querySelector('#leaderboard-table tbody');
    tbody.innerHTML = ''; // Clear existing data

    data.forEach((user, index) => {
        const tr = document.createElement('tr');

        // Rank
        const rankTd = document.createElement('td');
        rankTd.textContent = index + 1;
        tr.appendChild(rankTd);

        // Username
        const usernameTd = document.createElement('td');
        usernameTd.textContent = user.username;
        tr.appendChild(usernameTd);

        // Total Expense
        const totalExpenseTd = document.createElement('td');
        totalExpenseTd.textContent = parseFloat(user.totalExpense).toFixed(2); // Changed from user.get to user.totalExpense
        tr.appendChild(totalExpenseTd);

        tbody.appendChild(tr);
    });
}