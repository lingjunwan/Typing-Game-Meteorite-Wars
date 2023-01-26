// Generate 'stone' intervals
let interval = 100;
// If the count is the same as the interval, the stone is generated
let time = interval;
// Falling speed
let speed = 3;
// Determine the end of the game
let gameOver = false;
// The generated characters are taken randomly from here
let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// as the return value of setInterval
let down;
// Score & highscore
let score = 0;
let highscore = 0;
// Start the countdown
function countdown() {
  score = 0;
  document.getElementById("scorenum").innerHTML = score;
  let hint = document.getElementById("hint");
  let countTime = 3;
  let count = setInterval(() => {
    hint.innerHTML = countTime;
    if (!countTime) {
      clearInterval(count);
      hint.innerHTML = "GAME START!";
      //The focus will be set to the input field as soon as the page loads and the user can start typing without having to click on the input field
      document.getElementById("input").focus();
      //setting an interval of 20 milliseconds to repeatedly call the fall() function.
      down = setInterval(fall, 20);
    }
    countTime -= 1;
  }, 1000);
}
countdown();

// Falling
function fall() {
  let stones = document.getElementsByClassName("stone");

  if (time == interval) {
    let newStone = document.createElement("div");
    newStone.setAttribute("class", "stone");
    // Random characters：assigns a random character from the string "str" to the innerHTML of the new stone element
    newStone.innerHTML = str[Math.round(Math.random() * 25)];
    // Random Location：positioned randomly between 10% and 90% of the left of its parent container
    newStone.style.left = `${Math.round(Math.random() * 80) + 10}%`;
    let container = document.getElementById("container");
    // Add the generated stones to the container
    container.appendChild(newStone);
    time = 0;
  }
  // Iterate over each stone and modify its css bottom property to achieve the drop
  for (let i = 0; i < stones.length; i += 1) {
    // Skip this stone if the 'stop' attribute is exist
    if (stones[i].hasAttribute("stop")) continue;
    // Calculate the drop distance and assign it to style.bottom
    let distance = parseInt(getComputedStyle(stones[i]).bottom) - speed;
    stones[i].style.bottom = `${distance}px`;
    // Distance less than 150px means touch the ground, game over
    if (distance < 150) {
      document.getElementById("hint").innerHTML = "GAME OVER!";
      gameOver = true;
      clearInterval(down);
    }
  }
  time += 1;
}
// Events triggered by keydown
function keydown() {
  // Clear the text in the input field 1ms later, prevent the function from failing to clear the input field.
  setTimeout(() => {
    document.getElementById("input").value = "";
  }, 1);
  // check if the variable "gameOver" is true, if so, it stops the execution of the function using the return statement.
  if (gameOver) return;
  // Iterate through all the stones and remove the foremost stone if it is the same as the value entered by the keyboard
  let stones = document.getElementsByClassName("stone");
  let len = stones.length;
  for (let i = 0; i < len; i += 1) {
    // Determine if the value of the stone is the same as the value entered by the keyboard
    if (
      arguments.callee.caller.arguments[0].key.toUpperCase() ==
      stones[i].textContent
    ) {
      //If the key pressed is the same as the text content of the current stone element, it declares a variable "die" and assigns it the current stone element, it then removes the text content of the "die" element and add a "stop" attribute to it to prevent it from falling.
      let die = stones[i];
      die.innerHTML = "";
      die.setAttribute("stop", "");
      // Set transition animation, remove after 0.3 seconds
      die.style.transition = "0.3s";
      die.style.transform = "scale(0,0)";
      setTimeout(() => {
        die.parentElement.removeChild(die);
        die = null;
      }, 300);
      // Update Score
      score += 1;
      document.getElementById("scorenum").innerHTML = score;
      // Update Highscore
      if (score > highscore) {
        highscore = score;
        document.getElementById("highscorenum").textContent = highscore;
      }
      break;
    }
  }
}
// Pressing the Restart key triggers the event
function gameStart() {
  // If the game does not end then you can not restart(return statement stops the execution of the function)
  if (!gameOver) return;
  // Get each parameter from the input box
  interval = document.getElementById("interval").value; // determine how often new stone elements will be created.
  time = interval;
  speed = document.getElementById("speed").value;

  // Emptying the container of stones
  let container = document.getElementById("container");
  while (container.children.length) {
    container.children[0].remove();
  }
  gameOver = false;
  countdown();
}
