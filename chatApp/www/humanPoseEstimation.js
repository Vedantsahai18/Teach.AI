let skeletons = [];

let lastSleepTime = [];
let isSleeping = [];
let lastRaiseHand = [];
let isRaiseHand = []

async function HumanPoseEstimate(net, input, timestamp, POSE_THRESHOLD=0.3, THRESHOLD = 0.3) {
  const raw_poses = await net.estimateMultiplePoses(input, {
    flipHorizontal: false,
    maxDetections: 5,
    scoreThreshold: POSE_THRESHOLD,
    nmsRadius: 20
  });
  return gotPoses(raw_poses, POSE_THRESHOLD, THRESHOLD, timestamp);
}

async function HumanPoseEstimationSetup(video) {
  HeadGazeSetup(video);
  const net = await posenet.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: { width: video.width, height: video.height },
    multiplier: 0.75
  });
  return net;
}

function gotPoses(poses, POSE_THRESHOLD, THRESHOLD, timestamp) {

  let OUTPUT = []
  if (poses == null)
    return OUTPUT;

  for (let i = 0; i < poses.length; i++) {
    if (poses[i]["score"] >= POSE_THRESHOLD) {
      keypoints = poses[i]["keypoints"]
      const item = {
        sleeping: checkSleeping(keypoints, timestamp, i),
        raisHand: checkRaiseHand(keypoints, timestamp, i),
        eyeCoordX: keypoints[1].position.x,
        eyeCoordY: keypoints[1].position.y,
        timestamp: timestamp
      };
      OUTPUT.push(item)
    }
  }
  return OUTPUT;
}

function checkSleeping(keypoints, timestamp, i) {
  const tanAngle = Math.abs(keypoints[1].position.y - keypoints[2].position.y) / Math.abs(keypoints[1].position.x - keypoints[2].position.x)
  const angle = Math.atan(tanAngle) * 180 / Math.PI
  if (angle > 35 || (keypoints[1].position.y > keypoints[3].position.y && keypoints[2].position.y > keypoints[4].position.y)) {
    if (isSleeping[i] == false) {
      isSleeping[i] = true
      lastSleepTime[i] = timestamp
    }
  } else {
    isSleeping[i] = false;
  }

  return (timestamp - lastSleepTime[i] >= 2 && isSleeping[i]) * 1
}

function checkRaiseHand(keypoints, timestamp, i) {
  if (keypoints[7].position.y < keypoints[5].position.y || keypoints[8].position.y < keypoints[6].position.y) {
    if (isRaiseHand[i] == false) {
      isRaiseHand[i] = true
      lastRaiseHand[i] = timestamp
    }
  } else {
    isRaiseHand[i] = false;
  }

  return (timestamp - lastRaiseHand[i] >= 2 && isRaiseHand[i]) * 1
}
