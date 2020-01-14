function SetupFaceDetection(){
  return Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ])
}

async function DetectAllFaces(input, timestamp) {
    const detections = await faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    let OUTPUT = []
    let numPersons = detections.length
    for (let i = 0; i < numPersons; i++) {
      if (!isNaN(detections[i].alignedRect._box.x)) {
        const item = {
          // ...detections[i].alignedRect._box,
          ...detections[i].alignedRect._box,
          ...detections[i].expressions,
          timestamp: timestamp,
          numPerson: numPersons,
          personId: i
        }
        OUTPUT.push(item)
      }
  
    }
  
    return OUTPUT
  }
  