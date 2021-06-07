
function stopVideo() {
    console.log('js-stop')
    //player.stopVideo();
    callPlayer('stopVideo')
}

function pauseVideo() {
    console.log('js-pause')
    //    player.pauseVideo();
    callPlayer('pauseVideo')
}

function playVideo() {
    console.log('js-playVideo')
    callPlayer('playVideo')
}

function loadNewVideo(videoID) {
    console.log('js-loadNewVideo')
    console.log(videoID)
    callPlayer('loadVideoById', videoID);
};

function nextVideo() {
    //    player.nextVideo();
    callPlayer('nextVideo')
}

function previousVideo() {
    //    player.previousVideo();
    callPlayer('previousVideo')
}

function callPlayer(func, args) {
    var i = 0,
        iframes = document.getElementsByTagName('iframe'),
        src = '';
    for (i = 0; i < iframes.length; i += 1) {
        src = iframes[i].getAttribute('src');
        if (src && src.indexOf('youtube.com/embed') !== -1) {
            iframes[i].contentWindow.postMessage(JSON.stringify({
                'event': 'command',
                'func': func,
                'args': args || []
            }), '*');
        }
    }
}
