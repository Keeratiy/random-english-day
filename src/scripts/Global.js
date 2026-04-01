import { DARK_MODE, LIGHT_MODE, START, STOP } from "../config";
import { Members } from "../data/members";
import { Topics } from "../data/topics";
import { createAvatar } from "@dicebear/core";
import { croodles } from "@dicebear/collection";

const DEFAULT_TOTAL_TIME = 3600;
const MIN_TOTAL_TIME = 600;
const TIME_STEP = 300;
const TYPEWRITER_SPEED = 50;

const state = {
  members: buildInitialMembers(),
  randomizedMembers: [],
  totalTime: DEFAULT_TOTAL_TIME,
  timePerMember: 0,
  currentMemberIndex: 0,
  timerInterval: null,
  typewriterTimeout: null,
};

const elements = {
  bestTime: document.querySelector("#bestTimeTotal"),
  btnAdd: document.querySelector("#btnAdd"),
  btnBack: document.querySelector("#btnBack"),
  btnMode: document.querySelector("#btnMode"),
  btnNext: document.querySelector("#btnNext"),
  btnRandom: document.querySelector("#btnRandom"),
  btnReduce: document.querySelector("#btnReduce"),
  btnReset: document.querySelector("#btnReset"),
  btnStart: document.querySelector("#btnStart"),
  inputMember: document.querySelector("#inputMember"),
  modeIcon: document.querySelector("#icMode"),
  saveTotalTime: document.querySelector("#saveTotalTime"),
  startIcon: document.querySelector("#icStart"),
  templateMember: document.querySelector("#templateMember"),
  timer: document.querySelector("#timer"),
  timeModal: document.querySelector("#timeModal"),
  topicName: document.querySelector("#topicsName"),
  totalTime: document.querySelector("#totalTime"),
  randomMember: document.querySelector("#tempRandomMember"),
};

document.addEventListener("DOMContentLoaded", () => {
  if (!hasRequiredElements()) {
    return;
  }

  bindEvents();
  updateBestTimeDisplay();
  updateTotalTimeDisplay();
  resetTimer();
  updateNavigationButtons();
});

function buildInitialMembers() {
  return Object.entries(Members).map(([mem, member]) => ({
    mem,
    image: member.image,
    isChecked: Boolean(member.isChecked),
  }));
}

function hasRequiredElements() {
  return Object.values(elements).every(Boolean);
}

function bindEvents() {
  elements.inputMember.addEventListener("keydown", handleAddMember);
  elements.templateMember.addEventListener("change", handleMemberToggle);
  elements.btnRandom.addEventListener("click", handleRandomize);
  elements.btnMode.addEventListener("click", toggleMode);
  elements.btnStart.addEventListener("click", toggleTimer);
  elements.btnReset.addEventListener("click", resetTimer);
  elements.btnNext.addEventListener("click", () => changeMember(1));
  elements.btnBack.addEventListener("click", () => changeMember(-1));
  elements.timer.addEventListener("click", openTimeModal);
  elements.btnAdd.addEventListener("click", () => adjustTotalTime(TIME_STEP));
  elements.btnReduce.addEventListener("click", () =>
    adjustTotalTime(-TIME_STEP),
  );
  elements.saveTotalTime.addEventListener("click", () => {
    elements.timeModal.classList.add("hidden");
    resetTimer();
  });
}

function handleAddMember(event) {
  if (event.key !== "Enter") {
    return;
  }

  const memberName = elements.inputMember.value.trim();
  if (!memberName) {
    return;
  }

  const existingMember = state.members.find(
    (member) => member.mem.toLowerCase() === memberName.toLowerCase(),
  );
  if (existingMember) {
    elements.inputMember.value = "";
    return;
  }

  state.members.push({
    mem: memberName,
    image: null,
    isChecked: true,
  });

  elements.templateMember.insertAdjacentHTML(
    "beforeend",
    createMemberTemplate(memberName),
  );
  elements.inputMember.value = "";
  updateBestTimeDisplay();
}

function handleMemberToggle(event) {
  const checkbox = event.target.closest('input[type="checkbox"]');
  if (!checkbox) {
    return;
  }

  const selectedMember = state.members.find(
    (member) => member.mem === checkbox.id,
  );
  if (!selectedMember) {
    return;
  }

  selectedMember.isChecked = checkbox.checked;
  updateBestTimeDisplay();
}

function handleRandomize() {
  state.randomizedMembers = shuffleMembers(getSelectedMembers());
  state.currentMemberIndex = 0;

  renderRandomizedMembers();
  animateTopic(getRandomTopic());
  resetTimer();
  setCurrentMember(state.currentMemberIndex);
  updateNavigationButtons();
  updateBestTimeDisplay();
}

function createMemberTemplate(memberName) {
  return `
    <li class="flex items-center">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" class="hidden" checked id="${memberName}">
        <div class="toggle w-12 h-6 bg-gray-200 rounded-full shadow-inner relative">
          <div class="dot w-6 h-6 rounded-full shadow-md absolute top-0 transition-transform duration-300 ease-in-out"></div>
        </div>
        <span class="text-xl ml-3">${memberName}</span>
      </label>
    </li>
  `;
}

function getSelectedMembers() {
  return state.members.filter((member) => member.isChecked);
}

function shuffleMembers(members) {
  const pool = [...members];
  const randomizedMembers = [];

  while (pool.length > 0) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    randomizedMembers.push(pool.splice(randomIndex, 1)[0]);
  }

  return randomizedMembers;
}

function renderRandomizedMembers() {
  if (state.randomizedMembers.length === 0) {
    elements.randomMember.innerHTML = `
      <p class="text-2xl md:text-3xl lg:text-4xl col-span-full text-center my-auto">
        Select at least one member
      </p>
    `;
    return;
  }

  const cardsMarkup = state.randomizedMembers
    .map((member, index) => createRandomMemberCard(member, index))
    .join("");
  elements.randomMember.innerHTML = cardsMarkup;
}

function createRandomMemberCard(member, index) {
  const imageMarkup = member.image
    ? `
        <div class="image-container rounded-lg" style="--data-image:url(${member.image})">
          <img
            src="${member.image}"
            alt="${member.mem}"
            class="rounded-lg border border-white image"
          />
        </div>
      `
    : `
        <img
          src="${createAvatar(croodles, { seed: member.mem, size: 80 }).toDataUri()}"
          alt="${member.mem}"
          class="image-container rounded-lg border border-white w-[100px] h-[100px] object-cover"
        />
      `;

  return `
    <div class="flex flex-col items-center">
      ${imageMarkup}
      <span class="mt-2">${index + 1}. ${member.mem}</span>
    </div>
  `;
}

function getRandomTopic() {
  const randomTopicIndex = Math.floor(Math.random() * Topics.length);
  return Topics[randomTopicIndex];
}

function animateTopic(fullText) {
  clearTypewriterTimeout();
  elements.topicName.innerHTML = "";

  const cursor = document.createElement("span");
  cursor.classList.add("cursor");
  cursor.textContent = "|";
  elements.topicName.appendChild(cursor);

  let index = 0;
  const writeNextCharacter = () => {
    if (index >= fullText.length) {
      cursor.remove();
      state.typewriterTimeout = null;
      return;
    }

    cursor.before(document.createTextNode(fullText[index]));
    index += 1;
    elements.topicName.scrollTop = elements.topicName.scrollHeight;
    state.typewriterTimeout = window.setTimeout(
      writeNextCharacter,
      TYPEWRITER_SPEED,
    );
  };

  writeNextCharacter();
}

function clearTypewriterTimeout() {
  if (state.typewriterTimeout) {
    clearTimeout(state.typewriterTimeout);
    state.typewriterTimeout = null;
  }
}

function updateTotalTimeDisplay() {
  elements.totalTime.textContent = formatTime(state.totalTime);
  updateTimeButtons();
}

function updateTimeButtons() {
  elements.btnAdd.classList.toggle(
    "disabled-btn",
    state.totalTime >= DEFAULT_TOTAL_TIME,
  );
  elements.btnReduce.classList.toggle(
    "disabled-btn",
    state.totalTime <= MIN_TOTAL_TIME,
  );
}

function openTimeModal() {
  elements.timeModal.classList.remove("hidden");
  updateTimeButtons();
}

function adjustTotalTime(change) {
  const nextTotalTime = Math.min(
    DEFAULT_TOTAL_TIME,
    Math.max(MIN_TOTAL_TIME, state.totalTime + change),
  );

  if (nextTotalTime === state.totalTime) {
    return;
  }

  state.totalTime = nextTotalTime;
  updateTotalTimeDisplay();
}

function resetTimer() {
  stopTimer();
  state.timePerMember = calculateTimePerMember();
  updateTimerDisplay(state.timePerMember);
  setTimerButtonToStart();
}

function calculateTimePerMember() {
  const memberCount =
    state.randomizedMembers.length || getSelectedMembers().length;

  if (memberCount === 0) {
    return 0;
  }

  return Math.floor(state.totalTime / memberCount);
}

function updateBestTimeDisplay() {
  const bestTime = getSelectedMembers().length * 3;
  elements.bestTime.textContent = `The ideal time is ${bestTime} minutes`;
}

function toggleMode() {
  if (elements.btnMode.dataset.mode === LIGHT_MODE) {
    elements.modeIcon.src = "/random-english-day/icons/light_mode.svg";
    document.body.style.backgroundImage =
      "url('/random-english-day/images/background/dark.jpg')";
    elements.btnMode.dataset.mode = DARK_MODE;
    return;
  }

  elements.modeIcon.src = "/random-english-day/icons/dark_mode.svg";
  document.body.style.backgroundImage =
    "url('/random-english-day/images/background/light.jpg')";
  elements.btnMode.dataset.mode = LIGHT_MODE;
}

function toggleTimer() {
  if (elements.btnStart.dataset.start === START) {
    stopTimer();
    setTimerButtonToStart();
    return;
  }

  if (state.timePerMember <= 0) {
    return;
  }

  setTimerButtonToStop();
  startTimer();
}

function setTimerButtonToStart() {
  elements.startIcon.src = "/random-english-day/images/icon/start.png";
  elements.btnStart.dataset.start = STOP;
}

function setTimerButtonToStop() {
  elements.startIcon.src = "/random-english-day/images/icon/stop.png";
  elements.btnStart.dataset.start = START;
}

function updateNavigationButtons() {
  const hasMembers = state.randomizedMembers.length > 0;
  elements.btnBack.style.display =
    hasMembers && state.currentMemberIndex > 0 ? "block" : "none";
  elements.btnNext.style.display =
    hasMembers && state.currentMemberIndex < state.randomizedMembers.length - 1
      ? "block"
      : "none";
}

function updateTimerDisplay(seconds) {
  elements.timer.innerHTML = formatTime(seconds);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

function setCurrentMember(index) {
  const memberCards =
    elements.randomMember.querySelectorAll(".image-container");
  memberCards.forEach((card) => card.classList.remove("current-member"));

  if (memberCards[index]) {
    memberCards[index].classList.add("current-member");
  }
}

function startTimer() {
  stopTimer();

  state.timerInterval = window.setInterval(() => {
    if (state.timePerMember <= 0) {
      stopTimer();
      return;
    }

    state.timePerMember -= 1;
    updateTimerDisplay(state.timePerMember);
  }, 1000);
}

function changeMember(direction) {
  const nextIndex = state.currentMemberIndex + direction;
  if (nextIndex < 0 || nextIndex >= state.randomizedMembers.length) {
    return;
  }

  state.currentMemberIndex = nextIndex;
  resetTimer();
  setCurrentMember(state.currentMemberIndex);
  updateNavigationButtons();

  if (state.randomizedMembers.length > 0) {
    setTimerButtonToStop();
    startTimer();
  }
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}
