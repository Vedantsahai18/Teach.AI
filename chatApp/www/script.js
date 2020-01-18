
Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
  get: function () {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  }
})

// Change to Link from Database
const FACE_URI = "/api/face-img";
const MODEL_HTTP_URL = '/models/model.json'
const MODEL_INDEXEDDB_URL = 'indexeddb://attention-model';

async function Setup() {
  console.log("Setup Started")

  const webCam = document.getElementById('video')
  webCam.srcObject = await GetWebCam()
  console.log("Video Player Loaded")

  // Gets the Current Face of the User
  // const currentFace = await (await fetch(FACE_URI)).text()
  // Convert Face to Face Matcher
  // const curentFaceMatcher = await FaceRecognitionGetMatcherFromImage(currentFace)

  const PoseNet = await HumanPoseEstimationSetup(webCam)
  console.log("Human Pose Estimation Setup Completed")
  await FaceDetectionSetup()
  console.log("Face Detection Setup completed")
  const TFModel = await TFModelSetup(MODEL_HTTP_URL,MODEL_INDEXEDDB_URL)
  console.log("TF Model Setup Setup completed")

  setInterval(async () => {
    if (webCam.playing) {
      console.log("Is Video Playing?", webCam.playing);
      const timestamp = TimeStamp();
      const faceouts = await DetectAllFaces(webCam, timestamp);
      console.log("faceouts", faceouts);
      if (faceouts.length === 0)
        return;

      // FaceRecognition(webCam, currentFaceMatcher)

      const poses = await HumanPoseEstimate(PoseNet, webCam, timestamp);
      console.log("poses", poses);
      if (poses.length === 0)
        return;
      const prediction = await TFModelPredict(TFModel, faceouts[0], poses[0])
      console.log(prediction)
    }
  }, 3000)
}

Setup().then(() => console.log("Script Setup Models Loaded"))
