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
    score: 0, // Will be used to track cumulative gap
    qList: [],
    qNum: 0,
    cumulativeGap: 0 // Track total gap across all questions
}

const MAX_ALLOWED_SCORE = 3000; // Maximum allowed cumulative gap

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
    console.log("DOM fully loaded and parsed");
    
    // Get existing elements from HTML
    const output = document.querySelector('.output');
    if (output && !output.id) {
        output.id = "output";
    }
    
    // Get reference to existing elements
    const scoreCard = document.getElementById('overallScore');
    const hangbase = document.getElementById('baseHang');
    const progressBar = document.getElementById('hangBar');
    
    // Get ticker elements
    const tickerLeft = document.getElementById('tickerLeft');
    const tickerCenter = document.getElementById('tickerCenter');
    const tickerRight = document.getElementById('tickerRight');
    
    console.log("Initializing elements:", {
        scoreCard, hangbase, progressBar, tickerLeft, tickerCenter, tickerRight
    });
    
    // Setup tally boxes
    if (scoreCard) {
        _tid = "tallyBoard";
        createTallyBoxesContainer(scoreCard, _tid); // qa_mechanics.js
    } else {
        console.error("scoreCard element not found!");
    }
    
    // Get question card
    const qCard = document.getElementById('qCard');
    
    // Set up event values
    Object.entries(gameQuestions).forEach(([key, val]) => ddValues.push(val.event));
    
    // Get input elements
    const evInput = document.getElementById('event-input');
    const customDropdown = document.getElementById('custom-dropdown');
    
    // Get buttons
    const btnSubmit = document.getElementById('btnSubmit');
    const btnNext = document.getElementById('btnNext');
    btnNext.disabled = true;
    
    // Get result container
    const sCard = document.getElementById('sCard');
    const progressBase = document.getElementById('progressBase');
    const progress = document.getElementById('progress');
    const progress2 = document.getElementById('progress2');
    
    // Create datalist for autocomplete
    const evDataList = document.createElement("datalist");
    evDataList.id = "event-list";
    optionsList = prepareEventStr(ddValues);
    evDataList.innerHTML = optionsList;
    document.body.appendChild(evDataList);
    
    // Add ALL events to the event list with scrollbar
    const eventsList = document.querySelector('.events-list');
    
    // Clear any existing events first
    eventsList.innerHTML = '';
    
    // Add all events from the database
    console.log(`Adding ${ddValues.length} events to the list`);
    ddValues.forEach(event => {
        const eventItem = document.createElement("div");
        eventItem.classList.add("event-item");
        eventItem.textContent = event;
        
        // Make events clickable to select them
        eventItem.addEventListener('click', function() {
            evInput.value = event;
            // Trigger input event to update any UI elements that depend on input
            const inputEvent = new Event('input', { bubbles: true });
            evInput.dispatchEvent(inputEvent);
        });
        
        eventsList.appendChild(eventItem);
    });
    
    // Make sure the custom dropdown works correctly
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

    // Custom dropdown functionality with immediate filtering
    evInput.addEventListener('input', function() {
        const filterText = this.value.toUpperCase();
        customDropdown.innerHTML = ''; // Clear previous results
        
        // Show dropdown as soon as user starts typing
        customDropdown.style.display = 'block';
            
        // Filter events and add to dropdown (phonetic/lexical matching)
        const matchingEvents = filterText.length > 0 ?
            ddValues.filter(event => 
                event.toUpperCase().includes(filterText)
            ).slice(0, 8) : // Limit to first 8 matches for better UX
            ddValues.slice(0, 8); // Show first 8 events when empty
            
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
    
    // Add Enter key support for submission
    evInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !btnSubmit.disabled) {
            if (validEventEntered(evInput)) {
                scoreResponse(evInput.value, game);
                btnSubmit.disabled = true;
                btnNext.disabled = false;
            }
        }
    });

    //reset score and results
    initResultsModal();

    // Start the game
    console.log("Starting new game");
    startNewGame(game);
    console.log("Game started");
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
    qScore = Math.abs(actual - res); // This is the gap in years
    game.score += qScore; // Track total gap
    game.cumulativeGap += qScore; // Also store in cumulativeGap for clarity

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
            <div class="score-year"><span>Target Year:</span> ${actual < 0 ? Math.abs(actual) + ' BC' : actual + ' AD'}</div>
            <div class="score-year"><span>Selected Event:</span> ${res < 0 ? Math.abs(res) + ' BC' : res + ' AD'}</div>
            <div class="score-diff" style="color: ${scoreColor}">
                <span>Year Gap:</span> ${Math.abs(scoreDiff)} years ${scoreDiff < 0 ? '(before target)' : '(after target)'}
            </div>
            <div class="score-cumulative">
                <span>Cumulative Gap:</span> ${game.cumulativeGap} years
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
    hangLen = Math.round(game.cumulativeGap / (game.maxQns * 300) * 99) // Scale based on expected reasonable gaps
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
    console.log("Updating year card");
    
    const qCard = document.getElementById("qCard");
    console.log("qCard element:", qCard);
    
    // Generate random year between -1000 (1000 BC) and 2000 AD
    let rndYear = Math.floor(Math.random() * 3001) - 1000;
    game.qList.push(rndYear);
    
    // Ensure the text is visible
    if (qCard) {
        // Format year display with BC/AD
        const yearText = rndYear < 0 ? Math.abs(rndYear) + " BC" : rndYear + " AD";
        console.log("Setting year display to:", yearText);
        qCard.innerHTML = yearText;
        qCard.style.color = "white";
        qCard.style.fontSize = "1.8rem";
        qCard.style.fontWeight = "bold";
        // Add !important to make sure it stays white
        qCard.setAttribute("style", "color: white !important; font-size: 1.8rem; font-weight: bold;");
    } else {
        console.error("qCard element not found!");
    }
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
    //Needs 3 elements: Avg, Cumulative Gap and Num Questions
    tickerLeft = document.getElementById('tickerLeft')
    tickerCenter = document.getElementById('tickerCenter')
    tickerRight = document.getElementById('tickerRight')

    tickerCenter.innerHTML = "Total Gap: " + game.cumulativeGap + " years";
    tickerRight.innerText = game.qNum + " / " + game.maxQns;
    tickerLeft.innerText = "Avg Gap: " + Math.round(game.cumulativeGap / game.qNum) + " years"
}

function clearTicker() {
    document.getElementById('tickerLeft').innerHTML = ""
    document.getElementById('tickerCenter').innerHTML = ""
    document.getElementById('tickerRight').innerHTML = ""
}


function initResultsModal() {
    // Get the existing modal elements
    const resmodal = document.getElementById("results-modal");
    const btnAnother = document.getElementById("btnAnother");
    const btnShare = document.getElementById("btnShare");
    const btnDone = document.getElementById("btnDone");
    
    // Apply styles
    btnAnother.style.background = '#007bff';
    btnAnother.style.color = 'white';
    btnDone.style.background = '#dc3545';
    btnShare.style.background = successGreen;
    
    // Add event listeners
    btnAnother.addEventListener("click", function () {
        resmodal.close();
        clearCard('sCard');
        startNewGame(game);
    });

    btnDone.addEventListener("click", function () {
        resmodal.close();
        clearCard('sCard');
        location.href = '../index.html'
    });
    
    console.log('Modal initialized');
}



function closeoutGame() {
    const resmodal = document.getElementById("results-modal");
    const btnAnother = document.getElementById("btnAnother");
    const btnDone = document.getElementById("btnDone");
    const resText = document.getElementById("res-text");

    resmodal.showModal();


    // //show results tally boxes
    // tcon = document.getElementById('resTBRow');
    // tcon.replaceChildren();
    // tallyboxes = createTallyBoxes(game, "resTBRow");
    // //Show tallyBoxes in ResultsModal
    // game.results.forEach((e, idx) => {
    //     colorTallyBox(idx, e)
    // });

    console.log(game.cumulativeGap, "Total Gap")
    resText.innerHTML = `
        <div class="results-summary">
            <h3>Game Results</h3>
            <p>Total Gap: ${game.cumulativeGap} years</p>
            <p>Average Gap: ${(game.cumulativeGap / game.qNum).toFixed(2)} years per question</p>
            <p>Smaller gaps are better!</p>
        </div>
    `;

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
    game.cumulativeGap = 0;
    clearTicker();
    resetDatalist();

    //clear TallyBoxes
    tcon = document.getElementById('tallyBoard');
    if (tcon) {
        tcon.replaceChildren(); //get rid of the old tallyBoxes, children of tallyBoard
        tallyboxes = createTallyBoxes(game, 'tallyBoard');
    } else {
        console.error("tallyBoard element not found!");
    }

    nextQuestion(game);
}