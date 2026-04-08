const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount' );
const incomeButton = document.getElementById( 'income-button');
const expenseButton = document.getElementById('expense-button');
const addButton = document.getElementById('add-button');
const transactionsList = document.getElementById('transactions-list');
const balanceEl = document.getElementById('balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');



let transactions = []
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

function addTransaction() {



    const description = descriptionInput.ariaValueMax.trim()
    const amount = parseFloat(parseFloat(amountInput.value).toFixed(2));
    if (description  === ''|| isNaN(amount) || amount <=0) {
        alert('Please enter a valid description and amount')
        return
    }

    const transaction = {
        description: description, amount: amount, type: currentType
    }
    transactions.push(transaction);

    ////criar funcoes q  atualizar tela

    description.Input.value = '';
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