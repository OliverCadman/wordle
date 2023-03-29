// TODO 1: Select all letter squares from DOM
// Log the letters to the console.

const letters = document.querySelectorAll('.wordboard-letter');
const successMsg = document.getElementById('success-msg');

// TODO 2: Define asynchronous init function
async function init() {
    /**
     * Define three global variables:
     * currentGuess, currentRow, ANSWER_LENGTH
     */

    let currentGuess = '';
    let currentRow = 0;
    const ANSWER_LENGTH = 5;
    let done = false;

    // Define URL and get word of the day
    const wotdUrl = 'https://words.dev-apis.com/word-of-the-day';
    const res = await fetch(wotdUrl);
    const resObject = await res.json();
    const wordOfTheDay = resObject.word.toUpperCase();
    const wordParts = wordOfTheDay.split('');
    console.log(wordParts);


    function addLetter(letter) {
       if (currentGuess.length < ANSWER_LENGTH) {
        currentGuess += letter;
       } else {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
       }

       console.log(currentGuess);
       letters[(currentRow * ANSWER_LENGTH) + currentGuess.length - 1].textContent = letter;
    }

    async function handleCommit() {
        if (currentGuess.length !== ANSWER_LENGTH) {
            // do nothing
            return;
        }


        // Validate word

        // Mark letters as correct/incorrect/wrong
        const guessParts = currentGuess.split('');
        const wordMap = makeMap(wordParts);
        console.log(wordMap)


        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add('correct');
               wordMap[guessParts[i]]--; 
                console.log(wordMap);
            }
        }

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
                // Do nothing. We have already processed this
            } else if (wordParts.includes(guessParts[i]) && wordMap[guessParts[i]] > 0) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add('close');
                wordMap[guessParts[i]]--
            } else {
                letters[currentRow * ANSWER_LENGTH + i].classList.add('wrong');
            }
        }

        if (currentGuess === wordOfTheDay) {
            animate();
            done = true;

            successMsg.classList.add('winner');
            successMsg.textContent = 'You win!';
        }

        
        currentRow++;
        currentGuess = "";
    }


    function handleBackspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].textContent = '';
    }


  /**
   * TODO 3A: Within async init() function, listen for key strokes
   * TODO 3B: Get information about which key had been pressed
   *  and assign to a variable 'action'
   * 
   * Log action variable to the console
   */
  document.addEventListener("keyup", function (e) {

    if (done) return;
    
    const action = e.key;


    
    if (action === 'Enter') {
        handleCommit();
    } else if (action === 'Backspace') {
        handleBackspace();
    } else if (isLetter(action)) {
        console.log(`You pressed the letter ${action}`)
        addLetter(action.toUpperCase());
    } else {
        // do nothing
    }
  });
}


// TODO 4: Define isLetter function
function isLetter(char) {
    return /^[a-zA-Z]$/.test(char);
}

function makeMap(array) {
    const obj = {};

    for (let i = 0; i < array.length; i++) {
        const letter = array[i];
        if (obj[letter]) {
            obj[letter] += 1;
        } else {
            obj[letter] = 1;
        }
    }

    return obj;
}



init();