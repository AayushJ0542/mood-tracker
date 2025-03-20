// Funcation to save data to Local Storage
function saveDataToLocalStorage() {
    const dataToStore = dataStored.map(item => ({
        ...item,
        date: item.date.toISOString()
    }));
    
    localStorage.setItem('moodTrackerData', JSON.stringify(dataToStore));
}

// Function to load data from localStorage
function loadDataFromLocalStorage() {
    const storedData = localStorage.getItem('moodTrackerData');
    
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        return parsedData.map(item => ({
            ...item,
            date: new Date(item.date)
        }));
    }
    
    return []; // Return empty array if no data found
}

// Storeing the Local Storage Data if not found return empty array 
const dataStored = loadDataFromLocalStorage();

// Dynamically Inserting Emoji
const emojiDiv = document.getElementById("emojis")

// Getting Emoji Date
const mooddateInput = document.getElementById("Mooddate")

// Dispay Inserted Emoji
const displaytodayEmoji = document.getElementById("dayDisplay")
const displaytodayEmojiDate = document.getElementById("dayDateDisplay")
const displaytodayEmojiName = document.getElementById("dayTextDisplay")

const dayRangeBtn = document.querySelector(".day")
const weekRangeBtn = document.querySelector(".weekly")
const monthRangeBtn = document.querySelector(".monthly")

const dateRangeBtn = document.querySelectorAll(".dateRange button")

// Adding Event Listner
dateRangeBtn.forEach((items) => {
    items.addEventListener("click", () => (makebtnactive(items)))
})

function makebtnactive(selectedBtn) {
    const activeBtn = document.querySelector(".activebtn")
    activeBtn.classList.remove("activebtn")
    selectedBtn.classList.add("activebtn")
    
    if (selectedBtn.classList.contains("day")) {
        viewType("day")
    } else if (selectedBtn.classList.contains("weekly")) {
        viewType("week")
    } else if (selectedBtn.classList.contains("monthly")) {
        viewType("month")
    }
}

// List of Mood along with emojis (Can Add more in future)
const emojis = [
    {
        emojiName: "Happy",
        emojiAlt: "😀",
        emojiStatic: "./assets/svg/happy.svg",
        emojiActive: "./assets/webp/happy.webp"
    },
    {
        emojiName: "Angry",
        emojiAlt: "😡",
        emojiStatic: "./assets/svg/anger.svg",
        emojiActive: "./assets/webp/anger.webp"
    },
    {
        emojiName: "Laughing",
        emojiAlt: "😂",
        emojiStatic: "./assets/svg/laughing.svg",
        emojiActive: "./assets/webp/laughing.webp"
    },
    {
        emojiName: "Sick",
        emojiAlt: "🤒",
        emojiStatic: "./assets/svg/sick.svg",
        emojiActive: "./assets/webp/sick.webp"
    }, {
        emojiName: "Sleep",
        emojiAlt: "😴",
        emojiStatic: "./assets/svg/sleep.svg",
        emojiActive: "./assets/webp/sleep.webp"
    }
]

// This Function Dynamically Create emoji cards 
emojis.forEach((items, count) => {
    const emojiCard = document.createElement("div")
    const emoji = document.createElement("div")
    const nameEmoji = document.createElement("div")
    
    emojiCard.classList.add("emojiCard")
    emojiCard.setAttribute("alt", count)
    emojiCard.setAttribute("id", items.emojiName)
    emoji.classList.add("emoji")
    nameEmoji.classList.add("nameEmoji")
    
    emoji.innerHTML = `
    <img class="static" src="${items.emojiStatic}" alt="${items.emojiAlt}"/>
    <img class="active" src="${items.emojiActive}" alt="${items.emojiAlt}"/>`
    
    nameEmoji.innerText = items.emojiName
    
    emojiCard.appendChild(emoji)
    emojiCard.appendChild(nameEmoji)
    emojiCard.addEventListener("click", insertData)
    emojiDiv.appendChild(emojiCard)
})

// This function Inserts Data Received from Mood Selected 
// and also sending it to update view function
function insertData() {

    // Verifying the if Date is entered or not
    if (mooddateInput.value == "") {
        alert("Please Enter Date")
        return -1
    }
    // Converting the Input date into 'Date Type'
    inputDate = new Date(mooddateInput.value)

    // Finding if there is any data already stored
    // if not stored it will return -1 and else  
    const indexOfDate = findIndexOfDate(inputDate)
    
    // Grab and Store Selected Emoji data to a variable
    const selectedEmoji = emojis[this.getAttribute("alt")]
    
    //Checking of data in the given Date is already there or not  
    // if not available it will add
    if (indexOfDate < 0) {
        const insertedData = {
            date: inputDate,
            emojiIndex: (dataStored.length + 1),
            emojiName: selectedEmoji.emojiName,
            emojiAlt: selectedEmoji.emojiAlt,
            emojiActive: selectedEmoji.emojiActive
        } 
        dataStored.push(insertedData)
        
        // const newIndex = dataStored.length - 1
        
        updateCurrentView(inputDate)
        saveDataToLocalStorage();
    
    } 
    //if available it will ask if you want to update it or not
    else {
        const updateConfirmnation = confirm(`${dataStored[indexOfDate].emojiName} - ${dataStored[indexOfDate].emojiAlt} Mood is alrady inserted on ${inputDate.toISOString().split("T")[0]}.\nDo you want to still update it?`)
        if(updateConfirmnation){
        // Update existing date entry
        dataStored[indexOfDate].emojiName = selectedEmoji.emojiName
        dataStored[indexOfDate].emojiAlt = selectedEmoji.emojiAlt
        dataStored[indexOfDate].emojiActive = selectedEmoji.emojiActive
        
        updateCurrentView(inputDate)
        saveDataToLocalStorage();
        }
    }
}

// Function to find which view is active and update the view
function updateCurrentView(date) {
    // Find which view is currently active
    const activeBtn = document.querySelector(".activebtn")
    const viewType = activeBtn.classList.contains("day") ? "day" : 
                     activeBtn.classList.contains("weekly") ? "week" : "month"
    
    if (viewType === "day") {
        const dateIndex = findIndexOfDate(date)
        if (dateIndex >= 0) {
            displayEmojiToday(dateIndex)
        }
    } else if (viewType === "week") {
        displayEmojiWeek()
    } else if (viewType === "month") {
        displayEmojiMonth()
    }
}

// Function to change view type when user changes it
function viewType(viewType) {
    const dailyView = document.querySelector(".displayDay")
    const weeklyView = document.querySelector(".displayweek")
    const monthlyView = document.querySelector(".displaymonth")
    
    // Changing all the Display of View Type to None 
    dailyView.style.display = "none"
    weeklyView.style.display = "none"
    monthlyView.style.display = "none"
    
    // Show the selected view
    if (viewType === "day") {
        dailyView.style.display = "block"
        
        // If a date is selected in the input, show that date
        if (mooddateInput.value) {
            const selectedDate = new Date(mooddateInput.value)
            const dateIndex = findIndexOfDate(selectedDate)
            if (dateIndex >= 0) {
                displayEmojiToday(dateIndex)
            } else {
                // Clear the display if no data for selected date
                displaytodayEmoji.innerHTML = ""
                displaytodayEmojiDate.innerText = mooddateInput.value
                displaytodayEmojiName.innerText = "No mood data for this date"
            }
        } else {
            // If no date is selected, try to show today's data
            const today = new Date()
            const todayIndex = findIndexOfDate(today)
            if (todayIndex >= 0) {
                displayEmojiToday(todayIndex)
            } else {
                // Clear the display if no data for today
                displaytodayEmoji.innerHTML = ""
                displaytodayEmojiDate.innerText = ""
                displaytodayEmojiName.innerText = "No mood data for today"
            }
        }
    } else if (viewType === "week") {
        weeklyView.style.display = "block"
        displayEmojiWeek()
    } else if (viewType === "month") {
        monthlyView.style.display = "block"
        displayEmojiMonth()
    }
}

// Funcation to Display emoji for daily view for any given day
function displayEmojiToday(insertedData) {
    if (insertedData < 0) {
        console.log("Date Not Found")
        return
    }
    const emoji = document.createElement("div")
    emoji.innerHTML = `<img class="active" src="${dataStored[insertedData].emojiActive}" alt="${dataStored[insertedData].emojiAlt}"/>`
    displaytodayEmoji.innerHTML = ""
    displaytodayEmoji.appendChild(emoji)
    
    displaytodayEmojiDate.innerText = dataStored[insertedData].date.toISOString().split("T")[0]
    displaytodayEmojiName.innerText = `You are ${dataStored[insertedData].emojiName}`
}

// Function to get the start of the week for a given date
function getWeekStart(date) {
    const newDate = new Date(date)
    const day = newDate.getDay() // 0 is Sunday, 6 is Saturday
    const diff = newDate.getDate() - day
    return new Date(newDate.setDate(diff))
}

// Function to get the start of the month for a given date
function getMonthStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

// Function to display emoji data for the current week
function displayEmojiWeek() {
    const weeklyView = document.querySelector(".displayweek")
    weeklyView.innerHTML = ""
    
    // Get current date and the start of the week
    const today = new Date()
    // If date is selected in the input, use that instead of today
    const selectedDate = mooddateInput.value ? new Date(mooddateInput.value) : today
    const weekStart = getWeekStart(selectedDate)
    
    // Create a header for the weekly view
    const weekHeader = document.createElement("h3")
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    weekHeader.innerText = `Week of ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`
    weeklyView.appendChild(weekHeader)
    
    // Create a container for the week's emojis
    const weekContainer = document.createElement("div")
    weekContainer.classList.add("week-container")
    
    // Loop through each day of the week
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(weekStart)
        currentDate.setDate(currentDate.getDate() + i)
        
        // Create a day container
        const dayContainer = document.createElement("div")
        dayContainer.classList.add("day-container")
        
        // Add the day name
        const dayName = document.createElement("div")
        dayName.classList.add("day-name")
        dayName.innerText = currentDate.toLocaleDateString('en-US', { weekday: 'short' })
        
        // Add the date
        const dateDisplay = document.createElement("div")
        dateDisplay.classList.add("date-display")
        dateDisplay.innerText = currentDate.getDate()
        
        // Find if there's mood data for this day
        const dayIndex = findIndexOfDate(currentDate)
        
        // Add the emoji if data exists
        const emojiContainer = document.createElement("div")
        emojiContainer.classList.add("emoji-container")
        
        if (dayIndex >= 0) {
            const emoji = document.createElement("div")
            emoji.innerHTML = `<img class="weekly-emoji" src="${dataStored[dayIndex].emojiActive}" alt="${dataStored[dayIndex].emojiAlt}"/>`
            emojiContainer.appendChild(emoji)
        } else {
            emojiContainer.innerText = "No data"
        }
        
        // Assemble the day container
        dayContainer.appendChild(dayName)
        dayContainer.appendChild(dateDisplay)
        dayContainer.appendChild(emojiContainer)
        
        // Add the day container to the week container
        weekContainer.appendChild(dayContainer)
    }
    
    weeklyView.appendChild(weekContainer)
}

// Function to display emoji data for the current month
function displayEmojiMonth() {
    const monthlyView = document.querySelector(".displaymonth")
    monthlyView.innerHTML = ""
    
    // Get current date and the start of the month
    const today = new Date()
    // If date is selected in the input, use that instead of today
    const selectedDate = mooddateInput.value ? new Date(mooddateInput.value) : today
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    
    // Create a header for the monthly view
    const monthHeader = document.createElement("h3")
    monthHeader.innerText = `${new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    monthlyView.appendChild(monthHeader)
    
    // Create a container for the month's calendar
    const calendarContainer = document.createElement("div")
    calendarContainer.classList.add("calendar-container")
    
    // Add day headings (Sun, Mon, etc.)
    const dayHeadings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    dayHeadings.forEach(day => {
        const dayHeading = document.createElement("div")
        dayHeading.classList.add("day-heading")
        dayHeading.innerText = day
        calendarContainer.appendChild(dayHeading)
    })
    
    // Get the first day of the month (0 = Sunday, 6 = Saturday)
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement("div")
        emptyDay.classList.add("calendar-day", "empty")
        calendarContainer.appendChild(emptyDay)
    }
    
    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement("div")
        dayCell.classList.add("calendar-day")
        
        // Add the date number
        const dateNumber = document.createElement("div")
        dateNumber.classList.add("date-number")
        dateNumber.innerText = i
        dayCell.appendChild(dateNumber)
        
        // Check if there's mood data for this day
        const currentDate = new Date(year, month, i)
        const dayIndex = findIndexOfDate(currentDate)
        
        // Add the emoji if data exists
        if (dayIndex >= 0) {
            const emoji = document.createElement("div")
            emoji.innerHTML = `<img class="monthly-emoji" src="${dataStored[dayIndex].emojiActive}" alt="${dataStored[dayIndex].emojiAlt}"/>`
            dayCell.appendChild(emoji)
        }
        
        calendarContainer.appendChild(dayCell)
    }
    
    monthlyView.appendChild(calendarContainer)
}

// Function to find the index of a date in the dataStored array
function findIndexOfDate(inputDate) {
    return dataStored.findIndex((items) => 
        items.date.toDateString() === inputDate.toDateString()
    )
}

// Add event listener to update the view when date input changes
mooddateInput.addEventListener("change", function() {
    const activeBtn = document.querySelector(".activebtn")
    const viewType = activeBtn.classList.contains("day") ? "day" : 
                     activeBtn.classList.contains("weekly") ? "week" : "month"
    
    if (viewType === "day") {
        const selectedDate = new Date(this.value)
        const dateIndex = findIndexOfDate(selectedDate)
        if (dateIndex >= 0) {
            displayEmojiToday(dateIndex)
        } else {
            // Clear the display if no data for selected date
            displaytodayEmoji.innerHTML = ""
            displaytodayEmojiDate.innerText = this.value
            displaytodayEmojiName.innerText = "No mood data for this date"
        }
    } else if (viewType === "week") {
        // Refresh the weekly view based on the selected date
        displayEmojiWeek()
    } else if (viewType === "month") {
        // Refresh the monthly view based on the selected date
        displayEmojiMonth()
    }
})

document.addEventListener('DOMContentLoaded', function() {
    if (dataStored.length > 0) {
        // Find today's data if it exists
        const today = new Date();
        const todayIndex = findIndexOfDate(today);
        
        // If today has data, display it
        if (todayIndex >= 0) {
            displayEmojiToday(todayIndex);
        }
        
        viewType("day");
    }
});
