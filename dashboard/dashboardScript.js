document.addEventListener("DOMContentLoaded", function() {
const dropdown = document.querySelector(".custom-dropdown");
const selected = dropdown.querySelector(".selected");
const optionsList = dropdown.querySelector(".dropdown-options");

// Toggle dropdown on click
selected.addEventListener("click", function(event) {
    optionsList.classList.toggle("show");
    event.stopPropagation(); // Prevent click from propagating
});

// Handle selection
optionsList.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", function(event) {
        selected.textContent = this.textContent;
        selected.setAttribute("data-value", this.getAttribute("data-value"));
        optionsList.classList.remove("show"); // Close dropdown
        event.stopPropagation(); // Prevent event bubbling
    });
});

// Close dropdown when clicking outside
document.addEventListener("click", function(event) {
    if (!dropdown.contains(event.target)) {
        optionsList.classList.remove("show");
    }
});
});



function copyToClipboard() {
    const text = document.getElementById("popup-text").textContent;

    // Create a temporary textarea to copy text
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);

    // Show a confirmation alert or change button text
    alert("Copied to clipboard!");
}



function loadTextFile(filename) {
const timestamp = new Date().getTime(); // Generate a unique timestamp
const fileUrl = `${filename}?t=${timestamp}`; // Append it to the filename

fetch(fileUrl)
    .then(response => response.text())
    .then(text => {
        document.getElementById("popup-title").textContent = filename;
        document.getElementById("popup-text").textContent = text; // Ensure indentation remains
        showPopup();
    })
    .catch(error => alert("Error loading file: " + error));
}

function openPopup(title, contentSource, isFile = false) {
    document.getElementById("popup-title").textContent = title;

    if (isFile) {
        fetch(contentSource)
            .then(response => response.text())
            .then(text => {
                document.getElementById("popup-text").textContent = text;
                showPopup();
            })
            .catch(error => alert("Error loading file: " + error.message));
    } else {
        document.getElementById("popup-text").textContent = contentSource;
        showPopup();
    }
}

function showPopup() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}




function showElement() {
    document.getElementById("displayed-text").style.display = "block";
}
function hideElement() {
    document.getElementById("displayed-text").style.display = "none";
}


// New Window
function openNewWindow() {
    window.open("https://rohit-automation.netlify.app/", "_blank", "width=800,height=600");
}


// Dran and Drop
const draggable = document.getElementById("draggable");
const droppable = document.getElementById("droppable");
draggable.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.id);
        e.target.classList.add("dragging");
});

window.addEventListener("uncaught:exception", (e) => {
    console.error("Drag error:", e.detail);
});

draggable.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
});

droppable.addEventListener("dragover", (e) => {
    e.preventDefault();
});

droppable.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggedElementId = e.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(draggedElementId);
    e.target.appendChild(draggedElement);
});    


// Resizable
const box = document.getElementById("resizableBox");
    const resizer = box.querySelector(".resizer");

    let isResizing = false;

    resizer.addEventListener("mousedown", function (e) {
      isResizing = true;

      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", () => {
        isResizing = false;
        window.removeEventListener("mousemove", resize);
      });
    });

    function resize(e) {
      if (!isResizing) return;
      box.style.width = e.clientX - box.getBoundingClientRect().left + "px";
      box.style.height = e.clientY - box.getBoundingClientRect().top + "px";
    }

// Slider
const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");
slider.addEventListener("input", () => {
    event.preventDefault();
    sliderValue.style.display = "block";
    sliderValue.style.color = "black";
    sliderValue.innerHTML = `Value: ${slider.value}`;

    // Clear any existing timer
    clearTimeout(resetTimer);

    // Start a new 5-second timer to reset the box
    resetTimer = setTimeout(() => {
        sliderValue.style.display="none";
    }, 5000);
});


// Right Click
const rightClickButton = document.getElementById("rightClick");
const rightClickText = document.getElementById("rclick");
rightClickButton.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    rclick.style.display = "block";
    rclick.innerHTML = "✅ You right-clicked the button!";
    rclick.style.color = "black";

    setTimeout(() => {
        rclick.style.display = "none";
    }, 5000);
});


// Double Click
function showText() {
    const dclick = document.getElementById("dclick");
    dclick.style.display = "block";
    dclick.innerHTML = "✅ You double-clicked the button!";
    dclick.style.color = "black";

    setTimeout(() => {
      dclick.style.display = "none";
    }, 5000);
  }
  // Optional if not using inline ondblclick:
  const dblClickButton = document.getElementById("dblClick");
  dblClickButton.addEventListener("dblclick", showText);
    

// Hover Button
const button = document.getElementById("hoverBtn");
const text = document.getElementById("text");
button.addEventListener("mouseover", () => {
    text.style.display = "block";
    text.innerHTML = "✅ You hovered using mouse";
    text.style.color = "black";
});

button.addEventListener("mouseout", () => {
    text.style.display = "none";
});


// Simple Alert
function showConfirmAlert() {
    event.preventDefault();
    let userResponse = confirm("Do you accept this alert?");
    let messageElement = document.getElementById("message");
    if (userResponse) {
        messageElement.innerHTML = "✅ You accepted the alert!";
        messageElement.style.color = "black";
    } else {
        messageElement.innerHTML = "❌ You dismissed the alert!";
        messageElement.style.color = "black";
    }

    setTimeout(() => {
        messageElement.innerHTML = "";
    }, 5000);
}


// Prompt Alert
function showPromptAlert() {
    event.preventDefault();
    let userInput = prompt("Enter some text:");
    let messageElement = document.getElementById("message");
    if (userInput === null || userInput === "") {
        messageElement.innerHTML = "❌ You dismissed the alert!";
        messageElement.style.color = "black";
    } else {
        messageElement.innerHTML = `✅ You entered: <strong>${userInput}</strong>`;
        messageElement.style.color = "black";
    }

    setTimeout(() => {
        messageElement.innerHTML = "";
    }, 5000);
}


// Ok Cancel Alert
function showOkAlert() {
    event.preventDefault();
    alert("This is an OK alert!");  // Simple OK alert
    let messageElement = document.getElementById("message");
    messageElement.innerHTML = "✅ You accepted the alert!";
    messageElement.style.color = "black";

    setTimeout(() => {
        messageElement.innerHTML = "";
    }, 5000);
}


// Dynamic DropDown
const suggestions = [
"Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
"Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
"Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
"Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
"Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
"West Bengal", "Chandigarh", "Lakshadweep", "Delhi", 
"Puducherry", "Jammu and Kashmir", "Ladakh"
];
const searchBox = document.getElementById("searchBox");
const suggestionsList = document.getElementById("suggestionsList");
searchBox.addEventListener("input", function() {
    const query = this.value.toLowerCase().trim();
    suggestionsList.innerHTML = "";

    if (!query) {
        suggestionsList.style.display = "none";
        return;
    }

    const filteredSuggestions = suggestions.filter(item => item.toLowerCase().startsWith(query));

    if (filteredSuggestions.length > 0) {
        suggestionsList.style.display = "block";
    } else {
        suggestionsList.style.display = "none";
    }

    filteredSuggestions.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        li.classList.add("suggestion-item");
        li.addEventListener("click", function() {
            searchBox.value = item;
            suggestionsList.style.display = "none";
        });
        suggestionsList.appendChild(li);
    });
});
document.addEventListener("click", function(event) {
    if (!searchBox.contains(event.target) && !suggestionsList.contains(event.target)) {
        suggestionsList.style.display = "none";
    }
});


// date Picker
document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("datePicker");
    dateInput.addEventListener("click", function () {
        this.showPicker();
    });
});
