const video = document.getElementById('video')
  Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
  get: function(){
      return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  }
})
async function Setup() {
  console.log("55 15")
  HumanPoseEstimationSetup(video)
  console.log("55 55")
  await SetupFaceDetection()
  console.log("ss")
  video.srcObject = await navigator.mediaDevices.getUserMedia(
    { video: true, audio: false },
  )

  console.log("s1s")
  // document.body.append(canvas)
  // const displaySize = { width: video.width, height: video.height }
  // faceapi.matchDimensions(canvas, displaySize)

  setInterval(async ()=>{
    if(video.playing){
      const faceout = await DetectAllFaces(video, 0);
      console.log("44", faceout);
      const poses = Ml5GotPoses(poseNet);
      console.log("27", poses);
    }
  },5000)

}
Setup().then(()=>console.log("s2s"))
