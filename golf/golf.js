// History Golf 
// Created by Ram Narasimhan
// April 2022

//Read all the events
//create an output element
//add a dropdown to it

//change the year in the card...

//score it
//show the score

const game = {
    score: 0, qns: 0, penalty: [0, 2, 5, 10],
    numQns: 5, //[1,2,5,6,10]
    qList: [],
    qNum: -1
}

successGreen = "#28a745";
warningOrange = "#ffc107";
dangerRed = "#dc3545";
BtnActiveColor = "#1c3494"
BtnOffColor = "#e6f3f8";

var eList = Object.values(events); //from eventsDB.js
var gameQuestions = eList;
let ddValues = [];

document.addEventListener("DOMContentLoaded", () => {
    //PAGE APPEARANCE
    const output = document.querySelector('.output');

    //values = ["None", "Catastrophes", "Discoveries", "Inventions", "Literature", "Wars"];

    //ddValues defined here
    Object.entries(gameQuestions).forEach(([key, val]) => ddValues.push(val.event));

    scoreCard = maker('div', output, 'card', "")
    scoreCard.id = "sCard"
    scoreCard.classList.add("wide")
    scoreCard.classList.add("slate")

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
    const btnNext = maker('button', output, 'navbtn', 'Next');


    btnSubmit.addEventListener('click', (e) => {
        if (validEventEntered(evInput)) {
            console.log(`evList ${evInput.value}`)
            scoreResponse(evInput.value, game)
        }
    })

    btnNext.addEventListener('click', (e) => {
        nextQuestion(game);
        evInput.value = ""; //clear it
    })

    evInput.addEventListener('input', (e) => {
        evInput.style.backgroundColor = ''; //reset background color
    });

    startNewGame(game);
});


function validEventEntered(inputField) {
    var isValid = ddValues.includes(inputField.value)

    if (!isValid) {
        // inputField.style.backgroundColor = '#bfa';
        inputField.style.backgroundColor = '#fba';
    }

    return isValid;
}

function scoreResponse(response, game) {
    actual = game.qList[game.qNum];
    res = getResponseYear(response, gameQuestions);
    scard = document.getElementById('sCard')

    scard.innerHTML = `${actual} ${res} Score:${res - actual}`
    console.log(actual, res)
}

function getResponseYear(response, gameQuestions) {
    idx = ddValues.indexOf(response);
    console.log(`idx ${idx}`)
    return gameQuestions[idx].YearNum
}

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



function updateYearCard(game) {
    qCard = document.getElementById("qCard");
    let rndYear = Math.floor(Math.random() * 2001)

    game.qList.push(rndYear)

    qCard.innerHTML = rndYear + " AD"
}

function clearScoreCard() {
    scard = document.getElementById('sCard')
    scard.innerHTML = ""
}

function nextQuestion(game) {
    clearScoreCard();
    updateYearCard(game);
    game.qNum += 1;

}

function startNewGame(game) {
    game.qList = [];
    game.qNum = -1;
    nextQuestion(game)
}