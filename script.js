
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// Mobile navigation
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// Service buttons select the service in the booking form
const serviceButtons = document.querySelectorAll(".service-select");
const bookingService = document.getElementById("bookingService");

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    bookingService.value = button.dataset.service;
    document.getElementById("booking").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Price estimator
const estimateService = document.getElementById("estimateService");
const bagType = document.getElementById("bagType");
const estimatePrice = document.getElementById("estimatePrice");

function updateEstimate() {
  const servicePrice = Number(estimateService.value);
  const bagMultiplier = Number(bagType.value);
  const total = Math.round(servicePrice * bagMultiplier);

  estimatePrice.textContent = "₹" + total;
}

estimateService.addEventListener("change", updateEstimate);
bagType.addEventListener("change", updateEstimate);
updateEstimate();

// Demo booking system using localStorage
const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");
const trackingForm = document.getElementById("trackingForm");
const trackingIdInput = document.getElementById("trackingId");
const trackingResult = document.getElementById("trackingResult");

function getBookings() {
  try {
    return JSON.parse(localStorage.getItem("zipcareBookings")) || [];
  } catch (error) {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem("zipcareBookings", JSON.stringify(bookings));
}

function createBookingId() {
  return "ZC" + Math.floor(100000 + Math.random() * 900000);
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const service = bookingService.value;
  const type = document.getElementById("bookingBagType").value;
  const issue = document.getElementById("bookingIssue").value.trim();

  if (!name || !phone || !service || !type || !issue) {
    bookingMessage.className = "booking-message error";
    bookingMessage.textContent = "Please complete all required fields.";
    return;
  }

  if (!/^[6-9][0-9]{9}$/.test(phone)) {
    bookingMessage.className = "booking-message error";
    bookingMessage.textContent = "Enter a valid 10-digit Indian mobile number.";
    return;
  }

  const bookings = getBookings();
  let bookingId = createBookingId();

  while (bookings.some((booking) => booking.id === bookingId)) {
    bookingId = createBookingId();
  }

  const booking = {
    id: bookingId,
    name: name,
    phone: phone,
    email: email,
    service: service,
    bagType: type,
    issue: issue,
    status: "Request received",
    date: new Date().toLocaleDateString("en-IN")
  };

  bookings.push(booking);

  try {
    saveBookings(bookings);
  } catch (error) {
    bookingMessage.className = "booking-message error";
    bookingMessage.textContent =
      "Could not save the booking. Please enable browser storage and try again.";
    return;
  }

  bookingMessage.className = "booking-message success";
  bookingMessage.textContent =
    "Booking created successfully! Your demo booking ID is " +
    bookingId +
    ". Save this ID to track your request.";

  trackingIdInput.value = bookingId;
  bookingForm.reset();
});

// Track a booking by its ID
trackingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const enteredId = trackingIdInput.value.trim().toUpperCase();
  const bookings = getBookings();

  const booking = bookings.find(
    (item) => item.id.toUpperCase() === enteredId
  );

  if (!booking) {
    trackingResult.textContent =
      "No booking found. Check the ID and use the same browser where you created the booking.";
    return;
  }

  trackingResult.textContent =
    "Booking " + booking.id +
    " | Service: " + booking.service +
    " | Bag: " + booking.bagType +
    " | Status: " + booking.status +
    " | Created: " + booking.date;
});

// Display current year in footer
document.getElementById("currentYear").textContent =
  new Date().getFullYear();
