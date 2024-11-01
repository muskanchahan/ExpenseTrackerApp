const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const loginData = { email, password };

            axios.post('/api/login', loginData)
                .then((response) => {
                    const token = response.data.token;
                    localStorage.setItem('token', token);
                    window.location.href = '/ExpenseTracker';
                })
                .catch((error) => {
                    console.error('Error during login:', error);
                    alert('Login failed. Please check your email and password.');
                })
            })

            function forgotpassword() {
                window.location.href = "./forgotpassword.html"
            }