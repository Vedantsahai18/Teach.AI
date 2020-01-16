const video = document.getElementById('video')
Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
  get: function () {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  }
})

async function Setup() {
  console.log("Setup Started")
  console.log("Video Player 2Loaded")

  video.srcObject = await navigator.mediaDevices.getUserMedia(
    { video: true, audio: false },
  )
  console.log("Video Player Loaded")

  await HumanPoseEstimationSetup(video)
  console.log("Human Pose Estimation Setup Completed")
  await FaceDetectionSetup()
  console.log("Face Detection Setup completed")
  HeadGazeSetup(video)
  console.log("Head Gaze Setup completed")

  setInterval(async () => {
    if (video.playing) {
      const currentTime = new Date();
      const timestamp = currentTime.getUTCMinutes();

      const faceout = await DetectAllFaces(video, timestamp);
      console.log("faceout", faceout);
      const poses = HumanPoseEstimate(poseNet, timestamp);
      console.log("poses", poses);

      // Head Gaze Requires Current Raw Pose
      const raw_poses = HumanPoseEstimatorRawPose();
      const head_gaze = HeadGazeDetector(raw_poses, timestamp)
      console.log("head_gaze", head_gaze);
    }
  }, 3000)

}
Setup().then(() => console.log("Script Setup Models Loaded"))
