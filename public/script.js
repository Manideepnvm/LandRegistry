document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const signinForm = document.getElementById('signinForm');
    const landRegistrationForm = document.getElementById('landRegistrationForm');
    const messageDiv = document.getElementById('message');
    const landList = document.getElementById('landList');
    const authForms = document.getElementById('auth-forms');

    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('userid');

    if (token) {
        authForms.style.display = 'none';
        landRegistrationForm.style.display = 'block';
        fetchLands();
    }

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email }),
        });

        const data = await response.json();
        if (data.success) {
            messageDiv.textContent = 'User registered successfully! Please sign in.';
            messageDiv.className = 'message success';
        } else {
            messageDiv.textContent = data.message || 'User registration failed. Please try again.';
            messageDiv.className = 'message error';
        }
        messageDiv.style.display = 'block';
    });

    signinForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('signinUsername').value;
        const password = document.getElementById('signinPassword').value;

        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userid', data.userid);
            authForms.style.display = 'none';
            landRegistrationForm.style.display = 'block';
            fetchLands();
        } else {
            messageDiv.textContent = data.message || 'Sign in failed. Please try again.';
            messageDiv.className = 'message error';
            messageDiv.style.display = 'block';
        }
    });

    landRegistrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const ownerName = document.getElementById('ownerName').value;
        const ownerAddress = document.getElementById('ownerAddress').value;
        const ownerContact = document.getElementById('ownerContact').value;
        const landAddress = document.getElementById('landAddress').value;
        const landSize = document.getElementById('landSize').value;
        const landPrice = document.getElementById('landPrice').value;
        const landType = document.getElementById('landType').value;

        // Validate phone number
        if (ownerContact.length !== 10) {
            messageDiv.textContent = 'Please enter a valid phone number.';
            messageDiv.className = 'message error';
            messageDiv.style.display = 'block';
            return;
        }

        // Validate land size and price
        if (landSize < 0 || landPrice < 0) {
            messageDiv.textContent = 'Please enter a valid land size and price.';
            messageDiv.className = 'message error';
            messageDiv.style.display = 'block';
            return;
        }

        if (ownerName && ownerAddress && ownerContact && landAddress && landSize && landPrice && landType) {
            const response = await fetch('http://localhost:3000/api/register-land', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ownerName,
                    ownerAddress,
                    ownerContact,
                    landAddress,
                    landSize,
                    landPrice,
                    landType,
                    userId,
                }),
            });

            const data = await response.json();
            if (data.success) {
                messageDiv.textContent = 'Land registration successful!';
                messageDiv.className = 'message success';
                fetchLands();
            } else {
                messageDiv.textContent = data.message || 'Land registration failed. Please try again.';
                messageDiv.className = 'message error';
            }
            messageDiv.style.display = 'block';
        } else {
            messageDiv.textContent = 'Please fill in all fields.';
            messageDiv.className = 'message error';
            messageDiv.style.display = 'block';
        }
    });

    function fetchLands() {
        fetch('http://localhost:3000/api/lands', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => response.json())
        .then(lands => {
            landList.innerHTML = '';
            lands.forEach(land => {
                const li = document.createElement('li');

                li.innerHTML = `
                    <span>ID: ${land.id}, Owner: ${land.ownerName}, Address: ${land.landAddress}, Size: ${land.landSize} acres, Price: $${land.landPrice}, Type: ${land.landType}</span>
                    <button onclick="deleteLand(${land.id})">Delete</button>
                `;
                landList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    window.deleteLand = async function(landId) {
        const response = await fetch(`http://localhost:3000/api/lands/${landId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (data.success) {
            messageDiv.textContent = 'Land deleted successfully!';
            messageDiv.className = 'message success';
            fetchLands();
        } else {
            messageDiv.textContent = data.message || 'Land deletion failed. Please try again.';
            messageDiv.className = 'message error';
        }
        messageDiv.style.display = 'block';
    };
});
