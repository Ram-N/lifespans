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
const timePeriodValues = ["All", "0AD-Present", "1900-Present", "1800s", "1700s", "1500AD-Present", "1000AD-1500AD", "0AD-1000AD", "0AD-500AD", "BCE"];


//SIDEBAR
function initSidebar() {
    const sidebar = document.getElementById("settings-sidebar");
    const modalcontent = document.getElementById("settings-modal-content");

    var h2 = document.createElement("h2");
    h2.innerHTML = "Game Settings";
    modalcontent.appendChild(h2);

    qAlertBox = addTextBox(parent = modalcontent, elClass = "alert error", _id = 'qAlertBox');
    qAlertBox.innerHTML = "";
    qAlertBox.style.display = 'none'

    var numQValues = [1, 2, 5, 6, 10];
    let promptText = "<br>" + "Number of questions per set: "
    let selectID = "selectNumQ";
    let promptFor = "numQ"
    selIndex = numQValues.indexOf(game.maxQns);
    console.log(game.maxQns, "while creating DD index is", selIndex,)
    addDropdown(numQValues, selIndex, selectID, promptText, promptFor, modalcontent);

    promptText = "<br>" + "Time Period: "
    selectID = "ddTP";
    promptFor = "TP";
    selIndex = 0;
    addDropdown(timePeriodValues, selIndex, selectID, promptText, promptFor, modalcontent);

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


    //QDIFF Buttons    Question Difficulty row
    let qrow = document.createElement('div');
    qrow.id = 'opWrapper'
    modalcontent.append(qrow)

    let lbl = document.createElement('span');
    lbl.classList.add('tspan');
    lbl.innerHTML = 'Questions '
    qrow.append(lbl)

    const questAny = maker('button', qrow, 'Opbtn', 'Any');
    const questEasy = maker('button', qrow, 'Opbtn', 'Easy');
    const questMed = maker('button', qrow, 'Opbtn', 'Medium');
    const questHard = maker('button', qrow, 'Opbtn', 'Hard');

    qbtns = [[questEasy, "E"], [questMed, "M"], [questHard, "H"], [questAny, "A"]]
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


    ddNumQ = document.getElementById('selectNumQ')
    ddNumQ.onchange = function () {
        console.log(this.value, 'numQ');
        game.maxQns = parseInt(this.options[this.selectedIndex].text)
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

    btnStart.addEventListener("click", function () {
        statusOkay = startNewGame(game);
        if (statusOkay) {
            slidebackSidebar(sidebar);
            console.log(ddNumQ.selectedIndex, 'Num Qs selected')
            console.log(game.maxQns)
        }
    })

    defaultOptions = { maxQns: 5, category: 0, timePeriod: 0 }
    resetBtn.addEventListener("click", function () {
        game.maxQns = defaultOptions.maxQns;
        game.category = "All";
        game.timePeriod = "All";

        game.chosenQuestionDifficulty = "A";
        game.chosenAltsDifficulty = "M";
        ddNumQ.selectedIndex = numQValues.indexOf(game.maxQns);
        ddTP.selectedIndex = defaultOptions.timePeriod;
        ddSpecial.disabled = true;
        ddCat.selectedIndex = defaultOptions.category;

        for (b of qbtns) {
            b[0].style.background = BtnOffColor;
            b[0].style.color = "black";
        }
        buttonSelected(questAny);

        for (b of abtns) {
            b[0].style.background = BtnOffColor;
            b[0].style.color = "black";
        }
        buttonSelected(btnMed);//look and feel
        console.log('Resetting all options')
        updateSelText();
        qAlertBox.style.display = 'none'


    })


}

function updateSelText() {
    console.log('Some option in sidepanel updated')
    qAlertBox.style.display = 'none'
    sel = document.getElementById('selText');
    sel.innerHTML = selectionText();
}

function selectionText() {
    console.log(game)
    ddict = { "E": "Easy", "M": "Medium", "H": "Hard", "A": "All" }
    let qd = ddict[game.chosenQuestionDifficulty];
    let ad = ddict[game.chosenAltsDifficulty];
    selText = `<br>For this round: ${game.maxQns} questions 
    <br> Category: ${game.category}
    <br> Time period: ${game.timePeriod}
     <br> Question Difficulty: ${qd} <br> Choices: ${ad} `
    return selText
}

function assignGameCategory(dd) {
    txt = dd.options[dd.selectedIndex].text
    //console.log(txt, "chosen Cat")
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

function subsetEventsbySelectedTP() {
    if (game.timePeriod == "All") { return } //no need to filter
    let tPMap = {};
    for (ddText of timePeriodValues) {
        tPMap[ddText] = ddText
    }

    console.log('going to filter for', game.timePeriod)
    if (game.timePeriod == "0AD-Present") {
        gameQuestions = gameQuestions.filter(ev =>
            ev["timePeriod"] != 'BCE'
        );
        return
    }

    if (game.timePeriod == "1500AD-Present") {
        gameQuestions = gameQuestions.filter(ev =>
            ['1500AD-1700AD', "1800s", "1900s", "1900-Present"].includes(ev["timePeriod"])
        );
        return
    }

    if (game.timePeriod == "0AD-1000AD") {
        gameQuestions = gameQuestions.filter(ev =>
            ['500AD-1000AD', '0AD-500AD'].includes(ev["timePeriod"])
        );
        return
    }

    gameQuestions = gameQuestions.filter(ev =>
        ev["timePeriod"] == game.timePeriod
    );


}



function slidebackSidebar(sidebar) {
    sidebar.className = "slide-out"
    setTimeout(() => sidebar.style.display = "none", 775)
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





function setGameAltsDiffLevel(letter) {
    game.chosenAltsDifficulty = letter;
    console.log("Alts Chosen", game.chosenAltsDifficulty)

    aDiffBtn = document.querySelector(`[data-altsdiff="${letter}"]`)
    aDiffBtn.style.background = BtnActiveColor;
    aDiffBtn.style.color = "white";
}

function setGameQDiffLevel(letter) {
    game.chosenQuestionDifficulty = letter;
    console.log("Chosen QD", game.chosenQuestionDifficulty)

    if (letter != "A") {//do not subset questions if "Any" was chosen
        gameQuestions = gameQuestions.filter(ev =>
            ev.diffCat == letter
        );
    }
    questBtn = document.querySelector(`[data-qdiff="${letter}"]`)
    questBtn.style.background = BtnActiveColor;
    questBtn.style.color = "white";
}


function scoreString() {
    let _str = `Score: ${game.score} out of ${game.qNum * 10} \t\t(${game.qNum} of ${game.maxQns} Questions)`
    return _str
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

function initResultsModal() {
    const resmodal = maker('div', output, 'modal', '');
    const rescontainer = maker('div', resmodal, 'modal-content', '');
    const resclose = maker('span', rescontainer, 'close', "&times");
    resmodal.id = "results-modal"
    resclose.id = "close-results"

    const resChoiceBox = maker('div', rescontainer, 'info-box', "");
    const resChoiceTitle = maker('div', resChoiceBox, 'info-box-title', "Game Options");
    resChoiceText = maker('span', resChoiceBox, 'info-box-text', "");
    resChoiceText.id = 'res-choices';

    //placeholder for res tally boxes
    createTallyBoxesContainer(resChoiceBox, "resTBRow");

    resText = maker('span', resChoiceBox, 'info-box-text', "");
    resText.id = 'res-text';


    //RESULTS MODAL Buttons
    const btnAnother = maker('button', rescontainer, 'Opbtn', 'Another Round');
    const btnShare = maker('button', rescontainer, 'Opbtn', 'Share');
    const btnDone = maker('button', rescontainer, 'Opbtn', 'Leave');
    btnAnother.style.background = '#007bff';
    btnAnother.style.color = 'white';
    btnDone.style.background = '#dc3545';
    btnAnother.id = 'btnAnother';
    btnDone.id = 'btnDone';
    btnShare.id = 'btnShare';
    btnShare.style.background = successGreen

}


function getResultsText() {
    //TODO: Based on the %age score, make a suitably encouraging comment

    _astr = "<br>"
    //    _astr += selectionText() + '<br>'
    _astr += `You scored ${game.score} out of ${game.maxQns * 10}!`
    _astr += `<br> Average difficulty ${game.averageDifficulty}`
    return _astr
}



function closeoutGame() {

    const output = document.getElementById("output");
    const resmodal = document.getElementById("results-modal");
    //const modalcontent = document.getElementById("options-modal-content");
    const resclose = document.getElementById("close-results");
    const resBox = document.getElementById('results-box');
    const resChText = document.getElementById('res-choices');
    const resText = document.getElementById("res-text");
    const btnAnother = document.getElementById("btnAnother");
    const btnDone = document.getElementById("btnDone");

    resmodal.style.display = "block";
    resChText.innerHTML = selectionText();

    //show results tally boxes
    tcon = document.getElementById('resTBRow');
    tcon.replaceChildren();
    tallyboxes = createTallyBoxes(game, "resTBRow");
    //Show tallyBoxes in ResultsModal
    game.results.forEach((e, idx) => {
        _tcolor = itemColors[e];
        colorTallyBox(idx, _tcolor)
    });

    console.log(game.results, "results")
    resText.innerHTML = getResultsText();

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
        location.href = '../index.html'

    });

    tcon = document.getElementById('tallyBoard');
    tcon.replaceChildren(); //get rid of the tallyBoxes, children of tallyBoard
}


function startNewGame(game) {
    ddIDnames = ["selectNumQ", "selectCat", "ddSpecial", "ddTP"]
    ddNumQ = document.getElementById(ddIDnames[0]);
    ddCat = document.getElementById(ddIDnames[1]);
    ddSpecial = document.getElementById(ddIDnames[2]);
    ddTP = document.getElementById(ddIDnames[3]);

    //Reset Game attributes
    game.score = 0
    game.qNum = 0
    game.maxQns = parseInt(ddNumQ.options[ddNumQ.selectedIndex].text)
    gameQuestions = eList;
    game.results = [];

    tcon = document.getElementById('tallyBoard');
    tcon.replaceChildren(); //get rid of the old tallyBoxes, children of tallyBoard
    tallyboxes = createTallyBoxes(game, 'tallyBoard');

    console.log('maxQns', game.maxQns)
    //clear out the tallyboxes
    for (tb = 0; tb < game.maxQns; tb++) {
        tallyboxes[tb].style.background = "";
    }

    //subsetting questions
    // subsetEventsbySelectedCategory(ddCat);
    subsetEventsbySelectedCategory(); //actual subsetting happens now.
    console.log(gameQuestions.length, "after Cat", eList.length)

    subsetEventsbySelectedTP(); //actual subsetting happens now.
    console.log(eList.length, "After TP - ", gameQuestions.length);

    //subsetEventsbySpecific(ddSpecial);
    setGameAltsDiffLevel(game.chosenAltsDifficulty);
    console.log(gameQuestions.length, "after AltsD", eList.length)
    setGameQDiffLevel(game.chosenQuestionDifficulty);

    //check if there are enough questions...message accordingly
    console.log(gameQuestions.length, "numDB after QDiff")

    //verify that there are a sufficient number of questions
    if (gameQuestions.length < game.maxQns) {
        console.log('Error insuff questions')
        qAlertBox.innerHTML = "Options have made the scope of questions too narrow. \n Please broaden your filtering in the Side panel";
        qAlertBox.style.display = 'block'
        return 0 //statusOkay
    }
    else {
        //Pick a New event
        pickNextQuestion(game);
        return 1 //statusOkay
    }
}

