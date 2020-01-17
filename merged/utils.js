function GetWebCam() {
    return navigator.mediaDevices.getUserMedia(
        { video: true, audio: false },
    )
}

function TimeStamp(){
    return Math.round(new Date().getTime()/1000);
  }
  