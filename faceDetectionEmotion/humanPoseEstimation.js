let poses = null;
let skeletons = [];

let lastSleepTime = [];
let isSleeping = [];
let lastRaiseHand = [];
let isRaiseHand = []
let poseNet = null;

function Ml5GotPoses() {
  return gotPoses(poses);
}

function abcdefgggggg(results) {
  poses = results;
  console.log("43322");
}
function HumanPoseEstimationSetup(video) {
  const poseNet = ml5.poseNet(video, () => {
  });
  console.log(poseNet)
  poseNet.on('pose', abcdefgggggg);
  return poseNet;
}

var abc = ["raisHand", "sleeping", "eyeCoordX", "eyeCoordY", "timestamp"]
var xyz = []
abc = abc + "\n"
var flag = 0, flag1 = 0
function gotPoses(results) {
  console.log("pose");

  let OUTPUT = []
  const timestamp = getTime()
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
      console.log("44", item);
      //console.log(OUTPUT)
      if (OUTPUT[i]['raisHand'] == 1)
        flag = 1
      else
        flag = 0
      if (OUTPUT[i]['sleeping'] == 1)
        flag1 = 1
      else
        flag1 = 0
      //console.log(flag)
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