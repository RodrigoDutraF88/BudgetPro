const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount' );
const incomeButton = document.getElementById( 'income-button');
const expenseButton = document.getElementById('expense-button');
const addButton = document.getElementById('add-button');
const transactionsList = document.getElementById('transactions-list');
const balanceDisplay = document.getElementById('balance');
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpenseDisplay = document.getElementById('total-expense');
const rateDisplay = document.getElementById('rate-display');
let exchangeRate = 0.18;

const buttonReais = document.getElementById('brasil');
const buttonDollar = document.getElementById('usa');
const sortSelect = document.getElementById('sort-select');

const exportCSV = document.getElementById('export');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentType = 'income';
let currentCurrency = localStorage.getItem('currency') || 'R$';


const todayDate = document.getElementById('today-date');
if (todayDate) {
    
    if(currentCurrency=== 'R$'){
        todayDate.textContent = new Date().toLocaleDateString('pt-Br', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
        });       
    } else{
            todayDate.textContent = new Date().toLocaleDateString('en-Us', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
        });
    }
}


async function fetchExchangeRate() {
    try {
        const response = await fetch('https://api.frankfurter.dev/v2/rate/BRL/USD');
        const data = await response.json();
        exchangeRate = data.rate;
        rateDisplay.textContent = `1 BRL = ${exchangeRate.toFixed(4)}USD`;
    } catch (error) {
        rateDisplay.textContent = 'Rate unavailable, using estimate';
        console.log('Exchange rate fetch failed:', error);
    }
}

buttonReais.addEventListener('click', function(){
    currentCurrency = 'R$'
    localStorage.setItem('currency', 'R$')
    buttonReais.classList.add('active');
    buttonDollar.classList.remove('active');
    rateDisplay.textContent = `1 BRL = ${exchangeRate.toFixed(4)} USD`;
    renderTransactions();
    updateSummaryAndChart();
});

buttonDollar.addEventListener('click', function(){
    currentCurrency = '$'
    localStorage.setItem('currency', '$')
    buttonReais.classList.remove('active');
    buttonDollar.classList.add('active');
    rateDisplay.textContent = `1 BRL = ${exchangeRate.toFixed(4)} USD`;
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

function getDisplayAmount(amount){
    if (currentCurrency ==='$'){
        return (amount * exchangeRate).toFixed(2)
    } return amount.toFixed(2);
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
        
        const date = new Date(sorted[i].date);
        const dateFormatted = date.toLocaleDateString('pt-Br', { 
        month: 'short', 
        day: 'numeric' 
        });
        li.innerHTML = `
        <span class="description ${sorted[i].type}"> ${sorted[i].description}</span>
        <span class="date">${dateFormatted}</span>
        <span class="amount ${sorted[i].type}"> ${sign}${currentCurrency}${getDisplayAmount(sorted[i].amount)}</span>
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
    totalIncomeDisplay.innerHTML = `${currentCurrency}${getDisplayAmount(totalIncome)}`
    totalExpenseDisplay.innerHTML = `${currentCurrency}${getDisplayAmount(totalExpense)}`
    balanceDisplay.innerHTML = `${currentCurrency}${getDisplayAmount(balance)}`
    chart.data.datasets[0].data = [totalIncome, totalExpense];
    chart.update()
}

function deleteTransaction(date){
    transactions = transactions.filter(t=> t.date !== Number(date))
    
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


function exportToCSV() {
    if (transactions.length === 0) {
        alert('No transactions to export')
        return
    }
    const header ='Description,Amount,Type,Date';
    const rows = [];
    for (let i =0; i < transactions.length;i++) {
        const t = transactions[i];
        const description = t.description
        const amount = getDisplayAmount(t.amount)
        const type = t.type
        const date = new Date(t.date).toLocaleDateString('pt-Br', { month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        rows.push(`${description},${amount},${type},${date}`);
    }
    const csvContent = header + '\n' + rows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a');
    a.href = url;
    a.download = `budgetpro-transactions-${new Date().toLocaleDateString('pt-Br')}.csv`;
    a.click()
    URL.revokeObjectURL(url);
}



exportCSV.addEventListener('click', exportToCSV);
addButton.addEventListener('click' , addTransaction)
renderTransactions()
updateSummaryAndChart()
fetchExchangeRate()

