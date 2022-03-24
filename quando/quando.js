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

    createTallyBoxRow(output);

    //PROGRESS BAR
    var pdiv = maker('div', output, 'padDiv', '');
    var barbase = document.createElement('div');
    barbase.id = 'progressBase';
    pdiv.append(barbase)

    var progress = document.createElement('div');
    progress.id = 'progress';
    barbase.append(progress)

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

    initOptionsModal();
    initHelpModal();
    initStatsModal();
    initResultsModal();
    initSidebar();


    const sidebar = document.getElementById("settings-sidebar");
    sidebar.className = "slide-in";
    sidebar.style.display = "block";

    startNewGame(game);

});

