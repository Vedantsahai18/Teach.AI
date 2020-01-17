
Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
  get: function () {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  }
})

async function Setup() {
  console.log("Setup Started")

  const webCam = document.getElementById('video')
  console.log("Video Player Loaded")

  const PoseNet = await HumanPoseEstimationSetup(webCam)
  console.log("Human Pose Estimation Setup Completed")
  await FaceDetectionSetup()
  console.log("Face Detection Setup completed")

  webCam.srcObject = await GetWebCam()
  setInterval(async () => {
    console.log("Is Video Playing?", webCam.playing);
    if (webCam.playing) {
      const currentTime = new Date();
      const timestamp = currentTime.getUTCMinutes();

      const faceout = await DetectAllFaces(webCam, timestamp);
      console.log("faceout", faceout);
      const poses = await HumanPoseEstimate(PoseNet, webCam, timestamp);
      console.log("poses", poses);
    }
  }, 3000)

}
Setup().then(() => console.log("Script Setup Models Loaded"))
