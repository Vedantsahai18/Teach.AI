let poses = null;
let skeletons = [];

let lastSleepTime = [];
let isSleeping = [];
let lastRaiseHand = [];
let isRaiseHand = []

function HumanPoseEstimate(timestamp) {
  return gotPoses(HumanPoseEstimatorRawPose(), timestamp);
}

function HumanPoseEstimatorRawPose(){
  return poses;
}

function HumanPoseEstimationSetup(video) {
  return new Promise((resolve, reject) => {
    const poseNet = ml5.poseNet(video, () => {
      poseNet.on('pose', (results) => {
        poses = results;
      }
      );
      resolve(poseNet)
    });
  })
}

function gotPoses(poses, timestamp) {

  let OUTPUT = []
  if (poses == null)
    return OUTPUT;

  for (i = 0; i < poses.length; i++) {
    if (poses[i]["pose"]["score"] >= 0.15) {
      keypoints = poses[i]["pose"]["keypoints"]
      const item = {
        sleeping: checkSleeping(keypoints, i),
        raisHand: checkRaiseHand(keypoints, i),
        eyeCoordX: keypoints[1].position.x,
        eyeCoordY: keypoints[1].position.y,
        timestamp: timestamp
      };
      OUTPUT.push(item)
    }
  }
  return OUTPUT;
}

function checkSleeping(keypoints, i) {
  const tanAngle = Math.abs(keypoints[1].position.y - keypoints[2].position.y) / Math.abs(keypoints[1].position.x - keypoints[2].position.x)
  const angle = Math.atan(tanAngle) * 180 / Math.PI
  if (angle > 35 || (keypoints[1].position.y > keypoints[3].position.y && keypoints[2].position.y > keypoints[4].position.y)) {
    if (isSleeping[i] == false) {
      isSleeping[i] = true
      lastSleepTime[i] = getTime()
    }
  } else {
    isSleeping[i] = false;
  }

  if (getTime() - lastSleepTime[i] >= 2 && isSleeping[i]) {
    // console.log("SLEEPING ----------------------------------")
    return 1;
  } else {
    return 0;
  }
}

function checkRaiseHand(keypoints, i) {
  if (keypoints[7].position.y < keypoints[5].position.y || keypoints[8].position.y < keypoints[6].position.y) {
    if (isRaiseHand[i] == false) {
      isRaiseHand[i] = true
      lastRaiseHand[i] = getTime()
    }
  } else {
    isRaiseHand[i] = false;
  }

  return (getTime() - lastRaiseHand[i] >= 2 && isRaiseHand[i]) * 1
}

function getTime() {
  let today = new Date();
  return today.getMinutes() * 60 + today.getSeconds()
}