


//#region  game logic

let clickCount = 0
let height = 120
let width = 100
let inflationRate = 20
let maxSize = 300
let highestPopCount = 0
let currentPopCount = 0
let gameLength = 10000
let clockID = 0
let timeRemaining = 0
let currentPlayer = {}
let currentColor = "blue"
let possibleColors = ["blue", "green", "red", "purple", "pink"]



function startGame() {
  document.getElementById("game-controls").classList.remove("hidden")
  document.getElementById("main-controls").classList.add("hidden")
  document.getElementById("scoreboard").classList.add("hidden")
  startClock()

  setTimeout(stopGame, gameLength)
}

function startClock() {
  timeRemaining = gameLength
  drawClock()
  clockID = setInterval(drawClock, 1000)
}

function stopClock() {
  clearInterval(clockID)
}

function drawClock() {
  let countdownElement = document.getElementById("countdown")
  countdownElement.innerText = (timeRemaining / 1000).toString()
  timeRemaining -= 1000
}

function inflate() {
  clickCount++
  height += inflationRate
  width += inflationRate

  checkBalloonPop()
  draw()

}

function checkBalloonPop() {
  if (height >= maxSize) {
    console.log("pop the balloon")
    let balloonElement = document.getElementById("balloon")
    balloonElement.classList.remove(currentColor)
    getRandomColor()
    balloonElement.classList.add(currentColor)
    // @ts-ignore
    document.getElementById("pop-sound").play()
    currentPopCount++
    height = 40
    width = 0
  }
}

function getRandomColor() {
  let i = Math.floor(Math.random() * possibleColors.length)
  currentColor = possibleColors[i]
}

function draw() {
  let balloonElement = document.getElementById("balloon")
  let clickCountElement = document.getElementById("click-count")
  let popCountElement = document.getElementById("pop-count")
  let highPopCountElement = document.getElementById("high-pop-count")
  let showPlayerName = document.getElementById("playerName")

  balloonElement.style.height = height + "px"
  balloonElement.style.width = width + "px"

  clickCountElement.innerText = clickCount.toString()
  popCountElement.innerText = currentPopCount.toString()
  highPopCountElement.innerText = currentPlayer.topScore.toString()
  showPlayerName.innerText = currentPlayer.name
}

function stopGame() {
  console.log("Game is Over")
  document.getElementById("main-controls").classList.remove("hidden")
  document.getElementById("game-controls").classList.add("hidden")
  document.getElementById("scoreboard").classList.remove("hidden")

  clickCount = 0
  height = 120
  width = 100

  if (currentPopCount > currentPlayer.topScore) {
    currentPlayer.topScore = currentPopCount
    savePlayers()
  }
  currentPopCount = 0
  stopClock()
  draw()
  drawScoreboard()
}

//#endregion

let players = []
loadPlayers()

function setPlayer(event) {
  event.preventDefault()  // stops some error from happening?
  let form = event.target
  let playerName = form.playerName.value

  // loops through array, like a for 
  currentPlayer = players.find(player => player.name == playerName)

  if (!currentPlayer) {
    currentPlayer = { name: playerName, topScore: 0 }
    // appends new item to the array
    players.push(currentPlayer)
    savePlayers()
  }

  console.log(currentPlayer)
  form.reset()
  document.getElementById("game").classList.remove("hidden")
  form.classList.add("hidden")
  draw()
  drawScoreboard()

}

function changePlayer() {
  document.getElementById("playerForm").classList.remove("hidden")
  document.getElementById("game").classList.add("hidden")
}
function savePlayers() {
  window.localStorage.setItem("players", JSON.stringify(players))
}

function loadPlayers() {
  let playersData = JSON.parse(window.localStorage.getItem("players"))
  if (playersData) {
    players = playersData
  }
}

/*  add new html in an array of stuffs */
function drawScoreboard() {
  let template = ""
  players.sort((p1, p2) => p2.topScore - p1.topScore);
  players.forEach(player => {
    template += `
      <div class="d-flex space-between">
        <span>
          <i class="fa fa-user"></i>
          ${player.name}
        </span>
        <span>score: ${player.topScore}</span>
      </div>
    `
  })

  document.getElementById("players").innerHTML = template
}

/* this is outside of any method, which is ok.  It'll happen when
 * the page loads */
drawScoreboard()


