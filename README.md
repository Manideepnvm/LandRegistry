# Land Registry System

A *Web3-enabled Land Registry System* built with *HTML, CSS, JavaScript, and MySQL*, designed for secure, transparent, and efficient land registration.

## 🚀 Features

- 🔐 *User Authentication* – Secure login and registration
- 📜 *Land Ownership Records* – Store and manage land details
- 🏛 *Government Verification* – Admin access for land approval
- 📍 *Location-based Search* – Find land records easily
- 📊 *Dashboard Analytics* – Visual insights into land data

## 🛠 Tech Stack

- *Frontend*: HTML, CSS, JavaScript
- *Backend*: Node.js, Express.js
- *Database*: MySQL
- *Blockchain Integration* (optional for future scalability)

## 📂 Project Structure

plaintext
📂 LandRegistry
 ├── 📁 public          # Frontend (HTML, CSS, JS)
 │   ├── index.html    # Main page
 │   ├── style.css     # Styling
 │   ├── script.js     # Frontend logic
 ├── 📁 backend        # Node.js + Express.js server
 │   ├── server.js     # API server
 │   ├── db.js         # MySQL database connection
 ├── 📁 sql            # Database scripts
 │   ├── schema.sql    # Database schema
 ├── 📄 README.md      # Project documentation


## 🚀 Installation & Setup

### 1️⃣ Clone the Repository
bash
git clone https://github.com/yourusername/landregistry.git
cd landregistry


### 2️⃣ Install Dependencies
bash
npm install


### 3️⃣ Setup MySQL Database
- Create a MySQL database: land_registry
- Run the SQL script:
sql
source sql/schema.sql;

- Update db.js with your MySQL credentials.

### 4️⃣ Start the Server
bash
node backend/server.js


### 5️⃣ Open in Browser
Visit http://localhost:3000

## 📌 API Endpoints

| Method | Endpoint          | Description        |
|--------|------------------|--------------------|
| POST   | /register      | User Registration |
| POST   | /login         | User Login        |
| GET    | /lands         | Get Land Records  |
| POST   | /add-land      | Add New Land      |
| PUT    | /approve/:id   | Approve Land      |

## 📜 License
This project is licensed under the *MIT License*.

## 🤝 Contributing
Feel free to submit a *pull request* or open an *issue* for suggestions.

---
