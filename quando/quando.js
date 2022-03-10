// Quando
// Created by Ram Narasimhan
// March 2022

successGreen = "#28a745";
warningOrange = "#ffc107";
dangerRed = "#dc3545";
BtnActiveColor = "#1c3494"
BtnOffColor = "#e6f3f8";

const game = {
    score: 0, qns: 0, penalty: [0, 2, 5, 10], maxqns: 2, maxscore: 100,
    averageDifficulty: 5,
    chosenQuestionDifficulty: "E",
    chosenAltsDifficulty: "M",
    category: 'All Events',
    hintFlag: false,
    numHints: 0,
    activeOptions: [0, 1, 2, 3],

    newEventFlag: true,
    solnFlag: false,
    solnAttempted: false,

};

var eList = Object.values(events); //from eventsDB.js

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

    var navdiv2 = maker('div', output, 'padDiv', '');
    output.append(navdiv2)
    const btnHint = maker('button', navdiv2, 'navbtn', 'Hint');
    const btnSoln = maker('button', navdiv2, 'navbtn', 'Solution');
    btnHint.id = 'btnHint';
    btnSoln.id = 'btnSoln';


    //TALLY BOX
    var tcon = document.createElement('div');
    tcon.id = 'tallyBoard';
    output.append(tcon)


    numTallyRows = getTallyRows();
    tallyrows = []
    tallyboxes = []
    for (row = 0; row < numTallyRows; row++) {
        tallyrows.push(maker('div', tcon, 'tallyRow', ''))
        for (let box = 0; box < 5; box++) {
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
                actual = gameQuestions[game.index].Date
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


    function initOptionsModal() {
        const modal = document.getElementById("options-modal");
        const modalcontent = document.getElementById("options-modal-content");

        var h2 = document.createElement("h2");
        h2.innerHTML = "Game Options";
        modalcontent.appendChild(h2);

        //Question Difficulty row
        let qrow = document.createElement('div');
        qrow.id = 'opWrapper'
        modalcontent.append(qrow)

        let lbl = document.createElement('span');
        lbl.classList.add('tspan');
        lbl.innerHTML = 'Questions '
        qrow.append(lbl)

        //Option Buttons
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

        //Option Buttons
        const btnEasy = maker('button', owrap, 'Opbtn', 'Easy');
        const btnMed = maker('button', owrap, 'Opbtn', 'Medium');
        const btnHard = maker('button', owrap, 'Opbtn', 'Hard');
        abtns = [[btnEasy, "E"], [btnMed, "M"], [btnHard, "H"]]
        for (ab of abtns) {
            ab[0].dataset.altsdiff = ab[1]
            ab[0].style.background = BtnOffColor;
        }

        //START BUTTON
        let gowrap = document.createElement('div');
        modalcontent.append(gowrap)
        const btnStart = maker('button', gowrap, 'Opbtn', 'Start');
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

        for (ab of abtns) {
            handleAltsButtonClick(ab, abtns);
        }

        for (qb of qbtns) {
            handleQuestionButtonClick(qb, qbtns);
        }

        btnStart.addEventListener("click", function () {
            startNewGame(game);
            modal.style.display = "none";
        })

    }

    function handleAltsButtonClick(ab, abtns) {
        let aBtn = ab[0]
        aBtn.addEventListener("click", function () {
            for (b of abtns) {
                b[0].style.background = BtnOffColor;
                b[0].style.color = "black";
            }
            setGameAltsDiffLevel(ab[1]);
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
        });
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

        // Get the button that opens the modal
        const helpbtn = document.getElementById("help");

        // Get the <span> element that closes the modal
        const span = document.getElementById("close-help");

        // When the user clicks on the button, open the modal
        helpbtn.addEventListener("click", function () {
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


    function getTallyRows() {
        numRows = Math.floor(game.maxqns / 5)
        if (game.maxqns % 5) { numRows += 1 }
        return numRows
    }


    initOptionsModal();
    initHelpModal();
    initStatsModal();
    initSettingsModal();


    const modal = document.getElementById("options-modal");
    modal.style.display = "block";

    startNewGame(game);

});