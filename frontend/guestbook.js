document.getElementById('guestbookForm').addEventListener('submit', function(event) {
    event.preventDefault();//폼 제출 기본 동작을 막음

    const name = document.getElementById('guestbookName').value;//이름 저장
    const message = document.getElementById('guestbookMessage').value;//메시지 저장 

    fetch('/api/guestbook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, message }),
    })
    .then(response => response.json())
    .then(data => {
        displayEntries(); //방명록 목록 갱신
        document.getElementById('guestbookForm').reset();//폼 초기화
    })
    .catch(error => console.error('Error:', error));
});

function displayEntries() {
    fetch('/api/guestbook')
        .then(response => response.json())
        .then(entries => {
            const guestbookList = document.getElementById('guestbookList');
            guestbookList.innerHTML = '';
            entries.forEach(entry => {
                const listItem = document.createElement('li'); //기존 목록 초기화
                listItem.innerHTML = `<strong>${entry.name}:</strong> ${entry.message} <button onclick="deleteEntry('${entry._id}')">Delete</button>`;
                guestbookList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
}

function deleteEntry(id) {
    fetch(`/api/guestbook/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        displayEntries();//방명록 목록 갱신
    })
    .catch(error => console.error('Error:', error));
}

displayEntries();// 페이지 로드 시 기존 방명록 목록 표시



