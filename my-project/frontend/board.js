document.getElementById('boardForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('boardTitle').value;
    const content = document.getElementById('boardContent').value;

    fetch('/api/board', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
    })
    .then(response => response.json())
    .then(data => {
        displayEntries();
        document.getElementById('boardForm').reset();
    })
    .catch(error => console.error('Error:', error));
});

function displayEntries() {
    fetch('/api/board')
        .then(response => response.json())
        .then(entries => {
            const boardList = document.getElementById('boardList');
            boardList.innerHTML = '';
            entries.forEach(entry => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${entry.title}</strong> ${entry.content} <button onclick="editEntry('${entry._id}')">Edit</button> <button onclick="deleteEntry('${entry._id}')">Delete</button>`;
                boardList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
}

function deleteEntry(id) {
    fetch(`/api/board/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        displayEntries();
    })
    .catch(error => console.error('Error:', error));
}

function editEntry(id) {
    fetch(`/api/board/${id}`)
        .then(response => response.json())
        .then(entry => {
            document.getElementById('boardTitle').value = entry.title;
            document.getElementById('boardContent').value = entry.content;
            deleteEntry(id);
        })
        .catch(error => console.error('Error:', error));
}

displayEntries();
