
const Modal = {
    open(){
       // Abrir Modal
       // Adicionar a class active ao modal
       document
        .querySelector('.modal-overlay')
        .classList
        .add('active')

    },
    close(){
        // Fechar Modal
        // Remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("jedi.finances:transactions")) || []
    },
    set(transactions){
        localStorage.setItem("jedi.finances:transactions", 
        JSON.stringify(transactions))
    }

}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)
        App.reload()
    },
    income_value(){
        let income = 0;
        Transaction.all.forEach(_transaction => {
            if( _transaction.amount > 0) {
                income += _transaction.amount;
            }
        })
        return income;
    },
    expense_value(){
        let expense = 0;
        Transaction.all.forEach(_transaction => {
            if( _transaction.amount < 0) {
                expense += _transaction.amount;
            }
        })
        return expense;
    },
    return_value(){
        
        return Transaction.income_value() + Transaction.expense_value()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(_transaction, _index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(_transaction, _index)
        tr.dataset._index = _index

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(_transaction, _index){
        const CSSclass = _transaction.amount > 0 ? "income" :
        "expense"

        const amount = Utils.formatCurrency(_transaction.amount)

        const html = `
            <td class="description">${_transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="risk">${_transaction.risk}</td>
            <td class="startdate">${_transaction.startdate}</td>
            <td class="enddate">${_transaction.enddate}</td>
            <td class="button">
                <span onclick="Transaction.remove(${_index})" class="material-icons gray">remove_circle</span>
                <span class="material-icons purple">insights</span>
                <span class="material-icons green">create</span>
            </td>
        `
        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.income_value())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expense_value())
        document
            .getElementById('returnDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.return_value())
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }

}

const Utils = {

    formatAmount(value){
        value = Number(value) * 100

        return value
    },

    formatRisk(value){
        value = Number(value)

        return value
    },

    formatDate(date){
       
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : 
        ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value 
    }
}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    risk: document.querySelector('input#risk'),
    startdate: document.querySelector('input#startdate'),
    enddate: document.querySelector('input#enddate'),
    people: document.querySelector('input#people'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            risk: Form.risk.value,
            startdate: Form.startdate.value,
            enddate: Form.enddate.value,
            people: Form.people.value   
        }
    },

    validateFields() {

        const { description, amount, risk, startdate, enddate, people } = Form.getValues()

        if( description.trim() === "" || 
            amount.trim() === "" || 
            risk.trim() === "" || 
            startdate.trim() === "" || 
            enddate.trim() === "" || 
            people.trim() === "" ) {
                throw new Error("Por favor preencha todos os campos")
            }
        
    },

    formatValues(){
        let { description, amount, risk, startdate, enddate, people } = Form.getValues()
        amount = Utils.formatAmount(amount)
        risk = Utils.formatRisk(risk)
        startdate = Utils.formatDate(startdate)
       
        enddate = Utils.formatDate(enddate)
        console.log(enddate)

        return {
            description,
            amount,
            risk,
            startdate,
            enddate,
            people
        }

    },

    saveTransaction(transaction){
        Transaction.add(transaction)
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.risk.value = ""
        Form.startdate.value = ""
        Form.enddate.value = ""
        Form.people.value = ""
    },

    submit(event){
        event.preventDefault()

        try {
            
            Form.validateFields()
            const transaction = Form.formatValues()
            Form.saveTransaction(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }

       
 

    },
}

const App = {
        init(){

            Transaction.all.forEach((_transaction, _index) => {
                DOM.addTransaction(_transaction, _index)
            })
        
            DOM.updateBalance()
        
            Storage.set(Transaction.all)
        },
        reload(){
            DOM.clearTransactions()
            App.init()
        },

}

App.init()

 

  

 