

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

var player;
// Callback for when the YouTube iFrame player is ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    // Set Player height and width
    width: '100%',
    height: height,
    // Set the id of the video to be played
    videoId: 'd0Zdar4SPhA',
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
  if (isiOS) {
    window.webkit.messageHandlers['audioControl'].postMessage(JSON.stringify(event.data))
  }
};

// Update HTML nodes on the page
// with most recent values from
// the YouTube iFrame API
function update(node) {
  switch (node) {
    // Update player reported changes
    case "duration":
      // document.getElementById("duration").innerHTML = player.getDuration() + "s";
      console.log(player.getDuration())
      break;
    case "url":
      var url = player.getVideoUrl();
      //document.getElementById("url").innerHTML = "<a href=\"" + url + "\" target=\"_blank\">" + url + "</a>";
      console.log(url)
      break;
    case "embedCode":
      // var embedCode = player.getVideoEmbedCode();
      // var index = Math.ceil(embedCode.length / 3);
      // var fmtEmbedCode = [embedCode.slice(0, index), "\n", embedCode.slice(index, index * 2), "\n", embedCode.slice(index * 2)].join('');
      // document.getElementById("embedCode").innerText = fmtEmbedCode
      console.log('fmtEmbedCode')
      break;
    case "percentLoaded":
      var text = player.getVideoLoadedFraction() * 100 + "%"
      console.log(text)
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
      console.log(text)
      break;
    case "currentTime":
      var currentTime = player.getCurrentTime() + "s"
      console.log(currentTime)
      break;
    case "volume":
      var volume = player.getVolume()
      console.log(volume)
      break;
    case "mute":
      var mute = player.isMuted()
      console.log(mute)
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
      // var quality = player.getPlaybackQuality()
      console.log('quality')
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
      // var rate = player.getPlaybackRate()
      console.log('rate')
      break;
    case "title":
      var title = player.getVideoData()["title"]
      console.log(title)
      break;
    case "author":
      var author = player.getVideoData()["author"]
      console.log(author)
      break;
    case "video_id":
      var video_id = player.getVideoData()["video_id"]
      console.log(video_id)
      break;
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
function cueNewVideo() {
  player.cueVideoById(document.getElementById("video_idOption").value);
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
function seekTo() {
  player.seekTo(document.getElementById("currentTimeOption").value);
};
function setVolume() {
  player.setVolume(document.getElementById("volumeOption").value);
};
function mute() {
  player.mute();
};
function unmute() {
  player.unMute();
};
function setQuality() {
  player.setPlaybackQuality(document.getElementById("qualityOption").value);
};
function setRate() {
  player.setPlaybackRate(document.getElementById("rateOption").value);
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