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
    maxQns: 10, //Default, though this comes from the options modal
    score: 0,
    qList: [],
    qNum: 0,
}

const MAX_ALLOWED_SCORE = 2000;

/* Using style guide color variables */
/* Success and progress colors */
successGreen = "var(--dark-moss-green, #606c38)";
warningOrange = "var(--earth-yellow, #dda15e)";
dangerRed = "var(--rosewood, #6a040f)";
BtnActiveColor = "var(--tigers-eye, #bc6c25)";
BtnOffColor = "var(--cornsilk, #fefae0)";

var eList = Object.values(events); //from eventsDB.js
var gameQuestions = eList;
let ddValues = [];

document.addEventListener("DOMContentLoaded", () => {
    //PAGE APPEARANCE
    const output = document.querySelector('.output');
    output.id = "output";



    //TOP CARD
    scoreCard = maker('div', output, 'card', "")
    scoreCard.id = "overallScore"
    scoreCard.classList.add("wide");
    scoreCard.classList.add("black");

    //Hangman Progressbar
    var hangbase = document.createElement('div');
    hangbase.classList.add('score-progress-bar');
    hangbase.id = 'baseHang';
    hangbase.style.display = "flex";
    scoreCard.append(hangbase)

    //this needs to be updated with each guess...
    progress = document.createElement('div');
    progress.classList.add('score-progress-bar');
    progress.id = 'hangBar';
    hangbase.append(progress)


    tickerTextContainer = maker('div', scoreCard, 'card-text-row', "")

    txt = maker('span', tickerTextContainer, "card-text", "");
    txt.id = "tickerLeft"
    txt = maker('span', tickerTextContainer, "card-text", "");
    txt.id = "tickerCenter"
    txt = maker('span', tickerTextContainer, "card-text", "");
    txt.id = "tickerRight"

    _tid = "tallyBoard"
    // createTallyBoxesContainer(tickerTextContainer, _tid); //qa_mechanics.js
    createTallyBoxesContainer(scoreCard, _tid); //qa_mechanics.js



    // Create instruction header
    const instructionHeader = maker('div', output, 'instruction-header', "");
    instructionHeader.innerHTML = `
        <h2>History Golf Challenge</h2>
        <p class="game-instructions">Identify historical events that happened closest to the given year. The smaller the time difference, the better your score!</p>
    `;

    // Question card container
    crow = maker('div', output, 'card-row', "")
    crow.id = "question-container";
    cslate = maker('div', crow, 'card', "")
    cslate.classList.add('slate')
    cslate.innerHTML = "<h3>Find an event that happened closest to...</h3>"
    cslate.id = "qText";
    qCard = maker('div', cslate, "card-container", "")
    qCard.id = "qCard"

    //ddValues defined here
    Object.entries(gameQuestions).forEach(([key, val]) => ddValues.push(val.event));
    
    // Create a unified input container with a better organization
    const interactionContainer = maker('div', output, 'interaction-container', "");
    interactionContainer.id = "interaction-container";
    
    // Create input box first
    const inputWrapper = maker('div', interactionContainer, 'input-wrapper', "");
    
    const evInput = document.createElement("input");
    evInput.type = "text";
    evInput.classList.add("autocomplete-input");
    evInput.placeholder = "Select the historical event you think happened closest to the year above"
    evInput.id = "event-input"
    evInput.setAttribute("autocomplete", "off")
    inputWrapper.appendChild(evInput);
    
    // Create custom dropdown that will replace datalist
    const customDropdown = document.createElement("div");
    customDropdown.classList.add("custom-dropdown");
    customDropdown.id = "custom-dropdown";
    customDropdown.style.display = "none";
    inputWrapper.appendChild(customDropdown);
    
    // Add help text below input
    const helpText = document.createElement('div');
    helpText.classList.add('help-text');
    helpText.innerHTML = "Type to search for historical events";
    inputWrapper.appendChild(helpText);
    
    // Add buttons immediately after input
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    interactionContainer.appendChild(buttonContainer);
    
    const btnSubmit = maker('button', buttonContainer, 'navbtn', 'Submit');
    btnSubmit.id = 'btnSubmit';
    
    const btnNext = maker('button', buttonContainer, 'navbtn', 'Next');
    btnNext.id = 'btnNext';
    btnNext.disabled = true;
    
    // Create the datalist for suggestions (the card black wide fade-in element)
    // This is the dropdown list of events that appears when typing in the input
    const eventsContainer = maker('div', output, 'events-container', "");
    eventsContainer.id = "events-container";
    
    const listDiv = maker('div', eventsContainer, 'card', "");
    listDiv.classList.add("black", "wide");
    listDiv.id = "events-list-container";
    
    const evDataList = document.createElement("datalist");
    evDataList.id = "event-list";
    optionsList = prepareEventStr(ddValues);
    evDataList.innerHTML = optionsList;
    
    // Add datalist to the document
    document.body.appendChild(evDataList);
    
    // Add an events list display (previously shown in the black card)
    listDiv.innerHTML = "<div class='events-header'>Available Historical Events</div>";
    listDiv.style.maxHeight = "150px";
    listDiv.style.overflowY = "auto";
    
    // Create an events list element to show available options
    const eventsList = document.createElement("div");
    eventsList.classList.add("events-list");
    // We'll show the first few events to give users an idea
    const previewEvents = ddValues.slice(0, 10);
    previewEvents.forEach(event => {
        const eventItem = document.createElement("div");
        eventItem.classList.add("event-item");
        eventItem.textContent = event;
        eventsList.appendChild(eventItem);
    });
    listDiv.appendChild(eventsList);
    
    // Result container
    crow2 = maker('div', output, 'card-row', "")
    crow2.id = "result-container";
    crow2.style.minHeight = 100 + "px";
    crow2.style.background = "var(--rosewood, #6a040f)";
    crow2.style.borderRadius = "12px";
    let sCard = maker('div', crow2, 'card', "")
    sCard.id = "sCard"
    sCard.classList.add("wide")
    sCard.classList.add("slate")

    //PROGRESS BAR
    var pdiv = document.createElement('div');
    pdiv.classList.add("score-progress-container");
    crow2.append(pdiv);

    var barbase = document.createElement('div');
    barbase.classList.add('score-progress-bar');
    barbase.id = 'progressBase';
    barbase.style.display = "flex";
    pdiv.append(barbase)

    var progress = document.createElement('div');
    progress.classList.add('score-progress-bar');
    progress.id = 'progress';
    barbase.append(progress)

    progress = document.createElement('div');
    progress.classList.add('score-progress-bar');
    progress.id = 'progress2';
    barbase.append(progress)

    // END OF APPEARANCE


    btnSubmit.addEventListener('click', (e) => {
        if (validEventEntered(evInput)) {
            console.log(`evList ${evInput.value}`)
            scoreResponse(evInput.value, game);
            btnSubmit.disabled = true;
            btnNext.disabled = false;
        }
    })

    btnNext.addEventListener('click', (e) => {
        evInput.value = ""; //clear it
        nextQuestion(game);
        btnSubmit.disabled = false;
        btnNext.disabled = true;
    })

    // Custom dropdown functionality
    evInput.addEventListener('input', function() {
        const filterText = this.value.toUpperCase();
        customDropdown.innerHTML = ''; // Clear previous results
        
        if (filterText.length > 0) {
            customDropdown.style.display = 'block';
            
            // Filter events and add to dropdown
            const matchingEvents = ddValues.filter(event => 
                event.toUpperCase().includes(filterText)
            ).slice(0, 8); // Limit to first 8 matches for better UX
            
            if (matchingEvents.length > 0) {
                matchingEvents.forEach(event => {
                    const item = document.createElement('div');
                    item.classList.add('dropdown-item');
                    item.textContent = event;
                    
                    // Handle item click
                    item.addEventListener('click', function() {
                        evInput.value = event;
                        customDropdown.style.display = 'none';
                    });
                    
                    customDropdown.appendChild(item);
                });
            } else {
                const noMatch = document.createElement('div');
                noMatch.classList.add('dropdown-item', 'no-match');
                noMatch.textContent = 'No matching events found';
                customDropdown.appendChild(noMatch);
            }
        } else {
            customDropdown.style.display = 'none';
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== evInput && e.target !== customDropdown) {
            customDropdown.style.display = 'none';
        }
    });
    
    // Show dropdown on focus if there's text
    evInput.addEventListener('focus', function() {
        if (this.value.length > 0) {
            customDropdown.style.display = 'block';
        }
    });
    
    // Reset background color on input
    evInput.addEventListener('input', function() {
        evInput.style.backgroundColor = '';
    });

    //reset score and results
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

    sCard = document.getElementById('sCard')
    sPCon = document.getElementById('progressBase')
    sPBar = document.getElementById('progress')
    sPBar2 = document.getElementById('progress2');
    hangBar = document.getElementById('hangBar');


    let dirNeg = (actual > res) ? true : false;
    pbLen = Math.round(qScore / 2000 * 50);
    console.log('pblen', pbLen, actual, res, 'dirNeg', dirNeg)

    const scoreDiff = res - actual;
    const scoreColor = scoreDiff < 0 ? 'var(--dark-moss-green, #606c38)' : 'var(--rosewood, #6a040f)';
    sCard.innerHTML = `
        <div class="score-result">
            <div class="score-year"><span>Target:</span> ${actual}</div>
            <div class="score-year"><span>Your guess:</span> ${res}</div>
            <div class="score-diff" style="color: ${scoreColor}">
                <span>Score:</span> ${scoreDiff} years
            </div>
        </div>
    `

    sPCon.style.width = "100%";

    if (dirNeg) {
        sPBar.style.width = `${50 - pbLen}%`;
    } else {
        sPBar.style.width = `50%`;
    }

    sPBar2.style.width = `${pbLen}% `;
    
    // Apply appropriate class based on score
    sPBar2.classList.remove('score-success', 'score-warning', 'score-danger');
    if (qScore < 100) {
        sPBar2.classList.add('score-success');
    } else if (qScore < 250) {
        sPBar2.classList.add('score-warning');
    } else {
        sPBar2.classList.add('score-danger');
    }


    // Calculate progress bar values
    hangLen = Math.round(game.score / 2000 * 99)
    hangBar.style.width = `${1 + hangLen}%`
    
    // Add appropriate class based on progress
    hangBar.classList.remove('score-success', 'score-warning', 'score-danger');
    if (hangLen < 50) {
        hangBar.classList.add('score-success');
    } else if (hangLen < 75) {
        hangBar.classList.add('score-warning');
    } else {
        hangBar.classList.add('score-danger');
    }

    console.log(actual, res, 'hanglen', hangLen)
    updateTicker();

    _tcolor = "red"
    if (qScore < 250) { _tcolor = "orange" }
    if (qScore < 100) { _tcolor = "green" }
    colorTallyBox(game.qNum - 1, _tcolor)
}

function getResponseYear(response, gameQuestions) {
    idx = ddValues.indexOf(response);
    console.log(`idx ${idx} `)
    return gameQuestions[idx].YearNum
}

// Loads the list of events to the dynamic list...
function prepareEventStr(ddValues) {
    let _str = "";
    if (ddValues) {
        ddValues.forEach((item) => {
            _str += `<option>${item}</option> `
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

function clearInput(_id) {
    inp = document.getElementById(_id)
    inp.value = ""
}

function resetDatalist() {
    evDataList = document.getElementById("event-list");
    for (let option of evDataList.options) {
        option.style.display = "block";
    }
}


function updateTicker() {
    //Needs 3 elements: Avg, Score and Num Questions
    tickerLeft = document.getElementById('tickerLeft')
    tickerCenter = document.getElementById('tickerCenter')
    tickerRight = document.getElementById('tickerRight')

    tickerCenter.innerHTML = game.score;
    tickerRight.innerText = game.qNum + " / " + game.maxQns;
    tickerLeft.innerText = "Avg Miss: " + Math.round(game.score / game.qNum) + " years"
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

}



function nextQuestion(game) {
    game.qNum += 1;
    clearCard('sCard');
    clearInput("event-input");
    resetDatalist();

    if (game.score > MAX_ALLOWED_SCORE) {
        closeoutGame();
    }


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
    resetDatalist();

    //clear TallyBoxes
    tcon = document.getElementById('tallyBoard');
    tcon.replaceChildren(); //get rid of the old tallyBoxes, children of tallyBoard
    tallyboxes = createTallyBoxes(game, 'tallyBoard');

    nextQuestion(game);
}