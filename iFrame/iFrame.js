
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
var autoplay = getQueryVariable('autoplay');
if (autoplay == false) {
  autoplay = 1;
}
var playsinline = getQueryVariable('playsinline');
if (playsinline == false) {
  playsinline = 1;
}
var enablejsapi = getQueryVariable('enablejsapi');
if (enablejsapi == false) {
  enablejsapi = 1;
}
var controls = getQueryVariable('controls');
if (controls == false) {
  controls = 1;
}
var background = getQueryVariable('background');
if (background == false) {
  background = 1;
}
var loop = getQueryVariable('loop');
if (loop == false) {
  loop = 1;
}
var allowSeekAhead = getQueryVariable('allowSeekAhead');
if (allowSeekAhead == false) {
  allowSeekAhead = 1;
}
var modestbranding = getQueryVariable('modestbranding');
if (modestbranding == false) {
  modestbranding = 1;
}
var videoID = getQueryVariable('videoID')
if (videoID == false) {
  videoID = 'd0Zdar4SPhA';
}

console.log('window url = ' + window.location.href);
console.log('window search = ' + window.location.search);

var player;
// Callback for when the YouTube iFrame player is ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    // Set Player height and width
    width: '100%',
    height: height,
    // Set the id of the video to be played
    videoId: videoID,
    playerVars: {
      'autoplay': autoplay,
      'playsinline': playsinline,
      'enablejsapi': enablejsapi,
      'controls': controls,
      'background': background,
      'loop': loop,
      'allowSeekAhead': allowSeekAhead,
      'modestbranding': modestbranding,
    },
    // Setup event handelers
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onPlaybackQualityChange': onPlaybackQualityChange,
      'onPlaybackRateChange': onPlaybackRateChange,
      'onError': onError,
      'onApiChange': onApiChange,
    }
  });
};

// Event Handlers 
function onPlaybackQualityChange() {
  // Update playback quality on page
  update("quality");
};
function onPlaybackRateChange() {
  // Update playback rate on page
  update("rate");
};
function onError(error) {
  // Update errors on page
  console.log("Error!");
};
function onApiChange(event) {
  // Update currently availbe APIs
  console.log("API Change!");
};
function onPlayerReady() {
  // Update page after player is ready
  updateAll();
  playVideo();
}

function onPlayerStateChange(event) {
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
};

// Update HTML nodes on the page
// with most recent values from
// the YouTube iFrame API
function update(node) {
  var params = {};
  switch (node) {
    // Update player reported changes
    case "duration":
      var duration = player.getDuration();
      // document.getElementById("duration").innerHTML = player.getDuration() + "s";
      console.log(duration)
      params['duration'] = duration;
      break;
    case "url":
      var url = player.getVideoUrl();
      //document.getElementById("url").innerHTML = "<a href=\"" + url + "\" target=\"_blank\">" + url + "</a>";
      console.log(url)
      params['url'] = url;
      break;
    case "embedCode":
      // var embedCode = player.getVideoEmbedCode();
      // var index = Math.ceil(embedCode.length / 3);
      // var fmtEmbedCode = [embedCode.slice(0, index), "\n", embedCode.slice(index, index * 2), "\n", embedCode.slice(index * 2)].join('');
      // document.getElementById("embedCode").innerText = fmtEmbedCode
      console.log('fmtEmbedCode')
      break;
    case "percentLoaded":
      var percentLoaded = player.getVideoLoadedFraction();
      var text = percentLoaded * 100 + "%"
      params['percentLoaded'] = percentLoaded;
      break;
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
      var text = 'status >>>>> ' + status + " (" + state + ")";
      params['status'] = status;
      params['state'] = state;
      break;
    case "currentTime":
      var currentTime = player.getCurrentTime();
      params['currentTime'] = currentTime;
      break;
    case "volume":
      var volume = player.getVolume()
      params['volume'] = volume;
      break;
    case "mute":
      var mute = player.isMuted()
      params['mute'] = mute;
      break;
    case "quality":
      // var availableQualityLevels = player.getAvailableQualityLevels()
      // var selectbox = document.getElementById('qualityOption');
      // //clear existing options
      // var i;
      // for (i = selectbox.options.length - 1; i >= 0; i--) {
      //   selectbox.remove(i);
      // }
      // //write current available options
      // for (var i in availableQualityLevels) {
      //   var opt = document.createElement("OPTION");
      //   opt.text = availableQualityLevels[i];
      //   opt.value = availableQualityLevels[i];
      //   selectbox.options.add(opt);
      // }
      var quality = player.getPlaybackQuality()
      params['quality'] = quality;
      break;
    case "rate":
      // var availableRates = player.getAvailablePlaybackRates()
      // var selectbox = document.getElementById('rateOption');
      // //clear existing options
      // var i;
      // for (i = selectbox.options.length - 1; i >= 0; i--) {
      //   selectbox.remove(i);
      // }
      // //write current available options
      // for (var i in availableRates) {
      //   var opt = document.createElement("OPTION");
      //   opt.text = availableRates[i];
      //   opt.value = availableRates[i];
      //   selectbox.options.add(opt);
      // }
      var rate = player.getPlaybackRate()
      params['rate'] = rate;
      break;
    case "title":
      var title = player.getVideoData()["title"]
      params['title'] = title;
      break;
    case "author":
      var author = player.getVideoData()["author"]
      console.log(author)
      break;
    case "video_id":
      var video_id = player.getVideoData()["video_id"]
      params['video_id'] = video_id;
      break;
  }
  var json = JSON.stringify(params);
  if (isiOS) {
    window.webkit.messageHandlers['audioControl'].postMessage(json)
  }
};
// Updates all HTML nodes
function updateAll() {
  for (var node in nodeList) {
    update(nodeList[node]);
  }
};
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

// Functions to invoke user requested action through the iFrame API
function loadNewVideo(videoID) {
  console.log(videoID)
  player.loadVideoById(videoID);
};
function cueNewVideo(option) {
  player.cueVideoById(option);
};
function playVideo() {
  player.playVideo();
};
function pauseVideo() {
  player.pauseVideo();
};
function stopVideo() {
  player.stopVideo();
};
function seekTo(position) {
  player.seekTo(position);
};
function setVolume(volume) {
  player.setVolume(volume);
};
function mute() {
  player.mute();
};
function unmute() {
  player.unMute();
};
function setQuality(quality) {
  player.setPlaybackQuality(quality);
};
function setRate(rate) {
  player.setPlaybackRate(rate);
};

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