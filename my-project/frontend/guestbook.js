document.getElementById('guestbookForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('guestbookName').value;
    const message = document.getElementById('guestbookMessage').value;

    fetch('/api/guestbook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, message }),
    })
    .then(response => response.json())
    .then(data => {
        displayEntries();
        document.getElementById('guestbookForm').reset();
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
                const listItem = document.createElement('li');
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
        displayEntries();
    })
    .catch(error => console.error('Error:', error));
}

displayEntries();
