import {
    config
} from './config.js';

import {
    loadMusicToTmp
} from './tmp_music.js';

import {
    getUrlParam
} from './package.js';

document.addEventListener("DOMContentLoaded", async () => {
    const path = document.location.pathname;
    console.log('Path = ', path);
    const pathWoParams = path.split('?')[0];
    if (pathWoParams != '/gallery' && pathWoParams != '/gallery.html') {
        console.log('Not in gallery page, skip.');
        return;
    }

    console.log('In function \'DOMContentLoaded\'')
    
    // 检查是否存在认证令牌
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        // 用户已登录，可以执行相关操作，例如显示用户信息或访问受限资源
        console.log('User is logged in');
    } else {
        // 用户未登录，重定向到登录页面
        console.log('User is not logged in');
        window.location.href = '/login';
    }

    const searchInput = getUrlParam('search');
    if (searchInput) {
        initSearchBar();
        await loadSearchedWorks(searchInput);
    } else {
        initSearchBar();
        createScrollingBoard();
        const musicDescs = await getWorks();
        initScrollingBoard(musicDescs);
        initWorks(musicDescs);
    }
});

function initSearchBar() {
    const searchBtn = document.getElementById('search-button');

    searchBtn.addEventListener('click', () => {
        // Get the search input value
        const searchInput = document.getElementById('search-input').value.trim();

        // console.log(searchInput)

        if (searchInput) {
            // Construct the search query URL
            const searchUrl = `/gallery?search=${searchInput}`;

            // Redirect the user to the search page
            window.location.href = searchUrl;
        }
    });
}

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

        // 监听作品元素的点击事件
        swiperSlide.addEventListener('click', async () => {
            try {
                const fileId = musicDesc.fileId;

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
                const tmpMusicId = loadMusicToTmp(music, fileId);

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
    
    const swiper = new Swiper('.swiper-container', {
        loop: true, // Enable loop mode
        autoplay: {
          delay: 2000, // Adjust autoplay delay as needed
        //   disableOnInteraction: false // Continue autoplay even when user interacts with the slider
        },
        effect: 'cube',
        mousewheel: {
            invert: false,
        },
        grabCursor: true
    });
}

async function initWorks(musicDescs) {
    const works = document.querySelector('.works');
    
    // 添加所有作品
    musicDescs.forEach(musicDesc => {
        // 创建作品元素
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

        // 监听作品元素的点击事件
        work.addEventListener('click', async () => {
            try {
                const fileId = musicDesc.fileId;

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
                const tmpMusicId = loadMusicToTmp(music, fileId);

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

    // 添加所有作品
    data.musicDescs.forEach(musicDesc => {
        // 创建作品元素
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

        // 监听作品元素的点击事件
        work.addEventListener('click', async () => {
            try {
                const fileId = musicDesc.fileId;

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
                const tmpMusicId = loadMusicToTmp(music, fileId);

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
