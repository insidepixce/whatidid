let timer;
let running = false;
let time = 0;
let deleteLogId = null;  // 삭제할 로그 ID 저장

// 시작/정지 버튼 클릭 이벤트 핸들러
document.addEventListener('DOMContentLoaded', (event) => {
    const startStopButton = document.getElementById('startStopButton');
    const logButton = document.getElementById('logButton');
    const saveButton = document.getElementById('saveButton');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');

    if (startStopButton) {
        startStopButton.addEventListener('click', () => {
            if (running) {
                clearInterval(timer);  // 타이머 정지
                startStopButton.textContent = 'Start';  // 버튼 텍스트 변경
            } else {
                timer = setInterval(() => {
                    time++;
                    document.getElementById('timer').textContent = new Date(time * 1000).toISOString().substr(11, 8);  // 시간 업데이트
                }, 1000);  // 1초마다 업데이트
                startStopButton.textContent = 'Stop';  // 버튼 텍스트 변경
            }
            running = !running;  // 상태 변경
        });
    }

    if (logButton) {
        logButton.addEventListener('click', () => {
            if (!running && time > 0) {
                const memoInput = prompt("Enter a memo for this log:");
                const formData = new FormData();
                formData.append('logEntry', time);
                formData.append('memo', memoInput);
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.onchange = () => {
                    formData.append('image', fileInput.files[0]);
                    fetch('/api/stopwatch/log', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        displayLogEntries();
                    })
                    .catch(error => console.error('Error:', error));
                };
                fileInput.click();
            }
        });
    }

    if (saveButton) {
        saveButton.addEventListener('click', () => {
            if (!running && time > 0) {
                fetch('/api/stopwatch/log', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ logEntry: time })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    displayLogEntries();
                })
                .catch(error => console.error('Error:', error));
            }
        });
    }

    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', () => {
            deleteLog();
        });
    }

    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', () => {
            document.getElementById('deleteConfirmBox').style.display = 'none';
        });
    }

    // 페이지 로드 시 로그 엔트리 표시
    displayLogEntries();
});

// 로그 시간과 현재 시간을 표시하는 함수
function displayLogEntries() {
    fetch('/api/stopwatch/log')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
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
                        <input type="text" class="memoInput" placeholder="Enter memo" value="${entry.memo || ''}">
                        <button onclick="updateMemo('${entry._id}', this.previousElementSibling.value)">Update Memo</button>
                        <button onclick="deleteMemo('${entry._id}')">Delete Memo</button>
                        <button onclick="confirmDeleteLog('${entry._id}')">Delete Log</button>
                        ${entry.image ? `<img src="/uploads/${entry.image}" alt="Log image" width="100">` : ''}
                    `;
                    logList.appendChild(listItem);
                });
            } else {
                console.error('Error: entries is not an array');
            }
        })
        .catch(error => console.error('Error:', error));
}

// 메모 업데이트 함수
function updateMemo(logId, memo) {
    fetch(`/api/stopwatch/log/${logId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memo })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('네트워크 서버가 안좋아요 !');
        }
        return response.json();
    })
    .then(data => {
        console.log('Memo updated:', data);
        displayLogEntries();
    })
    .catch(error => console.error('Error:', error));
}

// 메모 삭제 함수
function deleteMemo(logId) {
    fetch(`/api/stopwatch/log/${logId}/memo`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Memo deleted:', data);
        displayLogEntries();  // 메모 삭제 후 로그 목록 갱신
    })
    .catch(error => console.error('Error:', error));
}

// 로그 삭제 확인 함수
function confirmDeleteLog(logId) {
    deleteLogId = logId;
    document.getElementById('deleteConfirmBox').style.display = 'flex';
}

// 로그 삭제 함수
function deleteLog() {
    fetch(`/api/stopwatch/log/${deleteLogId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Log deleted:', data);
        document.getElementById('deleteConfirmBox').style.display = 'none';
        displayLogEntries();  // 로그 삭제 후 로그 목록 갱신
    })
    .catch(error => console.error('Error:', error));
}
