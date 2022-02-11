// History Golf Practice 1
// Ram Narasimhan.

const cnv = {
    xMargin: 30,
    yMargin: 30,
}

var hintFlag = false;
var newEventFlag = true;

var values = Object.values(events);
var keys = Object.keys(events);


const output = document.querySelector('.output');
const main = maker('div', output, 'main', 'Press Button to Start');
const guess = maker('input', output, 'guess', '');
const btnHint = maker('button', output, 'btn', 'Hint');
const btnNext = maker('button', output, 'btn', 'Next');

//const game = { hiddenNum: 0, inplay: false, max: 10, score: 0 };
guess.setAttribute('type', 'number');
guess.style.display = 'none';


btnNext.addEventListener('click', (e) => {
    index = showRandomEvent(events);
    hintFlag = false;
    newEventFlag = false;

    message(values[index], 'black');
})

function endGame() {
    btn.textContent = "Restart Game";
    game.inplay = false;
    guess.style.display = 'none';
    game.max = genNumber(100);
}

function message(html, txColor) {
    main.innerHTML = html;
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