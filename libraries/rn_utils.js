//Ram Narasimhan
// Feb 2022



Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
}

//https://love2dev.com/blog/javascript-remove-from-array/#remove-from-array-splice-value
//Usage: var result = arrayRemove(array, 6);
// result = [1, 2, 3, 4, 5, 7, 8, 9, 0]
function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele != value;
    });
}


function buttonSelected(btn) {
    btn.style.background = BtnActiveColor;
    btn.style.color = "White";
}


//Appearance of dropdown. Gets added to parentElement.
function addDropdown(values, selIndex, selectID, promptText, promptFor, parentElement) {

    var dddiv = document.createElement("div");
    var select = document.createElement("select");
    select.id = selectID;

    //each option has a value and text.
    for (const v of values) {
        let val = v.toString();
        var option = document.createElement("option");
        option.value = val;
        option.text = val.charAt(0).toUpperCase() + val.slice(1);
        select.appendChild(option);
    }

    var label = document.createElement("label");
    label.innerHTML = promptText
    label.htmlFor = promptFor;

    select.selectedIndex = selIndex;
    parentElement.append(dddiv);
    dddiv.appendChild(label).appendChild(select);
}


function addTextBox(parent, elClass, _id = null) {
    const ele = document.createElement('div');
    ele.className = elClass; //could be multiple classes separated by space
    if (_id) { ele.id = _id; }
    parent.append(ele);
    return ele;
}


//https://github.com/lsvekis/JavaScript-Code/tree/main/JavaScript%20Projects
function maker(eleType, elParent, eleClass, _text) {
    const ele = document.createElement(eleType);
    ele.classList.add(eleClass);
    ele.innerHTML = _text;
    elParent.append(ele);
    return ele;
}


function ButtonMaker(parent, html, clr = 0, fntColor = 0) {

    const btn = document.createElement('button');
    btn.innerHTML = html;
    if (clr) {
        btn.style.backgroundColor = clr;
    }
    if (fntColor) {
        btn.style.color = fntColor
    }
    return parent.appendChild(btn);
}


function draw_border(clr = 0, sw = 20) {
    push();
    strokeWeight(sw);
    stroke(clr);
    noFill();
    rect(0, 0, width, height)
    pop();
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

    if (key == 'r') { // R = resume, reloop, redraw
        //print('redraw')
        draw();
    }

    if (key == 'x') {
        noLoop();
    }
}

//replicate an array rep times
function replicate(arr, rep) {
    var al = arr.length,
        rl = al * rep,
        res = new Array(rl);
    for (var i = 0; i < rl; i++)
        res[i] = arr[i % al];
    return res;
}


//https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
// usage: createArray(3, 2);
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function create2DArray(cols) {
    var arr = [];
    for (var i = 0; i < cols; i++) {
        arr[i] = [];
    }
    return arr;
}


function alphaFill(clr, alphaValue) {
    c = color(clr);
    c.setAlpha(alphaValue);
    fill(c);
}

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray2(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Usage: 
//   var arr = [2, 11, 37, 42];
//   shuffleArray(arr);
//   console.log(arr);
//In place sorting of an array using Fisher-Yates (aka Knuth) Shuffle
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

