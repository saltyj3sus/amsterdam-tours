window.onload = () => {
  const calendar = document.getElementById("calendar");
  const rangeDisplay = document.getElementById("range-display");
  const downloadBtn = document.getElementById("download-pdf");
  const monthYearDisplay = document.getElementById("month-year");
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");
  const resetBtn = document.getElementById("reset-bookings");

  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth(); // 0-indexed

// Modify this array in code to block out dates
  const blockedDates = ["2025-05-24", "2025-05-30"];

// Load previous bookings
  let bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  let selectedDates = [...bookings]; // Also fill selectedDates from saved state

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
      } else if (selectedDates.includes(key)) {
        dayEl.classList.add("selected");
        dayEl.onclick = () => handleDayClick(currentYear, currentMonth, i);
      } else {
        dayEl.onclick = () => handleDayClick(currentYear, currentMonth, i);
      }

      calendar.appendChild(dayEl);
    }
  }

  //function generatePDF(start, end) {
    //const { jsPDF } = window.jspdf;
    //const doc = new jsPDF();
    //doc.text("Noa’s Amsterdam Excursion Tours Inc.", 10, 10);
    //doc.text(`Booking Confirmation`, 10, 30);
    //doc.text("Thank you for booking with us! Our team will process your request", 10, 50);
    //doc.text("as soon as possible", 10, 60);
    //doc.text(`From: ${start.toDateString()}`, 10, 70);
    //doc.text(`To: ${end.toDateString()}`, 10, 80);
    //doc.text("If you have any questions or special requests, please contact", 10,100);
    //doc.text("your booked tour guide.", 10, 110);
    //doc.save("totally_legit_not_a_virus.pdf");
  //}

  function generatePDF(datesArray) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Noa’s Amsterdam Excursion Tours Inc.", 10, 10);
    doc.text("Booking Confirmation", 10, 20);
    doc.text("Thank you for booking with us!", 10, 30);
    doc.text("Dates selected:", 10, 40);

    let y = 50;
    const sortedDates = datesArray.map(key => new Date(key)).sort((a, b) => a - b);
    for (const d of sortedDates) {
      doc.text(`- ${d.toDateString()}`, 10, y);
      y += 10;
    }

    y += 10;
    doc.text("If you have any questions or special requests,", 10, y);
    doc.text("please contact your assigned tour guide.", 10, y + 10);

    doc.save("amsterdam_tour_booking_confirmation.pdf");
  }

  function updateSelectedText() {
    if (selectedDates.length === 0) {
      rangeDisplay.textContent = "";
      downloadBtn.style.display = "none";
    } else {
      rangeDisplay.textContent = `You selected ${selectedDates.length} date(s)`;
      downloadBtn.style.display = "inline-block";
      downloadBtn.onclick = () => generatePDF(selectedDates);
    }
  }

  function handleDayClick(year, month, day) {
    const clickedDate = new Date(year, month, day);
    const key = dateKey(year, month, day);

    if (blockedDates.includes(key)) return;

    const index = selectedDates.indexOf(key);
    if (index > -1) {
    // Already selected → unselect
      selectedDates.splice(index, 1);
    } else {
      selectedDates.push(key);
    }

    localStorage.setItem("bookings", JSON.stringify(selectedDates));
    updateSelectedText();
    renderCalendar();
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

  resetBtn.onclick = () => {
    localStorage.removeItem("bookings");
    bookings.length = 0; // Clear the array in memory
    renderCalendar();
    rangeDisplay.textContent = "";
    downloadBtn.style.display = "none";
  };

  renderCalendar();
  updateSelectedText();
};