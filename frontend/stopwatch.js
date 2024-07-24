let timer;
let running = false;
let time = 0;

// 시작/정지 버튼 클릭 이벤트 핸들러
document.getElementById('startStopButton').addEventListener('click', () => {
    if (running) {
        clearInterval(timer);  // 타이머 정지
        document.getElementById('startStopButton').textContent = 'Start';  // 버튼 텍스트 변경
    } else {
        timer = setInterval(() => {
            time++;
            document.getElementById('timer').textContent = new Date(time * 1000).toISOString().substr(11, 8);  // 시간 업데이트
        }, 1000);  // 1초마다 업데이트
        document.getElementById('startStopButton').textContent = 'Stop';  // 버튼 텍스트 변경
    }
    running = !running;  // 상태 변경
});

// 리셋 버튼 클릭 이벤트 핸들러
document.getElementById('resetButton').addEventListener('click', () => {
    clearInterval(timer);  // 타이머 정지
    running = false;
    time = 0;
    document.getElementById('timer').textContent = '00:00:00';  // 시간 초기화
    document.getElementById('startStopButton').textContent = 'Start';  // 버튼 텍스트 변경
});

// 저장 버튼 클릭 이벤트 핸들러
document.getElementById('saveButton').addEventListener('click', () => {
    if (!running && time > 0) {
        fetch('/api/stopwatch/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ logEntry: time }),  // 로그 데이터 전송
        })
        .then(response => response.json())
        .then(data => {
            const logDiv = document.createElement('div');
            const currentTime = new Date();
            logDiv.innerHTML = `
                <div>Logged time: ${new Date(time * 1000).toISOString().substr(11, 8)}</div>
                <div>Current time: ${currentTime.toISOString().substr(11, 8)}</div>
            `;  // 로그 표시
            document.getElementById('logs').appendChild(logDiv);  // 로그 추가
        })
        .catch(error => console.error('Error:', error));  // 오류 처리
    }
});

// 로그 시간과 현재 시간을 표시하는 함수
function displayLogEntries() {
    fetch('/api/stopwatch/log')
        .then(response => response.json())
        .then(entries => {
            if (Array.isArray(entries)) {
                const logList = document.getElementById('logList');
                logList.innerHTML = '';
                entries.forEach(entry => {
                    const logTime = new Date(entry.logEntry * 1000);  // 초 단위를 밀리초로 변환
                    const currentTime = new Date();  // 현재 시간
                    const hours = String(logTime.getUTCHours()).padStart(2, '0');
                    const minutes = String(logTime.getUTCMinutes()).padStart(2, '0');
                    const seconds = String(logTime.getUTCSeconds()).padStart(2, '0');
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <div>Log time: ${hours}:${minutes}:${seconds}</div>
                        <div>Current time: ${currentTime.toISOString().substr(11, 8)}</div>
                    `;
                    logList.appendChild(listItem);
                });
            } else {
                console.error('Error: entries is not an array');
            }
        })
        .catch(error => console.error('Error:', error));
}

// 메모 추가 버튼 클릭 이벤트 핸들러
document.getElementById('addMemoButton').addEventListener('click', () => {
    const memoInput = document.getElementById('memoInput');
    const memoText = memoInput.value.trim();
    if (memoText) {
        const logList = document.getElementById('logList');
        const listItem = document.createElement('li');
        listItem.innerText = `Memo: ${memoText}`;
        logList.appendChild(listItem);
        memoInput.value = '';  // 입력 필드 초기화
    } else {
        alert('Please enter a memo.');
    }
});

// 페이지 로드 시 로그 엔트리 표시
window.onload = () => {
    displayLogEntries();
};
