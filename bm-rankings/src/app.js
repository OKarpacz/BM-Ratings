const albums = [
    {
        id: 1,
        title: 'Album 1',
        artist: 'Artist 1',
        cover: './assets/images/cover1.jpg',
        description: 'Opis albumu 1.',
        tracklist: ['Utwór 1', 'Utwór 2', 'Utwór 3'],
        rating: 4.5,
    },
    {
        id: 2,
        title: 'Album 2',
        artist: 'Artist 2',
        cover: './assets/images/cover2.jpg',
        description: 'Opis albumu 2.',
        tracklist: ['Utwór A', 'Utwór B', 'Utwór C'],
        rating: 3.8,
    },
    {
        id: 3,
        title: 'Album 3',
        artist: 'Artist 3',
        cover: './assets/images/cover3.jpg',
        description: 'Opis albumu 3.',
        tracklist: ['Track X', 'Track Y', 'Track Z'],
        rating: 4.2,
    },
    {
        id: 4,
        title: 'Album 4',
        artist: 'Artist 4',
        cover: './assets/images/cover4.jpg',
        description: 'Opis albumu 4.',
        tracklist: ['Song 1', 'Song 2', 'Song 3'],
        rating: 3.5,
    },
    {
        id: 5,
        title: 'Album 5',
        artist: 'Artist 5',
        cover: './assets/images/cover5.jpg',
        description: 'Opis albumu 5.',
        tracklist: ['Piece A', 'Piece B', 'Piece C'],
        rating: 4.8,
    },
];

const comments = {
    1: [
        { user: 'User1', comment: 'Świetny album!', rating: 5 },
        { user: 'User2', comment: 'Nie podoba mi się.', rating: 2 },
        { user: 'User3', comment: 'Dobry, ale mógł być lepszy.', rating: 3 },
    ],
    2: [
        { user: 'User4', comment: 'Uwielbiam ten album!', rating: 5 },
        { user: 'User5', comment: 'Nie mój styl.', rating: 2 },
    ],
    3: [
        { user: 'User6', comment: 'Bardzo przyjemny do słuchania.', rating: 4 },
        { user: 'User7', comment: 'Średni, ale ma kilka dobrych utworów.', rating: 3 },
    ],
    4: [
        { user: 'User8', comment: 'Nie polecam.', rating: 1 },
        { user: 'User9', comment: 'Całkiem niezły.', rating: 3 },
    ],
    5: [
        { user: 'User10', comment: 'Arcydzieło!', rating: 5 },
        { user: 'User11', comment: 'Najlepszy album, jaki słyszałem.', rating: 5 },
        { user: 'User12', comment: 'Zasługuje na więcej uwagi.', rating: 4 },
    ],
};


const likes = {};
const dislikes = {};
const userActions = {};

function initApp() {
    renderAlbumList();
}

function handleRegister(event) {
    event.preventDefault();
    try {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        if (!username || !password) {
            throw new Error('Login i hasło są wymagane.');
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));

        console.log('Rejestracja zakończona sukcesem.');
    } catch (error) {
        console.error('Błąd podczas rejestracji:', error.message);
        alert('Wystąpił błąd: ' + error.message);
    }
}


function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((user) => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', username);
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        initApp();
    } else {
        alert('Nieprawidłowy login lub hasło.');
    }
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    document.getElementById('app').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
}

function showRegisterPage() {
    document.getElementById('register-page').style.display = 'block';
    document.getElementById('login-page').style.display = 'none';
}

function showLoginPage() {
    document.getElementById('register-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
}

function renderComments(albumId) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';

    const albumComments = comments[albumId] || [];
    albumComments.forEach((comment, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${comment.user}:</strong> ${comment.comment} (Ocena: ${comment.rating})
            <div>
                <button class="like-btn" data-album-id="${albumId}" data-comment-index="${index}">👍</button>
                <span class="like-counter" data-album-id="${albumId}" data-comment-index="${index}">👍 0</span>
                <button class="dislike-btn" data-album-id="${albumId}" data-comment-index="${index}">👎</button>
                <span class="dislike-counter" data-album-id="${albumId}" data-comment-index="${index}">👎 0</span>
            </div>
        `;
        commentsList.appendChild(li);
    });

    document.querySelectorAll('.like-btn').forEach((button) => {
        button.addEventListener('click', (event) => {
            const albumId = parseInt(event.target.dataset.albumId, 10);
            const commentIndex = parseInt(event.target.dataset.commentIndex, 10);
            handleLike(albumId, commentIndex);
        });
    });

    document.querySelectorAll('.dislike-btn').forEach((button) => {
        button.addEventListener('click', (event) => {
            const albumId = parseInt(event.target.dataset.albumId, 10);
            const commentIndex = parseInt(event.target.dataset.commentIndex, 10);
            handleDislike(albumId, commentIndex);
        });
    });
}

function showAlbumDetails(albumId) {
    const album = albums.find((a) => a.id === albumId);

    if (album) {
        document.getElementById('album-cover').src = album.cover;
        document.getElementById('album-title').textContent = album.title;
        document.getElementById('album-artist').textContent = `Artysta: ${album.artist}`;
        document.getElementById('album-description').textContent = album.description;
        document.getElementById('album-rating').textContent = album.rating;

        const tracklist = document.getElementById('album-tracklist');
        tracklist.innerHTML = '';
        album.tracklist.forEach((track) => {
            const li = document.createElement('li');
            li.textContent = track;
            tracklist.appendChild(li);
        });

        renderComments(albumId);

        const addCommentForm = document.getElementById('add-comment-form');
        addCommentForm.onsubmit = (event) => addComment(event, albumId);

        document.getElementById('profile-page').style.display = 'none';
        document.getElementById('ranking-page').style.display = 'none';
        document.getElementById('app').style.display = 'none';
        document.getElementById('album-details').style.display = 'block';
    }
}

function renderAlbumList() {
    const albumListContainer = document.getElementById('album-list');
    albumListContainer.innerHTML = '';

    albums.forEach((album) => {
        const albumCard = document.createElement('div');
        albumCard.classList.add('album-card');
        albumCard.innerHTML = `
            <img src="${album.cover}" alt="${album.title}" class="album-cover" />
            <h3>${album.title}</h3>
            <p>Artysta: ${album.artist}</p>
            <p>Opis: ${album.description}</p>
            <p>Ocena: ${album.rating}</p>
            <button class="view-details-btn" data-id="${album.id}">Szczegóły</button>
        `;
        albumListContainer.appendChild(albumCard);
    });

    document.querySelectorAll('.view-details-btn').forEach((button) => {
        button.addEventListener('click', (event) => {
            const albumId = parseInt(event.target.dataset.id, 10);
            showAlbumDetails(albumId);
        });
    });
}

function backToApp() {
    document.getElementById('album-details').style.display = 'none';
    document.getElementById('ranking-page').style.display = 'none';
    document.getElementById('profile-page').style.display = 'none';
    document.getElementById('add-page').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}

function renderRanking() {
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '';

    const sortedAlbums = [...albums].sort((a, b) => b.rating - a.rating);
    sortedAlbums.forEach((album) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${album.title}</strong> - Artysta: ${album.artist}, Ocena: ${album.rating}`;
        rankingList.appendChild(li);
    });
}

function showRankingPage() {
    renderRanking();
    document.getElementById('app').style.display = 'none';
    document.getElementById('ranking-page').style.display = 'block';
}

function renderProfile() {
    const reviewsList = document.getElementById('reviews-list');
    const favoritesList = document.getElementById('favorites-list');

    reviewsList.innerHTML = '';
    favoritesList.innerHTML = '';

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Musisz być zalogowany, aby zobaczyć profil.');
        return;
    }

    Object.entries(comments).forEach(([albumId, albumComments]) => {
        albumComments.forEach((comment) => {
            if (comment.user === currentUser) {
                const li = document.createElement('li');
                li.textContent = `Album ${albumId}: ${comment.comment} (Ocena: ${comment.rating})`;
                reviewsList.appendChild(li);
            }
        });
    });

    albums.forEach((album) => {
        if (album.rating > 4) {
            const li = document.createElement('li');
            li.textContent = `${album.title} - Artysta: ${album.artist}`;
            favoritesList.appendChild(li);
        }
    });
}

function showProfilePage() {
    renderProfile();
    document.getElementById('app').style.display = 'none';
    document.getElementById('profile-page').style.display = 'block';
}

function showAddPage() {
    document.getElementById('app').style.display = 'none';
    document.getElementById('add-page').style.display = 'block';
}

function handleAdd(event) {
    event.preventDefault();

    const title = document.getElementById('add-title').value;
    const artist = document.getElementById('add-artist').value;
    const cover = document.getElementById('add-cover').value;
    const description = document.getElementById('add-description').value;
    const rating = parseFloat(document.getElementById('add-rating').value);

    if (title && artist && cover && description && rating) {
        const newAlbum = {
            id: albums.length + 1,
            title,
            artist,
            cover,
            description,
            tracklist: [],
            rating,
        };

        albums.push(newAlbum);
        alert('Album/Zespół został zgłoszony!');
        document.getElementById('add-form').reset();
        backToApp();
        renderAlbumList();
    } else {
        alert('Proszę wypełnić wszystkie pola.');
    }
}

function addComment(event, albumId) {
    event.preventDefault();

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Musisz być zalogowany, aby dodać komentarz.');
        document.getElementById('album-details').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
        return;
    }

    const commentText = document.getElementById('comment-text').value;
    const commentRating = parseInt(document.getElementById('comment-rating').value, 10);

    if (commentText && commentRating) {
        const newComment = { user: currentUser, comment: commentText, rating: commentRating };

        if (!comments[albumId]) {
            comments[albumId] = [];
        }

        comments[albumId].push(newComment);
        alert('Komentarz został dodany!');
        renderComments(albumId);
        document.getElementById('add-comment-form').reset();
    } else {
        alert('Proszę wypełnić wszystkie pola.');
    }
}

function handleLike(albumId, commentIndex) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Musisz być zalogowany, aby polubić komentarz.');
        return;
    }

    if (!userActions[currentUser]) {
        userActions[currentUser] = { likes: {}, dislikes: {} };
    }

    if (userActions[currentUser].likes[`${albumId}-${commentIndex}`]) {
        alert('Już polubiłeś ten komentarz.');
        return;
    }

    if (userActions[currentUser].dislikes[`${albumId}-${commentIndex}`]) {
        alert('Nie możesz polubić komentarza, który już nie polubiłeś.');
        return;
    }

    if (!likes[albumId]) {
        likes[albumId] = {};
    }
    likes[albumId][commentIndex] = (likes[albumId][commentIndex] || 0) + 1;

    userActions[currentUser].likes[`${albumId}-${commentIndex}`] = true;

    updateLikeDislikeCounters(albumId, commentIndex);
}

function handleDislike(albumId, commentIndex) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Musisz być zalogowany, aby nie polubić komentarza.');
        return;
    }

    if (!userActions[currentUser]) {
        userActions[currentUser] = { likes: {}, dislikes: {} };
    }

    if (userActions[currentUser].dislikes[`${albumId}-${commentIndex}`]) {
        alert('Już nie polubiłeś tego komentarza.');
        return;
    }

    if (userActions[currentUser].likes[`${albumId}-${commentIndex}`]) {
        alert('Nie możesz nie polubić komentarza, który już polubiłeś.');
        return;
    }

    if (!dislikes[albumId]) {
        dislikes[albumId] = {};
    }
    dislikes[albumId][commentIndex] = (dislikes[albumId][commentIndex] || 0) + 1;

    userActions[currentUser].dislikes[`${albumId}-${commentIndex}`] = true;

    updateLikeDislikeCounters(albumId, commentIndex);
}

function updateLikeDislikeCounters(albumId, commentIndex) {
    const likeCounter = document.querySelector(
        `.like-counter[data-album-id="${albumId}"][data-comment-index="${commentIndex}"]`
    );
    const dislikeCounter = document.querySelector(
        `.dislike-counter[data-album-id="${albumId}"][data-comment-index="${commentIndex}"]`
    );

    if (likeCounter) {
        likeCounter.textContent = `👍 ${likes[albumId]?.[commentIndex] || 0}`;
    }
    if (dislikeCounter) {
        dislikeCounter.textContent = `👎 ${dislikes[albumId]?.[commentIndex] || 0}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const goToRegister = document.getElementById('go-to-register');
    const goToLogin = document.getElementById('go-to-login');
    const logoutBtn = document.getElementById('logout-btn');
    const goToRanking = document.getElementById('go-to-ranking');
    const goToProfile = document.getElementById('go-to-profile');
    const goToAdd = document.getElementById('go-to-add');
    const addForm = document.getElementById('add-form');
    const backToAppFromAddBtn = document.getElementById('back-to-app-from-add');
    const backToAppFromProfileBtn = document.getElementById('back-to-app-from-profile');
    const backToAppFromRankingBtn = document.getElementById('back-to-app-from-ranking');
    const backToAppFromDetailsBtn = document.getElementById('back-to-app-from-details');

    registerForm.addEventListener('submit', handleRegister);
    loginForm.addEventListener('submit', handleLogin);
    goToRegister.addEventListener('click', showRegisterPage);
    goToLogin.addEventListener('click', showLoginPage);
    logoutBtn.addEventListener('click', handleLogout);
    goToRanking.addEventListener('click', showRankingPage);
    goToProfile.addEventListener('click', showProfilePage);
    goToAdd.addEventListener('click', showAddPage);
    addForm.addEventListener('submit', handleAdd);
    backToAppFromAddBtn.addEventListener('click', backToApp);
    backToAppFromProfileBtn.addEventListener('click', backToApp);
    backToAppFromRankingBtn.addEventListener('click', backToApp);
    backToAppFromDetailsBtn.addEventListener('click', backToApp);
});
