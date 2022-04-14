// Functions and utilties Used in handling Questions and Answers
// Created by Ram Narasimhan
// March 2022

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


    if (game.qNum == game.maxQns) {
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

    //check if there are enough questions...message accordingly
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

function giveHint() {
    maxHints = 3 // can only give 3 hints before solution is revealed
    if (!game.solnFlag && game.numHints < 3) {
        game.hintFlag = true;
        game.numHints++;

        done = false;
        while (!done) {
            pick = game.activeOptions.random()
            pressed = altBtn[pick].innerHTML
            actual = gameQuestions[game.index].stem
            if (pressed != actual) {
                altBtn[pick].innerHTML = ""
                //remove pick from the active options
                game.activeOptions = game.activeOptions.filter(function (ele) {
                    return ele != pick;
                });
                done = true;
            }
        }
        message(scoreBox, scoreString(), 'black');
    }
}


//Only needed when more than one tallyRow may be required
function getTallyRows() {
    return 1
    // numRows = Math.floor(game.maxQns / 5)
    // if (game.maxQns % 5) { numRows += 1 }
    // return numRows
}

//this function is called once, when creating "main"
function createTallyBoxesContainer(parent, _tid) {
    var tcon = maker('div', parent, 'tallyRow', "")
    tcon.id = _tid;
    parent.append(tcon);
}


//called twice. 
//Once from startNewGame.
//Once more from resultsmodal
function createTallyBoxes(game, _tid) {
    tcon = document.getElementById(_tid);
    numTallyRows = getTallyRows();
    tallyboxes = [];
    for (let box = 0; box < game.maxQns; box++) {
        tallyboxes.push(maker('div', tcon, 'tallyBox', ''))
    }
    return tallyboxes;
}


function formatLine(_str) {

    const breakers = [";", "\n"];
    const word_break = [" "];
    const textWidth = 100;
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


function getProgress() {
    let w;
    w = game.qNum / game.maxQns * 100
    if (w > 100) { w = 100 }

    return w;
}


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
        game.results.push(itemScore)
        colorCorrectAltBtn(); //make the correct solution to be green
        addMessage(solText, 'black'); //display solution
        btnSoln.disabled = true;
        btnHint.disabled = true;
        btnNext.disabled = false;
        btnNext.style.backgroundColor = BtnActiveColor;
        btnNext.style.color = 'white';

        _tcolor = itemColors[itemScore];
        colorTallyBox(game.qNum, _tcolor)
        game.qNum += 1;


        const scoreBox = document.getElementById("scoreDiv");
        message(scoreBox, scoreString(), 'black');
        progress.style.width = getProgress() + "%";
    }
}

function colorTallyBox(idx, _tcolor) {
    try {
        tallyboxes[idx].style.background = _tcolor;
        //throw 'tallyBoxException'; // generates an exception
    } catch (e) {
        console.log(e, game.qNum, game.maxQns, tallyboxes)
    }

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

