document.addEventListener('DOMContentLoaded', (event) => {
    const startStopButton = document.getElementById('startStopButton');
    const logButton = document.getElementById('logButton');
    const saveButton = document.getElementById('saveButton');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');

    let running = false;
    let timer;
    let elapsedTime = 0;
    let startTime;
    let deleteLogId = null;

    if (startStopButton) {
        startStopButton.addEventListener('click', () => {
            if (running) {
                clearInterval(timer);  
                elapsedTime += Date.now() - startTime;
                startStopButton.textContent = 'Start';
            } else {
                startTime = Date.now();
                timer = setInterval(() => {
                    const currentTime = Date.now();
                    const timeElapsed = elapsedTime + (currentTime - startTime);
                    const date = new Date(timeElapsed);
                    const formattedTime = date.toISOString().substr(11, 8);
                    document.getElementById('timer').textContent = `${date.toDateString()} ${formattedTime}`;
                }, 1000);  
                startStopButton.textContent = 'Stop';
            }
            running = !running;
        });
    }

    if (logButton) {
        logButton.addEventListener('click', () => {
            if (!running && elapsedTime > 0) {
                const memoInput = prompt("Enter a memo for this log:");
                const titleInput = prompt("Enter a title for this log:");
                const formData = new FormData();
                formData.append('logEntry', elapsedTime);
                formData.append('memo', memoInput);
                formData.append('title', titleInput);
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
            if (!running && elapsedTime > 0) {
                fetch('/api/stopwatch/log', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ logEntry: elapsedTime })
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
        console.log('Button found and event listener is being added.');
        confirmDeleteButton.addEventListener('click', () => {
            console.log('Button clicked'); // 클릭 이벤트가 발생하는지 확인
            if (deleteLogId) {
                console.log(`Attempting to delete log with id: ${deleteLogId}`); // deleteLogId 값 확인
                fetch(`/api/stopwatch/log/${deleteLogId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    console.log('Fetch response received'); // Fetch 응답이 도착했는지 확인
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Log deleted successfully', data); // 삭제 성공 메시지
                    document.getElementById('deleteConfirmBox').style.display = 'none';
                    deleteLogId = null;
                    displayLogEntries();
                })
                .catch(error => console.error('Error:', error));
            } else {
                console.error('deleteLogId is not set'); // deleteLogId가 설정되지 않은 경우 메시지 출력
            }
        });
    } else {
        console.error('Button not found'); // 버튼이 발견되지 않으면 이 메시지를 출력
    }
    

    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', () => {
            document.getElementById('deleteConfirmBox').style.display = 'none';
            deleteLogId = null;
        });
    }

    displayLogEntries();
});

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
                entries.forEach((entry, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${index + 1}</th>
                        <td><a href="/logDetail.html?id=${entry._id}">${entry.title || 'No Title'}</a></td>
                        <td>${new Date(entry.logEntry).toDateString()}</td>
                        <td>${new Date(entry.logEntry).toISOString().substr(11, 8)}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="confirmDeleteLog('${entry._id}')">Delete</button>
                        </td>
                    `;
                    logList.appendChild(row);
                });
            } else {
                console.error('Error: entries is not an array');
            }
        })
        .catch(error => console.error('Error:', error));
}

function confirmDeleteLog(logId) {
    deleteLogId = logId;
    document.getElementById('deleteConfirmBox').style.display = 'flex';
}
let deleteLogId = null; // deleteLogId 초기화

document.querySelectorAll('.delete-log-button').forEach(button => {
    button.addEventListener('click', () => {
        deleteLogId = button.getAttribute('data-log-id'); // 버튼에 설정된 로그 ID를 가져옴
        console.log(`deleteLogId set to: ${deleteLogId}`); // 설정된 deleteLogId 값 로그 출력
        document.getElementById('deleteConfirmBox').style.display = 'block'; // 확인 박스 표시
    });
});

// 삭제 확인 버튼 클릭 시 삭제 요청
if (confirmDeleteButton) {
    console.log('Button found and event listener is being added.');
    confirmDeleteButton.addEventListener('click', () => {
        console.log('Button clicked'); // 클릭 이벤트가 발생하는지 확인
        if (deleteLogId) {
            console.log(`Attempting to delete log with id: ${deleteLogId}`); // deleteLogId 값 확인
            fetch(`/api/stopwatch/log/${deleteLogId}`, {
                method: 'DELETE'
            })
            .then(response => {
                console.log('Fetch response received'); // Fetch 응답이 도착했는지 확인
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Log deleted successfully', data); // 삭제 성공 메시지
                document.getElementById('deleteConfirmBox').style.display = 'none';
                deleteLogId = null;
                displayLogEntries();
            })
            .catch(error => console.error('Error:', error));
        } else {
            console.error('deleteLogId is not set'); // deleteLogId가 설정되지 않은 경우 메시지 출력
        }
    });
} else {
    console.error('Button not found'); // 버튼이 발견되지 않으면 이 메시지를 출력
}