function GetWebCam() {
    return navigator.mediaDevices.getUserMedia(
        { video: true, audio: false },
    )
}