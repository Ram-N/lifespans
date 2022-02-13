// History Golf Practice 1
// Ram Narasimhan.

const cnv = {
    xMargin: 30,
    yMargin: 30,
}

var hintFlag = false;
var newEventFlag = true;
var solnFlag = false;

var values = Object.values(events);
var keys = Object.keys(events);


const output = document.querySelector('.output');
const scoreBox = maker('div', output, 'main', 'Scorecard');
const main = maker('div', output, 'main', 'Press Button to Start');
const optionsPanel = maker('div', output, 'main', '');


hintB = []
for (let rep = 0; rep < 4; rep++) {
    hintB.push(maker('button', optionsPanel, 'optionBtn', `Sol${rep}`));
}

const btnHint = maker('button', output, 'btn', 'Hint');
const btnNext = maker('button', output, 'longbtn', 'Next');
const btnSoln = maker('button', output, 'longbtn', 'Solution');

const game = { score: 0, penalty: [0, 2, 3, 5] };
let numHints = 0;

//REFRESH
btnNext.addEventListener('click', (e) => {
    pickNewEvent();
})

function pickNewEvent() {
    index = showRandomEvent(events);
    hintFlag = false;
    numHints = 0;
    newEventFlag = false;
    solnFlag = false;
    message(main, values[index], 'black');
    message(scoreBox, `Score: ${game.score}`, 'black');
    displayOptions(index);
}


for (let rep = 0; rep < 4; rep++) {
    hintB[rep].addEventListener('click', (e) => {
        if (!solnFlag) {
            shown = hintB[rep].innerHTML
            actual = keys[index]
            if (shown == actual) {
                game.score += 10
                solnFlag = true; //revealed
                message(scoreBox, `Score: ${game.score}`, 'black');
            }
        }
    })
}


btnSoln.addEventListener('click', (e) => {
    if (!solnFlag) {
        addMessage(keys[index], 'black');
        solnFlag = true;
    }
})


//GIVE A HINT
btnHint.addEventListener('click', (e) => {
    if (!solnFlag) {
        hintFlag = true;
        numHints++;
        game.score -= game.penalty[numHints]
        done = false;
        while (!done) {
            pick = [0, 1, 2, 3].random()
            shown = hintB[pick].innerHTML
            actual = keys[index]
            if (shown != actual) {
                hintB[pick].innerHTML = ""
                done = true;
            }
        }
        message(scoreBox, `Score: ${game.score}`, 'black');
    }
})


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
        hintB[rep].innerHTML = solOptions[rep]
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




function draw() {
    if (newEventFlag) {
        background(params.bgColor)
        index = showRandomEvent(events);
        hintFlag = false;
        newEventFlag = false;
    }
    showSolution(index, hintFlag, events)
    noLoop();
}


function showRandomEvent(events) {

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

function showSolution(index, hintFlag, events) {
    var keys = Object.keys(events);

    if (hintFlag) {
        text(keys[index], width / 4, height - 100)
    }
}


function formatLine(_str) {

    const breakers = [" ", ";", ".", "\n"];
    const textWidth = 40;
    formatted = ""
    currLen = 0
    for (var x of _str) {
        currLen++;
        if ((currLen > textWidth) && (breakers.some(el => x.includes(el)))) {
            formatted += x + "\n"
            currLen = 0
        } else { formatted += x }
    }

    print(formatted)
    numLines = Math.ceil(formatted.length / textWidth)
    return { text: formatted, numLines: numLines }
}

function initialize() {
    //global score to be Zero
    game.score = 0

    //Pick a New event
    pickNewEvent();
}


initialize();