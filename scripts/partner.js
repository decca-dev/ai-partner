const button = document.querySelector('.talk');
const content = document.querySelector('.content');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
    content.textContent = "";
}


recognition.onresult = (event) => {
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

    speech.text = "Excuse me babe?"

    if (message.includes('pp')) {
        const finalText = "You have a very big pp";
        speech.text = finalText;
    }
    
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}