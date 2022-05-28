// Estudio
// Created by Ram Narasimhan
// May 2022

successGreen = "#28a745";
warningOrange = "#ffc107";
dangerRed = "#dc3545";
BtnActiveColor = "#1c3494"
BtnOffColor = "#e6f3f8";

const game = {
    score: 0,
    qNum: 0, penalty: [0, 2, 5, 10],
    maxQns: 5, //Default, though this comes from the options modal
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

function myFlipFunction() {
    var card = document.getElementById("reviewcard");
    card.classList.toggle("flipper");
}


document.addEventListener("DOMContentLoaded", () => {

    //PAGE APPEARANCE
    const output = document.querySelector('.mainstudio');


    const main = maker('div', output, 'maincontainer', '');
    const card = maker('div', main, 'reviewcard', '');
    const cfront = maker('div', card, 'review-front', 'front');

    const cback = maker('div', card, 'review-back', '');
    const cbackH1 = maker('h1', cback, 'review-back.h1', '');

    cfront.id = "rfront";
    cbackH1.id = "rback";
    output.id = "output";
    card.id = 'reviewcard'
    cfront.innerHTML = 'Test this please'

    //Nav Buttons
    var cardcontainer = maker('div', main, 'cardbuttoncontainer', '');
    // main.append(cardcontainer)


    var navdiv2 = maker('div', cardcontainer, 'padDiv', '');
    const btnSoln = maker('button', navdiv2, 'navbtn', 'Flip Card');
    const btnWiki = maker('button', navdiv2, 'navbtn', 'Wikipedia');
    const btnDetails = maker('button', navdiv2, 'navbtn', 'Details');
    btnDetails.id = 'btnDetails';
    btnWiki.id = 'btnWiki';

    var divDetails = maker('div', output, 'textDiv', '');
    divDetails.id = "divDetails"
    divDetails.style.display = 'none';


    const btnNext = maker('button', cardcontainer, 'longbtn', 'Next');
    btnNext.id = 'btnNext';
    btnNext.style.width = '100%';
    // btnNext.style.height = "2.5em";



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
        displayNextReviewCard(game);
    })


    btnSoln.addEventListener('click', (e) => {
        myFlipFunction();
    })


    //GIVE A HINT
    btnWiki.addEventListener('click', (e) => {
        // giveHint()
    })


    btnDetails.addEventListener('click', (e) => {
        // giveHint()
    })

    //FLIP
    card.addEventListener('click', (e) => {
        console.log('clicked')
        myFlipFunction();
    })

    //SHOW DETAILS
    btnDetails.onmouseenter = function () {
        console.log(divDetails.innerHTML);
        divDetails.classList.remove("slide-left")
        divDetails.classList.add("slide-right")
        divDetails.style.display = "block";
    };

    btnDetails.onmouseleave = function () {
        console.log('details off');
        divDetails.classList.remove("slide-right")
        divDetails.classList.add("slide-left")
        divDetails.style.display = 'none';
    };

    btnWiki.addEventListener("click", function () {
        let url = gameQuestions[game.index].wikipedia;
        window.open(url, "_blank");
        console.log("url to wiki")
    });


    startNewGame(game);

});


function slideback(divDetails) {
    divDetails.className = "slide-down"
    setTimeout(() => divDetails.style.display = "none", 775)
}


function displayNextReviewCard(game) {

    //var card = document.getElementById("reviewcard");
    var cfront = document.getElementById("rfront");
    var cback = document.getElementById("rback");
    var divDetails = document.getElementById("divDetails");
    var btnWiki = document.getElementById("btnWiki");
    var btnDetails = document.getElementById("btnDetails");

    game.index = pickNextEventIndex();
    console.log(game.index);

    let _qstr = formatLine(gameQuestions[game.index].event);
    let _qdate = gameQuestions[game.index].stem;
    let _qdetails = gameQuestions[game.index].details;
    let _qwiki = gameQuestions[game.index].wikipedia;

    btnDetails.disabled = false;
    btnWiki.disabled = false;

    if (!_qdetails) {
        btnDetails.disabled = true;
    }
    if (!_qwiki) {
        btnWiki.disabled = true;
    }

    // console.log(_qstr)
    // console.log(_qdate)
    console.log(divDetails.innerHTML);


    cback.innerHTML = _qdate;
    cfront.innerHTML = _qstr.text;
    divDetails.innerHTML = _qdetails;
}

function startNewGame(game) {
    game.qList = [];
    game.qNum = 0;
    game.score = 0;
    //    clearTicker();

    displayNextReviewCard(game);
}

