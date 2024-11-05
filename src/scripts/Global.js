import { DARK_MODE, LIGHT_MODE, Members, Topics } from "../config";
import { createAvatar } from '@dicebear/core';
import { croodles } from '@dicebear/collection';
let member = [];

document.addEventListener("DOMContentLoaded", () => {
  addMember();
  changeStatusMember();
  randomTopicAndMember();
  switchMode();

  for (const mem in Members) {
    member.push({ mem, ...Members[mem] });
  }
});

function addMember() {
  document.querySelector("#inputMember").addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      const memberName = document.querySelector("#inputMember").value;

      if (memberName != "" && memberName != null && memberName != undefined) {
        let html = [];
        html.push(`<li class="flex items-center">`);
        html.push(`<label class="flex items-center cursor-pointer">`);
        html.push(`<input type="checkbox" class="hidden" checked id="${memberName}">`);
        html.push(
          `<div class="toggle w-12 h-6 bg-gray-200 rounded-full shadow-inner relative">`,
        );
        html.push(
          `<div class="dot w-6 h-6 rounded-full shadow-md absolute top-0 transition-transform duration-300 ease-in-out"></div>`,
        );
        html.push(`</div>`);
        html.push(
          `<span class="text-xl ml-3">${memberName}</span>`,
        );
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
    });
  });
}

function randomTopicAndMember() {
  document.querySelector("#btnRandom").addEventListener("click", () => {
    const template = document.querySelector("#tempRandomMember");
    template.innerHTML = "";
    const selectedMember = member.filter((item) => {
      return item.isChecked === true;
    });

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
        if (selectedMember[randomIndex].image == null){
          html.push(
            `<img src="${avatar.toDataUri()}" 
            alt="${selectedMember[randomIndex].mem}" 
            class="rounded-lg border border-white w-[100px] h-[100px] object-cover" />`,
          );
        } else {
          html.push(
            `<img src="${selectedMember[randomIndex].image}" 
            alt="${selectedMember[randomIndex].mem}" 
            class="rounded-lg border border-white w-[100px] h-[100px] object-cover" />`,
          );
        }
        html.push(
          `<span class="">${i + 1}. ${selectedMember[randomIndex].mem}</span>`,
        );
        html.push(`</div>`);
        template.insertAdjacentHTML("beforeend", html.join(""));
        selectedMember.splice(randomIndex, 1);
      }
    }

    // Random Topics
    const randomTopicIndex = Math.floor(Math.random() * Topics.length);
    document.querySelector("#topicsName").innerHTML = Topics[randomTopicIndex];
  });
}

function switchMode(){
  document.querySelector("#btnMode").addEventListener("click", () => {
    const mode = document.getElementById("btnMode");
    const icMode = document.getElementById("icMode");
    const body = document.body;
    if (mode.dataset.mode == LIGHT_MODE) {
      icMode.src = "/random-english-day/icons/dark_mode.svg";
      body.style.backgroundImage = "url('/random-english-day/images/background/light.jpg')";
      mode.dataset.mode = DARK_MODE;

    } else {
      icMode.src = "/random-english-day/icons/light_mode.svg";
      body.style.backgroundImage = "url('/random-english-day/images/background/dark.jpg')";
      mode.dataset.mode = LIGHT_MODE;
    }
  });
}
