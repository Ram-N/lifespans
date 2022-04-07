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
    maxQns: 2, //Default, though this comes from the options modal
    score: 0,
    qList: [],
    qNum: 0,
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
    output.id = "output";

    //TICKER
    scoreCard = maker('div', output, 'card', "")
    scoreCard.id = "overallScore"
    scoreCard.classList.add("wide");
    scoreCard.classList.add("black");

    tickerTextContainer = maker('div', scoreCard, 'card-text-row', "")

    txt = maker('span', tickerTextContainer, "card-text", "");
    txt.id = "tickerLeft"
    txt = maker('span', tickerTextContainer, "card-text", "");
    txt.id = "tickerCenter"
    txt = maker('span', tickerTextContainer, "card-text", "");
    txt.id = "tickerRight"


    crow = maker('div', output, 'card-row', "")
    cslate = maker('div', crow, 'card', "")
    cslate.classList.add('slate')
    cslate.innerHTML = "An event that happened closest to..."
    cslate.id = "qText";
    qCard = maker('div', cslate, "card-container", "")
    qCard.id = "qCard"

    //ddValues defined here
    Object.entries(gameQuestions).forEach(([key, val]) => ddValues.push(val.event));

    scoreCard = maker('div', output, 'card', "")
    scoreCard.id = "sCard"
    scoreCard.classList.add("wide")
    scoreCard.classList.add("slate")
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

    subDiv = document.createElement('div');
    output.append(subDiv);
    const btnSubmit = maker('button', subDiv, 'navbtn', 'Submit');
    nextDiv = document.createElement('div');
    output.append(nextDiv);
    const btnNext = maker('button', nextDiv, 'navbtn', 'Next');
    btnNext.disabled = true;

    // END OF APPEARANCE


    btnSubmit.addEventListener('click', (e) => {
        if (validEventEntered(evInput)) {
            console.log(`evList ${evInput.value}`)
            scoreResponse(evInput.value, game)
        }
        btnSubmit.disabled = true;
        btnNext.disabled = false;
    })

    btnNext.addEventListener('click', (e) => {
        nextQuestion(game);
        evInput.value = ""; //clear it
        btnSubmit.disabled = false;
        btnNext.disabled = true;
    })

    evInput.addEventListener('input', (e) => {
        evInput.style.backgroundColor = ''; //reset background color
    });

    initResultsModal();
    startNewGame(game);
});


function validEventEntered(inputField) {
    var isValid = ddValues.includes(inputField.value)

    if (!isValid) {
        // inputField.style.backgroundColor = '#bfa';
        inputField.style.backgroundColor = '#fba';
    }
    scard = document.getElementById('sCard')
    scard.innerHTML = `Invalid Input. Please select one event from the List. (Use Autocomplete!)`

    return isValid;
}

function scoreResponse(response, game) {
    actual = game.qList[game.qNum - 1]; //O is the first element, but its qnum is 1
    res = getResponseYear(response, gameQuestions);
    qScore = Math.abs(actual - res);
    game.score += qScore;

    scard = document.getElementById('sCard')
    scard.innerHTML = `${actual} ${res} Score:${res - actual}`
    console.log(actual, res)
    updateTicker();
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

function updateYearCard(game) {
    qCard = document.getElementById("qCard");
    let rndYear = Math.floor(Math.random() * 2001)
    game.qList.push(rndYear)
    //TODO : Also handle BC cases
    qCard.innerHTML = rndYear + " AD"
}

function clearCard(_id) {
    scard = document.getElementById(_id)
    scard.innerHTML = ""
}

function updateTicker() {
    //Needs 3 elements: Avg, Score and Num Questions
    tickerLeft = document.getElementById('tickerLeft')
    tickerCenter = document.getElementById('tickerCenter')
    tickerRight = document.getElementById('tickerRight')

    tickerCenter.innerHTML = game.score;
    tickerRight.innerText = game.qNum + " / " + game.maxQns;
    tickerLeft.innerText = "Par: " + (game.score / game.qNum)
}

function clearTicker() {
    document.getElementById('tickerLeft').innerHTML = ""
    document.getElementById('tickerCenter').innerHTML = ""
    document.getElementById('tickerRight').innerHTML = ""
}


function initResultsModal() {

    const output = document.getElementById("output");

    const resmodal = maker('dialog', output, 'modal', '');
    const rescontainer = maker('div', resmodal, 'modal-content', '');
    resmodal.id = "results-modal"
    console.log('results modal created')

    const resTextBox = maker('div', rescontainer, 'info-box', "");
    // const resChoiceTitle = maker('div', resChoiceBox, 'info-box-title', "Game Options");
    // resChoiceText = maker('span', resChoiceBox, 'info-box-text', "");
    // resChoiceText.id = 'res-choices';

    // //placeholder for res tally boxes
    // createTallyBoxRow(resChoiceBox, "resTBRow");

    resText = maker('span', resTextBox, 'info-box-text', "");
    resText.id = 'res-text';


    //RESULTS MODAL Buttons
    const btnAnother = maker('button', rescontainer, 'stdBtn', 'Another Round');
    const btnShare = maker('button', rescontainer, 'stdBtn', 'Share');
    const btnDone = maker('button', rescontainer, 'stdBtn', 'Leave');
    btnAnother.style.background = '#007bff';
    btnAnother.style.color = 'white';
    btnDone.style.background = '#dc3545';
    btnAnother.id = 'btnAnother';
    btnDone.id = 'btnDone';
    btnShare.id = 'btnShare';
    btnShare.style.background = successGreen

}



function closeoutGame() {

    const resmodal = document.getElementById("results-modal");
    const openModal = document.querySelector(".open-button");
    const closeModal = document.querySelector(".close-button");
    const btnAnother = document.getElementById("btnAnother");
    const btnDone = document.getElementById("btnDone");

    resmodal.showModal();

    // const output = document.getElementById("output");
    // const resmodal = document.getElementById("results-modal");
    // //const modalcontent = document.getElementById("options-modal-content");
    // const resclose = document.getElementById("close-results");
    // const resBox = document.getElementById('results-box');
    // const resChText = document.getElementById('res-choices');
    const resText = document.getElementById("res-text");


    // //show results tally boxes
    // tcon = document.getElementById('resTBRow');
    // tcon.replaceChildren();
    // tallyboxes = createTallyBoxes(game, "resTBRow");
    // //Show tallyBoxes in ResultsModal
    // game.results.forEach((e, idx) => {
    //     colorTallyBox(idx, e)
    // });

    console.log(game.score, "Score")
    resText.innerHTML = `${game.score} Points <br> Average: ${(game.score / game.maxQns).toFixed(2)} `;


    btnAnother.addEventListener("click", function () {
        resmodal.close();
        clearCard('sCard');
        startNewGame(game); //startNewGame only if Another is clicked 
    });

    btnDone.addEventListener("click", function () {
        resmodal.close();
        clearCard('sCard');
        location.href = '../index.html'
    });

    // tcon = document.getElementById('tallyBoard');
    // tcon.replaceChildren(); //get rid of the tallyBoxes, children of tallyBoard
}



function nextQuestion(game) {
    game.qNum += 1;
    clearCard('sCard');

    if (game.qNum > game.maxQns) {
        closeoutGame();
    }
    updateYearCard(game);

}

function startNewGame(game) {
    game.qList = [];
    game.qNum = 0;
    game.score = 0;
    clearTicker();
    nextQuestion(game);
}