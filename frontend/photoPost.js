document.getElementById('photoPostForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const file = document.getElementById('photoPostImage').files[0];
    const comment = document.getElementById('photoPostComment').value;

    const reader = new FileReader();
    reader.onload = function(event) {
        fetch('/api/photoPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: event.target.result, comment }),
        })
        .then(response => response.json())
        .then(data => {
            displayPhotos();
            document.getElementById('photoPostForm').reset();
        })
        .catch(error => console.error('Error:', error));
    };

    reader.readAsDataURL(file);
});

function displayPhotos() {
    fetch('/api/photoPost')
        .then(response => response.json())
        .then(posts => {
            const photoPostGrid = document.getElementById('photoPostGrid');
            photoPostGrid.innerHTML = '';
            posts.forEach(post => {
                const div = document.createElement('div');
                div.innerHTML = `<img src="${post.image}" alt="Photo" /><p>${post.comment}</p>`;
                photoPostGrid.appendChild(div);
            });
        })
        .catch(error => console.error('Error:', error));
}

displayPhotos();
