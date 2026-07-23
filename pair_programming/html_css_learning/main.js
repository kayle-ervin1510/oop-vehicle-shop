console.log("JS is connected from main.js");

const pageTitle = document.querySelector("#page-title");
const statusMethod = document.querySelector("#status-message");
const changeTitleButton = document.quertySelector("#change-title-button");
const userForm = document.querySelector("#user-form");
const formOutput = document.querySelector("#form-output");
const dynamicContainer = document.querySelector("#dynamic-container");
const addBoxButton = document.querySelector("#add-box-button")

console.log("Selected element", pageTitle);


const changeTitle = () =>{
	pageTitle.innerText="JavaScript changed the DOM";
	statusMessage.innerText="This page did not reload. JS changed exsiting element.";
}

changeTitleButton.addEventListener("click", changeTitle)

const handleFormSubmit=(event)=>{
	event.preventDefault()
	console.log(event)
	const formData = new FormData(event.target)
	console.log(formData)
	const userData = Object.fromEntries(formData)
	console.log(userData)
	
	const reminderText = userData.wantsNewsletter == "yes" 
	? "You asked for reminders." 
	: "You did not ask for reminders"

	formOutput.innerText = `Hello ${userData.userName}. You favorite color is ${user.Data.favoriteColor}. ${reminderText}`
	formOutput.style.color = user.Data.favoriteColor
}

userForm.addEventListener("submit", handleFormSubmit);

const addDemoDiv=()=>{
	const demoDiv = document.createElement("div");
	demoDiv.innerText= "I was created by JavaScript.";
	demoDiv.className = "demo-box";
	dynamicContainer.appendChild(demoDiv);
    statusMessage.innterText = "JavaScript created a new div and something or other"

}

addBoxButton.addEventListener("click", addDemoDiv)

const removeDemoDiv=()=>{
    const lastBox = dynamicContainer.lastElementChild;
    console.log(lastBox);
    if (lastBox == null){
        statusMessage.innerText="There is no div to remove."
        return;
    }
    lastBox.remove()
    statusMessage.innerText = "JS removed a div from the page"
}

removeBoxButton.addEventListener("click", removeDemoDiv)
