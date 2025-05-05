const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'usri_dorm'
});

db.connect(err => {
  if (err) {
    console.error('เชื่อมต่อฐานข้อมูลล้มเหลว:', err);
    return;
  }
  console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');
});

app.post('/register', (req, res) => {
  const { firstname, lastname, phone, email, password, id_card, room_number } = req.body;
  const sql = `
    INSERT INTO users (firstname, lastname, phone, email, password, id_card, room_number)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [firstname, lastname, phone, email, password, id_card, room_number], (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดตอนสมัคร:", err);
      return res.status(500).send("Error");
    }
    res.send("success");
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดตอนล็อกอิน:", err);
      return res.status(500).send("Error");
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

app.listen(3000, () => {
  console.log("✅ Server รันที่ http://localhost:3000");
});
