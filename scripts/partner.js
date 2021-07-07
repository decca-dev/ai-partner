// Checking if the user already made a artner before

window.onload = () => {
    if (!localStorage.getItem('data')) {
        return location.href = "./index.html"
    }
}

// changing the elements dynamically using data from localStorage

const body = document.querySelector('#partner-body');
const button = document.querySelector('#talk');
const content = document.querySelector('#content');
const errorsDiv = document.querySelector('#errors');

const data = JSON.parse(localStorage.getItem('data'));
const responses = data.responses;

document.title = `Talk to ${data.name}`;
button.innerHTML = `Talk to ${data.name}`;

if (data.gender === "male") {
    body.classList.add('bg-gradient-to-r');
    body.classList.add('from-green-400');
    body.classList.add('to-blue-500');
}else {
    body.classList.add('bg-gradient-to-r');
    body.classList.add('from-purple-400');
    body.classList.add('via-pink-500');
    body.classList.add('to-red-500');
}

if (responses.length > 0) {
    const tbody = document.querySelector('#t-body')
    responses.forEach((resp) => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.scope = 'row';
        th.id = "resp-num";
        tr.appendChild(th);
        const td1 = document.createElement('td');
        td1.id = "resp-trigger";
        td1.appendChild(document.createTextNode(resp.trigger));
        tr.appendChild(td1);
        const td2 = document.createElement('td');
        td2.id = "resp-resp";
        td2.appendChild(document.createTextNode(resp.response));
        tr.appendChild(td2);
        tbody.appendChild(tr);
    })
}

// Adding responses

const inputTrigger = document.querySelector('#trigger');
const inputResp = document.querySelector('#response');
const addBtn = document.querySelector('#add');

addBtn.addEventListener('click', () => {
    if (inputTrigger.value === "" || inputResp.value === "") {
        return errorsDiv.innerHTML = genError('Please fill in all fields before adding.')
    }

    let payload = {
        name: data.name,
        gender: data.gender,
        age: data.age,
        username: data.username,
        responses: null,
    }

    if (responses.length > 0) {
        payload.responses = [
            responses,
            {
                trigger: inputTrigger.value,
                response: inputResp.value,
            }
        ]
    }else {
        payload.responses = [
            {
                trigger: inputTrigger.value,
                response: inputResp.value,
            }
        ]
    }

    localStorage.setItem('data', JSON.stringify(payload))

    const tbody = document.querySelector('#t-body')

    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.scope = 'row';
    th.id = "resp-num";
    tr.appendChild(th);
    const td1 = document.createElement('td');
    td1.id = "resp-trigger";
    td1.appendChild(document.createTextNode(inputTrigger.value));
    tr.appendChild(td1);
    const td2 = document.createElement('td');
    td2.id = "resp-resp";
    td2.appendChild(document.createTextNode(inputResp.value));
    tr.appendChild(td2);
    tbody.appendChild(tr);
})

// Speech logic

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
    content.textContent = "";
}

recognition.onresult = async (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;
    readOutloud(transcript)
}

button.addEventListener('click', () => {
    recognition.start()
})

// Reading messages

function readOutloud(message){
    const speech = new SpeechSynthesisUtterance();

    speech.text = "Excuse me babe?";

    if (message.includes('hello') || message.includes('hi')) {
        const finalText = "How are you doing babe?";
        speech.text = finalText;
    };

    if (responses.length > 0) {
        responses.forEach((resp) => {
            if (message.includes(resp.trigger)) {
                const finalText = resp.response;
                speech.text = finalText;
            }
        })
    }
    
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    speechSynthesis.speak(speech);
}

//Utility functions

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