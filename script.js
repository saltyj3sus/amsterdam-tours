const calendar = document.getElementById("calendar");
const rangeDisplay = document.getElementById("range-display");
const downloadBtn = document.getElementById("download-pdf");
const monthYearDisplay = document.getElementById("month-year");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");

let start = null;
let end = null;

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0-indexed

// Modify this array in code to block out dates
const blockedDates = ["2025-05-24", "2025-05-30"];

// Load previous bookings
const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

function dateKey(year, month, day) {
  return `${year}-${month + 1}-${day}`;
}

function renderCalendar() {
  calendar.innerHTML = "";
  monthYearDisplay.textContent = new Date(currentYear, currentMonth).toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const key = dateKey(currentYear, currentMonth, i);
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.textContent = i;

    if (blockedDates.includes(key)) {
      dayEl.classList.add("blocked");
    } else if (bookings.includes(key)) {
      dayEl.classList.add("booked");
    } else if (isBetween(currentYear, currentMonth, i)) {
      dayEl.classList.add("selected");
    } else {
      dayEl.onclick = () => handleDayClick(currentYear, currentMonth, i);
    }

    calendar.appendChild(dayEl);
  }
}

function generatePDF(start, end) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Noa’s Amsterdam Excursion Tours Inc.", 10, 10);
  doc.text(`Booking Confirmation`, 10, 20);
  doc.text("Thank you for booking with us! Our team will process your request as soon as possible.", 10, 30);
  doc.text(`From: ${start.toDateString()}`, 10, 40);
  doc.text(`To: ${end.toDateString()}`, 10, 50);
  doc.text("If you have any questions or special requests, please contact your assigned tour guide", 10,60);
  doc.save("amsterdam_tour_booking_confirmation.pdf");
}

function handleDayClick(year, month, day) {
  const clickedDate = new Date(year, month, day);

  // If clicking a date inside an existing selected range → clear it
  if (start && end && clickedDate >= start && clickedDate <= end) {
    start = null;
    end = null;
    rangeDisplay.textContent = "";
    downloadBtn.style.display = "none";
    renderCalendar();
    return;
  }

  if (!start || (start && end)) {
    start = clickedDate;
    end = null;
  } else {
    if (clickedDate < start) {
      end = start;
      start = clickedDate;
    } else {
      end = clickedDate;
    }

    const selectedDates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
      if (!blockedDates.includes(key)) {
        bookings.push(key);
        selectedDates.push(key);
      }
    }

    localStorage.setItem("bookings", JSON.stringify(bookings));
    rangeDisplay.textContent = `You booked from ${start.toDateString()} to ${end.toDateString()}`;
    downloadBtn.style.display = "inline-block";
    downloadBtn.onclick = () => generatePDF(start, end);
  }

  renderCalendar();
}

function isBetween(year, month, day) {
  if (!start || !end) return false;
  const d = new Date(year, month, day);
  return d >= start && d <= end;
}

prevBtn.onclick = () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
};

nextBtn.onclick = () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
};

renderCalendar();