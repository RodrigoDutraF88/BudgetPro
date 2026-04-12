const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount' );
const incomeButton = document.getElementById( 'income-button');
const expenseButton = document.getElementById('expense-button');
const addButton = document.getElementById('add-button');
const transactionsList = document.getElementById('transactions-list');
const balanceDisplay = document.getElementById('balance');
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpenseDisplay = document.getElementById('total-expense');

const buttonReais = document.getElementById('brasil');
const buttonDollar = document.getElementById('usa');
const sortSelect = document.getElementById('sort-select');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentType = 'income';
let currentCurrency = localStorage.getItem('currency') || 'R$';

buttonReais.addEventListener('click', function(){
    currentCurrency = 'R$'
    localStorage.setItem('currency', 'R$')
    buttonReais.classList.add('active');
    buttonDollar.classList.remove('active');
    renderTransactions();
    updateSummaryAndChart();
});

buttonDollar.addEventListener('click', function(){
    currentCurrency = '$'
    localStorage.setItem('currency', '$')
    buttonReais.classList.remove('active');
    buttonDollar.classList.add('active');
    renderTransactions();
    updateSummaryAndChart();
});

sortSelect.addEventListener('change', function() {
    renderTransactions();
});



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


function getSortedTransactions() {
    const sorted= [...transactions];
    const value= sortSelect.value
    switch(value){
        case 'newest':
            sorted.sort((a,b) => b.date - a.date)
            return sorted
        case 'oldest':
            sorted.sort((a,b) => a.date - b.date)
            return sorted
        case 'highest':
            sorted.sort((a,b) => b.amount - a.amount)
            return sorted
        case 'lowest':
            sorted.sort((a,b) => a.amount - b.amount)
            return sorted

    }
}


function renderTransactions() {
    transactionsList.innerHTML = ''

    if(transactions.length ===0){
        transactionsList.innerHTML ='<li>No transactions yet</li>';
        return
    }
    const sorted = getSortedTransactions();
    for(let i= 0; i< sorted.length; i++){
        const li = document.createElement('li')
        const sign = sorted[i].type == 'income' ? '+' : '-';
        li.innerHTML = `
        <span class="description"> ${sorted[i].description}</span>
        <span class="amount ${sorted[i].type}"> ${sign}R$${sorted[i].amount}</span>
        <button class="delete-button" onclick="deleteTransaction('${sorted[i].date}')">✕</button>`
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
    totalIncomeDisplay.innerHTML = `${currentCurrency}${totalIncome.toFixed(2)}`
    totalExpenseDisplay.innerHTML = `${currentCurrency}${totalExpense.toFixed(2)}`
    balanceDisplay.innerHTML = `${currentCurrency}${balance.toFixed(2)}`
    chart.data.datasets[0].data = [totalIncome, totalExpense];
    chart.update()
}

function deleteTransaction(date){
    transactions.filter(transaction=> transaction.date !== date)
    
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
        description: description, amount: amount, type: currentType, date: Date.now()
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
            borderWidth: 0,
            hoverOffset: 10,
        }]
    },
    options: {
        cutout: '72%',
        animation: { animateRotate:true, duration: 2000, easing: 'easeInOutCubic'},
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }

})


if(currentCurrency === '$'){
    buttonDollar.classList.add('active')
    buttonReais.classList.remove('active')
}

addButton.addEventListener('click' , addTransaction)
renderTransactions()
updateSummaryAndChart()