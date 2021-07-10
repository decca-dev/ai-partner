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
        tr.id = "resp-r";
        const td1 = document.createElement('td');
        td1.id = "resp-trigger";
        td1.appendChild(document.createTextNode(resp.trigger));
        tr.appendChild(td1);
        const td2 = document.createElement('td');
        td2.id = "resp-resp";
        td2.appendChild(document.createTextNode(resp.response));
        tr.appendChild(td2);
        const delBtn = document.createElement('button');
        delBtn.id = "delete";
        delBtn.appendChild(document.createTextNode('X'));
        delBtn.classList.add('btn');
        delBtn.classList.add('btn-danger');
        delBtn.classList.add('ml-3');
        td2.appendChild(delBtn)
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

    let payWithoutTheLoad = [];

    for (let i = 0; i < responses.length; i++) {
        payWithoutTheLoad.push(responses[i])
    }

    payWithoutTheLoad.push({
        trigger: inputTrigger.value,
        response: inputResp.value,
    })

    let payload = {
        name: data.name,
        gender: data.gender,
        age: data.age,
        username: data.username,
        responses: payWithoutTheLoad
    }

    localStorage.setItem('data', JSON.stringify(payload))

    const tbody = document.querySelector('#t-body')

    const tr = document.createElement('tr');
    tr.id = "resp-r";
    const td1 = document.createElement('td');
    td1.id = "resp-trigger";
    td1.appendChild(document.createTextNode(inputTrigger.value));
    tr.appendChild(td1);
    const td2 = document.createElement('td');
    td2.id = "resp-resp";
    td2.appendChild(document.createTextNode(inputResp.value));
    tr.appendChild(td2);
    const delBtn = document.createElement('button');
    delBtn.id = "delete";
    delBtn.appendChild(document.createTextNode('X'));
    delBtn.classList.add('btn');
    delBtn.classList.add('btn-danger');
    delBtn.classList.add('ml-3');
    td2.appendChild(delBtn)
    tbody.appendChild(tr);

    inputTrigger.value = "";
    inputResp.value = "";
})

// Delete responses

const delBtn = document.querySelectorAll('#delete');

try {
    for (let i = 0; i < delBtn.length; i++) {
        delBtn[i].addEventListener('click', () => {
            const row = delBtn[i].parentElement.parentElement;
            document.querySelector('#t-body').removeChild(row);
        
            let rData = {
                trigger: document.querySelectorAll('#resp-trigger')[i].innerHTML,
                response: delBtn[i].parentElement.innerHTML,
            }
        
            let newD = responses.slice(rData, 0);
        
            let payload = {
                name: data.name,
                gender: data.gender,
                age: data.age,
                username: data.username,
                responses: newD
            }
        
            localStorage.setItem('data', JSON.stringify(payload));
        })
    }
        
} catch (e) {
    errorsDiv.innerHTML = genError('bruh')    
}

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
    await readOutloud(transcript)
}

button.addEventListener('click', () => {
    recognition.start()
})

// Reading messages

async function readOutloud(message){
    const speech = new SpeechSynthesisUtterance(message);

    if (responses.length > 0) {
        responses.forEach((resp) => {
            if (message.toLowerCase().includes(resp.trigger.toLowerCase())) {
                const finalText = resp.response;
                speech.text = finalText;
            }
        })
    }else {
        const response = await fetch(`https://api.monkedev.com/fun/chat?msg=${encodeURIComponent(message)}`)
        const d = await response.json()
        console.log(d.response);
        speech.text = d.response;
    }

    speech.volume = 10;
    speech.rate = 1;
    speech.pitch = 1;

    speechSynthesis.speak(speech);
}

function deletePartner(){
    if (localStorage.getItem('data')) localStorage.clear();
    return location.href = "./index.html"
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