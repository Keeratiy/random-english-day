import { DARK_MODE, LIGHT_MODE, START, STOP } from "../config";
import { Members } from "../data/members";
import { createAvatar } from "@dicebear/core";
import { croodles } from "@dicebear/collection";
const DEFAULT_TOTAL_TIME = 3600;
const MIN_TOTAL_TIME = 600;
const TIME_STEP = 300;
const TYPEWRITER_SPEED = 40;

const state = {
  members: buildInitialMembers(),
  randomizedMembers: [],
  totalTime: DEFAULT_TOTAL_TIME,
  timePerMember: 0,
  currentMemberIndex: 0,
  currentTopic: "",
  timerInterval: null,
  typewriterTimeout: null,
  topic: [],
  isWaiting: true,
};

const elements = {
  allMemberCount: document.querySelector("#allMemberCount"),
  bestTime: document.querySelector("#bestTimeTotal"),
  btnAdd: document.querySelector("#btnAdd"),
  btnBack: document.querySelector("#btnBack"),
  btnMode: document.querySelector("#btnMode"),
  btnNext: document.querySelector("#btnNext"),
  btnRandom: document.querySelector("#btnRandom"),
  btnReduce: document.querySelector("#btnReduce"),
  btnReset: document.querySelector("#btnReset"),
  btnStart: document.querySelector("#btnStart"),
  btnResetTopic: document.querySelector("#btnResetTopic"),
  currentSpeakerLabel: document.querySelector("#currentSpeakerLabel"),
  inputMember: document.querySelector("#inputMember"),
  modeIcon: document.querySelector("#icMode"),
  queueMemberCount: document.querySelector("#queueMemberCount"),
  saveTotalTime: document.querySelector("#saveTotalTime"),
  selectedMemberCount: document.querySelector("#selectedMemberCount"),
  startIcon: document.querySelector("#icStart"),
  templateMember: document.querySelector("#templateMember"),
  timer: document.querySelector("#timer"),
  timePerMemberLabel: document.querySelector("#timePerMemberLabel"),
  timeModal: document.querySelector("#timeModal"),
  resetModal: document.querySelector("#resetModal"),
  resetConfirm: document.querySelector("#resetConfirm"),
  resetCancel: document.querySelector("#resetCancel"),
  topicName: document.querySelector("#topicsName"),
  totalTime: document.querySelector("#totalTime"),
  randomMember: document.querySelector("#tempRandomMember"),
  topicCount: document.querySelector("#topicCount"),
  resetHead: document.querySelector("#resetHead"),
  resetBody: document.querySelector("#resetBody"),
};

document.addEventListener("DOMContentLoaded", async () => {
  if (!hasRequiredElements()) {
    return;
  }

  bindEvents();
  updateMemberMetrics();
  updateBestTimeDisplay();
  updateTotalTimeDisplay();
  resetTimer();
  updateNavigationButtons();
  try {
    await fetchTopicStats();
  } catch (error) {
    console.error(error);
  }
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
  elements.btnResetTopic.addEventListener("click", resetTopic);
  elements.btnNext.addEventListener("click", () => changeMember(1));
  elements.btnBack.addEventListener("click", () => changeMember(-1));
  elements.timer.addEventListener("click", openTimeModal);
  elements.btnAdd.addEventListener("click", () => adjustTotalTime(TIME_STEP));
  elements.btnReduce.addEventListener("click", () =>
    adjustTotalTime(-TIME_STEP),
  );
  elements.saveTotalTime.addEventListener("click", handleUpdateTime);
  elements.resetCancel.addEventListener("click", () => {
    elements.resetModal.style.display = "none";
  });
  elements.resetConfirm.addEventListener("click", handleConfirmReset);
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
  const newMember = state.members.at(-1);

  if (state.isWaiting) {
    updateMemberMetrics();
    resetTimer();
  } else {
    elements.inputMember.value = "";
    state.randomizedMembers.push(newMember);
    renderRandomizedMembers();
    resetTimer();
    updateMemberMetrics();
    updateBestTimeDisplay();
  }
}

async function fetchMockApi() {
  const response = await fetch(
    "https://6a1548aa91ff9a63de07ce3e.mockapi.io/api/v1/topic",
  );
  state.topic = await response.json();
}

async function fetchTopicStats() {
  await fetchMockApi();
  const usedCount = state.topic.filter((topic) => topic.is_used).length;
  const totalTopics = state.topic.length;
  topicTracker(usedCount, totalTopics);
}

function topicTracker(usedCount, totalTopics) {
  elements.topicCount.innerHTML = `${usedCount}/${totalTopics}`;
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

  if (checkbox.checked) {
    const alreadyExists = state.randomizedMembers.some(
      (member) => member.mem === selectedMember.mem,
    );
    if (state.isWaiting) {
      updateMemberMetrics();
    } else {
      if (!alreadyExists) {
        state.randomizedMembers.push(selectedMember);
      }
    }
  } else {
    state.randomizedMembers = state.randomizedMembers.filter(
      (member) => member.mem !== selectedMember.mem,
    );
  }

  renderRandomizedMembers();
  resetTimer();
  setCurrentMember(state.currentMemberIndex);
  updateMemberMetrics();
  updateBestTimeDisplay();
}

async function getRandomTopic() {
  const unusedTopics = state.topic.filter((topic) => !topic.is_used);

  if (unusedTopics.length === 0) {
    return {
      topic: null,
      usedCount: state.topic.length,
      totalTopics: state.topic.length,
    };
  }

  const randomTopic =
    unusedTopics[Math.floor(Math.random() * unusedTopics.length)];

  return {
    topic: randomTopic,
    usedCount: state.topic.filter((topic) => topic.is_used).length,
    totalTopics: state.topic.length,
  };
}

async function handleRandomize() {
  state.isWaiting = false;
  elements.btnRandom.disabled = true;
  await fetchTopicStats();
  const topicData = await getRandomTopic();
  if (!topicData.topic || topicData.usedCount === topicData.totalTopics) {
    elements.topicName.textContent = "You have used all topics!";
    state.currentTopic = "";
  } else if (topicData.topic) {
    state.currentTopic = topicData.topic;
    state.randomizedMembers = shuffleMembers(getSelectedMembers());
    state.currentMemberIndex = 0;
    renderRandomizedMembers();
    try {
      await fetch(
        `https://6a1548aa91ff9a63de07ce3e.mockapi.io/api/v1/topic/${state.currentTopic.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_used: true,
          }),
        },
      );
    } catch (error) {
      console.error(error);
      return;
    } finally {
      animateTopic(topicData.topic.name || topicData.topic.topic);
    }
  }

  elements.btnRandom.disabled = false;
  await fetchTopicStats();
  resetTimer();
  setCurrentMember(state.currentMemberIndex);
  updateNavigationButtons();
  updateMemberMetrics();
  updateBestTimeDisplay();
}

function createMemberTemplate(memberName) {
  const escapedMemberName = escapeHtml(memberName);

  return `
    <li>
      <label class="member-item flex items-center cursor-pointer justify-between gap-4 rounded-2xl border border-white/8 px-4 py-3">
        <div class="flex items-center gap-4">
          <input type="checkbox" class="hidden" checked id="${escapedMemberName}">
          <div class="toggle relative h-6 w-12 rounded-full bg-white/16 shadow-inner ring-1 ring-inset ring-white/10">
            <div class="dot absolute top-0 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out"></div>
          </div>
          <div class="flex flex-col">
            <span class="text-base font-semibold text-white sm:text-lg">${escapedMemberName}</span>
            <span class="text-xs uppercase tracking-[0.24em] text-white/42">Ready for round</span>
          </div>
        </div>
        <span class="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/46">
          Active
        </span>
      </label>
    </li>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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
  if (state.isWaiting) {
    return;
  } else {
    if (state.randomizedMembers.length === 0) {
      elements.randomMember.innerHTML = `
      <p class="text-2xl md:text-3xl lg:text-4xl col-span-full text-center my-auto">
        Select at least one member
      </p>
    `;
      updateSessionMetrics();
      return;
    }
  }

  const cardsMarkup = state.randomizedMembers
    .map((member, index) => createRandomMemberCard(member, index))
    .join("");
  elements.randomMember.innerHTML = cardsMarkup;
  updateSessionMetrics();
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
    <div class="flex flex-col items-center justify-center gap-3 text-center">
      ${imageMarkup}
      <span class="text-sm uppercase tracking-[0.2em] text-white/42">${index + 1}</span>
      <span class="font-semibold text-white">${member.mem}</span>
    </div>
  `;
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

function updateMemberMetrics() {
  if (elements.selectedMemberCount) {
    elements.selectedMemberCount.textContent = String(
      getSelectedMembers().length,
    );
  }

  if (elements.allMemberCount) {
    elements.allMemberCount.textContent = String(state.members.length);
  }

  updateSessionMetrics();
}

function updateSessionMetrics() {
  if (elements.queueMemberCount) {
    const queueCount =
      state.randomizedMembers.length || getSelectedMembers().length;
    elements.queueMemberCount.textContent = String(queueCount);
  }

  if (elements.timePerMemberLabel) {
    elements.timePerMemberLabel.textContent = formatTime(
      Math.max(state.timePerMember, 0),
    );
  }

  if (elements.currentSpeakerLabel) {
    const currentSpeaker =
      state.randomizedMembers[state.currentMemberIndex]?.mem;
    elements.currentSpeakerLabel.textContent =
      currentSpeaker || "Waiting to start";
  }
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
  elements.timeModal.style.display = "flex";
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

function resetTopic() {
  elements.resetModal.style.display = "flex";
}

async function safeUpdateTopics(topicsArray) {
  const usedTopics = topicsArray.filter((topic) => topic.is_used === true);

  for (const topic of usedTopics) {
    try {
      await fetch(
        `https://6a1548aa91ff9a63de07ce3e.mockapi.io/api/v1/topic/${topic.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...topic,
            is_used: false,
          }),
        },
      );
    } catch (error) {
      console.error(error);
    }
  }
}

function handleUpdateTime() {
  elements.timeModal.style.display = "none";
  resetTimer();
}

async function handleConfirmReset() {
  const resetModalHeader = document.getElementById("resetHead");
  const defaultResetHeader = resetModalHeader.innerHTML;
  const resetModalBody = document.getElementById("resetBody");
  const defaultResetBody = resetModalBody.innerHTML;
  elements.resetHead.innerHTML = '<span class="loader-dot">Resetting</span>';
  elements.resetBody.innerHTML = '<span class="loader mt-2 mb-0"></span>';
  elements.topicName.innerHTML =
    '<span class="loader-dot"> Resetting topics. Might take a while!</span>';
  elements.resetConfirm.style.display = "none";
  elements.resetCancel.style.display = "none";
  try {
    await safeUpdateTopics(state.topic);
  } catch (error) {
    console.error(error);
  } finally {
    elements.resetHead.innerHTML = defaultResetHeader;
    elements.resetBody.innerHTML = defaultResetBody;
    elements.resetConfirm.style.display = "block";
    elements.resetCancel.style.display = "block";
  }
  elements.resetModal.style.display = "none";
  state.currentTopic = "";
  elements.topicName.textContent = "Just click random";
  elements.topicCount.textContent = `0/${state.topic.length}`;
  state.currentMemberIndex = 0;
  setCurrentMember(state.currentMemberIndex);
}

function resetTimer() {
  stopTimer();
  state.timePerMember = calculateTimePerMember();
  updateTimerDisplay(state.timePerMember);
  setTimerButtonToStart();
  updateSessionMetrics();
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
    document.body.dataset.theme = DARK_MODE;
    elements.btnMode.dataset.mode = DARK_MODE;
    return;
  }

  elements.modeIcon.src = "/random-english-day/icons/dark_mode.svg";
  document.body.style.backgroundImage =
    "url('/random-english-day/images/background/light.jpg')";
  document.body.dataset.theme = LIGHT_MODE;
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
  const canGoBack = hasMembers && state.currentMemberIndex > 0;
  const canGoNext =
    hasMembers && state.currentMemberIndex < state.randomizedMembers.length - 1;

  elements.btnBack.classList.remove("disabled-btn");
  elements.btnNext.classList.remove("disabled-btn");
  elements.btnBack.setAttribute("aria-hidden", String(!canGoBack));
  elements.btnNext.setAttribute("aria-hidden", String(!canGoNext));
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

  updateSessionMetrics();
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
