const calendar = document.getElementById("calendar");
const rangeDisplay = document.getElementById("range-display");
const downloadBtn = document.getElementById("download-pdf");

let start = null;
let end = null;

const year = 2025;
const month = 5;
const daysInMonth = new Date(year, month + 1, 0).getDate();

// Modify this array in code to block out dates
const blockedDates = ["2025-05-24", "2025-05-30"];

// Load previous bookings
const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

function dateKey(day) {
  return `${year}-${month + 1}-${day}`;
}

function isBetween(day) {
  if (!start || !end) return false;
  const d = new Date(year, month, day);
  return d >= start && d <= end;
}

function renderCalendar() {
  calendar.innerHTML = "";
  for (let i = 1; i <= daysInMonth; i++) {
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    const key = dateKey(i);

    if (blockedDates.includes(key)) {
      dayEl.classList.add("blocked");
      dayEl.textContent = i;
      calendar.appendChild(dayEl);
      continue;
    }

    if (bookings.includes(key)) {
      dayEl.classList.add("booked");
      dayEl.textContent = i;
      calendar.appendChild(dayEl);
      continue;
    }

    dayEl.textContent = i;

    if (isBetween(i)) {
      dayEl.classList.add("selected");
    }

    dayEl.onclick = () => {
      const clickedDate = new Date(year, month, i);
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
        for (
          let d = new Date(start);
          d <= end;
          d.setDate(d.getDate() + 1)
        ) {
          const key = dateKey(d.getDate());
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
    };

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

renderCalendar();