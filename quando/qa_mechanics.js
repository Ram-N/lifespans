// Functions and utilties Used in handling Questions and Answers
// Created by Ram Narasimhan
// March 2022


function formatLine(_str) {

    const breakers = [";", "\n"];
    const word_break = [" "];
    const textWidth = 100;
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


function getProgress() {
    let w;
    w = game.qns / game.numQns * 100
    if (w > 100) { w = 100 }

    return w;
}
