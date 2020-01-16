// Based on python code provided in "Head Pose Estimation using OpenCV and Dlib"
//   https://www.learnopencv.com/head-pose-estimation-using-opencv-and-dlib/#code

// 3D model points
const numRows = 4;
const modelPoints = cv.matFromArray(numRows, 3, cv.CV_64FC1, [
  0.0,
  0.0,
  0.0, // Nose tip
  0.0,
  0.0,
  0.0, // HACK! solvePnP doesn't work with 3 points, so copied the
  //   first point to make the input 4 points
  // 0.0, -330.0, -65.0,  // Chin
  -225.0,
  170.0,
  -135.0, // Left eye left corner
  225.0,
  170.0,
  -135.0 // Right eye right corne
  // -150.0, -150.0, -125.0,  // Left Mouth corner
  // 150.0, -150.0, -125.0,  // Right mouth corner
]);
let cameraMatrix = null;

// Create Matrixes
const imagePoints = cv.Mat.zeros(numRows, 2, cv.CV_64FC1);
const distCoeffs = cv.Mat.zeros(4, 1, cv.CV_64FC1); // Assuming no lens distortion
const rvec = new cv.Mat({ width: 1, height: 3 }, cv.CV_64FC1);
const tvec = new cv.Mat({ width: 1, height: 3 }, cv.CV_64FC1);
const pointZ = cv.matFromArray(1, 3, cv.CV_64FC1, [0.0, 0.0, 500.0]);
const pointY = cv.matFromArray(1, 3, cv.CV_64FC1, [0.0, 500.0, 0.0]);
const pointX = cv.matFromArray(1, 3, cv.CV_64FC1, [500.0, 0.0, 0.0]);
const noseEndPoint2DZ = new cv.Mat();
const nose_end_point2DY = new cv.Mat();
const nose_end_point2DX = new cv.Mat();
const jaco = new cv.Mat();


function HeadGazeSetup(source) {
  const size = { width: source.width, height: source.height };
  const focalLength = size.width;
  const center = [size.width / 2, size.height / 2];
  cameraMatrix = cv.matFromArray(3, 3, cv.CV_64FC1, [
    focalLength,
    0,
    center[0],
    0,
    focalLength,
    center[1],
    0,
    0,
    1
  ]);
  // console.log("Camera Matrix:", cameraMatrix.data64F);

  window.beforeunload = () => {
    im.delete();
    imagePoints.delete();
    distCoeffs.delete();
    rvec.delete();
    tvec.delete();
    pointZ.delete();
    pointY.delete();
    pointX.delete();
    noseEndPoint2DZ.delete();
    nose_end_point2DY.delete();
    nose_end_point2DX.delete();
    jaco.delete();
  };
}


function HeadGazeDetector(p_poses, timestamp, THRESHOLD = 0.1) {
  const OUTPUT = []
  let angle = 50;

  console.log(" Thres ", THRESHOLD, "Raw Poses", p_poses);

  poses = p_poses.filter(function (pose) {
    return (pose.score > THRESHOLD);
  });
  // console.log(poses.length + " is the POSE LENGTH")
  let poseLength = poses.length
  for (let i = 0; i < poseLength; i++) {
    let detectedEye = true;
    const person = poses[i];
    console.log("Pose Score for Person", i, person)

    if (
      !person.keypoints.find(kpt => kpt.part === "nose") ||
      !person.keypoints.find(kpt => kpt.part === "leftEye") ||
      !person.keypoints.find(kpt => kpt.part === "rightEye")
    ) {
      detectedEye = false;
    }
    if (detectedEye == true) {
      const ns = person.keypoints.filter(kpt => kpt.part === "nose")[0]
        .position;
      const le = person.keypoints.filter(kpt => kpt.part === "leftEye")[0]
        .position;
      const re = person.keypoints.filter(kpt => kpt.part === "rightEye")[0]
        .position;

      // 2D image points. If you change the image, you need to change vector
      [
        ns.x,
        ns.y, // Nose tip
        ns.x,
        ns.y, // Nose tip (see HACK! above)
        // 399, 561, // Chin
        le.x,
        le.y, // Left eye left corner
        re.x,
        re.y // Right eye right corner
        // 345, 465, // Left Mouth corner
        // 453, 469 // Right mouth corner
      ].map((v, i) => {
        imagePoints.data64F[i] = v;
      });

      // Hack! initialize transition and rotation matrixes to improve estimation
      tvec.data64F[0] = -100;
      tvec.data64F[1] = 100;
      tvec.data64F[2] = 1000;
      const distToLeftEyeX = Math.abs(le.x - ns.x);
      const distToRightEyeX = Math.abs(re.x - ns.x);
      if (distToLeftEyeX < distToRightEyeX) {
        // looking at left
        rvec.data64F[0] = -1.0;
        rvec.data64F[1] = -0.75;
        rvec.data64F[2] = -3.0;
      } else {
        // looking at right
        rvec.data64F[0] = 1.0;
        rvec.data64F[1] = -0.75;
        rvec.data64F[2] = -3.0;
      }

      const success = cv.solvePnP(
        modelPoints,
        imagePoints,
        cameraMatrix,
        distCoeffs,
        rvec,
        tvec,
        true
      );
      if (!success) {
        return OUTPUT;
      }

      cv.projectPoints(
        pointZ,
        rvec,
        tvec,
        cameraMatrix,
        distCoeffs,
        noseEndPoint2DZ,
        jaco
      );
      cv.projectPoints(
        pointY,
        rvec,
        tvec,
        cameraMatrix,
        distCoeffs,
        nose_end_point2DY,
        jaco
      );
      cv.projectPoints(
        pointX,
        rvec,
        tvec,
        cameraMatrix,
        distCoeffs,
        nose_end_point2DX,
        jaco
      );



      // draw axis
      const pNose = {
        x: imagePoints.data64F[0],
        y: imagePoints.data64F[1]
      };
      const pZ = {
        x: noseEndPoint2DZ.data64F[0],
        y: noseEndPoint2DZ.data64F[1]
      };
      const p3 = {
        x: nose_end_point2DY.data64F[0],
        y: nose_end_point2DY.data64F[1]
      };
      const p4 = {
        x: nose_end_point2DX.data64F[0],
        y: nose_end_point2DX.data64F[1]
      };

      const angleWidth = Math.abs(pZ.x - pNose.x);
      const angleHeight = Math.abs(pZ.y - pNose.y);
      const angleTangent = angleHeight / angleWidth;
      angle = (Math.atan(angleTangent) * 180) / Math.PI;

    }

    // CONSOLE STATEMENTS TO OUTPUT
    if (!detectedEye) {
      // console.log("2 Eye not in frame");
      result = 0
    } else if (angle < 16) {
      // console.log("1 Facing Away");
      result = 1
    } else {
      // console.log("0 All good");
      result = 2
    }


    if (detectedEye) {
      OUTPUT.push({
        headpose: result,
        xCord: person.keypoints.find(kpt => kpt.part === "leftEye").position.x,
        yCord: person.keypoints.find(kpt => kpt.part === "rightEye").position.y,
        timestamp: timestamp,
        numPersons: poseLength,
        personId: i,
      })
      // console.log(OUTPUT)
    }
  }
  return OUTPUT
}

