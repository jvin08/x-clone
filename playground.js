let myLeads = [];

const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");

const deleteBtn = document.getElementById("delete-btn")
const tabBtn = document.getElementById("tab-btn");

// Get the leads from the localStorage - PS: JSON.parse()
// Store it in a variable, leadsFromLocalStorage
// Log out the variable
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
// 1. Check if leadsFromLocalStorage is truthy
// 2. If so, set myLeads to its value and call renderLeads()
if(leadsFromLocalStorage){
    myLeads = leadsFromLocalStorage;
    render(myLeads); 
}


tabBtn.addEventListener("click", function(){
    // working only with manifest permissions
    chrome.tabs.query({ active: true, currentWindow: true}, function(tabs){
        myLeads.push(tabs[0].url)
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render(myLeads)
    })
})

function render(leads) {
    const ulEl = document.getElementById("ul-el")
    // 1. Create a variable, listItems, to hold all the HTML for the list items
    // Assign it to an empty string to begin with
    let listItems = "";
    ulEl.innerHTML = "";
    for (let i = 0; i < leads.length; i++) {
    // 2. Add the item to the listItems variable instead of the ulEl.innerHTML
    listItems += `
        <li>
            <a target = '_blank' href='${leads[i]}'>
                ${leads[i]}
            </a>
        </li>
        `
    // console.log(listItems);
    // create element
    // set text content
    // append to ul
    // const li = document.createElement("li");
    // li.textContent = leads[i];
    // ulEl.append(li);
}
    // 3. Render the listItems inside the unordered list using ulEl.innerHTML
    ulEl.innerHTML += listItems;
}

deleteBtn.addEventListener("dblclick", function(){
    localStorage.clear();
    myLeads = [];
    render(myLeads); 
})

inputBtn.addEventListener("click", function(){
    if(inputEl.value){
        myLeads.push(inputEl.value);
        inputEl.value = "";
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render(myLeads); 
    }
})



