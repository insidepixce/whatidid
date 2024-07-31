// 폼 제출 이벤트 리스너 추가 
document.getElementById('boardForm').addEventListener('submit', function(event) {
    //폼 제출 기본 동작 막기 
    event.preventDefault();
    // 제목과 내용 변수에 저장
    const title = document.getElementById('boardTitle').value; //제목저장
    const content = document.getElementById('boardContent').value; //내요용저장
    //게시물 생성 API 요청
    fetch('/api/board', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
    })
    .then(response => response.json())
    .then(data => {
        
        displayEntries();//새로운 게시물들을 포함한 목록을 갱신
        document.getElementById('boardForm').reset(); //입력폼을 초기화
    })
    .catch(error => console.error('Error:', error));
});

//게시물 목록을 화면에 표시하는 함수 
function displayEntries() {
    fetch('/api/board')
        .then(response => response.json())
        .then(entries => {
            const boardList = document.getElementById('boardList');
            boardList.innerHTML = ''; //기존 목록 초기화
            entries.forEach(entry => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${entry.title}</strong> ${entry.content} <button onclick="editEntry('${entry._id}')">Edit</button> <button onclick="deleteEntry('${entry._id}')">Delete</button>`;
                boardList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
}


//게시물 삭제 함수 
function deleteEntry(id) {
    fetch(`/api/board/${id}`, {
        method: 'DELETE',
    }) //게시물 삭제 API 요청 
    .then(response => response.json())
    .then(data => {
        displayEntries();//삭제된 게시물을 반영한 총 게시물 목록 갱신 
    })
    .catch(error => console.error('Error:', error));
}

//게시물 수정 함수 
function editEntry(id) {
    fetch(`/api/board/${id}`)
        .then(response => response.json())
        .then(entry => {
            document.getElementById('boardTitle').value = entry.title; //폼에 제목 채우기 
            document.getElementById('boardContent').value = entry.content; //폼에 내용 채우기 
            deleteEntry(id); //기존 게시물 삭제 
        })
        .catch(error => console.error('Error:', error));
}

displayEntries(); //페이지 로드시 자동적으로 게시물 목록 표시 
