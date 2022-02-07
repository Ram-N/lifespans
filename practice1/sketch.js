// History Golf Practice 1
// Ram Narasimhan.

let palette = []
let grid;
const cnv = {
    xMargin: 30,
    yMargin: 30,
}

const params = {
    tw: 80, // triangle width within the Hexgrid
    xStep: 5,
    yStep: 5,
    bgColor: [210, 50, 80],
    blkColor: [0, 0, 0],
}



var hintFlag = false;
var newEventFlag = true;

function setup() {

    createCanvas(960, 960);
    background(params.bgColor)
    print(params.bgColor)

    cnv.height = height - 2 * cnv.yMargin // usable height
    cnv.width = width - 2 * cnv.yMargin //usable width

    draw_border(clr = params.blkColor, sw = 30 + cnv.xMargin); //rn_utils.js
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
    x = width / 4
    y = height / 2
    //stroke('black')
    var values = Object.values(events);
    var keys = Object.keys(events);

    index = int(random(keys.length))
    chosen = values[index]
    result = formatLine(chosen);

    numLines = result.numLines;
    print(chosen, x, y)
    fill(0, 0, 0)
    textSize(20)
    text(result.text, x, y)

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


function keyTyped() {
    // png is much higher quality than jpg
    if (key == 's') {
        let timeStamp = year() + "-" + nf(month(), 2) + "-" + nf(day(), 2) + "-" + nf(hour(), 2) + "-" + nf(minute(), 2) + "-" + nf(second(), 2);// + "-" + nf(millis(), 3, 0);
        print('ts', timeStamp)
        saveCanvas('keep_' + timeStamp);
    }
    if (key == 'k') {
        let timeStamp = year() + "-" + nf(month(), 2) + "-" + nf(day(), 2) + "-" + nf(hour(), 2) + "-" + nf(minute(), 2) + "-" + nf(second(), 2);// + "-" + nf(millis(), 3, 0);
        saveCanvas('keep_' + timeStamp + 'png');
        saveCanvas('keep0.png'); //representative. will overwrite existing file
    }

    if (key == 'h') {
        hintFlag = true;
        draw();
    }

    if (key == 'r') { // R = resume, reloop, redraw
        newEventFlag = true;
        draw();
    }

    if (key == 'x') {
        noLoop();
    }
}


function draw_border(clr = 0, sw = 20) {
    push();
    strokeWeight(sw);
    stroke(clr);
    noFill();
    rect(0, 0, width, height)
    pop();
}
