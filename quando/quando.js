// Quando
// Created by Ram Narasimhan
// March 2022

successGreen = "#28a745";
warningOrange = "#ffc107";
dangerRed = "#dc3545";
BtnActiveColor = "#1c3494"
BtnOffColor = "#e6f3f8";

const game = {
    score: 0, qns: 0, penalty: [0, 2, 5, 10],
    numQns: 5, //[1,2,5,6,10]
    maxscore: 100,
    averageDifficulty: 5,
    chosenQuestionDifficulty: "A",
    chosenAltsDifficulty: "M",
    category: "All",
    hintFlag: false,
    numHints: 0,
    activeOptions: [0, 1, 2, 3],
    timePeriod: "All",
    newEventFlag: true,
    solnFlag: false,
    solnAttempted: false,

};

var eList = Object.values(events); //from eventsDB.js
var gameQuestions = eList;

document.addEventListener("DOMContentLoaded", () => {

    //PAGE APPEARANCE
    const output = document.querySelector('.output');
    const scoreBox = maker('div', output, 'main', 'Scorecard');
    const main = maker('div', output, 'main', 'Press Button to Start');
    const optionsPanel = maker('div', output, 'main', '');
    main.id = "mainDiv";
    scoreBox.id = "scoreDiv";
    output.id = "output";


    altBtn = []
    for (let rep = 0; rep < 4; rep++) {
        altBtn.push(maker('button', optionsPanel, 'altBtn', `Sol${rep}`));
    }

    //Nav Buttons
    var navdiv = maker('div', output, 'padDiv', '');
    output.append(navdiv)

    const btnNext = maker('button', navdiv, 'navbtn', 'Next');
    btnNext.id = 'btnNext';
    btnNext.style.width = '60%';
    btnNext.style.height = "2.5em";
    btnNext.style.background = BtnActiveColor

    var navdiv2 = maker('div', output, 'padDiv', '');
    output.append(navdiv2)
    const btnHint = maker('button', navdiv2, 'navbtn', 'Hint');
    const btnSoln = maker('button', navdiv2, 'navbtn', 'Solution');
    btnHint.id = 'btnHint';
    btnSoln.id = 'btnSoln';


    //TALLY BOX
    //TODO: This has to become a function, called from Start New Game
    //It needs game.numQns as an input. Attach it to output eventually
    var tcon = document.createElement('div');
    tcon.id = 'tallyBoard';
    output.append(tcon)


    numTallyRows = getTallyRows();
    tallyrows = []
    tallyboxes = []
    for (row = 0; row < numTallyRows; row++) {
        tallyrows.push(maker('div', tcon, 'tallyRow', ''))
        for (let box = 0; box < 10; box++) {
            tallyboxes.push(maker('div', tallyrows[row], 'tallyBox', ''))
        }
    }



    //PROGRESS BAR
    var pdiv = maker('div', output, 'padDiv', '');
    var barbase = document.createElement('div');
    barbase.id = 'progressBase';
    pdiv.append(barbase)

    var progress = document.createElement('div');
    progress.id = 'progress';
    barbase.append(progress)



    const resmodal = maker('div', output, 'modal', '');
    const rescontainer = maker('div', resmodal, 'modal-content', '');
    const resclose = maker('span', rescontainer, 'close', "&times");
    resmodal.id = "results-modal"
    resclose.id = "close-results"

    var resh3 = document.createElement("h3");
    resh3.innerHTML = "";
    resh3.id = 'res-h3';
    rescontainer.appendChild(resh3);

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


    // END of html appearance
    // --------------------------------------    


    //REFRESH
    btnNext.addEventListener('click', (e) => {
        pickNextQuestion(game);
    })


    //An answer is attemtpted
    for (let rep = 0; rep < 4; rep++) {
        altBtn[rep].addEventListener('click', (e) => {
            console.log('pressed ', rep)
            displaySolution(rep)
        })
    }

    btnSoln.addEventListener('click', (e) => {
        displaySolution(-1);
    })


    //GIVE A HINT
    btnHint.addEventListener('click', (e) => {
        giveHint()
    })

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

    function getTallyRows() {
        numRows = Math.floor(game.numQns / 5)
        if (game.numQns % 5) { numRows += 1 }
        return numRows
    }


    initOptionsModal();
    initHelpModal();
    initStatsModal();
    initSidebar();


    const sidebar = document.getElementById("settings-sidebar");
    sidebar.className = "slide-in";
    sidebar.style.display = "block";

    startNewGame(game);

});