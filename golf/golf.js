// History Golf 
// Created by Ram Narasimhan
// April 2022

//Read all the events
//create an output element
//add a dropdown to it

//change the year in the card...

//score it
//show the score

game = {};

successGreen = "#28a745";
warningOrange = "#ffc107";
dangerRed = "#dc3545";
BtnActiveColor = "#1c3494"
BtnOffColor = "#e6f3f8";

var eList = Object.values(events); //from eventsDB.js
var gameQuestions = eList;

document.addEventListener("DOMContentLoaded", () => {
    //PAGE APPEARANCE
    const output = document.querySelector('.output');

    values = ["None", "Catastrophes", "Discoveries", "Inventions", "Literature", "Wars"];

    let ddValues = []
    Object.entries(gameQuestions).forEach(([key, val]) => ddValues.push(val.event));

    results = maker('div', output, 'main', "")

    // selIndex = 0;
    // promptText = "<br>" + "Select an Event that is closest to the Year above: "
    // selectID = "mainDD";
    // promptFor = "maindd"
    // addDropdown(ddValues, selIndex, selectID, promptText, promptFor, output);


    qdiv = maker('div', output, 'main', "")

    const evInput = document.createElement("input");
    evInput.type = "text";
    evInput.classList.add("autocomplete-input");
    evInput.placeholder = "Select Closest Event"
    evInput.id = "event-input"
    evInput.setAttribute("list", "event-list") //the list attrib should match the datalist id
    qdiv.append(evInput);

    const evDataList = document.createElement("datalist")
    evDataList.classList.add("autocomplete-list")
    evDataList.id = "event-list"
    optionsList = prepareEventStr(ddValues);
    evDataList.innerHTML = optionsList;
    qdiv.append(evDataList)

    const btnSubmit = maker('button', qdiv, 'navbtn', 'Submit');
    btnSubmit.addEventListener('click', (e) => {
        pickNextQuestion(game);
    })

    const btnNext = maker('button', output, 'navbtn', 'Next');
    btnNext.addEventListener('click', (e) => {
        pickNextQuestion(game);
    })



});


// Loads the list of events to the dynamic list...
function prepareEventStr(ddValues) {
    let _str = "";
    if (ddValues) {
        ddValues.forEach((item) => {
            _str += `<option> ${item}</option>`
        });
    }
    return _str
}

//Deprecated
// Loads the list of events to the dynamic list...
function loadDynamicList(ddValues, elem) {
    let _str = "";
    if (ddValues) {
        elem.innerHTML = "";
        ddValues.forEach((item) => {
            _str += `<option> ${item}</option>`
        });
    }
    elem.innerHTML = _str
}

//Deprecated
//filter the list based on search text
function filterData(data, searchText) {
    if (searchText.length > 2) {
        return data.filter((item) => item.toLowerCase().includes(searchText.toLowerCase()))
    }
    return []
}


function pickNextQuestion(game) {
    updateYearCard()
    game = {}
}

function updateYearCard() {
    qCard = document.getElementById("qCard");
    let rndYear = Math.floor(Math.random() * 2001)

    qCard.innerHTML = rndYear + " AD"
}