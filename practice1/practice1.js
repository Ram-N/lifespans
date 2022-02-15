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

var values = Object.values(events);
var keys = Object.keys(events);


const output = document.querySelector('.output');
const scoreBox = maker('div', output, 'main', 'Scorecard');
const main = maker('div', output, 'main', 'Press Button to Start');
const optionsPanel = maker('div', output, 'main', '');


altBtn = []
for (let rep = 0; rep < 4; rep++) {
    altBtn.push(maker('button', optionsPanel, 'optionBtn', `Sol${rep}`));
}

const btnHint = maker('button', output, 'btn', 'Hint');
const btnNext = maker('button', output, 'longbtn', 'Next');
const btnSoln = maker('button', output, 'longbtn', 'Solution');

const game = { score: 0, qns: 0, penalty: [0, 2, 3, 5] };
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

    //format the line here
    _qstr = formatLine(values[index]);

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
    game.qns += 1;
    solnAttempted = (rep == -1) ? false : true;
    if (solnAttempted) {
        solnFlag = true; //revealed
        pressed = altBtn[rep].innerHTML
        actual = keys[index]
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
    addMessage(keys[index], 'black'); //display solution
    btnSoln.disabled = true;
    btnHint.disabled = true;
    btnNext.disabled = false;
}



function colorCorrectAltBtn() {
    for (let rep = 0; rep < 4; rep++) {
        pressed = altBtn[rep].innerHTML
        actual = keys[index]
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
    solText = keys[index];

    solOptions = [];
    if (parseInt(solText)) {
        s = parseInt(solText)
        solOptions.push(s);
        solOptions.push(s + 10);
        solOptions.push(s - 100);
        solOptions.push(s + 20);
        shuffleArray2(solOptions); // inplace shuffle rn_utils.js
    } else {
        //FIX
        solOptions = ["A", "300 BC", "44 BC", "NA"]
    }

    for (let rep = 0; rep < 4; rep++) {
        altBtn[rep].innerHTML = solOptions[rep]
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
    index = Math.floor(Math.random() * keys.length)
    chosen = values[index]
    //result = formatLine(chosen);
    //numLines = result.numLines;
    console.log(chosen)
    // fill(0, 0, 0)
    // textSize(20)
    // text(result.text, x, y)

    return index

}


function formatLine(_str) {

    const breakers = [" ", ";", ".", "\n"];
    const textWidth = 40;
    formatted = ""
    currLen = 0
    for (var x of _str) {
        currLen++;
        if ((currLen > textWidth) && (breakers.some(el => x.includes(el)))) {
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