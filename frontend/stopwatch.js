let timer; //타이머 인터벌을 저장할 변수 
let startTime; // 타이머 시작 시간을 저장할 변수 
let elapsedTime = 0;
let isRunning = false;

document.getElementById('startStopButton').addEventListener('click', function() {
    if (isRunning) { //타이머가 실행 중일 때 
        clearInterval(timer); //타이머 정지 
        isRunning = false;//타이머 상태 변경
        document.getElementById('startStopButton').innerText = 'Start';
    } else { //타이머가 실행중이지 않을때 
        startTime = Date.now() - elapsedTime; // 시작 시간을 설정
        timer = setInterval(updateTimer, 1000); //타이머 시작
        isRunning = true;//타이머 상태 변경
        document.getElementById('startStopButton').innerText = 'Stop'; //버튼 텍스트 변경 
    }
});

//저장 버튼 클릭 이벤트 리스너 
document.getElementById('logButton').addEventListener('click', function() {
    const logEntry = elapsedTime; //총 경과 시간을 저장 
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
        alert('총 시간이 저장되었습니다!');//저장 완료 알람 
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
