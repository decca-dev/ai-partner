window.addEventListener('load', () => {
    alert(9)
})

// if(localStorage.getItem('data')) {
//     location.href = './main.html'
// }
const form = document.querySelector('#create');
const errorsDiv = document.querySelector('#errors');

function genError(text){
    return `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
        ${text}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `
}

function genSuccess(text){
    return `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        ${text}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const genderSelect = document.querySelector('#gender');
    const selectedGender = genderSelect.options[genderSelect.selectedIndex].value;
    const nameEl = document.querySelector('#name');
    const ageEl = document.querySelector('#age');
    const usernameEl = document.querySelector('#username');

    if (selectedGender == "gender") {
        return errorsDiv.innerHTML = genError('Please select a valid gender.');
    }

    if (nameEl.value == "" || ageEl.value == "" || usernameEl.value == "") {
        return errorsDiv.innerHTML = genError('Please fill in all fields.');
    }
    
    let payload = {
        gender: selectedGender,
        name: nameEl.value,
        age: ageEl.value,
        username: usernameEl.value
    };

    const data = JSON.stringify(payload);

    localStorage.setItem('data', data);

})