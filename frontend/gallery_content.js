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
        initScrollingBoard();
        await initWorks();
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

    const swiperButtonNext = document.createElement('div');
    swiperButtonNext.classList.add('swiper-button-next');

    const swiperButtonPrev = document.createElement('div');
    swiperButtonPrev.classList.add('swiper-button-prev');

    // Append the elements in the correct hierarchy
    swiperContainer.appendChild(swiperWrapper);
    swiperContainer.appendChild(swiperButtonNext);
    swiperContainer.appendChild(swiperButtonPrev);
    scrollingBoard.appendChild(swiperContainer);

    // Insert the scrolling board before the works section
    const works = document.querySelector('.works');
    content.insertBefore(scrollingBoard, works);
}

function initScrollingBoard() {
    // Get the swiper wrapper element
    const swiperWrapper = document.querySelector('.swiper-wrapper');

    // Define an array of image URLs
    const imageUrls = [
        'resource/image/test.jpg',
        'resource/image/test.jpg',
        'resource/image/test.jpg',
        'resource/image/test.jpg',
        'resource/image/test.jpg'
    ];

    // Loop through the image URLs and create swiper slides
    imageUrls.forEach((imageUrl, index) => {
        // Create a swiper slide
        const swiperSlide = document.createElement('div');
        swiperSlide.classList.add('swiper-slide');

        // Create an image element
        // const img = document.createElement('img');
        // img.src = imageUrl;
        // img.alt = `Image ${index + 1}`;
        swiperSlide.textContent = String(index);

        // Append the image to the swiper slide
        // swiperSlide.appendChild(img);

        // Append the swiper slide to the swiper wrapper
        swiperWrapper.appendChild(swiperSlide);
    });

    
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 3, // Display 3 slides at a time
        centeredSlides: true, // Center the active slide
        loop: true, // Enable loop mode
        spaceBetween: 20,
        autoplay: {
          delay: 2000, // Adjust autoplay delay as needed
        //   disableOnInteraction: false // Continue autoplay even when user interacts with the slider
        },
        navigation: {
            nextEl: '.swiper-button-next', // CSS class or DOM element for the next button
            prevEl: '.swiper-button-prev', // CSS class or DOM element for the previous button
        },
      });

    // swiper.update();
}

async function initWorks() {
    const works = document.querySelector('.works');

    try {
        const response = await fetch(`http://${config.online ? config.onlineIP : config.offlineIP}:3333/gallery`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('Receiving response:', data);

        // 添加所有作品
        data.musicDescs.forEach(musicDesc => {
            // 创建作品元素
            const work = document.createElement('div');
            work.classList.add('work');
            work.textContent = musicDesc.fileName;

            // 将作品元素添加到作品区域的最后
            works.appendChild(work);

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
        });
    } catch (error) {
        console.error('Error initializing home:', error);
    }
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
        work.textContent = musicDesc.fileName;

        // 将作品元素添加到作品区域的最后
        works.appendChild(work);

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
    });
}
