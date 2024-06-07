import {
    config
} from './config.js';

import {
    loadMusicToTmp
} from './tmp_music.js';

import {
    getUrlParam
} from './package.js';

import {
    Swiper
} from './lib/swiper-bundle.min.js';

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
    const path = document.location.pathname;
    console.log('Path = ', path);
    const pathWoParams = path.split('?')[0];
    if (pathWoParams != '/gallery' && pathWoParams != '/gallery.html') {
        console.log('Not in gallery page, skip.');
        return;
    }

    console.log('In function \'DOMContentLoaded\'')
    
    // Check token
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        console.log('User is logged in');
    } else {
        // Redirect to login page
        console.log('User is not logged in');
        window.location.href = '/login';
    }

    const searchInput = getUrlParam('search');
    if (searchInput) {
        // Show searching results
        initSearchBar();
        await loadSearchedWorks(searchInput);
    } else {
        // Initialize gallery content
        initSearchBar();
        createScrollingBoard();
        const musicDescs = await getWorks();
        try {
            initScrollingBoard(musicDescs);
        } catch(error) {
            console.log('Error initing scrolling board:', error);
        }
        initWorks(musicDescs);
    }
});

// Initialize search bar
function initSearchBar() {
    const searchBtn = document.getElementById('search-button');

    searchBtn.addEventListener('click', () => {
        // Get the search input value
        const searchInput = document.getElementById('search-input').value.trim();

        if (searchInput) {
            // Construct the search query URL
            const searchUrl = `/gallery?search=${searchInput}`;

            // Redirect the user to the search page
            window.location.href = searchUrl;
        }
    });
}

// Create blank scrolling board
function createScrollingBoard() {
    const content = document.getElementById('content');

    // Create the scrolling board elements
    const scrollingBoard = document.createElement('div');
    scrollingBoard.classList.add('scrolling-board');

    const swiperContainer = document.createElement('div');
    swiperContainer.classList.add('swiper-container');

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');

    // Append the elements in the correct hierarchy
    swiperContainer.appendChild(swiperWrapper);
    scrollingBoard.appendChild(swiperContainer);

    // Insert the scrolling board before the works section
    const works = document.querySelector('.works');
    content.insertBefore(scrollingBoard, works);
}

// Fetch all music description files from backend server
async function getWorks() {
    try {
        const response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/gallery`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('Receiving response:', data);

        return data.musicDescs;
    } catch (error) {
        console.error('Error getting works:', error);

        return null;
    }
}

// Initialize scrolling board content
function initScrollingBoard(musicDescs) {
    // Get the swiper wrapper element
    const swiperWrapper = document.querySelector('.swiper-wrapper');

    // Loop through the image URLs and create swiper slides
    musicDescs.forEach(musicDesc => {
        // Create a swiper slide
        const swiperSlide = document.createElement('div');
        swiperSlide.classList.add('swiper-slide');
        swiperWrapper.appendChild(swiperSlide);

        // Create the slide content container
        const slideContent = document.createElement('div');
        slideContent.classList.add('slide-content');
        swiperSlide.appendChild(slideContent);

        // Create and append the file name element
        const fileName = document.createElement('div');
        fileName.className = 'music-name';
        fileName.textContent = musicDesc.fileName;
        slideContent.appendChild(fileName);
        
        // Create and append the author element
        const author = document.createElement('div');
        author.className = 'author';
        author.textContent = musicDesc.uid;
        slideContent.appendChild(author);

        // When clicking a work element
        swiperSlide.addEventListener('click', async () => {
            try {
                const fileId = musicDesc.fileId;
                const uid = musicDesc.uid;

                // Fetch music from database
                const response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/file/fetch`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fileId })
                });
                    
                const data = await response.json();
                console.log('Receiving response:', data);

                const music = data.music;

                // Load music to TmpMusic
                const tmpMusicId = loadMusicToTmp(music, fileId, uid);

                // Switch to edit page
                window.location.href = '/edit?tmpMusicId=' + String(tmpMusicId);
            } catch (error) {
                console.error('Error fetching file:', error);
            }
        });

        // When clicking author name
        author.addEventListener('click', (event) => {
            event.stopPropagation();
            window.location.href = '/home?uid=' + musicDesc.uid;
        });
    });
    
    const swiper = new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
          delay: 2000
        },
        effect: 'cube',
        mousewheel: {
            invert: false,
        },
        grabCursor: true
    });
}

// Initialize all works
async function initWorks(musicDescs) {
    const works = document.querySelector('.works');
    
    // Add work elements
    musicDescs.forEach(musicDesc => {
        // Create work element
        const work = document.createElement('div');
        work.classList.add('work');
        works.appendChild(work);

        // Create and append the file name element
        const fileName = document.createElement('div');
        fileName.className = 'music-name';
        fileName.textContent = musicDesc.fileName;
        work.appendChild(fileName);
        
        // Create and append the author element
        const author = document.createElement('div');
        author.className = 'author';
        author.textContent = musicDesc.uid;
        work.appendChild(author);

        // When clicking the work element
        work.addEventListener('click', async () => {
            try {
                const fileId = musicDesc.fileId;
                const uid = musicDesc.uid;

                // Fetch music from database
                const response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/file/fetch`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fileId })
                });
                    
                const data = await response.json();
                console.log('Receiving response:', data);

                const music = data.music;

                // Load music to TmpMusic
                const tmpMusicId = loadMusicToTmp(music, fileId, uid);

                // Switch to edit page
                window.location.href = '/edit?tmpMusicId=' + String(tmpMusicId);
            } catch (error) {
                console.error('Error fetching file:', error);
            }
        });

        author.addEventListener('click', (event) => {
            event.stopPropagation();
            window.location.href = '/home?uid=' + musicDesc.uid;
        });
    });

    works.querySelectorAll('.work').forEach((work, index) => {
        setTimeout(() => {
            work.style.animation = `bounceUp 1s ease-out forwards`;
        }, index * 200); // Delay each element by 200ms
    });
}

// Show searched results
async function loadSearchedWorks(searchInput) {
    const response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/gallery?search=${searchInput}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    console.log('Receiving response:', data);

    const works = document.querySelector('.works');

    // Add all works
    data.musicDescs.forEach(musicDesc => {
        // Create work element
        const work = document.createElement('div');
        work.classList.add('work');
        works.appendChild(work);

        // Create and append the file name element
        const fileName = document.createElement('div');
        fileName.className = 'music-name';
        fileName.textContent = musicDesc.fileName;
        work.appendChild(fileName);
        
        // Create and append the author element
        const author = document.createElement('div');
        author.className = 'author';
        author.textContent = musicDesc.uid;
        work.appendChild(author);

        // When clicking the work
        work.addEventListener('click', async () => {
            try {
                const fileId = musicDesc.fileId;
                const uid = musicDesc.uid;

                // Fetch music from database
                const response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/file/fetch`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fileId })
                });
                
                const data = await response.json();
                console.log('Receiving response:', data);

                const music = data.music;

                // Load music to TmpMusic
                const tmpMusicId = loadMusicToTmp(music, fileId, uid);

                // Switch to edit page
                window.location.href = '/edit?tmpMusicId=' + String(tmpMusicId);
            } catch (error) {
                console.error('Error fetching file:', error);
            }
        });

        author.addEventListener('click', (event) => {
            event.stopPropagation();
            window.location.href = '/home?uid=' + musicDesc.uid;
        });
    });

    works.querySelectorAll('.work').forEach((work, index) => {
        setTimeout(() => {
            work.style.animation = `bounceUp 1s ease-out forwards`;
        }, index * 200); // Delay each element by 200ms
    });
}
