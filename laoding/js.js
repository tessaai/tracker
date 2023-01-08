const notifications = document.querySelector(".notifications"),
  buttons = document.querySelectorAll(".buttons .btn");
const toastDetails = {
  timer: 5000,
  success: {
    icon: "fa-circle-check",
    text: "Success: This is a success toast.",
  },
  error: {
    icon: "fa-circle-xmark",
    text: "Error: This is an error toast.",
  },
  warning: {
    icon: "fa-triangle-exclamation",
    text: "Warning: This is a warning toast.",
  },
  info: {
    icon: "fa-circle-info",
    text: "Info: This is an information toast.",
  },
};

const removeToast = (toast) => {
  toast.classList.add("hide");
  if (toast.timeoutId) clearTimeout(toast.timeoutId); 
  setTimeout(() => toast.remove(), 500); 
};

const createToast = (id) => {
  const { icon, text } = toastDetails[id];
  const toast = document.createElement("li"); 
  toast.className = `toast ${id}`; 
  toast.innerHTML = `<div class="column">
                         <i class="fa-solid ${icon}"></i>
                         <span>${text}</span>
                      </div>
                      <i class="fa-solid faul-xmark" onclick="removeToast(this.parentElement)"></i>`;
  notifications.appendChild(toast); 
  toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
};
buttons.forEach((btn) => {
  btn.addEventListener("click", () => createToast(btn.id));
});
document.getElementById("expForm").addEventListener("submit", addTransaction);
const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let type = document.getElementById("type").value;
let name = document.getElementById("name").value;
let amount = document.getElementById("amount").value;
if (type != "chooseOne" && name.length > 0 && amount > 0) {
  const transaction = {
    type,
    name,
    amount,
    id:
      transactions.length > 0
        ? transactions[transactions.length - 1].id + 1
        : 1,
  };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
document.getElementById("expForm").reset();
showTransactions();
updateBalance();

const showTransactions = () => {
  const transactionTable = document.getElementById("transactionTable");
  transactionTable.innerHTML = "";
  for (let i = 0; i < transactions.length; i++) {
    transactionTable.innerHTML += `
         <tr>
             <td>${transactions[i].type}</td>
             <td>${transactions[i].name}</td>
             <td>$${transactions[i].amount}</td>
             <td><a class="deleteButton" onclick="deleteTransaction(${transactions[i].id})">
                 Delete</td>
         </tr>
     `;
  }
};
const deleteTransaction = (id) => {
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].id == id) {
      transactions.splice(i, 1);
    }
  }
  
  localStorage.setItem("transactions", JSON.stringify(transactions));
  showTransactions();
  updateBalance();
};
const updateBalance = () => {
  let balance = 0;
  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      balance += Number(transaction.amount);
    } else if (transaction.type === "expense") {
      balance -= transaction.amount;
    }
  });
  document.querySelector(".balance").textContent = balance;
};
