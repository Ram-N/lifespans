// Modals used in Quando
// Created by Ram Narasimhan
// March 2022


successGreen = "#28a745";
warningOrange = "#ffc107";
dangerRed = "#dc3545";
BtnActiveColor = "#1c3494"
BtnOffColor = "#e6f3f8";

const itemColors = { 0: 'red', 5: 'yellow', 8: 'blue', 10: successGreen }


//SIDEBAR
function initSidebar() {
    const sidebar = document.getElementById("settings-sidebar");
    const modalcontent = document.getElementById("settings-modal-content");

    var h2 = document.createElement("h2");
    h2.innerHTML = "Game Settings";
    modalcontent.appendChild(h2);

    var values = [1, 2, 5, 6, 10];
    let promptText = "Number of questions per set: "
    let selectID = "selectNumQ";
    let promptFor = "numQ"
    addDropdown(values, selectID, promptText, promptFor, modalcontent);

    var h2 = document.createElement("h2");
    sID = document.getElementById(selectID);
    h2.innerHTML = `NumQuestions ${sID.options[sID.selectedIndex].text}`;
    modalcontent.appendChild(h2);



    //START BUTTON
    let gowrap = document.createElement('div');
    modalcontent.append(gowrap)
    const btnStart = maker('button', gowrap, 'Opbtn', 'Start Game');
    btnStart.id = 'goBtn'
    btnStart.style.background = successGreen;
    btnStart.style.color = "white"

    // END OF SIDEBAR APPEARANCE

    const settingsBtn = document.getElementById("settings"); //on the titlebar
    const span = document.getElementById("close-settings");

    // When the user clicks on the button, open the modal
    settingsBtn.addEventListener("click", function () {
        sidebar.className = "slide-in";
        sidebar.style.display = "block";
    });

    // When the user clicks on <span> (x), close the modal
    span.addEventListener("click", function () {
        //sidebar.style.display = "none";
        slidebackSidebar(sidebar);
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", function (event) {
        if (event.target == sidebar) {
            //sidebar.style.display = "none";
            slidebackSidebar(sidebar);
        }
    });

    btnStart.addEventListener("click", function () {
        startNewGame(game);
        slidebackSidebar(sidebar);
        //sidebar.style.display = "none";
        console.log(sID.selectedIndex, 'selected')
        game.numQns = parseInt(sID.options[sID.selectedIndex].text)
        console.log(game.numQns)

    })

}


function getDropdown(sID) {
    sID.options[sID.selectedIndex].value;
    sID.options[sID.selectedIndex].text;
}

function addDropdown(values, selectID, promptText, promptFor, modalcontent) {

    var select = document.createElement("select");
    //select.name = "numQ";
    select.id = selectID;

    //each option has a value and text.
    for (const v of values) {
        let val = v.toString();
        var option = document.createElement("option");
        option.value = val;
        option.text = val.charAt(0).toUpperCase() + val.slice(1);
        select.appendChild(option);
    }

    var label = document.createElement("label");
    label.innerHTML = promptText
    label.htmlFor = promptFor;

    select.selectedIndex = 2;
    modalcontent.appendChild(label).appendChild(select);
}

function slidebackSidebar(sidebar) {
    sidebar.className = "slide-out"
    setTimeout(() => sidebar.style.display = "none", 775)
}


function closeoutGame() {

    const output = document.getElementById("output");
    const resmodal = document.getElementById("results-modal");
    //const modalcontent = document.getElementById("options-modal-content");
    const resclose = document.getElementById("close-results");
    const resh3 = document.getElementById("res-h3");
    const btnAnother = document.getElementById("btnAnother");
    const btnDone = document.getElementById("btnDone");

    resmodal.style.display = "block";
    resh3.innerHTML = getResultsText();

    // When the user clicks on <span> (x), close the modal
    resclose.addEventListener("click", function () {
        resmodal.style.display = "none";
    });

    btnAnother.addEventListener("click", function () {
        resmodal.style.display = "none";
        startNewGame(game); //startNewGame only if Another is clicked 
        progress.style.width = getProgress() + "%";
    });

    btnDone.addEventListener("click", function () {
        //clear screen if Done
        resmodal.style.display = "none";
        output.remove();
        hehead = document.getElementById("h2-game-category");
        hehead.innerHTML = 'Thank you for playing Quando!'

    });

}



function getResultsText() {
    //TODO: Based on the %age score, make a suitably encouraging comment

    _astr = ""
    _astr += `Category: ${game.category} <br>`
    _astr += `You scored ${game.score} out of ${game.numQns * 10}! <br>`
    _astr += `<br> Average difficulty ${game.averageDifficulty}`
    return _astr
}

function startNewGame(game) {
    //global score to be Zero
    game.score = 0
    game.qns = 0

    //clear out the tallyboxes
    for (tb = 0; tb < tallyboxes.length; tb++) {
        tallyboxes[tb].style.background = "";
    }

    setGameAltsDiffLevel(game.chosenAltsDifficulty);
    setGameQDiffLevel(game.chosenQuestionDifficulty);
    //Pick a New event
    pickNextQuestion(game);
}

function setGameAltsDiffLevel(letter) {
    game.chosenAltsDifficulty = letter;
    console.log("Alts Chosen", game.chosenAltsDifficulty)

    aDiffBtn = document.querySelector(`[data-altsdiff="${letter}"]`)
    aDiffBtn.style.background = BtnActiveColor;
    aDiffBtn.style.color = "white";
}

function setGameQDiffLevel(letter) {
    game.chosenQuestionDifficulty = letter;
    console.log("Chosen", game.chosenQuestionDifficulty)

    gameQuestions = eList.filter(ev =>
        ev.DiffCat == letter
    );

    questBtn = document.querySelector(`[data-qdiff="${letter}"]`)
    questBtn.style.background = BtnActiveColor;
    questBtn.style.color = "white";
}

function pickNextEventIndex() {

    index = Math.floor(Math.random() * gameQuestions.length)
    return index;

    // done = false;
    // circuitBreaker = 0
    // while (!done && (circuitBreaker < 1000)) {
    //     index = Math.floor(Math.random() * eList.length)
    //     chosen = eList[index] //chosen Event...has keys and alts both
    //     //console.log(chosen.DiffCat, game.chosenQuestionDifficulty)
    //     if (chosen.DiffCat == game.chosenQuestionDifficulty) {
    //         done = true;
    //         return index
    //     }
    //     circuitBreaker++;
    // }

    // console.log(game.chosenQuestionDifficulty, "not found")
    // return null

}

function pickNextQuestion(game) {

    const main = document.getElementById("mainDiv");
    const scoreBox = document.getElementById("scoreDiv");
    btnNext = document.getElementById("btnNext");
    btnHint = document.getElementById("btnHint");
    btnSoln = document.getElementById("btnSoln");


    if (game.qns == game.numQns) {
        closeoutGame();
    }

    game.hintFlag = false;
    game.numHints = 0;
    game.activeOptions = [0, 1, 2, 3];

    game.newEventFlag = false;
    game.solnFlag = false;
    game.solnAttempted = false;

    game.index = pickNextEventIndex(); //should be item level not game
    _qstr = formatLine(gameQuestions[index].Event);

    message(main, _qstr.text, 'black');
    message(scoreBox, scoreString(), 'black');
    displayAlternatives(index);
    //console.log('btnNext', btnNext)
    btnNext.disabled = true;
    btnNext.style.backgroundColor = BtnOffColor;
    btnSoln.disabled = false;
    btnHint.disabled = false;

    for (let rep = 0; rep < 4; rep++) {
        altBtn[rep].style.background = 'grey';
        altBtn[rep].style.color = 'black';
        //altBtn[rep].style.color = "white";
    }

}

function scoreString() {
    let _str = `Score: ${game.score} out of ${game.qns * 10}`
    return _str
}

function displayAlternatives(index) {
    solText = gameQuestions[index].Date;

    switch (game.chosenAltsDifficulty) {
        case 'E': solOptions = gameQuestions[index].AltsEasy;
            break;
        case 'M': solOptions = gameQuestions[index].AltsMid;
            break;
        case 'H': solOptions = gameQuestions[index].AltsHard;
            break;

        default: solOptions = gameQuestions[index].AltsMid;
    }

    shuffleArray2(solOptions); // inplace shuffle rn_utils.js

    altList = solOptions.slice(0, 3).concat(solText)
    shuffleArray2(altList);

    for (let rep = 0; rep < 4; rep++) {
        altBtn[rep].innerHTML = altList[rep]
    }


}

function formatLine(_str) {


    const breakers = [";", "\n"];
    const word_break = [" "];
    const textWidth = 50;
    formatted = ""
    currLen = 0
    for (var x of _str) {
        currLen++;
        if (breakers.some(el => x.includes(el))) {
            formatted += x + "<br>"
            currLen = 0
        }
        else if ((currLen > textWidth) && (word_break.some(el => x.includes(el)))) {
            formatted += x + "<br>"
            currLen = 0
        } else { formatted += x }
    }

    numLines = Math.ceil(formatted.length / textWidth)
    console.log(formatted, numLines)
    return { text: formatted, numLines: numLines }
}

//writes message to the MAIN board
function message(elem, html, txColor) {
    elem.innerHTML = html;
    elem.style.backgroundColor = txColor;
}


//writes message to the MAIN board
function addMessage(html, txColor) {
    const main = document.getElementById("mainDiv");

    main.innerHTML += "<br><br>" + html;
    main.style.backgroundColor = txColor;
}



function getProgress() {
    let w;
    w = game.qns / game.numQns * 100
    if (w > 100) { w = 100 }

    return w;
}


function colorCorrectAltBtn() {
    for (let rep = 0; rep < 4; rep++) {
        pressed = altBtn[rep].innerHTML
        actual = solText;
        if (pressed == actual) {
            altBtn[rep].style.background = successGreen;
            altBtn[rep].style.color = 'white';
        }
    }
}


//rep is the Alt that was pressed...
function displaySolution(rep) {
    if (!game.solnFlag) {
        itemScore = 0
        game.solnFlag = true; //revealed
        game.solnAttempted = (rep == -1) ? false : true;
        if (game.solnAttempted) {
            pressed = altBtn[rep].innerHTML
            actual = gameQuestions[index].Date
            if (pressed == actual) {
                itemScore = 10 - game.penalty[game.numHints]
                game.score += itemScore
            } else {
                altBtn[rep].style.background = "red";
                altBtn[rep].style.color = "white";
            }
        }
        colorCorrectAltBtn(); //make the correct solution to be green
        addMessage(solText, 'black'); //display solution
        btnSoln.disabled = true;
        btnHint.disabled = true;
        btnNext.disabled = false;
        btnNext.style.backgroundColor = BtnActiveColor;
        btnNext.style.color = 'white';

        tallyboxes[game.qns].style.background = itemColors[itemScore];

        game.qns += 1;

        const scoreBox = document.getElementById("scoreDiv");
        message(scoreBox, scoreString(), 'black');
        progress.style.width = getProgress() + "%";
    }
}
