function GetWebCam() {
    return navigator.mediaDevices.getUserMedia(
        { video: true, audio: false },
    )
}

function TimeStamp() {
    return Math.round(new Date().getTime() / 1000);
}

function MinDistance(point1, point2){
    return Math.pow(point1.y - point2.y,2) + Math.pow(point1.x - point2.x,2);
}

function MatchingPoseFromFaceout(faceout, poses){
    if (faceout == null)
        return 0;
    faceout = faceout.landmarks.positions
    let min_dist = MinDistance(PolygonCentroid(faceout), PolygonCentroid(GetFaceKeyPoints(poses[0])));
    let min_pose = 0

    for(let i = 1; i < poses.length; ++i){
        const dist =  MinDistance(PolygonCentroid(faceout), PolygonCentroid(GetFaceKeyPoints(poses[i])))
        if(dist < min_dist){
            min_dist = dist;
            min_pose = i;
        }
    }
    return min_pose;
}

function PolygonCentroid(pts) {
    let first = pts[0], last = pts[pts.length - 1];
    if (first.x != last.x || first.y != last.y) pts.push(first);
    let twicearea = 0,
        x = 0, y = 0,
        nPts = pts.length,
        p1, p2, f;
    for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
        p1 = pts[i]; p2 = pts[j];
        f = (p1.y - first.y) * (p2.x - first.x) - (p2.y - first.y) * (p1.x - first.x);
        twicearea += f;
        x += (p1.x + p2.x - 2 * first.x) * f;
        y += (p1.y + p2.y - 2 * first.y) * f;
    }
    f = twicearea * 3;
    return { x: x / f + first.x, y: y / f + first.y };
}