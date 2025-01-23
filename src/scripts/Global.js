import { DARK_MODE, LIGHT_MODE, Members, Topics, START, STOP } from "../config";
import { createAvatar } from "@dicebear/core";
import { croodles } from "@dicebear/collection";
let member = [];
let timerInterval;
let totalTime = 3600; // 1 hour
let timePerMember = 0;
let currentMemberIndex = 0;
let bestTime = 0;
const startBtn = document.getElementById("btnStart");
const icStart = document.getElementById("icStart");
const totalTimeModal = document.getElementById("timeModal");
const totalTimeDisplay = document.getElementById("totalTime");
const saveTotalTimeBtn = document.getElementById("saveTotalTime");
const btnAdd = document.querySelector("#btnAdd");
const btnReduce = document.querySelector("#btnReduce");
document.addEventListener("DOMContentLoaded", () => {
  addMember();
  changeStatusMember();
  randomTopicAndMember();
  switchMode();
  switchStartStop();
  updateTimeDisplay();
  for (const mem in Members) {
    member.push({ mem, ...Members[mem] });
  }
});

function updateTimeDisplay() {
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  totalTimeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
document.querySelector("#timer").addEventListener("click", () => {
  totalTimeModal.classList.remove("hidden");
  if (totalTime === 3600) {
    btnAdd.classList.add("disabled-btn");
  }
});

btnAdd.addEventListener("click", () => {
  if (totalTime < 3600) {
    btnReduce.classList.remove("disabled-btn");
    totalTime += 300; // เพิ่มทีละ 5 นาที
    updateTimeDisplay();
    if (totalTime === 3600) {
      btnAdd.classList.add("disabled-btn");
    }
  } else {
    btnAdd.disabled = true;
  }
});

btnReduce.addEventListener("click", () => {
  if (totalTime > 1200) {
    btnAdd.classList.remove("disabled-btn");
    totalTime -= 300; // ลดทีละ 5 นาที
    updateTimeDisplay();
    if (totalTime === 1200) {
      btnReduce.classList.add("disabled-btn");
    }
  } else {
    btnReduce.disabled = true;
  }
});

saveTotalTimeBtn.addEventListener("click", () => {
  timeModal.classList.add("hidden");
  resetTimer();
});

function addMember() {
  document
    .querySelector("#inputMember")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const memberName = document.querySelector("#inputMember").value;

        if (memberName != "" && memberName != null && memberName != undefined) {
          let html = [];
          html.push(`<li class="flex items-center">`);
          html.push(`<label class="flex items-center cursor-pointer">`);
          html.push(
            `<input type="checkbox" class="hidden" checked id="${memberName}">`,
          );
          html.push(
            `<div class="toggle w-12 h-6 bg-gray-200 rounded-full shadow-inner relative">`,
          );
          html.push(
            `<div class="dot w-6 h-6 rounded-full shadow-md absolute top-0 transition-transform duration-300 ease-in-out"></div>`,
          );
          html.push(`</div>`);
          html.push(`<span class="text-xl ml-3">${memberName}</span>`);
          html.push(`</label>`);
          html.push(`</li>`);

          let templateMember = document.querySelector("#templateMember");
          templateMember.insertAdjacentHTML("beforeend", html.join(""));
          document.querySelector("#inputMember").value = "";

          member.push({
            mem: memberName,
            image: null,
            isChecked: true,
          });

          changeStatusMember();
        }
      }
    });
}

function changeStatusMember() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("click", function (ele) {
      let name = ele.target.id;
      const selectedMember = member.find((member) => member.mem === name);

      if (selectedMember) {
        selectedMember.isChecked = ele.target.checked;
      }

      updateBestTimeDisplay();
    });
  });
}

function randomTopicAndMember() {
  document.querySelector("#btnRandom").addEventListener("click", () => {
    const template = document.querySelector("#tempRandomMember");
    template.innerHTML = "";

    const selectedMember = member.filter((item) => item.isChecked);

    if (selectedMember.length > 0) {
      const selectMemLength = selectedMember.length;
      const template = document.querySelector("#tempRandomMember");
      template.innerHTML = "";
      for (var i = 0; i < selectMemLength; i++) {
        const randomIndex = Math.floor(Math.random() * selectedMember.length);
        let avatar = createAvatar(croodles, {
          seed: selectedMember[randomIndex].mem,
          size: 80,
        });
        let html = [];
        html.push(`<div class="flex flex-col items-center">`);
        if (selectedMember[randomIndex].image == null) {
          html.push(
            `<img src="${avatar.toDataUri()}" 
            alt="${selectedMember[randomIndex].mem}" 
            class="image-container rounded-lg border border-white w-[100px] h-[100px] object-cover" />`,
          );
        } else {
          html.push(
            `<div class="image-container rounded-lg" style="--data-image:url(${selectedMember[randomIndex].image})" >
              <img src="${selectedMember[randomIndex].image}" 
              alt="${selectedMember[randomIndex].mem}"
              class="rounded-lg border border-white image" />
            </div>`,
          );
        }
        html.push(
          `<span class="mt-2">${i + 1}. ${selectedMember[randomIndex].mem}</span>`,
        );
        html.push(`</div>`);
        template.insertAdjacentHTML("beforeend", html.join(""));
        selectedMember.splice(randomIndex, 1);
      }
    }

    const randomTopicIndex = Math.floor(Math.random() * Topics.length);
    const topicElement = document.getElementById("topicsName");
    randomTextAnimation(topicElement, Topics[randomTopicIndex]);

    currentMemberIndex = 0;
    Timer();
    setActive(currentMemberIndex);
    updateUIForStart(icStart, startBtn);
    updateButtonVisibility();
    updateBestTimeDisplay();
  });
}

function randomTextAnimation(element, fullText) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789กขฃคฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮ";
  const animationDuration = 2000;
  const frameInterval = 50;
  const totalFrames = Math.round(animationDuration / frameInterval);
  let currentFrame = 0;

  const interval = setInterval(() => {
    currentFrame++;
    if (currentFrame <= totalFrames) {
      const randomText = fullText
        .split("")
        .map((char, index) => {
          if (index < currentFrame * (fullText.length / totalFrames)) {
            return char; // แสดงตัวอักษรจริงเมื่อถึง Frame ของตัวอักษรตัวนั้น
          }
          return characters.charAt(
            Math.floor(Math.random() * characters.length),
          ); // ตัวอักษรสุ่ม
        })
        .join("");

      element.innerHTML = randomText; // อัปเดตข้อความ
    } else {
      clearInterval(interval); // จบ Animation
      element.innerHTML = fullText; // แสดงข้อความเต็ม
    }
  }, frameInterval);
}

function Timer() {
  clearInterval(timerInterval);
  const selectedMember = member.filter((item) => item.isChecked);

  let timeDisplay = "";
  timePerMember = Math.floor(totalTime / selectedMember.length);
  timeDisplay = formattedTime(timePerMember);

  // Timer
  document.querySelector("#timer").innerHTML = timeDisplay;
}
function updateBestTimeDisplay() {
  const selectedMember = member.filter((item) => item.isChecked);
  console.log(selectedMember);
  bestTime = Math.floor(selectedMember.length * 3);
  document.querySelector("#bestTimeTotal").textContent =
    `The ideal time is ${bestTime} minutes`;
}

function switchMode() {
  document.querySelector("#btnMode").addEventListener("click", () => {
    const mode = document.getElementById("btnMode");
    const icMode = document.getElementById("icMode");
    const body = document.body;
    if (mode.dataset.mode == LIGHT_MODE) {
      icMode.src = "/random-english-day/icons/light_mode.svg";
      body.style.backgroundImage =
        "url('/random-english-day/images/background/dark.jpg')";
      mode.dataset.mode = DARK_MODE;
    } else {
      icMode.src = "/random-english-day/icons/dark_mode.svg";
      body.style.backgroundImage =
        "url('/random-english-day/images/background/light.jpg')";
      mode.dataset.mode = LIGHT_MODE;
    }
  });
}

function switchStartStop() {
  document.querySelector("#btnStart").addEventListener("click", () => {
    if (startBtn.dataset.start == START) {
      updateUIForStart(icStart, startBtn);
      stopTimer();
    } else {
      updateUIForStop(icStart, startBtn);
      startTimer();
    }
  });
}

function updateUIForStart(icStart, startBtn) {
  icStart.src = "/random-english-day/images/icon/start.png";
  startBtn.dataset.start = STOP;
}

function updateUIForStop(icStart, startBtn) {
  icStart.src = "/random-english-day/images/icon/stop.png";
  startBtn.dataset.start = START;
}

function updateButtonVisibility() {
  const listMember = document.querySelectorAll(
    "#tempRandomMember > div > .image-container",
  );
  document.querySelector("#btnBack").style.display =
    currentMemberIndex === 0 ? "none" : "block";
  document.querySelector("#btnNext").style.display =
    currentMemberIndex === listMember.length - 1 ? "none" : "block";
}

function updateTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  document.querySelector("#timer").innerHTML =
    `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formattedTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function setActive(index) {
  const listMember = document.querySelectorAll(
    "#tempRandomMember > div > .image-container",
  );
  listMember.forEach((item) => {
    item.classList.remove("current-member");
  });
  if (listMember[index]) {
    listMember[index].classList.add("current-member");
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (timePerMember > 0) {
      timePerMember--;
      updateTimerDisplay(timePerMember);
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
}

function nextMember() {
  Timer();
  currentMemberIndex++;
  updateButtonVisibility();
  if (currentMemberIndex < member.length) {
    startTimer();
    updateUIForStop(icStart, startBtn);
    updateTimerDisplay(timePerMember);
    setActive(currentMemberIndex);
  } else {
    clearInterval(timerInterval);
  }
}

function backMember() {
  Timer();
  currentMemberIndex--;
  updateButtonVisibility();
  if (currentMemberIndex < member.length) {
    startTimer();
    updateUIForStop(icStart, startBtn);
    updateTimerDisplay(timePerMember);
    setActive(currentMemberIndex);
  } else {
    clearInterval(timerInterval);
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  Timer();
  updateTimerDisplay(timePerMember);
  updateUIForStart(icStart, startBtn);
}

document.querySelector("#btnReset").addEventListener("click", resetTimer);
document.querySelector("#btnNext").addEventListener("click", nextMember);
document.querySelector("#btnBack").addEventListener("click", backMember);
