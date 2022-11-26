"strict mode";

const questio = document.querySelector(".questions");
const correctDisplay = document.querySelector(".correctDisplay");
const optionsDIv = document.querySelector(".options");
const hiScore = document.querySelector(".hiScore");
const startBtn = document.querySelector(".start-btn");
const nextBtn = document.querySelector(".nxt-question");
const oneChance = document.querySelector(".one-chace");
const overlay = document.querySelector(".overlay");
const usageError = document.querySelector(".usage-error");
const gameOver = document.querySelector(".gameOver");
const overScore = document.querySelector(".over-score");
const restart = document.querySelector(".restart");

const opt = document.querySelectorAll(".opt");

///corect or wrong

const correct = document.querySelector(".correct");
const wrong = document.querySelector(".wrong");

////timerDisplay
const timerDisplay = document.querySelector(".timerDisplay");
const scoreDisplay = document.querySelector(".score");
const visualQuestn = document.querySelector(".visual-question");
//////////////
const qArray = [];

////////variables
let newQuestion;
let score = 0;
let Highscore = 0;
let timeplayed = 0;
let chance = 1;
let scoreData;
let useInt;
let wrongCount = 0;
///////////

scoreData = JSON.parse(localStorage.getItem("Highscore"));
hiScore.textContent = `Highscore: ${scoreData}`;
console.log(scoreData);

///////////////////// question class parent
class Questions {
  constructor(question, answer, options) {
    this.question = question;
    this.answer = answer;
    this.options = options;
  }
}

/////child class

////type text question

class TextQuestions extends Questions {
  type = "Text";

  constructor(question, answer, options) {
    super(question, answer, options);
  }
}

class VisualQuetions extends Questions {
  type = "Visual";
  constructor(question, answer, options, imgSrc) {
    super(question, answer, options);
    this.img = imgSrc;
    this.displayImg();
  }

  displayImg() {
    visualQuestn.src = this.img;
  }
}
// console.log(newQ);

///fxn for creating a new question,it also pushes a new question into the question array array

function newTextQuestionFxn(question, answer, options) {
  const NewQ = new TextQuestions(question, answer, options);

  qArray.push(NewQ);
}

///visual class
function newVisualQuetionsFxn(question, answer, options, src) {
  const NewQ = new VisualQuetions(question, answer, options, src);

  qArray.push(NewQ);
}

////fxn for capitalizing
function captext(text) {
  return text[0].toUpperCase() + text.slice(1);
}

///fxn timer
let time;
let startCountdown;
let click = 0;
let timer;
let oneChanceUsage = 0;
startCountdown = function () {
  const tic = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(Math.trunc(time % 60)).padStart(2, 0);

    timerDisplay.textContent = `${min}:${sec}`;
    if (time === 10) {
      timerDisplay.style.backgroundColor = "red";
    }
    if (time === 0) {
      clearInterval(timer);

      questio.textContent = "Times Up ⌛";
      // visualQuestn.src = "";

      opt.forEach((el) => {
        el.classList.add("none");
      });

      console.log("times up");
    }
    time--;
  };
  time = 30;
  tic();

  timer = setInterval(() => {
    tic();
    // console.log(time);
  }, 1000);

  return timer;
};

/////////fxn clear
const clearWrongCorrect = function () {
  wrong.classList.add("none");
  correct.classList.add("none");
};
////////
function endGame() {
  // if (wrongCount === 3) {
  // }
  if (timeplayed === 6 || wrongCount === 3) {
    ////display game ends
    ////display score and highscore
    GameOver();

    Highscore = score > Highscore ? score : Highscore;
    hiScore.textContent = `Highscore: ${score}`;
    // console.log("3");
    localStorage.setItem("Highscore", JSON.stringify(Highscore));
    /////display restart button
  }
}

////////////
function correctfxn() {
  wrong.classList.add("none");

  clearInterval(timer);
  // visualQuestn.classList.add("none");

  correct.classList.remove("none");
  score++;
  timeplayed++;

  ////UI
  scoreDisplay.textContent = score;
  endGame();

  // endGame();
}
//////////

console.log(qArray);
///////////////
//////////////////////////////
////////////////////////////////////

startBtn.addEventListener("click", function () {
  overlay.style.transition = "all 1s";
  overlay.style.opacity = "0";

  setTimeout(() => {
    overlay.classList.add("none");
  }, 800);
});
//////////////

///////////////////////

nextBtn.addEventListener("click", function () {
  click = 0;
  usageError.classList.remove("error-off");
  clearTimeout(useInt);
  timerDisplay.style.backgroundColor = "var(--primary-color)";

  opt.forEach((el) => {
    el.classList.remove("none");
  });
  clearWrongCorrect();

  const random = Math.trunc(Math.random() * qArray.length);
  newQuestion = qArray[random];

  if (newQuestion.type === "Text") {
    visualQuestn.classList.add("none");
    optionsDIv.classList.add("text-opt");
    optionsDIv.classList.remove("visual-opt");
    questio.textContent = newQuestion.question;

    const s = newQuestion.options.sort((a, b) => {
      return 0.5 - Math.random();
    });

    opt.forEach((el, i) => {
      el.textContent = s[i];
    });
    if (timer) {
      clearInterval(timer);
    }
    startCountdown();
  } else if (newQuestion.type === "Visual") {
    visualQuestn.src = null;

    questio.textContent = newQuestion.question;
    visualQuestn.classList.toggle("none");
    newQuestion?.displayImg();
    optionsDIv.classList.remove("text-opt");
    optionsDIv.classList.add("visual-opt");
    const s = newQuestion.options.sort((a, b) => {
      return 0.5 - Math.random();
    });

    opt.forEach((el, i) => {
      el.textContent = s[i];
    });
    if (timer) {
      clearInterval(timer);
    }

    visualQuestn.addEventListener("load", function () {
      if (timer) {
        clearInterval(timer);
      }
      startCountdown();
    });
  }

  oneChance.addEventListener("click", function () {
    if (oneChanceUsage === 0) {
      correctfxn();
      chance--;
      console.log("clicked");
    } else if (oneChanceUsage > 0) {
      usageError.classList.add("error-off");
      useInt = setTimeout(() => {
        usageError.classList.remove("error-off");
      }, 2000);
    }
    oneChanceUsage++;
  });
});

// if (timplayed)
/////////////////

/////////////////////////

opt.forEach((el) => {
  el.addEventListener("click", function () {
    console.log(this.textContent);
    click++;

    //if correct
    if (click < 2 && timer) {
      if (this.textContent === newQuestion?.answer && newQuestion) {
        ///correct

        correctfxn();
        //////

        opt.forEach((el) => {});
      } else if (this.textContent != newQuestion?.answer && newQuestion) {
        //wrong
        timeplayed++;
        wrongCount++;
        console.log(wrongCount);

        correct.classList.add("none");
        clearInterval(timer);
        visualQuestn.src = "";

        wrong.classList.remove("none");
        correctDisplay.textContent = captext(newQuestion?.answer);

        endGame();
      }
    } else {
      return;
    }
  });
});
restart.addEventListener("click", function () {
  scoreData = JSON.parse(localStorage.getItem("Highscore"));
  hiScore.textContent = `Highscore: ${scoreData}`;
  console.log(scoreData);
  gameOver.classList.add("none");
  gameOver.classList.remove("gameOver-None");
  opt.forEach((op, i) => {
    op.textContent = `opt-${i + 1}`;
    clearInterval(timer);
    timerDisplay.textContent = "00:00";
    scoreDisplay.textContent = "0";
    questio.textContent = "";
    wrong.classList.add("none");
  });
});
////
function GameOver() {
  gameOver.classList.remove("none");
  gameOver.classList.add("gameOver-None");
  localStorage.setItem("Highscore", JSON.stringify(Highscore));
  overScore.textContent = score;
  // gameOver.classList.remove("none");
}
