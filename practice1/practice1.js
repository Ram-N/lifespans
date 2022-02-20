// History Golf Practice 1
// Ram Narasimhan.

const cnv = {
    xMargin: 30,
    yMargin: 30,
}

var hintFlag = false;
var newEventFlag = true;
var solnFlag = false;
var solnAttempted = false;

//var values = Object.values(events);
var eList = Object.values(events);

//var keys = Object.keys(events);


const output = document.querySelector('.output');
const scoreBox = maker('div', output, 'main', 'Scorecard');
const main = maker('div', output, 'main', 'Press Button to Start');
const optionsPanel = maker('div', output, 'main', '');


altBtn = []
for (let rep = 0; rep < 4; rep++) {
    altBtn.push(maker('button', optionsPanel, 'optionBtn', `Sol${rep}`));
}

//Nav Buttons
var navdiv = maker('div', output, 'padDiv', '');
output.append(navdiv)

const btnHint = maker('button', navdiv, 'navbtn', 'Hint');
const btnSoln = maker('button', navdiv, 'navbtn', 'Solution');
const btnNext = maker('button', navdiv, 'navbtn', 'Next');

//PROGRESS BAR
var pdiv = maker('div', output, 'padDiv', '');
var barbase = document.createElement('div');
barbase.id = 'progressBase';
pdiv.append(barbase)

var progress = document.createElement('div');
progress.id = 'progress';
barbase.append(progress)


const game = { score: 0, qns: 0, penalty: [0, 2, 3, 5], maxqns: 10 };
let numHints = 0;

//REFRESH
btnNext.addEventListener('click', (e) => {
    pickNewEvent();
})

function pickNewEvent() {

    index = showRandomEvent();
    hintFlag = false;
    numHints = 0;
    newEventFlag = false;
    solnFlag = false;
    solnAttempted = false;

    //format the question here...send in the question string
    _qstr = formatLine(eList[index].Event);

    message(main, _qstr.text, 'black');
    message(scoreBox, scoreString(), 'black');
    displayOptions(index);
    btnNext.disabled = true;
    btnSoln.disabled = false;
    btnHint.disabled = false;

    for (let rep = 0; rep < 4; rep++) {
        altBtn[rep].style.background = 'grey';
        altBtn[rep].style.color = 'black';
        //altBtn[rep].style.color = "white";
    }

}


//An answer is attemtpted
for (let rep = 0; rep < 4; rep++) {
    altBtn[rep].addEventListener('click', (e) => {
        displaySolution(rep)
    })
}

btnSoln.addEventListener('click', (e) => {
    displaySolution(-1);
})


//GIVE A HINT
btnHint.addEventListener('click', (e) => {
    if (!solnFlag && numHints <= 2) {
        hintFlag = true;
        numHints++;
        game.score -= game.penalty[numHints]
        done = false;
        while (!done) {
            pick = [0, 1, 2, 3].random()
            pressed = altBtn[pick].innerHTML
            actual = keys[index]
            if (pressed != actual) {
                altBtn[pick].innerHTML = ""
                done = true;
            }
        }
        message(scoreBox, scoreString(), 'black');
    }
})

//rep is the option that was pressed...
function displaySolution(rep) {
    if (!solnFlag) {
        solnFlag = true; //revealed
        game.qns += 1;
        solnAttempted = (rep == -1) ? false : true;
        if (solnAttempted) {
            pressed = altBtn[rep].innerHTML
            actual = eList[index].Date
            if (pressed == actual) {
                game.score += 10
                //color the correct button green!
            } else {
                altBtn[rep].style.background = "red";
                altBtn[rep].style.color = "white";
            }
        }
        colorCorrectAltBtn(); //make the correct solution to be green
        message(scoreBox, scoreString(), 'black');
        addMessage(solText, 'black'); //display solution
        btnSoln.disabled = true;
        btnHint.disabled = true;
        btnNext.disabled = false;

        progress.style.width = getProgress() + "%";
    }
}


function getProgress() {
    let w;
    w = game.qns / game.maxqns * 100
    if (w > 100) { w = 100 }

    return w;
}


function colorCorrectAltBtn() {
    for (let rep = 0; rep < 4; rep++) {
        pressed = altBtn[rep].innerHTML
        actual = solText;
        if (pressed == actual) {
            altBtn[rep].style.background = 'green';
            altBtn[rep].style.color = 'white';
        }
    }
}


function scoreString() {
    let _str = `Score: ${game.score} out of ${game.qns * 10}`
    return _str
}



//come up with 3 additional spoiler options for the right solution
function displayOptions(index) {
    solText = eList[index].Date;

    solOptions = eList[index].Alternatives;
    shuffleArray2(solOptions); // inplace shuffle rn_utils.js

    altList = solOptions.slice(0, 3).concat(solText)
    shuffleArray2(altList);

    for (let rep = 0; rep < 4; rep++) {
        altBtn[rep].innerHTML = altList[rep]
    }


}


function endGame() {
    btn.textContent = "Restart Game";
    game.inplay = false;
    guess.style.display = 'none';
    game.max = genNumber(100);
}

//writes message to the MAIN board
function message(elem, html, txColor) {
    elem.innerHTML = html;
    elem.style.backgroundColor = txColor;
}


//writes message to the MAIN board
function addMessage(html, txColor) {
    main.innerHTML += "<br><br>" + html;
    main.style.backgroundColor = txColor;
}

function showRandomEvent() {
    index = Math.floor(Math.random() * eList.length)
    chosen = eList[index] //chosen Event...has keys and alts both
    console.log(chosen)
    return index

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

function initialize() {
    //global score to be Zero
    game.score = 0
    game.qns = 0

    //Pick a New event
    pickNewEvent();
}


initialize();