window.onload = () => {
    if (!localStorage.getItem('data')) {
        return location.href = "./index.html"
    }
}

const body = document.querySelector('#partner-body');
const button = document.querySelector('#talk');
const content = document.querySelector('#content');

const data = JSON.parse(localStorage.getItem('data'));

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

function readOutloud(message){
    const speech = new SpeechSynthesisUtterance();

    speech.text = "Excuse me babe?";

    if (message.includes('penis')) {
        const finalText = "You have a very big pp";
        speech.text = finalText;
    }
    
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    speechSynthesis.speak(speech);
}