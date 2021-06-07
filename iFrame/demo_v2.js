
var u = navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

if (isiOS) {
    var console = {};
    console.log = function (message) {
        window.webkit.messageHandlers['console.log'].postMessage(message)
    }
}

var height = getQueryVariable('height');
if (height == false) {
    height = 280;
}
console.log('height = ' + height);

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        width: '100%',
        height: height,
        videoId: 'd0Zdar4SPhA',
        playerVars: {
            'autoplay': 1,
            'playsinline': 1,
            'enablejsapi': 1,
            'controls': 1,
            'background': 1,
            'loop': 1,
            'allowSeekAhead': 1,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError,
            'onApiChange': onPlayerApiChange
        }
    });
}

function onPlayerApiChange() {
    console.log('The player API changed');
    updateAll();
}

function onPlayerError(event) {
    console.log(event)
    updateAll();
}

function onPlayerReady(event) {
    console.log('onPlayerReady = ' + event);
    console.log(player);
    playVideo();
    updateAll();
}

var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
    // Get current state
    // Video has ended
    switch (event.data) {
        case YT.PlayerState.ENDED:
            updateAll() // set status for state, ...
            clearIntervals() // clear all intervals
            break;
        case YT.PlayerState.PLAYING:
            updateAll() // set status for state, ...
            setIntervals() // set intervals for ...
            break;
        case YT.PlayerState.PAUSED:
            updateAll() // set status for state, ...
            clearIntervals() // clear all intervals
            break;
        case YT.PlayerState.BUFFERING:
            updateAll() // set status for state, ...
            clearIntervals() // clear all intervals
            break;
        case YT.PlayerState.CUED:
            updateAll() // set status for state, ...
            clearIntervals() // clear all intervals
            break;
        default:
            updateAll() // set status for state, ...
            clearIntervals() // clear all intervals
            break;

    }
    console.log('onPlayerStateChange' + '>>>> ' + event.data);
    if (isiOS) {
        window.webkit.messageHandlers['audioControl'].postMessage(JSON.stringify(event.data))
    }
    updateAll();
}

function update(node) {
    switch (node) {
        case "status":
            var state = player.getPlayerState()
            switch (state) {
                case YT.PlayerState.ENDED:
                    status = "ENDED";
                    break;
                case YT.PlayerState.PLAYING:
                    status = "PLAYING";
                    break;
                case YT.PlayerState.PAUSED:
                    status = "PAUSED";
                    break;
                case YT.PlayerState.BUFFERING:
                    status = "BUFFERING";
                    break;
                case YT.PlayerState.CUED:
                    status = "CUED";
                    break;
                default:
                    status = "UNKNOWN";
                    break;
            }
            console.log('state ' + state);
            break;
    }
}

// Array to track all HTML nodes
var nodeList = [
    "duration",
    "url",
    "embedCode",
    "percentLoaded",
    "status",
    "currentTime",
    "volume",
    "mute",
    "quality",
    "rate",
    "title",
    "author",
    "video_id",
];

function updateAll() {
    for (var node in nodeList) {
        update(nodeList[node]);
    }
};

function seekTo(startSeconds) {
    console.log('seekTo')
    console.log(startSeconds)
    player.seekTo(startSeconds, true)
}

function loadNewVideo(videoID) {
    console.log('loadNewVideo' + '>>>> ' + videoID)
    player.loadNewVideo(videoID)
}

function stopVideo() {
    console.log('js-stop')
    player.pauseVideo();
}

function pauseVideo() {
    console.log('js-pause')
    player.pauseVideo();
}

function playVideo() {
    console.log('playVideo')
    player.playVideo()
}

function getVideoInfo() {
    var duration = player.getDuration();
    var current = player.getCurrentTime();
    var info = {
        "current": current,
        "duration": duration,
    }
    if (isiOS) {
        window.webkit.messageHandlers['time'].postMessage(JSON.stringify(info))
    }
    return info
}

function getQueryVariable(arg) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == arg) {
            return pair[1];
        }
    }
    return (false);
}

// Controls interval handlers to update page contens
// Array to track intervals
var activeIntervals = [];

function setIntervals() {
    // Sets invertval funtions to actively update page content
    activeIntervals[0] = setInterval(function () { update("percentLoaded") }, 500);
    activeIntervals[1] = setInterval(function () { update("currentTime") }, 500);
    activeIntervals[2] = setInterval(function () { update("mute") }, 500);
    activeIntervals[3] = setInterval(function () { update("volume") }, 500);
};

function clearIntervals() {
    // Clears existing intervals to actively update page content
    for (var interval in activeIntervals) {
        clearInterval(interval);
    }
};