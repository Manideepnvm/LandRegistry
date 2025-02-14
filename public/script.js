document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('landRegistrationForm');
    const messageDiv = document.getElementById('message');
    const landList = document.getElementById('landList');

    form.addEventListener('submit', function(event) {
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
            fetch('http://localhost:3000/api/register-land', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ownerName,
                    ownerAddress,
                    ownerContact,
                    landAddress,
                    landSize,
                    landPrice,
                    landType,
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messageDiv.textContent = 'Land registration successful!';
                    messageDiv.className = 'message success';
                    fetchLands();
                } else {
                    messageDiv.textContent = 'Land registration failed. Please try again.';
                    messageDiv.className = 'message error';
                }
                messageDiv.style.display = 'block';
            })
            .catch(error => {
                console.error('Error:', error);
                messageDiv.textContent = 'An error occurred. Please try again.';
                messageDiv.className = 'message error';
                messageDiv.style.display = 'block';
            });
        } else {
            messageDiv.textContent = 'Please fill in all fields.';
            messageDiv.className = 'message error';
            messageDiv.style.display = 'block';
        }
    });

    function fetchLands() {
        fetch('http://localhost:3000/api/lands')
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

    window.deleteLand = function(landId) {
        fetch(`http://localhost:3000/api/lands/${landId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageDiv.textContent = 'Land deleted successfully!';
                messageDiv.className = 'message success';
                fetchLands();
            } else {
                messageDiv.textContent = 'Land deletion failed. Please try again.';
                messageDiv.className = 'message error';
            }
            messageDiv.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            messageDiv.textContent = 'An error occurred. Please try again.';
            messageDiv.className = 'message error';
            messageDiv.style.display = 'block';
        });
    };

    fetchLands();
});
