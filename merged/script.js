
Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
  get: function () {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  }
})

async function Setup() {
  console.log("Setup Started")

  const webCam = document.getElementById('video')
  webCam.srcObject = await GetWebCam()
  console.log("Video Player Loaded")

  PoseNet = await HumanPoseEstimationSetup(webCam)
  console.log("Human Pose Estimation Setup Completed")
  await FaceDetectionSetup()
  console.log("Face Detection Setup completed")
  console.log("Head Gaze Setup completed")

  Worker worker = new Worker(async () => {
    console.log("Is Video Playing?", webCam.playing);
    if (webCam.playing) {
      const currentTime = new Date();
      const timestamp = currentTime.getUTCMinutes();

      const faceout = await DetectAllFaces(webCam, timestamp);
      console.log("faceout", faceout);
      const poses = await HumanPoseEstimate(PoseNet, webCam, timestamp);
      console.log("poses", poses);
    }
  });

}
Setup().then(() => console.log("Script Setup Models Loaded"))
