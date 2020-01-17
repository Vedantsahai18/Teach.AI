(function () {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  // The letious HTML elements we need to configure or control. These
  // will be set by the startup() function.

  let video = null;
  let canvas = null;
  let photo = null;
  let startbutton = null;

  async function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    video.srcObject = await GetWebCam()
    video.play();

    startbutton.addEventListener('click', function (ev) {
      takepicture();
      ev.preventDefault();
    }, false);

    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    let context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    let data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    let context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    let base64 = canvas.toDataURL('image/png');
    photo.setAttribute('src', base64);

    // Write Code to Publish to Browser Here
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
})();
