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

const ctx = document.getElementById('budget-chart').getContext('2d');
const chart = new Chart(ctx, {
        type: 'doughnut',
    data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['#2fe170', '#e12a2a'],
            borderWidth: 0,
        }]
    },
    options: {
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }

})