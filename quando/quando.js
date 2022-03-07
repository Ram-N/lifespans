// Quando
// Created by Ram Narasimhan
// March 2022

successGreen = "#28a745";
warningOrange = "#ffc107";
dangerRed = "#dc3545";
BtnActiveColor = "#1c3494"
BtnOffColor = "#e6f3f8";


document.addEventListener("DOMContentLoaded", () => {

    var eList = Object.values(events); //from eventsDB.js

    const game = {
        score: 0, qns: 0, penalty: [0, 2, 5, 10], maxqns: 2, maxscore: 100,
        averageDifficulty: 5,
        chosenQuestionDifficulty: "E",
        chosenAltsDifficulty: "M",
        category: 'All Events',
    };

    //PAGE APPEARANCE
    const output = document.querySelector('.output');
    const scoreBox = maker('div', output, 'main', 'Scorecard');
    const main = maker('div', output, 'main', 'Press Button to Start');
    const optionsPanel = maker('div', output, 'main', '');


    altBtn = []
    for (let rep = 0; rep < 4; rep++) {
        altBtn.push(maker('button', optionsPanel, 'altBtn', `Sol${rep}`));
    }

    //Nav Buttons
    var navdiv = maker('div', output, 'padDiv', '');
    output.append(navdiv)

    const btnNext = maker('button', navdiv, 'navbtn', 'Next');
    btnNext.style.width = '60%';
    btnNext.style.height = "2.5em";

    var navdiv2 = maker('div', output, 'padDiv', '');
    output.append(navdiv2)
    const btnHint = maker('button', navdiv2, 'navbtn', 'Hint');
    const btnSoln = maker('button', navdiv2, 'navbtn', 'Solution');


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



    const resmodal = maker('div', output, 'modal', '');
    const rescontainer = maker('div', resmodal, 'modal-content', '');
    const resclose = maker('span', rescontainer, 'close', "&times");
    resmodal.id = "results-modal"
    resclose.id = "close-results"

    var resh3 = document.createElement("h3");
    resh3.innerHTML = "";
    resh3.id = 'res-h3';
    rescontainer.appendChild(resh3);

    //RESULTS MODAL Buttons
    const btnAnother = maker('button', rescontainer, 'Opbtn', 'Another Round');
    const btnShare = maker('button', rescontainer, 'Opbtn', 'Share');
    const btnDone = maker('button', rescontainer, 'Opbtn', 'Leave');
    btnAnother.style.background = '#007bff';
    btnAnother.style.color = 'white';
    btnDone.style.background = '#dc3545';
    btnAnother.id = 'btnAnother';
    btnDone.id = 'btnDone';
    btnShare.id = 'btnShare';
    btnShare.style.background = successGreen


    // END of html appearance
    // --------------------------------------    

    var hintFlag = false;
    var newEventFlag = true;
    var solnFlag = false;
    var solnAttempted = false;


    //these should be part of a current Item object
    let numHints = 0;

    let activeOptions = [0, 1, 2, 3];

    const itemColors = { 0: 'red', 5: 'yellow', 8: 'blue', 10: successGreen }

    //REFRESH
    btnNext.addEventListener('click', (e) => {
        pickNextQuestion();
    })


    function closeoutGame() {

        const resmodal = document.getElementById("results-modal");
        //const modalcontent = document.getElementById("options-modal-content");
        const resclose = document.getElementById("close-results");
        const resh3 = document.getElementById("res-h3");
        const btnAnother = document.getElementById("btnAnother");
        const btnDone = document.getElementById("btnDone");

        resmodal.style.display = "block";
        resh3.innerHTML = getResultsText();

        // When the user clicks on <span> (x), close the modal
        resclose.addEventListener("click", function () {
            resmodal.style.display = "none";
        });

        btnAnother.addEventListener("click", function () {
            resmodal.style.display = "none";
            startNewGame(); //startNewGame only if Another is clicked 
            progress.style.width = getProgress() + "%";
        });

        btnDone.addEventListener("click", function () {
            //clear screen if Done
            resmodal.style.display = "none";
            output.remove();
            hehead = document.getElementById("h2-game-category");
            hehead.innerHTML = 'Thank you for playing Quando!'

        });


    }


    function getResultsText() {
        //TODO: Based on the %age score, make a suitably encouraging comment

        _astr = ""
        _astr += `Category: ${game.category} <br>`
        _astr += `You scored ${game.score} out of ${game.maxqns * 10}! <br>`
        _astr += `<br> Average difficulty ${game.averageDifficulty}`
        return _astr
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
                actual = gameQuestions[index].Date
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
                actual = gameQuestions[index].Date
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
                altBtn[rep].style.background = successGreen;
                altBtn[rep].style.color = 'white';
            }
        }
    }


    function scoreString() {
        let _str = `Score: ${game.score} out of ${game.qns * 10}`
        return _str
    }



    function displayAlternatives(index) {
        solText = gameQuestions[index].Date;

        switch (game.chosenAltsDifficulty) {
            case 'E': solOptions = gameQuestions[index].AltsEasy;
                break;
            case 'M': solOptions = gameQuestions[index].AltsMid;
                break;
            case 'H': solOptions = gameQuestions[index].AltsHard;
                break;

            default: solOptions = gameQuestions[index].AltsMid;
        }

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

    function pickNextEventIndex() {

        index = Math.floor(Math.random() * gameQuestions.length)
        return index;

        // done = false;
        // circuitBreaker = 0
        // while (!done && (circuitBreaker < 1000)) {
        //     index = Math.floor(Math.random() * eList.length)
        //     chosen = eList[index] //chosen Event...has keys and alts both
        //     //console.log(chosen.DiffCat, game.chosenQuestionDifficulty)
        //     if (chosen.DiffCat == game.chosenQuestionDifficulty) {
        //         done = true;
        //         return index
        //     }
        //     circuitBreaker++;
        // }

        // console.log(game.chosenQuestionDifficulty, "not found")
        // return null

    }

    function initOptionsModal() {
        const modal = document.getElementById("options-modal");
        const modalcontent = document.getElementById("options-modal-content");

        var h2 = document.createElement("h2");
        h2.innerHTML = "Game Options";
        modalcontent.appendChild(h2);

        //Question Difficulty row
        let qrow = document.createElement('div');
        qrow.id = 'opWrapper'
        modalcontent.append(qrow)

        let lbl = document.createElement('span');
        lbl.classList.add('tspan');
        lbl.innerHTML = 'Questions '
        qrow.append(lbl)

        //Option Buttons
        const questEasy = maker('button', qrow, 'Opbtn', 'Easy');
        const questMed = maker('button', qrow, 'Opbtn', 'Medium');
        const questHard = maker('button', qrow, 'Opbtn', 'Hard');

        qbtns = [[questEasy, "E"], [questMed, "M"], [questHard, "H"]]
        for (qb of qbtns) {
            qb[0].dataset.qdiff = qb[1]
            qb[0].style.background = BtnOffColor;
        }

        //C H O I C E S
        let owrap = document.createElement('div');
        owrap.id = 'opWrapper'
        modalcontent.append(owrap)

        lbl = document.createElement('span');
        lbl.innerHTML = 'Choices'
        lbl.classList.add('tspan');
        owrap.append(lbl)

        //Option Buttons
        const btnEasy = maker('button', owrap, 'Opbtn', 'Easy');
        const btnMed = maker('button', owrap, 'Opbtn', 'Medium');
        const btnHard = maker('button', owrap, 'Opbtn', 'Hard');
        abtns = [[btnEasy, "E"], [btnMed, "M"], [btnHard, "H"]]
        for (ab of abtns) {
            ab[0].dataset.altsdiff = ab[1]
            ab[0].style.background = BtnOffColor;
        }

        //START BUTTON
        let gowrap = document.createElement('div');
        modalcontent.append(gowrap)
        const btnStart = maker('button', gowrap, 'Opbtn', 'Start');
        btnStart.id = 'goBtn'
        btnStart.style.background = successGreen;
        btnStart.style.color = "white"

        // END OF MODAL APPEARANCE

        const gearBtn = document.getElementById("game-options"); //on the titlebar
        const span = document.getElementById("close-options");

        // When the user clicks on the button, open the modal
        gearBtn.addEventListener("click", function () {
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

        for (ab of abtns) {
            handleAltsButtonClick(ab, abtns);
        }

        for (qb of qbtns) {
            handleQuestionButtonClick(qb, qbtns);
        }

        btnStart.addEventListener("click", function () {
            startNewGame();
            modal.style.display = "none";
        })

    }

    function handleAltsButtonClick(ab, abtns) {
        let aBtn = ab[0]
        aBtn.addEventListener("click", function () {
            for (b of abtns) {
                b[0].style.background = BtnOffColor;
                b[0].style.color = "black";
            }
            setGameAltsDiffLevel(ab[1]);
        });
    }


    function handleQuestionButtonClick(qb, qbtns) {
        let questBtn = qb[0]
        questBtn.addEventListener("click", function () {
            for (b of qbtns) {
                b[0].style.background = BtnOffColor;
                b[0].style.color = "black";
            }
            setGameQDiffLevel(qb[1]);
        });
    }

    function setGameAltsDiffLevel(letter) {
        game.chosenAltsDifficulty = letter;
        console.log("Alts Chosen", game.chosenAltsDifficulty)

        aDiffBtn = document.querySelector(`[data-altsdiff="${letter}"]`)
        aDiffBtn.style.background = BtnActiveColor;
        aDiffBtn.style.color = "white";
    }


    function setGameQDiffLevel(letter) {
        game.chosenQuestionDifficulty = letter;
        console.log("Chosen", game.chosenQuestionDifficulty)

        gameQuestions = eList.filter(ev =>
            ev.DiffCat == letter
        );

        questBtn = document.querySelector(`[data-qdiff="${letter}"]`)
        questBtn.style.background = BtnActiveColor;
        questBtn.style.color = "white";
    }


    function initStatsModal() {
        const modal = document.getElementById("stats-modal");

        // Get the button that opens the modal
        const btn = document.getElementById("stats");

        // Get the <span> element that closes the modal
        const span = document.getElementById("close-stats");

        // When the user clicks on the button, open the modal
        btn.addEventListener("click", function () {
            // update stats here
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
            closeoutGame();
        }

        hintFlag = false;
        numHints = 0;
        activeOptions = [0, 1, 2, 3];

        newEventFlag = false;
        solnFlag = false;
        solnAttempted = false;

        index = pickNextEventIndex();
        _qstr = formatLine(gameQuestions[index].Event);

        message(main, _qstr.text, 'black');
        message(scoreBox, scoreString(), 'black');
        displayAlternatives(index);
        btnNext.disabled = true;
        btnSoln.disabled = false;
        btnHint.disabled = false;

        for (let rep = 0; rep < 4; rep++) {
            altBtn[rep].style.background = 'grey';
            altBtn[rep].style.color = 'black';
            //altBtn[rep].style.color = "white";
        }

    }


    function startNewGame() {
        //global score to be Zero
        game.score = 0
        game.qns = 0

        //clear out the tallyboxes
        for (tb = 0; tb < tallyboxes.length; tb++) {
            tallyboxes[tb].style.background = "";
        }

        setGameAltsDiffLevel(game.chosenAltsDifficulty);
        setGameQDiffLevel(game.chosenQuestionDifficulty);
        //Pick a New event
        pickNextQuestion();
    }

    initOptionsModal();
    initHelpModal();
    initStatsModal();


    const modal = document.getElementById("options-modal");
    modal.style.display = "block";

    startNewGame();

});