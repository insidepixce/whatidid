document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('logModal');
    const openModalButton = document.getElementById('openModalButton');
    const closeModalSpan = document.querySelector('.close');
    const logForm = document.getElementById('logForm');
    let deleteLogId = null; // deleteLogId 초기화

    // 모달 열기
    openModalButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // 모달 닫기
    closeModalSpan.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 폼 제출 처리
    logForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(logForm);

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
            console.log('Log created successfully', data);
            modal.style.display = 'none';
            logForm.reset();
            displayLogEntries(); // 새로운 로그를 표시하는 함수 호출
        })
        .catch(error => console.error('Error:', error));
    });

    // 로그 항목 선택 시 deleteLogId 설정
    document.querySelectorAll('.delete-log-button').forEach(button => {
        button.addEventListener('click', () => {
            deleteLogId = button.getAttribute('data-log-id'); // 버튼에 설정된 로그 ID를 가져옴
            console.log(`deleteLogId set to: ${deleteLogId}`); // 설정된 deleteLogId 값 로그 출력
            document.getElementById('deleteConfirmBox').style.display = 'block'; // 확인 박스 표시
        });
    });

    // 삭제 확인 버튼 클릭 시 삭제 요청
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
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
});

function displayLogEntries() {
    // 서버로부터 모든 로그를 가져와서 표시하는 함수
    fetch('/api/stopwatch/log')
        .then(response => response.json())
        .then(logs => {
            const logContainer = document.getElementById('logContainer');
            logContainer.innerHTML = ''; // 기존 로그를 지우고 새로 로드
            logs.forEach(log => {
                const logElement = document.createElement('div');
                logElement.classList.add('log-entry');
                logElement.innerHTML = `
                    <h3>${log.title}</h3>
                    <p>${log.logEntry}</p>
                    <p>${log.memo}</p>
                    ${log.image ? `<img src="/uploads/${log.image}" alt="Log Image" />` : ''}
                    <button class="delete-log-button" data-log-id="${log._id}">Delete</button>
                `;
                logContainer.appendChild(logElement);
            });
        })
        .catch(error => console.error('Error:', error));
}
