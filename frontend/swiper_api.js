const swiper = new Swiper('.swiper-container', {
    // Basic parameters
    direction: 'horizontal', // 'horizontal' or 'vertical'
    loop: false, // Enable/disable continuous loop mode
    initialSlide: 0, // Index number of initial slide
    speed: 300, // Transition speed in ms
    
    // Autoplay
    autoplay: {
      delay: 3000, // Delay between transitions in ms
      disableOnInteraction: true, // Disable autoplay after user interactions
    },
    
    // Navigation
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    
    // Pagination
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets', // 'bullets', 'fraction', 'progressbar'
      clickable: true, // Make pagination bullets clickable
    },
    
    // Scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
      hide: false,
    },
    
    // Space between slides
    spaceBetween: 30, // Space between slides in px
    
    // Number of slides per view
    slidesPerView: 1, // Number of slides to show at the same time
    centeredSlides: false, // Center the active slide
    
    // Free mode
    freeMode: false, // Enable free mode
    
    // Effect
    effect: 'slide', // 'slide', 'fade', 'cube', 'coverflow', 'flip'
    fadeEffect: {
      crossFade: true,
    },
    
    // Responsive breakpoints
    breakpoints: {
      // When window width is >= 640px
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      // When window width is >= 768px
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
    
    // Lazy loading
    lazy: {
      loadPrevNext: true,
    },
    
    // Keyboard control
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    
    // Mousewheel control
    mousewheel: {
      invert: false,
    },
    
    // Hash navigation
    hashNavigation: {
      watchState: true,
    },
    
    // Zoom
    zoom: {
      maxRatio: 2,
      minRatio: 1,
    },
    
    // Virtual slides
    virtual: {
      slides: (function () {
        const slides = [];
        for (let i = 0; i < 600; i += 1) {
          slides.push(`Slide ${i + 1}`);
        }
        return slides;
      }()),
    },
    
    // Watch slides progress
    watchSlidesProgress: true,
    
    // Watch slides visibility
    watchSlidesVisibility: true,
    
    // Slide to clicked slide
    slideToClickedSlide: true,
    
    // Grab cursor
    grabCursor: true,
    
    // Slides grid
    slidesPerColumn: 1,
    slidesPerColumnFill: 'column', // 'column' or 'row'
    
    // Set wrapper size
    setWrapperSize: false,
    
    // Auto height
    autoHeight: false,
    
    // Swiping / no swiping
    allowSlideNext: true,
    allowSlidePrev: true,
    allowTouchMove: true,
    
    // Touch ratio
    touchRatio: 1,
    
    // Touch angle
    touchAngle: 45,
    
    // Simulate touch
    simulateTouch: true,
    
    // Short swipes
    shortSwipes: true,
    
    // Long swipes
    longSwipes: true,
    
    // Long swipes ratio
    longSwipesRatio: 0.5,
    
    // Follow finger
    followFinger: true,
    
    // Threshold
    threshold: 0,
    
    // Touch move stop propagation
    touchMoveStopPropagation: true,
    
    // Unique navigation elements
    uniqueNavElements: true,
    
    // Resistance
    resistance: true,
    resistanceRatio: 0.85,
    
    // Prevent interaction on transition
    preventInteractionOnTransition: false,
    
    // Swiping
    noSwiping: true,
    noSwipingClass: 'swiper-no-swiping',
    
    // Passive listeners
    passiveListeners: true,
    
    // Container modifier class
    containerModifierClass: 'swiper-container-', // Container modifier class
    
    // Slide class
    slideClass: 'swiper-slide', // Default slide class
    
    // Slide active class
    slideActiveClass: 'swiper-slide-active', // Default slide active class
    
    // Slide visible class
    slideVisibleClass: 'swiper-slide-visible', // Default slide visible class
    
    // Slide duplicate class
    slideDuplicateClass: 'swiper-slide-duplicate', // Default slide duplicate class
    
    // Slide next class
    slideNextClass: 'swiper-slide-next', // Default slide next class
    
    // Slide prev class
    slidePrevClass: 'swiper-slide-prev', // Default slide prev class
    
    // Notification class
    notificationClass: 'swiper-notification', // Default notification class
    
    // Lazy loading class
    lazyLoadingClass: 'swiper-lazy', // Default lazy loading class
    
    // Preloader class
    preloaderClass: 'swiper-lazy-preloader', // Default preloader class
    
    // Zoom container class
    zoomContainerClass: 'swiper-zoom-container', // Default zoom container class
    
    // Notification
    notificationClass: 'swiper-notification', // Notification class
    
    // Backface hidden fix
    runCallbacksOnInit: true,
    preloadImages: true,
    updateOnImagesReady: true,
    observer: false,
    observeParents: false,
    observeSlideChildren: false,
    
    // CSS Mode
    cssMode: false,
    
    // Centered Slides
    centeredSlidesBounds: false,
    
    // Slide to clicked slide
    slideToClickedSlide: false,
    
    // Loop Additional Slides
    loopAdditionalSlides: 0,
    
    // Loop Fill Group with Blank
    loopFillGroupWithBlank: false,
    
    // Looped Slides
    loopedSlides: null,
    
    // Loop Prevents Sliding
    loopPreventsSliding: true,
    
    // Nested
    nested: false,
    
    // Create Elements
    createElements: false,
    
    // Enabled
    enabled: true,
    
    // Grab Cursor
    grabCursor: false,
    
    // Hash Navigation
    hashNavigation: false,
    
    // History
    history: false,
    
    // Load on Demand
    loadOnDemand: false,
    
    // Lazy Load
    lazyLoad: false,
    
    // Mousewheel
    mousewheel: false,
    
    // Navigation
    navigation: false,
    
    // Pagination
    pagination: false,
    
    // Parallax
    parallax: false,
    
    // Resistance
    resistance: false,
    
    // Scrollbar
    scrollbar: false,
    
    // Slide To Clicked Slide
    slideToClickedSlide: false,
    
    // Space Between
    spaceBetween: 0,
    
    // Speed
    speed: 300,
    
    // Swiping
    swiping: true,
    
    // Threshold
    threshold: 0,
    
    // Thumbs
    thumbs: false,
    
    // Virtual
    virtual: false,
    
    // Virtual Translate
    virtualTranslate: false,
    
    // Watch Overflow
    watchOverflow: true,
    
    // Zoom
    zoom: false,
  });
  