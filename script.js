const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount' );
const incomeButton = document.getElementById( 'income-button');
const expenseButton = document.getElementById('expense-button');
const addButton = document.getElementById('add-button');
const transactionsList = document.getElementById('transactions-list');
const balanceDisplay = document.getElementById('balance');
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpenseDisplay = document.getElementById('total-expense');



let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentType = 'income';

incomeButton.addEventListener('click', function() {
    currentType = 'income'
    incomeButton.classList.add('active')
    expenseButton.classList.remove('active')
});

expenseButton.addEventListener('click', function() {
    currentType = 'expense'
    incomeButton.classList.remove('active')
    expenseButton.classList.add('active')
});


function renderTransactions() {
    transactionsList.innerHTML = ''

    for(let i= 0; i< transactions.length; i++){
        const li = document.createElement('li')
        const sign = transactions[i].type == 'income' ? '+' : '-';
        li.innerHTML = `
        <span class="description"> ${transactions[i].description}</span>
        <span class="amount ${transactions[i].type}"> ${sign}R$${transactions[i].amount}</span>
        <button class="delete-button" onclick="deleteTransaction(${i})">✕</button>`
        transactionsList.appendChild(li);
    }

}



function updateSummaryAndChart(){
    let totalIncome = 0
    let totalExpense = 0

    for(let i = 0;i< transactions.length; i++){
        if(transactions[i].type == 'income'){
            totalIncome += transactions[i].amount;
        }else{
            totalExpense +=transactions[i].amount;
        }
    }

    
    const balance = totalIncome - totalExpense;
      if ( balance < 0){
        balanceDisplay.classList.add("negative");
    }else{
        balanceDisplay.classList.remove("negative");
    }
    totalIncomeDisplay.innerHTML = `$R$${totalIncome.toFixed(2)}`
    totalExpenseDisplay.innerHTML = `R$${totalExpense.toFixed(2)}`
    balanceDisplay.innerHTML = `R$${balance.toFixed(2)}`
    chart.data.datasets[0].data = [totalIncome, totalExpense];
    chart.update()
}

function deleteTransaction(index){
    transactions.splice(index, 1)
    saveTransactions();
    renderTransactions()
    updateSummaryAndChart();

}

function saveTransactions(){
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addTransaction() {



    const description = descriptionInput.value.trim()
    const amount = parseFloat(parseFloat(amountInput.value).toFixed(2));
    if (description  === ''|| isNaN(amount) || amount <=0) {
        alert('Please enter a valid description and amount')
        return
    }

    const transaction = {
        description: description, amount: amount, type: currentType
    }
    transactions.push(transaction);

    saveTransactions();
    renderTransactions();
    updateSummaryAndChart();



    descriptionInput.value = '';
    amountInput.value = ''
    
}


const ctx = document.getElementById('budget-chart').getContext('2d');
const chart = new Chart(ctx, {
        type: 'doughnut',
    data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [1.5, 1],
            backgroundColor: ['#2fe170', '#e12a2a'],
            borderWidth: 3,
        }]
    },
    options: {
        cutout: '66%',
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }

})




addButton.addEventListener('click' , addTransaction)
renderTransactions()
updateSummaryAndChart()