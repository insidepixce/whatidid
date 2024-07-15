let timer;
let startTime;
let elapsedTime = 0;
let isRunning = false;

document.getElementById('startStopButton').addEventListener('click', function() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        document.getElementById('startStopButton').innerText = 'Start';
    } else {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(updateTimer, 1000);
        isRunning = true;
        document.getElementById('startStopButton').innerText = 'Stop';
    }
});

document.getElementById('logButton').addEventListener('click', function() {
    const logEntry = elapsedTime;
    fetch('/api/stopwatch/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logEntry }),
    })
    .then(response => response.json())
    .then(data => {
        displayLogEntries();
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('saveButton').addEventListener('click', function() {
    const totalTime = elapsedTime;
    fetch('/api/stopwatch/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ totalTime }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Total time saved!');
    })
    .catch(error => console.error('Error:', error));
});

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    const time = new Date(elapsedTime);
    const hours = String(time.getUTCHours()).padStart(2, '0');
    const minutes = String(time.getUTCMinutes()).padStart(2, '0');
    const seconds = String(time.getUTCSeconds()).padStart(2, '0');
    document.getElementById('timer').innerText = `${hours}:${minutes}:${seconds}`;
}

function displayLogEntries() {
    fetch('/api/stopwatch/log')
        .then(response => response.json())
        .then(entries => {
            const logList = document.getElementById('logList');
            logList.innerHTML = '';
            entries.forEach(entry => {
                const time = new Date(entry.logEntry);
                const hours = String(time.getUTCHours()).padStart(2, '0');
                const minutes = String(time.getUTCMinutes()).padStart(2, '0');
                const seconds = String(time.getUTCSeconds()).padStart(2, '0');
                const listItem = document.createElement('li');
                listItem.innerText = `${hours}:${minutes}:${seconds}`;
                logList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
}

function loadTimer() {
    fetch('/api/stopwatch/total')
        .then(response => response.json())
        .then(data => {
            if (data.totalTime) {
                elapsedTime = data.totalTime;
                startTime = Date.now() - elapsedTime;
                updateTimer();
            }
        })
        .catch(error => console.error('Error:', error));
}

window.onload = function() {
    loadTimer();
    displayLogEntries();
};
