setTimeout(() => {
    $(document).ready(function () {
        //Preloader
        preloaderFadeOutTime = 550;
        function hidePreloader() {
            var preloader = $('.spinner-wrapper');
            preloader.fadeOut(preloaderFadeOutTime);
        }
        hidePreloader();
    });
}, 2000);


