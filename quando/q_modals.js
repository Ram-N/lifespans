// Modals used in Quando
// Created by Ram Narasimhan
// March 2022


successGreen = "#28a745";
warningOrange = "#ffc107";
dangerRed = "#dc3545";
BtnActiveColor = "#1c3494"
BtnOffColor = "#e6f3f8";

const categoryValues = ["All", "World", "USA/America", "Europe", "Asia", "Africa", "UK/Great Britain", "France", "Germany", "China", "India"];
const itemColors = { 0: 'red', 5: 'yellow', 8: 'blue', 10: successGreen }
const timePeriodValues = ["All", "0 AD - Present", "1900-2000 AD", "1800s", "1500 AD-Present", "1000 AD-1500 AD", "0 AD -1000 AD", "BCE"];


//SIDEBAR
function initSidebar() {
    const sidebar = document.getElementById("settings-sidebar");
    const modalcontent = document.getElementById("settings-modal-content");

    var h2 = document.createElement("h2");
    h2.innerHTML = "Game Settings";
    modalcontent.appendChild(h2);

    var numQValues = [1, 2, 5, 6, 10];
    let promptText = "<br>" + "Number of questions per set: "
    let selectID = "selectNumQ";
    let promptFor = "numQ"
    selIndex = numQValues.indexOf(game.numQns);
    console.log(game.numQns, "while creating DD index is", selIndex,)
    addDropdown(numQValues, selIndex, selectID, promptText, promptFor, modalcontent);

    //Major Cat
    promptText = "<br>" + "Region/Category: "
    selectID = "selectCat";
    promptFor = "cat"
    selIndex = 0;
    addDropdown(categoryValues, selIndex, selectID, promptText, promptFor, modalcontent);

    values = ["None", "Catastrophes", "Discoveries", "Inventions", "Literature", "Wars"];
    selIndex = 0;
    promptText = "<br>" + "Specific Topics: "
    selectID = "ddSpecial";
    promptFor = "scat"
    addDropdown(values, selIndex, selectID, promptText, promptFor, modalcontent);
    document.getElementById(selectID).disabled = true;

    promptText = "<br>" + "Time Period: "
    selectID = "ddTP";
    promptFor = "TP";
    selIndex = 0;
    addDropdown(timePeriodValues, selIndex, selectID, promptText, promptFor, modalcontent);


    //QDIFF Buttons    Question Difficulty row
    let qrow = document.createElement('div');
    qrow.id = 'opWrapper'
    modalcontent.append(qrow)

    let lbl = document.createElement('span');
    lbl.classList.add('tspan');
    lbl.innerHTML = 'Questions '
    qrow.append(lbl)

    const questEasy = maker('button', qrow, 'Opbtn', 'Easy');
    const questMed = maker('button', qrow, 'Opbtn', 'Medium');
    const questHard = maker('button', qrow, 'Opbtn', 'Hard');

    qbtns = [[questEasy, "E"], [questMed, "M"], [questHard, "H"]]
    for (qb of qbtns) {
        qb[0].dataset.qdiff = qb[1]
        qb[0].style.background = BtnOffColor;
    }

    //C H O I C E S
    let owrap = document.createElement('div');
    owrap.id = 'opWrapper'
    modalcontent.append(owrap)

    lbl = document.createElement('span');
    lbl.innerHTML = 'Choices'
    lbl.classList.add('tspan');
    owrap.append(lbl)

    //Choice Difficulty Buttons
    const btnEasy = maker('button', owrap, 'Opbtn', 'Easy');
    const btnMed = maker('button', owrap, 'Opbtn', 'Medium');
    const btnHard = maker('button', owrap, 'Opbtn', 'Hard');
    abtns = [[btnEasy, "E"], [btnMed, "M"], [btnHard, "H"]]
    for (ab of abtns) {
        ab[0].dataset.altsdiff = ab[1]
        ab[0].style.background = BtnOffColor;
    }

    //SELECTION TEXT (shows the selections)
    owrap = document.createElement('div');
    owrap.id = 'selText';
    modalcontent.append(owrap)
    updateSelText();
    //owrap.innerHTML = selectionText();

    const resetBtn = maker('button', modalcontent, 'Opbtn', 'Reset All');


    //START BUTTON
    let gowrap = document.createElement('div');
    modalcontent.append(gowrap)
    const btnStart = maker('button', gowrap, 'Opbtn', 'New Quando');
    btnStart.id = 'goBtn'
    btnStart.style.background = successGreen;
    btnStart.style.color = "white"

    // END OF SIDEBAR APPEARANCE


    //ELEMENT ACTIONS
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

    //FUNCTIONALTIY
    for (ab of abtns) {
        handleAltsButtonClick(ab, abtns);
        updateSelText();
    }

    for (qb of qbtns) {
        handleQuestionButtonClick(qb, qbtns);
    }

    btnStart.addEventListener("click", function () {
        startNewGame(game);
        slidebackSidebar(sidebar);
        console.log(ddNumQ.selectedIndex, 'Num Qs selected')
        console.log(game.numQns)

    })

    ddNumQ = document.getElementById('selectNumQ')
    ddNumQ.onchange = function () {
        console.log(this.value, 'numQ');
        game.numQns = parseInt(this.options[this.selectedIndex].text)
        updateSelText();
    }

    ddCat = document.getElementById('selectCat')
    ddCat.onchange = function () {
        console.log(this.value, 'Category Selected');
        assignGameCategory(ddCat)
        updateSelText();
    }

    ddTP = document.getElementById('ddTP')
    ddTP.onchange = function () {
        console.log(this.value, 'TP ');
        assignGameTimePeriod(ddTP)
        updateSelText();
    }

}

function updateSelText() {
    console.log('update')
    sel = document.getElementById('selText');
    sel.innerHTML = selectionText();
}

function selectionText() {
    console.log(game)
    ddict = { "E": "Easy", "M": "Medium", "H": "Hard" }
    let qd = ddict[game.chosenQuestionDifficulty];
    let ad = ddict[game.chosenAltsDifficulty];
    selText = `<br>For this round: ${game.numQns} questions 
    <br> Category: ${game.category}
    <br> Time period: ${game.timePeriod}
     <br> Question Difficulty: ${qd} <br> Choices: ${ad} `
    return selText
}

function assignGameCategory(dd) {
    txt = dd.options[dd.selectedIndex].text
    console.log(txt, "chosen Cat")
    game.category = txt;
}

function assignGameTimePeriod(dd) {
    txt = dd.options[dd.selectedIndex].text
    game.timePeriod = txt;
    console.log(txt, "chosen TP", game.timePeriod)

}

function subsetEventsbySelectedCategory() {
    if (game.category == "All") { return } //no need to filter
    let catMap = {};
    for (catText of categoryValues) {
        catMap[catText] = catText
    }
    catMap['USA/America'] = 'America'
    catMap['UK/Great Britain'] = 'Britain'
    gameQuestions = gameQuestions.filter(ev =>
        ev[catMap[game.category]] == 1.0
    );

}


function slidebackSidebar(sidebar) {
    sidebar.className = "slide-out"
    setTimeout(() => sidebar.style.display = "none", 775)
}

//Appearance of dropdown
function addDropdown(values, selIndex, selectID, promptText, promptFor, modalcontent) {

    var dddiv = document.createElement("div");
    var select = document.createElement("select");
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

    select.selectedIndex = selIndex;
    modalcontent.append(dddiv);
    dddiv.appendChild(label).appendChild(select);
}

function handleAltsButtonClick(ab, abtns) {
    let aBtn = ab[0]
    aBtn.addEventListener("click", function () {
        for (b of abtns) {
            b[0].style.background = BtnOffColor;
            b[0].style.color = "black";
        }
        setGameAltsDiffLevel(ab[1]); //functionality
        updateSelText();
    });
}


function handleQuestionButtonClick(qb, qbtns) {
    let questBtn = qb[0]
    questBtn.addEventListener("click", function () {
        for (b of qbtns) {
            b[0].style.background = BtnOffColor;
            b[0].style.color = "black";
        }
        setGameQDiffLevel(qb[1]);
        updateSelText();
    });
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
    ddIDnames = ["selectNumQ", "selectCat", "ddSpecial", "ddTP"]
    ddNumQ = document.getElementById(ddIDnames[0]);
    ddCat = document.getElementById(ddIDnames[1]);
    ddSpecial = document.getElementById(ddIDnames[2]);
    ddTP = document.getElementById(ddIDnames[3]);

    //global score to be Zero
    game.score = 0
    game.qns = 0
    game.numQns = parseInt(ddNumQ.options[ddNumQ.selectedIndex].text)
    gameQuestions = eList;


    //clear out the tallyboxes
    for (tb = 0; tb < game.numQns; tb++) {
        tallyboxes[tb].style.background = "";
    }

    //subsetting questions
    // subsetEventsbySelectedCategory(ddCat);
    subsetEventsbySelectedCategory(); //actual subsetting happens now.
    //subsetEventsbySpecific(ddSpecial);
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

    gameQuestions = gameQuestions.filter(ev =>
        ev.diffCat == letter
    );

    questBtn = document.querySelector(`[data-qdiff="${letter}"]`)
    questBtn.style.background = BtnActiveColor;
    questBtn.style.color = "white";
}

function pickNextEventIndex() {
    index = Math.floor(Math.random() * gameQuestions.length)
    return index;
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
    console.log(game.index);
    let _qstr = formatLine(gameQuestions[index].event);

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
    let _str = `Score: ${game.score} out of ${game.qns * 10} \t\t(${game.qns} of ${game.numQns} Questions)`
    return _str
}

function displayAlternatives(index) {
    solText = gameQuestions[index].stem;

    switch (game.chosenAltsDifficulty) {
        case 'E': solOptions = gameQuestions[index].altsEasy;
            break;
        case 'M': solOptions = gameQuestions[index].altsMid;
            break;
        case 'H': solOptions = gameQuestions[index].altsHard;
            break;

        default: solOptions = gameQuestions[index].altsMid;
    }

    shuffleArray2(solOptions); // inplace shuffle rn_utils.js

    altList = solOptions.slice(0, 3).concat(solText)
    shuffleArray2(altList);

    for (let rep = 0; rep < 4; rep++) {
        altBtn[rep].innerHTML = altList[rep]
    }


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
            actual = gameQuestions[index].stem
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

        game.qns += 1;

        try {
            tallyboxes[game.qns].style.background = itemColors[itemScore];
            throw 'myException'; // generates an exception
        } catch (e) {
            console.log(e, game.qns, game.numQns)
        }


        const scoreBox = document.getElementById("scoreDiv");
        message(scoreBox, scoreString(), 'black');
        progress.style.width = getProgress() + "%";
    }
}

// OPTIONS MODAL

function initOptionsModal() {
    const modal = document.getElementById("options-modal");
    const modalcontent = document.getElementById("options-modal-content");

    var h2 = document.createElement("h2");
    h2.innerHTML = "Game Options";
    modalcontent.appendChild(h2);


    //START BUTTON
    let gowrap = document.createElement('div');
    modalcontent.append(gowrap)
    const btnStart = maker('button', gowrap, 'Opbtn', 'Okay');
    btnStart.id = 'goBtn'
    btnStart.style.background = successGreen;
    btnStart.style.color = "white"

    // END OF MODAL APPEARANCE

    const gearBtn = document.getElementById("game-options"); //on the titlebar
    const span = document.getElementById("close-options");

    // When the user clicks on the button, open the modal
    gearBtn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    // When the user clicks on <span> (x), close the modal
    span.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });


    btnStart.addEventListener("click", function () {
        //startNewGame(game);
        modal.style.display = "none";
    })

}


function initStatsModal() {
    const modal = document.getElementById("stats-modal");

    // Get the button that opens the modal
    const btn = document.getElementById("stats");

    // Get the <span> element that closes the modal
    const span = document.getElementById("close-stats");

    // When the user clicks on the button, open the modal
    btn.addEventListener("click", function () {
        // update stats here
        modal.style.display = "block";
    });

    // When the user clicks on <span> (x), close the modal
    span.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}

function initHelpModal() {
    const modal = document.getElementById("help-modal");
    const helpbtn = document.getElementById("help");
    const span = document.getElementById("close-help");

    helpbtn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    span.addEventListener("click", function () {
        modal.style.display = "none"; //close the modal
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none"; //close the modal
        }
    });
}

