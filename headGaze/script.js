const video = document.getElementById('app')

async function Setup() {
  function startVideo() {
    return navigator.mediaDevices.getUserMedia(
      { video: true, audio: false },
    )
  }

  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ])

  video.srcObject = await startVideo()

  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
}
// let str = []
// function arrayToCSV(objArray) {
//   if (objArray.length == 0) {
//     return;
//   }
//   const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
//   let head = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

//   return array.reduce((str, next) => {
//       str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';
//       return str;
//      }, str);
// }

async function DetectAllFaces(timestamp) {
  const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
  let OUTPUT = []
  let numPersons = detections.length
  for (let i = 0; i < numPersons; i++) {
    console.log(detections[i].expressions)
    if (!isNaN(detections[i].alignedRect._box.x)) {
      OUTPUT.push({
        ...detections[i].alignedRect._box,
        ...detections[i].alignedRect._box,
        ...detections[i].expressions,
        timestamp: timestamp,
        numPerson: numPersons,
        personId: i
      })
    }

  }

  return OUTPUT
}


abc = ["_x", "_y", "_width", "_height", "neutral", "happy", "sad", "angry", "fearful", "disgusted", "surprised", "timestamp", "numPerson", "personId"];
abc = abc + "\n"
video.onplay = () => {
  console.log("55");
}
    //console.log(OUTPUT)
    // if(abc !== undefined)
    //   abc += (arrayToCSV(OUTPUT));