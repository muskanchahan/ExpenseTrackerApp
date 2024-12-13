const form = document.getElementById("expense-form");
const ul = document.getElementById('ul');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentPageText = document.getElementById('current-page');
let currentPage = 1;
const itemsPerPage = 5; // Number of items per page

// Fetch expenses on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchExpenses(currentPage);
    checkPremiumStatus();
});

// Function to fetch expenses
function fetchExpenses(page) {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:3000/api/ExpenseTracker?page=${page}&limit=${itemsPerPage}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then((response) => {
        const { expenses, totalItems } = response.data;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        displayExpenses(expenses);
        updatePaginationControls(totalPages);
    })
    .catch((error) => {
        console.error('Error fetching expense data:', error);
    });
}

// Display expenses
function displayExpenses(expenses) {
    const tbody = document.getElementById('expense-table-body');
    tbody.innerHTML = ''; // Clear existing data

    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    expenses.forEach((expense) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.amount}</td>
            <td>${expense.type}</td>
            <td>${expense.name}</td>
            <td>
                <button onclick="deleteExpense('${expense.id}', this)">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Pagination controls
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchExpenses(currentPage);
    }
});

nextBtn.addEventListener('click', () => {
    currentPage++;
    fetchExpenses(currentPage);
});

function updatePaginationControls(totalPages) {
    currentPageText.textContent = `Page ${currentPage}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Form submission for adding a new expense
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);

    if (isNaN(amount) || amount <= 0) {
        console.error('Invalid amount');
        return;
    }

    const userDetails = {
        type: document.getElementById('type').value,
        name: document.getElementById('name').value,
        date: document.getElementById('date').value,
        amount: amount
    };

    const token = localStorage.getItem('token');

    axios.post('http://localhost:3000/api/ExpenseTracker', userDetails, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => {
        console.log('Expense added successfully');
        fetchExpenses(currentPage);
    })
    .catch((error) => {
        console.error('Error adding expense:', error);
    });
    form.reset();
});

// Function to delete an expense
function deleteExpense(expenseId, button) {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/api/ExpenseTracker/${expenseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => {
        const row = button.closest('tr');
        row.parentNode.removeChild(row);
        console.log('Expense deleted successfully');
    })
    .catch((error) => {
        console.error('Error deleting expense:', error);
    });
}

function parseJwt(token) {
    // If the token has the "Bearer " prefix, remove it
    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Function to check premium status and update the UI accordingly
function checkPremiumStatus() {
    const token = localStorage.getItem('token');
    const  divContainer = document.getElementById('divPre'); // Get the leaderboard button
    if (token) {
        const decodedToken = parseJwt(token);
        if (decodedToken.ispremiumuser) {
            // Show the leaderboard button
             divContainer.style.display = 'block'; // Ensure button is visible
            const button = document.getElementById('rzp'); // Get the buy premium button
            if (button) {
                const badgeImage = document.createElement('img');
                badgeImage.src = "https://cdn-icons-png.flaticon.com/512/3972/3972726.png";
                badgeImage.alt = "Premium User Badge";
                badgeImage.width = 50;
                badgeImage.height = 50;
                button.parentNode.replaceChild(badgeImage, button);
            }
        } else {
            // Hide the leaderboard button for non-premium users
            divContainer.style.display = 'none';
        }
    } else {
         divContainer.style.display = 'none'; // Hide the leaderboard button if no token
    }
}

// Call the function when the page loads to check the user's premium status
document.addEventListener('DOMContentLoaded', checkPremiumStatus);

document.getElementById('rzp').onclick = async function (e) {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("User not authenticated. Please log in again.");
            return;
        }

        console.log("Fetching Razorpay order details...");
        const response = await axios.get('http://localhost:3000/api/premiummembership', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log("Server response for order details:", response);

        var options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function (paymentResponse) {
                console.log("Payment successful, response:", paymentResponse);

                try {
                    console.log("Updating transaction status...");

                    const updateResponse = await axios.post('http://localhost:3000/api/updatetransactionstatus', {
                        order_id: options.order_id,
                        payment_id: paymentResponse.razorpay_payment_id,
                    }, { headers: { 'Authorization': `Bearer ${token}` } });

                    console.log("Transaction status updated:", updateResponse.data);
                    alert('You are a premium user now and go back to the login page');
                    // window.location.href = '/login';

                    // Update the token in local storage if the backend provides a new one
                    if (updateResponse.data.token) {
                        localStorage.setItem('token', updateResponse.data.token);
                    }

                    // Call the function to replace the button with the premium badge
                    checkPremiumStatus();

                } catch (updateError) {
                    console.error("Error updating transaction status:", updateError);
                    alert('Error updating transaction status. Please contact support.');
                }
            }
        };

        console.log("Opening Razorpay with options:", options);
        const rzpl = new Razorpay(options);
        rzpl.open();

        rzpl.on('payment.failed', function (response) {
            console.log("Payment failed, response:", response);
            alert('Something went wrong with the payment. Please try again.');
        });

    } catch (error) {
        console.error("Error fetching Razorpay order details:", error);
        alert('Error fetching payment details. Please try again later.');
    }
};
  
document.getElementById("report").addEventListener('click', () => {
    window.location.href = 'report.html'; // Redirect to leaderboard
});


document.getElementById("leaderbtn").addEventListener('click', () => {
    window.location.href = 'http://localhost:3000/leaderboard'; // Redirect to leaderboard
});

document.getElementById('login').addEventListener('click',()=>{
    window.location.href='http://localhost:3000/login'
})


document.getElementById('openChatBtn').addEventListener('click', function() {
    tidioChatApi.open();
});



const calculatorPopup = document.getElementById("calculatorPopup");
const openCalculatorBtn = document.getElementById("openCalculatorBtn");

openCalculatorBtn.addEventListener("click", () => {
    calculatorPopup.style.display = "flex";
});

// Calculator display
const display = document.getElementById("display");

let currentInput = "";
let operator = null;
let operand1 = null;
let expression = ""; // New variable to track the full expression

function appendNumber(number) {
    currentInput += number;
    expression += number; // Add number to the expression
    display.value = expression; // Display the entire expression
}

function performOperation(op) {
    if (currentInput) {
        operand1 = parseFloat(currentInput);
        operator = op;
        currentInput = "";
        expression += ` ${op} `; // Add operator to the expression
        display.value = expression; // Display the entire expression
    }
}

function calculateResult() {
    if (operator && currentInput) {
        const operand2 = parseFloat(currentInput);
        let result;

        switch (operator) {
            case "+":
                result = operand1 + operand2;
                break;
            case "-":
                result = operand1 - operand2;
                break;
            case "*":
                result = operand1 * operand2;
                break;
            case "/":
                result = operand2 !== 0 ? operand1 / operand2 : "Error";
                break;
            default:
                result = "Error";
        }

        display.value = result;
        expression = result.toString(); // Reset expression to the result
        currentInput = result.toString();
        operator = null;
    }
}

function clearDisplay() {
    currentInput = "";
    operator = null;
    operand1 = null;
    expression = ""; // Clear the expression
    display.value = "";
}

// Close the calculator when clicking outside of it
window.addEventListener("click", (event) => {
    if (event.target === calculatorPopup) {
        calculatorPopup.style.display = "none";
    }
});
