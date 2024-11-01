const signupForm = document.getElementById('signupFrom');
signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('name').value; // Ensure the id matches the input field in the HTML

    const signupData = { username, email, password };

    axios.post('http://localhost:3000/api/signup', signupData)
        .then((response) => {
            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
                alert('Signup successful!');
                window.location.href = '/ExpenseTracker';
            } else {
                alert('Signup failed. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error during signup:', error);
            alert('Signup failed. Please check your details and try again.');
        });
});