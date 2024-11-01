// Selecting DOM elements
const form = document.getElementById("expense-form");
const ul = document.getElementById('ul');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentPageText = document.getElementById('current-page');

let currentPage = 1;
const itemsPerPage = 5; // Number of items per page

function reloadLike() {
    window.location.href = window.location.href;
}

// Function to fetch expenses
function fetchExpenses(page) {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:3000/api/ExpenseTracker?page=${page}&limit=${itemsPerPage}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then((response) => {
        const { expenses, totalItems } = response.data;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        ul.innerHTML = ''; // Clear the list
        expenses.forEach(showExpenseDetails); // Display expenses
        expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        // Update pagination controls
        currentPageText.textContent = `Page ${currentPage}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    })
    .catch((error) => {
        console.error('Error fetching expense data:', error);
    });
}

// Ensure you validate input data in form submission
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (isNaN(amount) || amount <= 0) {
        console.error('Invalid amount');
        return; // Exit if invalid
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
        fetchExpenses(currentPage); // Call to refresh expenses
    })
    .catch((error) => {
        console.error('Error adding expense:', error);
    });
    form.reset();
});


// Fetch expenses on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchExpenses(currentPage);
});

 
 

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

// Function to display expense details
function showExpenseDetails(expense) {
    const li = document.createElement('li');
    const liText = document.createElement('span'); 
    liText.textContent = `On ${expense.date}, we paid ${expense.amount} for ${expense.type} on ${expense.name}`;
    
    li.appendChild(liText);
    li.className = 'list';
    li.style.cssText = 'margin: 15px; background-color: gray; color: white; display: flex; justify-content: space-between; align-items: center;';
    ul.appendChild(li);

    const buttonContainer = document.createElement('div');
    li.appendChild(buttonContainer);

    // Delete Button
    createButton(buttonContainer, 'Delete Expense', '#4CAF50', () => deleteExpense(expense.id, li));

    // Edit Button
    createButton(buttonContainer, 'Edit Expense', '#4CAF50', () => {
        toggleEditForm(li);
    });

    // Edit Form
    const editForm = createEditForm(expense);
    li.appendChild(editForm);
}

// Helper function to create buttons
function createButton(container, text, color, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = `background-color: ${color}; color: white; border: none; border-radius: 4px; padding: 10px 20px; cursor: pointer; margin-right: 10px;`;
    button.addEventListener('click', onClick);
    container.appendChild(button);
    return button;
}

// Helper function to create an edit form
function createEditForm(expense) {
    const editForm = document.createElement('form');
    editForm.style.display = 'none';
    editForm.style.flexDirection = 'column';
    editForm.style.marginTop = '10px';

    const fields = ['type', 'name', 'date', 'amount'];
    const inputs = {}; // Object to store inputs for easier access

    fields.forEach(field => {
        const label = document.createElement('label');
        label.textContent = `Enter ${field}:`;
        const input = document.createElement('input');
        input.type = field === 'date' ? 'date' : field === 'amount' ? 'number' : 'text';
        input.value = expense[field];
        input.name = field; // Use field name for easier identification
        inputs[field] = input; // Store input in the object
        editForm.appendChild(label);
        editForm.appendChild(input);
    });

    const editSubmitBtn = createButton(editForm, 'Save', '#4CAF50', (event) => {
        event.preventDefault();
        
        // Construct the updated details object correctly
        const updatedDetails = {
            type: inputs['type'].value,
            name: inputs['name'].value,
            date: inputs['date'].value,
            amount: inputs['amount'].value
        };

        updateExpense(expense.id, updatedDetails);
        editForm.style.display = 'none'; // Hide the form
    });

    const editCancelBtn = createButton(editForm, 'Cancel', '#f44336', (event) => {
        event.preventDefault();
        editForm.style.display = 'none'; // Hide the form
    });

    return editForm;
}

// Function to toggle the visibility of the edit form
function toggleEditForm(li) {
    const editForm = li.querySelector('form');
    editForm.style.display = editForm.style.display === 'none' ? 'flex' : 'none';
}

// Function to update an expense
function updateExpense(expenseId, updatedData) {
    const token = localStorage.getItem('token');
    axios.put(`http://localhost:3000/api/ExpenseTracker/${expenseId}`, updatedData, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => {
        console.log('Expense updated successfully');
        fetchExpenses(currentPage); // Refresh the list
    })
    .catch((error) => {
        console.error('Error updating expense:', error);
    });
}
// Function to toggle the edit form
function toggleEditForm(li) {
    const editForm = li.querySelector('form');
    editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
}


// Function to delete an expense
function deleteExpense(expenseId, li) {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/api/ExpenseTracker/${expenseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => {
        ul.removeChild(li);
        console.log('Expense deleted successfully');
    })
    .catch((error) => {
        console.error('Error deleting expense:', error);
    });
}


 

 
 

// 
document.getElementById("leaderbtn").addEventListener('click', () => {
    window.location.href = 'http://localhost:3000/leaderboard'; // Redirect to leaderboard
});

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
    const leaderboardButton = document.getElementById('leaderbtn'); // Get the leaderboard button
    if (token) {
        const decodedToken = parseJwt(token);
        if (decodedToken.ispremiumuser) {
            // Show the leaderboard button
            leaderboardButton.style.display = 'block'; // Ensure button is visible
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
            leaderboardButton.style.display = 'none';
        }
    } else {
        leaderboardButton.style.display = 'none'; // Hide the leaderboard button if no token
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
 