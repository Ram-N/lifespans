// History Golf Practice 1
// Ram Narasimhan.


document.addEventListener("DOMContentLoaded", () => {


    var eList = Object.values(events); //from eventsDB.js
    const game = { score: 0, qns: 0, penalty: [0, 2, 5, 10], maxqns: 6, maxscore: 100 };

    //PAGE APPEARANCE
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

    //TALLY BOX
    var tcon = document.createElement('div');
    tcon.id = 'tallyBoard';
    output.append(tcon)


    numTallyRows = getTallyRows();
    tallyrows = []
    tallyboxes = []
    for (row = 0; row < numTallyRows; row++) {
        tallyrows.push(maker('div', tcon, 'tallyRow', ''))
        for (let box = 0; box < 5; box++) {
            tallyboxes.push(maker('div', tallyrows[row], 'tallyBox', ''))
        }
    }




    //PROGRESS BAR
    var pdiv = maker('div', output, 'padDiv', '');
    var barbase = document.createElement('div');
    barbase.id = 'progressBase';
    pdiv.append(barbase)

    var progress = document.createElement('div');
    progress.id = 'progress';
    barbase.append(progress)

    // END of html appearance

    var hintFlag = false;
    var newEventFlag = true;
    var solnFlag = false;
    var solnAttempted = false;






    //these should be part of a current Item object
    let numHints = 0;

    let activeOptions = [0, 1, 2, 3];

    const itemColors = { 0: 'red', 5: 'yellow', 8: 'blue', 10: 'green' }

    //REFRESH
    btnNext.addEventListener('click', (e) => {
        pickNextQuestion();
    })


    function resetGame() {
        _astr = `Start a New Game. You scored ${game.score} out of ${game.maxscore}`
        alert(_astr);
        initialize();
        progress.style.width = getProgress() + "%";
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
        giveHint()
    })

    function giveHint() {
        maxHints = 3 // can only give 3 hints before solution is revealed
        if (!solnFlag && numHints < 3) {
            hintFlag = true;
            numHints++;

            done = false;
            while (!done) {
                pick = activeOptions.random()
                pressed = altBtn[pick].innerHTML
                actual = eList[index].Date
                if (pressed != actual) {
                    altBtn[pick].innerHTML = ""
                    //remove pick from the active options
                    activeOptions = activeOptions.filter(function (ele) {
                        return ele != pick;
                    });
                    done = true;
                }
            }
            message(scoreBox, scoreString(), 'black');
        }
    }



    //rep is the option that was pressed...
    function displaySolution(rep) {
        if (!solnFlag) {
            itemScore = 0
            solnFlag = true; //revealed
            solnAttempted = (rep == -1) ? false : true;
            if (solnAttempted) {
                pressed = altBtn[rep].innerHTML
                actual = eList[index].Date
                if (pressed == actual) {
                    itemScore = 10 - game.penalty[numHints]
                    game.score += itemScore
                } else {
                    altBtn[rep].style.background = "red";
                    altBtn[rep].style.color = "white";
                }
            }
            colorCorrectAltBtn(); //make the correct solution to be green
            addMessage(solText, 'black'); //display solution
            btnSoln.disabled = true;
            btnHint.disabled = true;
            btnNext.disabled = false;
            tallyboxes[game.qns].style.background = itemColors[itemScore];

            game.qns += 1;
            message(scoreBox, scoreString(), 'black');
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


    function initHelpModal() {
        const modal = document.getElementById("help-modal");

        // Get the button that opens the modal
        const helpbtn = document.getElementById("help");

        // Get the <span> element that closes the modal
        const span = document.getElementById("close-help");

        // When the user clicks on the button, open the modal
        helpbtn.addEventListener("click", function () {
            modal.style.display = "block";
        });

        // When the user clicks on <span> (x), close the modal
        span.addEventListener("click", function () {
            modal.style.display = "none";
        });

        // When the user clicks anywhere outside of the modal, close it
        window.addEventListener("click", function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }


    function getTallyRows() {
        numRows = Math.floor(game.maxqns / 5)
        if (game.maxqns % 5) { numRows += 1 }
        return numRows
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



    function pickNextQuestion() {

        if (game.qns == game.maxqns) {
            resetGame();
        }

        hintFlag = false;
        numHints = 0;
        activeOptions = [0, 1, 2, 3];

        newEventFlag = false;
        solnFlag = false;
        solnAttempted = false;

        index = showRandomEvent();
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


    function initialize() {
        //global score to be Zero
        game.score = 0
        game.qns = 0

        //clear out the tallyboxes
        for (tb = 0; tb < tallyboxes.length; tb++) {
            tallyboxes[tb].style.background = "";
        }

        //Pick a New event
        pickNextQuestion();
    }

    initHelpModal();
    initialize();

});