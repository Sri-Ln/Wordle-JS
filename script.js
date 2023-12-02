const targetWords =[
  "cloud",
  "batch",
  "azure",
  "mossy",
  "serve"
]

const dictionary =[
  "cloud",
  "batch",
  "azure",
  "mossy",
  "serve"
]

const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")
const guessGrid = document.querySelector("[data-guess-grid]")

startInteraction()

function getRandomElement(array) {
  if (array.length === 0) {
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

let targetWord = getRandomElement(targetWords);
  console.log("TargetWord:",targetWord);
  
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
    clearTileAttributesAndValues()
    targetWord = getRandomElement(targetWords);
    const nextButtonToRemove = document.querySelector("[data-next]");
    if (nextButtonToRemove) {
      nextButtonToRemove.remove();
    }
    return
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey()
    return
  }
}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    submitGuess()
    return
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey()
    return
  }

  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key)
    return
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
      tile.classList.remove("flip")
      const letterCountInTarget = countOccurrences(targetWord, letter);
      const letterCountInGuess = countOccurrences(guess, letter);
      if(targetWord.includes(letter)){
        if (targetWord[index] === letter) {
          tile.dataset.state = "correct"
          key.classList.add("correct")
        } else {
          tile.dataset.state = "wrong-location"
          key.classList.add("wrong-location")
        }
      } else {
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

function createNextGameButton(){
  const nextButton = document.createElement("button");
    nextButton.setAttribute("data-next", "");
    nextButton.classList.add("key", "large4");
    nextButton.textContent = "Try another";
    const nextButtonContainer = document.querySelector(".next-button");
    nextButtonContainer.appendChild(nextButton);
    startInteraction();
}

function checkWinLose(guess, tiles) {
  guessWord=guess;
  if (guess === targetWord) {
    showAlert("You Win", 2000)
    danceTiles(tiles)
    stopInteraction()
    createNextGameButton()
    return
  }

  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
  if (remainingTiles.length === 0) {
    showAlert(targetWord.toUpperCase(), null)
    stopInteraction()
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
    if (guessWord === targetWord) {
      // Execute the function only when Enter key is pressed and guess is correct
      clearTileAttributesAndValues()
      targetWord = getRandomElement(targetWords);
    }
  }
});