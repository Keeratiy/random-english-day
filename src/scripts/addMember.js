document.querySelector('#addMember').addEventListener('click', () => {
    let memberName = document.querySelector('#inputMember').value;

    if (memberName != '' && memberName != null && memberName != undefined) {
        let html = [];
        html.push(`<li class="flex items-center">`);
        html.push(`<label class="flex items-center cursor-pointer">`);
        html.push(`<input type="checkbox" class="hidden" id="${memberName}">`);
        html.push(`<div class="toggle w-12 h-6 bg-gray-200 rounded-full shadow-inner relative">`);
        html.push(`<div class="dot w-6 h-6 bg-blue-500 rounded-full shadow-md absolute top-0 transition-transform duration-300 ease-in-out"></div>`);
        html.push(`</div>`);
        html.push(`<span class="text-xl ml-3 text-gray-700">${memberName}</span>`);
        html.push(`</label>`);
        html.push(`</li>`);

        let templateMember = document.querySelector('#templateMember');
        templateMember.insertAdjacentHTML('beforeend', html.join(''));
        document.querySelector('#inputMember').value = '';

        window.localStorage.setItem("newMember", memberName);
    }
    console.log(memberName)
});

document.querySelector('#btnResetMember').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // Check all checkboxes
    });
})