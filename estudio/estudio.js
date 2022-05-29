// Estudio
// Created by Ram Narasimhan
// May 2022

successGreen = "#28a745";
warningOrange = "#ffc107";
dangerRed = "#dc3545";
BtnActiveColor = "#1c3494"
BtnOffColor = "#e6f3f8";

const categoryValues = ["America", "Europe", "Asia", "Africa",
    "France", "Germany", "Britain", "China", "Discovery", "Greek", "India", "Invention", "MiddleEast", "prehistory",
    "Religion", "Roman", "Royalty", "Russia", "Science", "Wars", "World"];


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

    const cfront = maker('div', card, 'review-front', '');
    const frontSubj = maker('div', cfront, 'review-front.subj', '');
    const cfrontH1 = maker('div', cfront, 'review-text', '');

    const cback = maker('div', card, 'review-back', '');
    const backSubj = maker('div', cback, 'review-back.subj', '');
    const cbackH1 = maker('h1', cback, 'review-back.h1', '');

    cfrontH1.id = "rfrontH1";
    cbackH1.id = "rbackH1";
    output.id = "output";
    card.id = 'reviewcard';
    backSubj.id = "subback";
    frontSubj.id = "subfront";

    // cfront.innerHTML = 'Test Console'

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


function getQSubject(idx) {
    qitem = gameQuestions[index]

    validSubjects = []
    for (subj of categoryValues) {
        if (qitem[subj]) {
            validSubjects.push(subj)
        }
    }

    return validSubjects.random()
}


function displayNextReviewCard(game) {

    //var card = document.getElementById("reviewcard");
    var cfrontH1 = document.getElementById("rfrontH1");
    var cbackH1 = document.getElementById("rbackH1");
    var divDetails = document.getElementById("divDetails");
    var btnWiki = document.getElementById("btnWiki");
    var btnDetails = document.getElementById("btnDetails");

    var subback = document.getElementById("subback");
    var subfront = document.getElementById("subfront");

    game.index = pickNextEventIndex();
    console.log(game.index);

    let _qstr = formatLine(gameQuestions[game.index].event);
    let _qdate = gameQuestions[game.index].stem;
    let _qdetails = gameQuestions[game.index].details;
    let _qwiki = gameQuestions[game.index].wikipedia;
    let _qsubj = getQSubject(game.index);
    console.log("subj", _qsubj);

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
    subback.innerHTML = _qsubj;
    console.log(_qsubj);

    subfront.innerHTML = _qsubj;

    cbackH1.innerHTML = _qdate;
    cfrontH1.innerHTML = _qstr.text;
    divDetails.innerHTML = _qdetails;
}

function startNewGame(game) {
    game.qList = [];
    game.qNum = 0;
    game.score = 0;
    //    clearTicker();

    displayNextReviewCard(game);
}

