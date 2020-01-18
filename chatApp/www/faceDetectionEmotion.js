function FaceDetectionSetup() {
  return Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ])
}

function DetectAllFaceDescriptionWithLandmarksAndDescription(img) {
  return faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
}
function DetectSingleFaceDescriptionWithLandmarksAndDescription(img) {
  return faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
}

async function DetectAllFaces(input, timestamp) {
  const raw_faceouts = await DetectAllFaceDescriptionWithLandmarksAndDescription(input);
  let faceouts = []
  let numPersons = raw_faceouts.length
  for (let i = 0; i < numPersons; i++) {
    if (!isNaN(raw_faceouts[i].alignedRect._box.x)) {
      const item = {
        // ...detections[i].alignedRect._box,
        ...raw_faceouts[i].alignedRect._box,
        ...raw_faceouts[i].expressions,
        timestamp: timestamp,
        numPerson: numPersons,
        personId: i,
        headPose: HeadGazeDetect(raw_faceouts[i])
      }
      faceouts.push(item)
    }

  }

  return [faceouts, raw_faceouts]
}

async function FaceRecognitionGetMatcherFromImage(userFace, max_face_distance_euclidean = 0.6) {
  const userFaceDescription = await DetectSingleFaceDescriptionWithLandmarksAndDescription(userFace)
  return FaceRecognitionWithDescription(userFaceDescription, max_face_distance_euclidean);
}
function FaceRecognitionGetMatcherFromDescription(userFaceDescription, max_face_distance_euclidean = 0.6) {
  const userFaceMatcher = new faceapi.FaceMatcher(userFaceDescription, max_face_distance_euclidean);
  return userFaceMatcher;
}

async function FaceRecognition(input, userFaceMatcher) {
  const inputFaceDescriptions = await DetectAllFaceDescriptionWithLandmarksAndDescription(input)
  for (const fd of inputFaceDescriptions) {
    const bestMatch = userFaceMatcher.findBestMatch(fd.descriptor)
    console.log(bestMatch.toString())
  }
}