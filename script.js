const targetWords = [
  "cloud",
  "batch",
  "azure",
  "slack",
  "react",
  "serve",
  "mongo",
  "slurm",
  "stack",
  "route",
  "qubit",
  "scope",
  "array",
  "scale",
  "flask",
  "numpy",
  "scrum",
  "agile",
  "nodes",
  "state",
  "hooks",
  "redux",
  "fetch",
  "conda"
]

const dictionary = [
  "ocolo",
  "cloud"
]


const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")
const guessGrid = document.querySelector("[data-guess-grid]")
var checkActive = false;
const displayNumberOfWin = document.querySelector('.winCount')

function findRepeatingNumbers(array1, array2) {
  const repeatingNumbers = [];

  for (const number of array1) {
    if (array2.includes(number) && !repeatingNumbers.includes(number)) {
      repeatingNumbers.push(number);
    }
  }

  return repeatingNumbers;
}

//circle start
let progressBar = document.querySelector('.e-c-progress');
let indicator = document.getElementById('e-indicator');
let pointer = document.getElementById('e-pointer');
let length = Math.PI * 2 * 100;
progressBar.style.strokeDasharray = length;
function update(value, timePercent) {
  var offset = - length - length * value / (timePercent);
  progressBar.style.strokeDashoffset = offset;
  pointer.style.transform = `rotate(${360 * value / (timePercent)}deg)`;
};
//circle ends
const displayOutput = document.querySelector('.display-remain-time')
// const pauseBtn = document.getElementById('pause');
const setterBtns = document.querySelectorAll('button[data-setter]');
let intervalTimer;
let wholeTime = 2 * 60; // manage this to set the whole time 
let timeLeft = 2 * 60;
let isPaused = false;
let isStarted = false;

let numberOfGameWin = 0;

startInteraction()

function findAllIndexes(str, charToFind) {
  const indexes = [];
  let currentIndex = str.indexOf(charToFind);

  while (currentIndex !== -1) {
    indexes.push(currentIndex);
    currentIndex = str.indexOf(charToFind, currentIndex + 1);
  }

  return indexes;
}

function getRandomElement(array) {
  if (array.length === 0) {
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

let targetWord = getRandomElement(targetWords);

let guessWord;
function startInteraction() {
  document.addEventListener("click", handleMouseClick)
  document.addEventListener("keydown", handleKeyPress)
}

function stopInteraction() {
  document.removeEventListener("click", handleMouseClick)
  document.removeEventListener("keydown", handleKeyPress)
}

function countOccurrences(str, letter) {
  return str.split(letter).length - 1;
}


function changeWholeTime(seconds) {
  if ((wholeTime + seconds) > 0) {
    wholeTime += seconds;
    update(wholeTime, wholeTime);
  }
}

function newGame() {
  //condition to clear out data and play next game
  // let initialTime = 120;
  // let minTime = 30; // Minimum time allowed
  let newTime = 120;
  // Calculate the new time based on the number of wins
  if (numberOfGameWin > 9) {
    newTime = 10
  } else if (numberOfGameWin > 5) {
    newTime = 30
  } else if (numberOfGameWin > 1) {
    newTime = 60
  }
  // let newTime = Math.max(minTime, initialTime / Math.pow(2, Math.floor(numberOfGameWin / 2)));
  // Update the time values and display the updated time
  update(wholeTime, newTime);
  update(timeLeft, newTime);
  displayTimeLeft(newTime);
  clearTileAttributesAndValues()
  targetWord = getRandomElement(targetWords);
  const nextButtonToRemove = document.querySelector("[data-next]");
  if (nextButtonToRemove) {
    nextButtonToRemove.remove();
  }
  return
}
function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key)
    return
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess()
    return
  }

  if (e.target.matches("[data-next]")) {
    //condition to clear out data and play next game
    newGame();
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey()
    return
  }
}

let timerStarted = false;


function displayTimeLeft(timeLeft) { //displays time on the input
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  displayOutput.textContent = displayString;
  update(timeLeft, wholeTime);
}

function pauseTimer(event) {
  // console.log("Started: ", isStarted);
  if (isStarted === false) {
    // console.log("IS started")
    let initialTime = 120;
    let minTime = 30; // Minimum time allowed
    // Calculate the new time based on the number of wins
    let newTime = 120;
    // Calculate the new time based on the number of wins
    if (numberOfGameWin > 9) {
      newTime = 10
    } else if (numberOfGameWin > 5) {
      newTime = 30
    } else if (numberOfGameWin > 1) {
      newTime = 60
    }
    // Update the time values and display the updated time
    update(wholeTime, newTime);
    update(timeLeft, newTime);
    displayTimeLeft(newTime);
    timer(newTime);
    isStarted = true;
    // pauseBtn.classList.remove('play');
    // pauseBtn.classList.add('pause');

    setterBtns.forEach(function (btn) {
      btn.disabled = true;
      btn.style.opacity = 0.5;
    });
  } else if (isPaused) {
    console.log("IS paused")
    // pauseBtn.classList.remove('play');
    // pauseBtn.classList.add('pause');
    timer(timeLeft);
    isPaused = isPaused ? false : true
  } else {
    console.log("Else")
    // pauseBtn.classList.remove('pause');
    // pauseBtn.classList.add('play');
    clearInterval(intervalTimer);
    isPaused = isPaused ? false : true;
  }
}
function handleKeyPress(e) {
  console.log("handle key press:", e.key)
  if (e.key === "Enter" && !document.getElementById("nextButton")) {
    submitGuess();
    return;
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey();
    return;
  }

  if (e.key.match(/^[a-z]$/) && !document.getElementById("nextButton")) {
    console.log("ACheck")
    checkActive = true;
    pressKey(e.key);
    // console.log("Timer started: ", timerStarted);
    // Start the timer only if it hasn't been started yet
    if (!timerStarted) {
      //condition to start the timer
      pauseTimer()
      timerStarted = true;
    }

    return;
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles()
  if (activeTiles.length >= WORD_LENGTH) return
  const nextTile = guessGrid.querySelector(":not([data-letter])")
  nextTile.dataset.letter = key.toLowerCase()
  nextTile.textContent = key
  nextTile.dataset.state = "active"
}

function clearTileAttributesAndValues() {
  const tilesToClear = guessGrid.querySelectorAll("[data-state='correct'], [data-state='wrong'], [data-state='wrong-location']");
  const keyButtonsToClear = keyboard.querySelectorAll(".key");
  tilesToClear.forEach(tile => {
    tile.removeAttribute("data-state");
    tile.removeAttribute("data-letter");
    tile.textContent = "";
  });
  keyButtonsToClear.forEach(button => {
    button.classList.remove("correct", "wrong-location", "wrong");
    button.classList.add("key");
  });
  startInteraction();
}

function deleteKey() {
  const activeTiles = getActiveTiles()
  const lastTile = activeTiles[activeTiles.length - 1]
  if (lastTile == null) return
  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

function submitGuess() {
  const activeTiles = [...getActiveTiles()]
  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Not enough letters")
    shakeTiles(activeTiles)
    return
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter
  }, "");


  if (!dictionary.includes(guess)) {
    showAlert("Not in word list")
    shakeTiles(activeTiles)
    return
  }

  stopInteraction()
  activeTiles.forEach((...params) => flipTile(...params, guess))
}

function flipTile(tile, index, array, guess) {
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() => {
    tile.classList.add("flip")
  }, (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener(
    "transitionend",
    () => {
      // console.log("Target word: ", targetWord);
      // console.log("guess", guess);
      let shouldContinue = true; // Flag to control the flow
      const guessCharCout = (guess.split(letter).length - 1);
      // console.log("Guess Char count:", guessCharCout);
      const targetCharCout = (targetWord.split(letter).length - 1);
      // console.log("targetCharCout:", targetCharCout);
      let repeatingNumbers;
      let tempCharCount = guessCharCout;
      if (targetCharCout && (guessCharCout > targetCharCout)) {
        const targetIndexes = findAllIndexes(targetWord, letter);
        const guessIndexes = findAllIndexes(guess, letter);
        // console.log("target indexes: ", targetIndexes);
        // console.log("GuessIndexes", guessIndexes);
        repeatingNumbers = findRepeatingNumbers(targetIndexes, guessIndexes);
        // Print or use the repeatingNumbers as needed
        // console.log("Repeating Numbers:", repeatingNumbers);
        if (guessIndexes.length > 0) {
          // console.log(`The indexes of '${letter}' in "${targetWord}" are: ${targetIndexes.join(', ')}`);
          // console.log(`The indexes of '${letter}' in "${guess}" are: ${guessIndexes.join(', ')}`);
        } else {
          // console.log(`'${letter}' not found in "${targetWord}"`);
        }

      }
      tile.classList.remove("flip")
      const letterCountInTarget = countOccurrences(targetWord, letter);
      const letterCountInGuess = countOccurrences(guess, letter);
      // this condition needs a rework as if there multiple occurances of a letter in a word then the letter is marked as present
      if (targetWord.includes(letter)) {
        // console.log("target includes letter")
        let targetCountVal = 1;
        let guessCountVal = 2;
        // console.log("Tempcharcount", tempCharCount);
        if (repeatingNumbers?.length == targetCharCout) {
          if (repeatingNumbers.includes(index)) {
            // console.log("hello")
            tile.dataset.state = "correct"
            key.classList.add("correct")
            tempCharCount -= 1
          } else {
            tile.dataset.state = "wrong"
            key.classList.add("wrong")
            tempCharCount -= 1
          }
          shouldContinue = false;
        }
        // console.log("")
        // console.log("Guess Char count:", guessCharCout);
        // console.log("targetCharCout:", targetCharCout);
        if (targetWord[index] === letter) {
          // console.log("hello131")
          tile.dataset.state = "correct"
          key.classList.add("correct")
        } else if (shouldContinue) {
          // console.log("else1242")
          tile.dataset.state = "wrong-location"
          key.classList.add("wrong-location")
        }
      } else {
        // console.log("1234else")
        tile.dataset.state = "wrong"
        key.classList.add("wrong")
      }
      // if (targetWord[index] === letter) {
      //   tile.dataset.state = "correct"
      //   key.classList.add("correct")
      //   console.log("Correct")
      // } else if (targetWord.includes(letter)) {
      //   tile.dataset.state = "wrong-location"
      //   key.classList.add("wrong-location")
      //   console.log("Wrong pos")
      // } else {
      //   tile.dataset.state = "wrong"
      //   key.classList.add("wrong")
      //   console.log("Wrong")
      // }

      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () => {
            startInteraction()
            checkWinLose(guess, array)
          },
          { once: true }
        )
      }
    },
    { once: true }
  )
}

function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]')
}

function showAlert(message, duration = 1000) {
  const existingAlert = Array.from(alertContainer.children).find(
    (alert) => alert.textContent === message && !alert.classList.contains("hide")
  );
  if (existingAlert) {
    existingAlert.dataset.duration = duration + parseInt(existingAlert.dataset.duration || 0, 10);
  } else {
    const alert = document.createElement("div");
    alert.textContent = message;
    alert.classList.add("alert");
    alertContainer.prepend(alert);
    alert.dataset.duration = duration;
    setTimeout(() => {
      alert.classList.add("hide");
      alert.addEventListener("transitionend", () => {
        alert.remove();
      });
    }, duration);
  }
}


function shakeTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add("shake")
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake")
      },
      { once: true }
    )
  })
}



function createNextGameButton() {
  const nextButton = document.createElement("button");
  nextButton.setAttribute("data-next", "");
  nextButton.setAttribute("id", "nextButton");
  nextButton.classList.add("key", "large4");
  nextButton.textContent = "New Game";
  const nextButtonContainer = document.querySelector(".next-button");
  nextButtonContainer.appendChild(nextButton);
  startInteraction();
}

function checkWinLose(guess, tiles) {
  guessWord = guess;
  if (guess === targetWord) {
    clearInterval(intervalTimer);
    showAlert("You Win", 2000)
    numberOfGameWin += 1;
    displayNumberOfWin.textContent = numberOfGameWin;
    danceTiles(tiles)
    stopInteraction()
    // pauseBtn.classList.remove('pause');
    // pauseBtn.classList.add('play');
    clearInterval(intervalTimer);
    isPaused = isPaused ? false : true;
    timerStarted = false;
    isStarted = false;
    setTimeout(() => {
      createNextGameButton()
    }, (2000))

    return
  }

  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
  if (remainingTiles.length === 0) {
    showAlert(`Nice try, the correct word is ${targetWord?.toUpperCase()}`, 2000);
    isPaused = false;
    pauseTimer();
    // numberOfGameWin = 0;
    // timerStarted = false;
    // displayNumberOfWin.textContent = numberOfGameWin;
    // setTimeout(() => {
    //   // update(wholeTime, wholeTime);
    //   // update(timeLeft, timeLeft);
    //   // displayTimeLeft(120);
    //   isStarted = false;
    //   clearTileAttributesAndValues();
    //   createNextGameButton()
    // }, (2000))
    // stopInteraction()
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance")
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance")
        },
        { once: true }
      )
    }, (index * DANCE_ANIMATION_DURATION) / 5)
  })
}

document.addEventListener("keydown", (event) => {
  // Check if the pressed key is Enter
  if (event.key === "Enter") {
    // Check if the user's guess is correct
    if (document.getElementById("nextButton")) {
      newGame();
    }
  }
});

update(wholeTime, wholeTime); //refreshes progress bar
displayTimeLeft(wholeTime);
for (var i = 0; i < setterBtns.length; i++) {
  setterBtns[i].addEventListener("click", function (event) {
    var param = this.dataset.setter;
    switch (param) {
      case 'minutes-plus':
        changeWholeTime(1 * 60);
        break;
      case 'minutes-minus':
        changeWholeTime(-1 * 60);
        break;
      case 'seconds-plus':
        changeWholeTime(1);
        break;
      case 'seconds-minus':
        changeWholeTime(-1);
        break;
    }
    displayTimeLeft(wholeTime);
  });
}
function timer(seconds) { //counts time, takes seconds
  let remainTime = Date.now() + (seconds * 1000);

  // console.log("remain time: ", seconds);
  displayTimeLeft(seconds);

  intervalTimer = setInterval(function () {
    timeLeft = Math.round((remainTime - Date.now()) / 1000);
    if (timeLeft == 0) {
      isPaused = false;
      pauseTimer();
      showAlert(`Nice try, the correct word is ${targetWord?.toUpperCase()}`, 2000);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
    //   clearInterval(intervalTimer);
    //   isStarted = false;
    //   setterBtns.forEach(function (btn) {
    //     btn.disabled = false;
    //     btn.style.opacity = 1;
    //   });
    //   displayTimeLeft(wholeTime);
    //   // pauseBtn.classList.remove('pause');
    //   // pauseBtn.classList.add('play');
    //   return;

    // }
    displayTimeLeft(timeLeft);
  }, 1000);
}
// pauseBtn.addEventListener('click', pauseTimer);
