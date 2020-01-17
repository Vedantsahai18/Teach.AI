const video = document.getElementById('video')
let PoseNet = null;

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
  get: function () {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  }
})

async function Setup() {
  console.log("Setup Started")

  console.log(video)
  video.srcObject = await navigator.mediaDevices.getUserMedia(
    { video: true, audio: false },
  )
  console.log("Video Player Loaded")

  PoseNet = await HumanPoseEstimationSetup(video)
  console.log("Human Pose Estimation Setup Completed")
  await FaceDetectionSetup()
  console.log("Face Detection Setup completed")
  console.log("Head Gaze Setup completed")

  setInterval(async () => {
    if (video.playing) {
      const currentTime = new Date();
      const timestamp = currentTime.getUTCMinutes();

      const faceout = await DetectAllFaces(video, timestamp);
      console.log("faceout", faceout);
      const poses = await HumanPoseEstimate(PoseNet, video, timestamp);
      console.log("poses", poses);
    }
  }, 3000)

}
Setup().then(() => console.log("Script Setup Models Loaded"))
