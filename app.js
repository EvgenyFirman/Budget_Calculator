// ******** BUDGET APP BY EUGENE FIRMAN *********

// BUDGET CONTROLLER
let budgetController = (function(){
    // Income Function Constructor
    let Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }
     // Expense Function Constructor
    let Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    // Expense Prototype Calculate Percentage Method
    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }
    // Expense Prototype Get Percentage Method
    Expense.prototype.getPercentage = function(){
        return this.percentage
    }
    // Private Calculate Total Income Function
    let calculateTotal = function(type){
        let sum = 0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value
        })
        data.totals[type] = sum;
    };

    // Data Store Object
    let data = {
        allItems : {
            inc: [],
            exp: []
        },
        totals:{
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    }

    // BUDGET CONTROLLER RETURNS 
    return {
        // Add Item Function
        addItem: function(type,desc,value){
            let newItem , ID;
            // ID Definition
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Type vary statement
            if (type === "exp"){
                newItem = new Expense(ID,desc,value);
            } else if (type === "inc"){
                newItem = new Income(ID,desc,value);
            }
            // Adding items to data 
            data.allItems[type].push(newItem);
            // Return added item
            return newItem;
        },
        calculateBudget(){
            calculateTotal("exp");
            calculateTotal("inc")
            

            // calculate total: income - expenses 
            data.budget = data.totals.inc - data.totals.exp;
            // calculate percentage of income
            if (data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            
        },
        getBudget(){
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            }
        },
        deleteItem(type,id){
            let ids = data.allItems[type].map(function(current){
                return current.id
            })

            let index = ids.indexOf(id)

            if (index !== 1){
                data.allItems[type].splice(index,1)
            }
        },
        calculatePercentages(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc)
            })
        },
        getPercentages(){
            let allPercentages = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            })
            return allPercentages;
        },
        test(){
            console.log(data)
        }
    }
    

})();

// USER INTERFACE CONTROLLER
let uiController = (function(){

    // DOM STRINGS DEFINITION
    let stringsDOM = {
        stringsType: ".add__type",
        stringsDesc: ".add__description",
        stringsVal: ".add__value",
        stringsBTN: ".add__btn",
        expensesContainer: ".expenses__list",
        incomeContainer: ".income__list",
        budgetLabel: ".budget__value",
        incomeLabel:".budget__income--value",
        expensesLabel:".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercLabel: ".item__percentage",
        dateLabel: ".budget__title--month"
    }

    // Format Number Function
    let formatNumber = function (num,type){
        let numSplit,int,dec;
        num = Math.abs(num)
        num = num.toFixed(2);
        numSplit = num.split(".")
        int = numSplit[0];
        if (int.length > 3){
            int = int.substr(0,int.length - 3) + "," + int.substr(int.length - 3,int.length);
        }
        dec = numSplit[1];
        return (type === "exp" ? "-" :  "+") + " " + int + "." + dec;
    };
    let nodeListForEach = function(list,callback){
        for(let i = 0; i < list.length; i++ ){
            callback(list[i],i)
        }
    }
    // uiController RETURN
    return {
        // GET VALUE BY USER FUNCTION
        getValue: function(){
            // RETURN VALUE ENTERED BY USER
            return {
                type: document.querySelector(stringsDOM.stringsType).value,
                description: document.querySelector(stringsDOM.stringsDesc).value,
                val: parseFloat(document.querySelector(stringsDOM.stringsVal).value),
            }
        }, 
        // RETURN GET STRINGS TO RECIEVE ACCESS FROM APP CONTROLLER
        getStrings: function() {
            return stringsDOM;
        },
        //addListItem RENDERS INFO FROM INPUT IN DOM
        addListItem: function(obj,type){
            let html;
            // DEFINE TYPE INC OR EXP TO RENDER ELEMENT
            if (type === "inc"){
                element = stringsDOM.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if(type === "exp") {
                element = stringsDOM.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value))

            // INSERT HTML INTO DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        deleteListItem(selectorID){
            let el = document.getElementById(selectorID)
             el.parentNode.removeChild(el);
        },
        clearFields: function(){
            // DECLARE FIELDS FIELDS ARR VARIABLES
            let fields, fieldsArr;
            // Define Fields Variable
            fields = document.querySelectorAll(stringsDOM.stringsDesc + " , " + stringsDOM.stringsVal);
            
            // fieldsARR Return array trick
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(element => {
                element.value = "";
            });
            document.querySelector(".add__description").focus()

        },
        displayBudget(obj){

            let type;
            obj.budget > 0 ? type = "inc": type = "exp";
            document.querySelector(stringsDOM.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(stringsDOM.incomeLabel).textContent = formatNumber(obj.totalInc,"inc");
            document.querySelector(stringsDOM.expensesLabel).textContent = formatNumber(obj.totalExp,"exp");
            if (obj.percentage > 0) {
                document.querySelector(stringsDOM.percentageLabel).textContent = obj.percentage + " %";
            } else {
                document.querySelector(stringsDOM.percentageLabel).textContent = "---";
            }
            
        },
        displayPercentages(percentages){
            let fields = document.querySelectorAll(stringsDOM.expensesPercLabel);

            nodeListForEach(fields, function(current,index){
                if (percentages[index] > 0){
                    current.textContent = percentages[index] + "%";
                } else {
                    current.textContent = "---"
                }
            })
        },
        displayDate(){
            let now, year,month,months;
            months = ["January", "February", "March", "April","May", "June", "July", "August", "September", "October", "November","December"]
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth()
            document.querySelector(stringsDOM.dateLabel).textContent = months[month] + " " + year;
        },
        changedType(){
            let fields;
            fields = document.querySelectorAll(stringsDOM.stringsType + "," + stringsDOM.stringsDesc + "," + stringsDOM.stringsVal)
            nodeListForEach(fields,function(cur){
                cur.classList.toggle("red-focus");
            })
            document.querySelector(stringsDOM.stringsBTN).classList.toggle("red")
        }
    }

})(); 
// APP CONTROLLER 
let appController = (function(budgetCtrl,uiCtrl){

    // FUNCTION WHICH HOLDS EVENT LISTENERS
    function setEventListeners(){
    // GET STRINGS IMPORT FROM uiController
     let DOM = uiCtrl.getStrings();

    //  ADD ITEM EVENT LISTENER
    document.querySelector(DOM.stringsBTN).addEventListener("click", addItem);

    // Delete Item Event Listener

    document.querySelector(DOM.container).addEventListener("click",deleteItem)

    document.querySelector(DOM.stringsType).addEventListener("change", uiCtrl.changedType )
    }

    // Update Budget Function
    let updateBudget = function(){
        // Calculate Budget
        budgetCtrl.calculateBudget();

        // Return Budget
        let budget = budgetCtrl.getBudget();

        // Display Budget in UI
        uiCtrl.displayBudget(budget)
    }

    // Delete Item Function
    let deleteItem = function(event){
        let itemID,type,ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID)

        if (itemID) {
            splitID = itemID.split("-")
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // Delete item from data structure
            budgetCtrl.deleteItem(type,ID)
            // Delete item from UI
            uiCtrl.deleteListItem(itemID); 
            // Update and show new budget
            updateBudget();
            // Calculate Update Percentages
            updatePercentages()
        }
    }

    // Update Percentage Function

    
    let updatePercentages = function(){

        // 1. Calculate Percentages 
        budgetCtrl.calculatePercentages()
        // 2. Read Percentages from Budget uiController
        let percentages = budgetCtrl.getPercentages()
        // 3. Update UI with new percentages
        uiCtrl.displayPercentages(percentages);
    }

  

    // FUNCTION WHICH ADDS ITEM
    function addItem(){
        let newItem, input;
        input = uiCtrl.getValue();
        if (input.description !== "" && !isNaN(input.val) && input.val !== 0){
            newItem = budgetCtrl.addItem(input.type,input.description,input.val)
            uiCtrl.addListItem(newItem,input.type)
            uiCtrl.clearFields()
            updateBudget();
            updatePercentages()
        }
    }
    return {
        init: function(){
            console.log("app has been started")
            uiCtrl.displayBudget({
                totalInc: 0,
                totalExp: 0,
                budget: 0,
                percentage: 0

            })
            uiCtrl.displayDate();
            setEventListeners();
        }
    }

})(budgetController,uiController);

appController.init();