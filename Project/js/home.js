// ฟังก์ชันออกจากระบบ
function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "index.html";
}

// ===== ร้องเรียน/ซ่อมบำรุง =====
// เปิด modal ร้องเรียน
document.getElementById("openComplaint").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("complaintModal").style.display = "flex";
});

// ปิด modal ร้องเรียน
function closeModal() {
  document.getElementById("complaintModal").style.display = "none";
}

// ===== เช็คยอดค้างชำระ =====
// MOCK DATA ยอดค้างชำระ
const mockBillData = {
  room: "101 (มีแอร์)",
  month: "เมษายน 2568",
  charges: [
    { name: "ค่าหอพัก", amount: 3000 },
    { name: "ค่าน้ำประปา", amount: 144 },
    { name: "ค่าไฟฟ้า", amount: 248 },
    { name: "ค่าปรับล่าช้า", amount: 200 }
  ]
};

// เปิด modal เช็คยอด
document.getElementById("openCheckBill").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("checkBillModal").style.display = "flex";

  // รีเซ็ตฟอร์ม
  const form = document.getElementById("billForm");
  form.style.display = "block";
  form.reset();

  // ซ่อนข้อมูลเก่า
  document.getElementById("billInfo").style.display = "none";
});

// ปิด modal เช็คยอด
function closeCheckModal() {
  document.getElementById("checkBillModal").style.display = "none";
}

// ตรวจสอบยอดค้างชำระ
function checkBill(event) {
  event.preventDefault();
  const roomInput = document.getElementById("roomNumber").value.trim();
  if (!roomInput) return;

  const data = mockBillData;

  // ซ่อนฟอร์ม
  event.target.style.display = "none";

  // แสดงข้อมูล
  document.getElementById("roomDisplay").textContent = data.room;
  document.getElementById("monthDisplay").textContent = data.month;

  const chargeList = document.getElementById("chargeList");
  chargeList.innerHTML = "";
  let total = 0;
  data.charges.forEach(charge => {
    const li = document.createElement("li");
    li.textContent = `${charge.name}: ${charge.amount.toLocaleString()} บาท`;
    chargeList.appendChild(li);
    total += charge.amount;
  });

  document.getElementById("totalAmount").textContent = total.toLocaleString() + " บาท";
  document.getElementById("billInfo").style.display = "block";
}

// ===== หน้าชำระเงินจริง (PromptPay) =====
function openRealPaymentModal() {
  document.getElementById("realPaymentModal").style.display = "flex";
}

function closeRealPaymentModal() {
  document.getElementById("realPaymentModal").style.display = "none";
}
function showPaymentConfirmation() {
  document.getElementById("realPaymentModal").style.display = "none";
  document.getElementById("confirmPaymentModal").style.display = "block";
  startCountdown(24 * 60 * 60); // เริ่มนับถอยหลัง 24 ชั่วโมง
}

function startCountdown(seconds) {
  const timerElement = document.getElementById("countdownTimer");

  function updateTimer() {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    timerElement.textContent = `${hours}:${minutes}:${secs}`;
    if (seconds > 0) {
      seconds--;
      setTimeout(updateTimer, 1000);
    }
  }

  updateTimer();
}

function submitConfirmation() {
  
  const fileInput = document.getElementById("paymentSlip");
  if (fileInput.files.length === 0) {
    alert("กรุณาอัปโหลดสลิปก่อนดำเนินการต่อ");
    return;
  }
  alert("ระบบได้รับข้อมูลเรียบร้อยแล้ว กำลังดำเนินการตรวจสอบ ✅");
  document.getElementById("confirmPaymentModal").style.display = "none";
}
// โค้ดจำลองว่าเจ้าของหอยืนยันแล้ว
function mockOwnerConfirm() {
  // ซ่อน modal ก่อนหน้า
  document.getElementById("confirmPaymentModal").style.display = "none";
  // แสดง modal เสร็จสิ้น
  document.getElementById("paymentSuccessModal").style.display = "flex";
}

// ปิด modal
function closeSuccessModal() {
  document.getElementById("paymentSuccessModal").style.display = "none";
}

// 🔄 สำหรับอนาคต: ดึงสถานะจาก backend (ใช้API จริง)
async function checkOwnerConfirmationStatus() {
  try {
    const response = await fetch('https://api.example.com/payment-status?userId=123');
    const data = await response.json();

    if (data.status === 'confirmed') {
      document.getElementById("confirmPaymentModal").style.display = "none";
      document.getElementById("paymentSuccessModal").style.display = "flex";
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเช็คสถานะการชำระเงิน", error);
  }
}
setInterval(() => {
}, 10000); 

// ===== ใบเสร็จหลังยืนยัน =====
const mockReceiptData = {
  roomNo: "101",
  tenantName: "นางสำรวย สวยดี",
  printDate: "19/04/2568",
  monthYear: "เมษายน 2568",
  charges: [
    { label: "ค่าหอพัก", amount: 3000 },
    { label: "ค่าน้ำประปา", amount: 144 },
    { label: "ค่าไฟฟ้า", amount: 248 },
    { label: "ค่าปรับล่าช้า", amount: 200 }
  ],
  paymentMethod: "transfer"
};

function openReceiptModal(data) {
  document.getElementById("receiptRoom").textContent = data.roomNo;
  document.getElementById("receiptName").textContent = data.tenantName;
  document.getElementById("receiptDate").textContent = data.printDate;
  document.getElementById("receiptMonth").textContent = data.monthYear;

  const tbody = document.getElementById("receiptBody");
  tbody.innerHTML = "";
  let total = 0;

  data.charges.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.label}</td>
      <td>${item.amount.toFixed(2)}</td>
      <td>0.00</td>
      <td>${item.amount.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
    total += item.amount;
  });

  document.getElementById("receiptTotal").textContent = total.toFixed(2);
  document.getElementById("payCash").checked = data.paymentMethod === "cash";
  document.getElementById("payTransfer").checked = data.paymentMethod === "transfer";

  document.getElementById("receiptModal").style.display = "flex";
}

function closeReceiptModal() {
  document.getElementById("receiptModal").style.display = "none";
}

function mockOwnerConfirm() {
  document.getElementById("confirmPaymentModal").style.display = "none";
  document.getElementById("paymentSuccessModal").style.display = "flex";

  openReceiptModal(mockReceiptData);
}


window.onclick = function(event) {
  const modals = document.querySelectorAll(".modal, .modal-overlay");
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};
