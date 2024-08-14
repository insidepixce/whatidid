document.getElementById('photoPostForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const file = document.getElementById('photoPostImage').files[0];
    const comment = document.getElementById('photoPostComment').value;

    const reader = new FileReader();
    reader.onload = function(event) {
        fetch('/api/photoPost', {
            method: 'POST',//
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: event.target.result, comment }),
        })
        .then(response => response.json())
        .then(data => {
            if (!response.ok) {
                throw new Error(data.error || 'Unknown error');
            }
            displayPhotos();
            document.getElementById('photoPostForm').reset();
            alert('Photo post created successfully!');
        })
        .catch(error => alert('Error: ' + error.message));
    };

    reader.readAsDataURL(file);
});

function displayPhotos() {
    fetch('/api/photoPost')
        .then(response => response.json())
        .then(posts => {
            if (!response.ok) {
                throw new Error(posts.error || 'Unknown error');
            }
            const photoPostGrid = document.getElementById('photoPostGrid');
            photoPostGrid.innerHTML = '';
            posts.forEach(post => {
                const div = document.createElement('div');
                div.classList.add('col-md-4');
                div.innerHTML = `
                    <div class="card mb-4">
                        <img src="${post.image}" class="card-img-top" alt="Photo">
                        <div class="card-body">
                            <p class="card-text">${post.comment}</p>
                        </div>
                    </div>
                `;
                photoPostGrid.appendChild(div);
            });
        })
        .catch(error => alert('Error: ' + error.message));
}

displayPhotos();
