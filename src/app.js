// ===============================
// Customer Queue Management
// ===============================

// 1. Main data storage
let tickets = [];
let ticketCounter = 1;

// 2. DOM references
const ticketForm = document.getElementById("ticketForm");
const customerNameInput = document.getElementById("customerName");
const serviceTypeInput = document.getElementById("serviceType");
const priorityCustomerInput = document.getElementById("priorityCustomer");

const messageElement = document.getElementById("message");
const pendingTicketsElement = document.getElementById("pendingTickets");
const ticketHistoryElement = document.getElementById("ticketHistory");

const attendNextButton = document.getElementById("attendNextButton");

const pendingCountElement = document.getElementById("pendingCount");
const attendedCountElement = document.getElementById("attendedCount");
const cancelledCountElement = document.getElementById("cancelledCount");
const totalCountElement = document.getElementById("totalCount");

// 3. Event listeners
ticketForm.addEventListener("submit", function (event) {
  event.preventDefault();

  createTicket();
});

attendNextButton.addEventListener("click", function () {
  attendNextTicket();
});

// 4. Create a new ticket
function createTicket() {
  const customerName = customerNameInput.value.trim();
  const serviceType = serviceTypeInput.value;
  const isPriority = priorityCustomerInput.checked;

  if (customerName === "") {
    showMessage("Customer name is required.", "error");
    return;
  }

  const newTicket = {
    id: Date.now(),
    ticketNumber: ticketCounter,
    customerName: customerName,
    serviceType: serviceType,
    isPriority: isPriority,
    status: "Pending",
    createdAt: new Date(),
    attendedAt: null,
    cancelledAt: null,

  };

  tickets.push(newTicket);
  ticketCounter++;

  clearForm();
  showMessage("Ticket created successfully.", "success");
  renderApp();
}

// 5. Render pending tickets
function renderPendingTickets() {
  const pendingTickets = tickets.filter(function (ticket) {
    return ticket.status === "Pending";
  });

  pendingTicketsElement.innerHTML = "";

  if (pendingTickets.length === 0) {
    pendingTicketsElement.innerHTML = "<p>No pending tickets yet.</p>";
    return;
  }

  pendingTickets.forEach(function (ticket) {
    const ticketCard = document.createElement("div");
    ticketCard.classList.add("ticket-card");

    if (ticket.isPriority) {
      ticketCard.classList.add("priority");
    }

    ticketCard.innerHTML = `
      <h3>Ticket #${ticket.ticketNumber}</h3>
      <p><strong>Customer:</strong> ${ticket.customerName}</p>
      <p><strong>Service:</strong> ${ticket.serviceType}</p>
      <p><strong>Priority:</strong> ${ticket.isPriority ? "Yes" : "No"}</p>
      <p><strong>Status:</strong> ${ticket.status}</p>
      <p><strong>Created At:</strong> ${formatDate(ticket.createdAt)}</p>
      <button class="btn btn-danger" onclick="cancelTicket(${ticket.id})">
        Cancel
      </button>
    `;

    pendingTicketsElement.appendChild(ticketCard);
  });
}

// 6. Attend next ticket
function attendNextTicket() {
  const pendingTickets = tickets.filter(function (ticket) {
    return ticket.status === "Pending";
  });

  if (pendingTickets.length === 0) {
    showMessage("No pending tickets available.", "error");
    return;
  }

  let nextTicket = pendingTickets.find(function (ticket) {
    return ticket.isPriority === true;
  });

  if (!nextTicket) {
    nextTicket = pendingTickets[0];
  }

  nextTicket.status = "Attended";
  nextTicket.attendedAt = new Date();

  showMessage(`Ticket #${nextTicket.ticketNumber} attended.`, "success");
  renderApp();
}

// 7. Cancel ticket
function cancelTicket(ticketId) {
  const ticket = tickets.find(function (ticket) {
    return ticket.id === ticketId;
  });

  if (!ticket) {
    showMessage("Ticket not found.", "error");
    return;
  }

  if (ticket.status !== "Pending") {
    showMessage("Only pending tickets can be cancelled.", "error");
    return;
  }

  ticket.status = "Cancelled";

  showMessage(`Ticket #${ticket.ticketNumber} cancelled.`, "success");
  renderApp();
}

// 8. Render ticket history
function renderTicketHistory() {
  const historyTickets = tickets.filter(function (ticket) {
    return ticket.status === "Attended" || ticket.status === "Cancelled";
  });

  ticketHistoryElement.innerHTML = "";

  if (historyTickets.length === 0) {
    ticketHistoryElement.innerHTML = "<p>No ticket history yet.</p>";
    return;
  }

  historyTickets.forEach(function (ticket) {
    const historyCard = document.createElement("div");
    historyCard.classList.add("ticket-card");

    if (ticket.status === "Attended") {
      historyCard.classList.add("attended");
    }

    if (ticket.status === "Cancelled") {
      historyCard.classList.add("cancelled");
    }

    historyCard.innerHTML = `
      <h3>Ticket #${ticket.ticketNumber}</h3>
      <p><strong>Customer:</strong> ${ticket.customerName}</p>
      <p><strong>Service:</strong> ${ticket.serviceType}</p>
      <p><strong>Priority:</strong> ${ticket.isPriority ? "Yes" : "No"}</p>
      <p><strong>Status:</strong> ${ticket.status}</p>
      <p><strong>Created At:</strong> ${formatDate(ticket.createdAt)}</p>
      <p><strong>Attended At:</strong> ${formatDate(ticket.attendedAt)}</p>
      <p><strong>Cancelled At:</strong> ${formatDate(ticket.cancelledAt)}</p>
    `;

    ticketHistoryElement.appendChild(historyCard);
  });
}

// 9. Update statistics
function updateStatistics() {
  const pendingCount = tickets.filter(function (ticket) {
    return ticket.status === "Pending";
  }).length;

  const attendedCount = tickets.filter(function (ticket) {
    return ticket.status === "Attended";
  }).length;

  const cancelledCount = tickets.filter(function (ticket) {
    return ticket.status === "Cancelled";
  }).length;

  const totalCount = tickets.length;

  pendingCountElement.textContent = pendingCount;
  attendedCountElement.textContent = attendedCount;
  cancelledCountElement.textContent = cancelledCount;
  totalCountElement.textContent = totalCount;
}

// 10. Show messages
function showMessage(text, type) {
  messageElement.textContent = text;

  messageElement.classList.remove("success", "error");

  if (type) {
    messageElement.classList.add(type);
  }
}

// 11. Clear form
function clearForm() {
  customerNameInput.value = "";
  serviceTypeInput.selectedIndex = 0;
  priorityCustomerInput.checked = false;
}
function formatDate(date) {
    if(!date){
        return "Not available";
    }
    return date.toLocaleString();
}

// 12. Render the full app
function renderApp() {
  renderPendingTickets();
  renderTicketHistory();
  updateStatistics();
}

// 13. Initial render
renderApp();