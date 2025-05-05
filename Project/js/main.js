// เปิด/ปิด Modal
function openModal(id) {
  document.getElementById(id).style.display = "flex";
}
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// ลงทะเบียนผู้ใช้ (เชื่อมกับ Node.js backend)
document.getElementById("registerForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const firstname = document.getElementById("registerName").value;
  const lastname = document.getElementById("registerSurname").value;
  const phone = document.getElementById("registerPhone").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const id_card = document.getElementById("registerIdCard").value;
  const room_number = document.getElementById("registerRoomNumber").value;

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ firstname, lastname, phone, email, password, id_card, room_number })
    });

    if (!response.ok) {
      throw new Error("Server responded with error");
    }

    const result = await response.text();
    if (result === "success") {
      alert("สมัครสมาชิกสำเร็จ");
      closeModal("registerModal");
    } else {
      alert("สมัครไม่สำเร็จ: " + result);
    }
  } catch (error) {
    console.error("เชื่อมต่อเซิร์ฟเวอร์ล้มเหลว:", error);
    alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ กรุณาตรวจสอบว่ารัน server.js แล้วหรือไม่");
  }
});

// ล็อกอินผู้ใช้
document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error("ข้อมูลไม่ถูกต้อง");
    }

    const userData = await response.json();

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", userData.firstname + " " + userData.lastname);
    localStorage.setItem("userRoom", userData.room_number);

    window.location.href = "home.html";
  } catch (error) {
    console.error("เชื่อมต่อเซิร์ฟเวอร์ล้มเหลว:", error);
    alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือเชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
  }
});

// เช็คว่าล็อกอินอยู่หรือไม่
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path.includes("index.html") || path === "/") {
    if (localStorage.getItem("isLoggedIn") === "true") {
      window.location.href = "home.html";
    }
  }
});
