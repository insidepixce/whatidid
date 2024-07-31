document.getElementById('guestbookForm').addEventListener('submit', function(event) {
    event.preventDefault();//폼 제출 기본 동작을 막음

    const name = document.getElementById('guestbookName').value;//이름 저장
    const message = document.getElementById('guestbookMessage').value;//메시지 저장 

    fetch('/api/guestbook', {
        //방명록 생성 API 요청하기 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',//json 형식으로 전송
        },
        body: JSON.stringify({ name, message }),//이름과 메시지를 json 형식으로 전송
    })
    .then(response => response.json())//응답을 json 형식으로 반환
    .then(data => {
        displayEntries(); //방명록 목록 갱신
        document.getElementById('guestbookForm').reset();//폼 초기화
    })
    .catch(error => console.error('Error:', error));//에러 발생시 에러 출력하기 
});

function displayEntries() { // 방명록 목록을 화면에 표시하는 함수 
    fetch('/api/guestbook') // 방명록 게시물 목록을 가져오는 API 요청 
        .then(response => response.json())//응답을 Json 형식으로 변환
        .then(entries => {
            const guestbookList = document.getElementById('guestbookList');
            guestbookList.innerHTML = '';//기존 목록 초기화 
            //: 새로운 방명록 항목들을 추가하기 전에 화면에 이미 표시된 기존 항목들을 제거하기 위해서. 
            //이래야 중복된 항목이 생기지 않고 항상 최신 상태의 방명록 목록이 화면에 표시됨 
            entries.forEach(entry => { //모든 방명록 항목들을 반복하며 화면에 표시 
                const listItem = document.createElement('li'); //기존 목록 초기화
                listItem.innerHTML = `<strong>${entry.name}:</strong> ${entry.message} <button onclick="deleteEntry('${entry._id}')">Delete</button>`;//방명록 항목을 리스트형식으로 변환하여 표시 
                guestbookList.appendChild(listItem);//화면에 방명록 항목들 표시 
            });
        })
        .catch(error => console.error('Error:', error));//에러시 에러 메세지 출력 
}

function deleteEntry(id) { //방명록 삭제 함수 
    fetch(`/api/guestbook/${id}`, { //방명록 삭제 api 요청 
        method: 'DELETE',
    })
    .then(response => response.json())//응답을 json 형식으로 반환
    .then(data => { //삭제된 방명록을 반영한 방명록 목록 갱신 
        displayEntries();//방명록 목록 갱신
    })
    .catch(error => console.error('Error:', error)); 
}

displayEntries();// 페이지 로드 시 기존 방명록 목록 표시



