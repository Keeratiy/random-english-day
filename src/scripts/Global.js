import { Members, Topics } from "../config";
let member = [];

document.addEventListener("DOMContentLoaded", () => {
  addMember();
  changeStatusMember();
  randomTopicAndMember();

  for (const mem in Members) {
    member.push({ mem, ...Members[mem] });
  }
});

function addMember() {
  document.querySelector("#addMember").addEventListener("click", () => {
    let memberName = document.querySelector("#inputMember").value;

    if (memberName != "" && memberName != null && memberName != undefined) {
      let html = [];
      html.push(`<li class="flex items-center">`);
      html.push(`<label class="flex items-center cursor-pointer">`);
      html.push(`<input type="checkbox" class="hidden" id="${memberName}">`);
      html.push(
        `<div class="toggle w-12 h-6 bg-gray-200 rounded-full shadow-inner relative">`,
      );
      html.push(
        `<div class="dot w-6 h-6 bg-blue-500 rounded-full shadow-md absolute top-0 transition-transform duration-300 ease-in-out"></div>`,
      );
      html.push(`</div>`);
      html.push(
        `<span class="text-xl ml-3 text-gray-700">${memberName}</span>`,
      );
      html.push(`</label>`);
      html.push(`</li>`);

      let templateMember = document.querySelector("#templateMember");
      templateMember.insertAdjacentHTML("beforeend", html.join(""));
      document.querySelector("#inputMember").value = "";

      // Members[memberName] = { image: 'https://via.placeholder.com/60', isChecked: false };
      member.push({
        mem: memberName,
        image: "https://via.placeholder.com/60",
        isChecked: false,
      });

      changeStatusMember();
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
        let html = [];
        html.push(`<div class="flex flex-col items-center mx-2 mb-4">`);
        html.push(
          `<img src="${selectedMember[randomIndex].image}" alt="${selectedMember[randomIndex].mem}" class="rounded-full border-2 border-blue-500 mb-2 w-[100px] h-[100px]  " />`,
        );
        html.push(
          `<span class="text-black">${i + 1}. ${selectedMember[randomIndex].mem}</span>`,
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
