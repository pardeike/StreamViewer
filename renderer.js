var options = {
  width: 1342,
  height: 754,
  channel: "robbaz",
  transparent: true,
  allowfullscreen: true,
  layout: "video",
  muted: true
}
var player = new Twitch.Embed("twitch", options)

// player.addEventListener(Twitch.Embed.VIDEO_READY, function () {
//   console.log('The video is ready')
// })
//
// player.addEventListener(Twitch.Embed.VIDEO_PLAY, function () {
//   console.log('The video is playing')
// })

var currentStreamer = ''

function handleErrors(response) {
  if (!response.ok) {
    window.location.reload()
    return
  }
  return response.json()
}

async function setStreamerId() {
  try {
    await fetch(`https://frontend.rimionship.com/api/showstream/0/0?handler=Streamer`, {
      method: "get"
    })
      .then(response => handleErrors(response))
      .then(async (data) => {
        if (currentStreamer !== data.streamer) {
          currentStreamer = data.streamer
          player.setChannel(currentStreamer)
          player.setQuality('chunked')
          document.getElementById('streamer').innerHTML = currentStreamer
        }
      })
  } catch (e) {
    console.log(e.message)
    debugger
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function run() {
  while (true) {
    await sleep(1000)
    await setStreamerId()
  }
}

run().then(_ => { })