const recorderContainer = document.getElementById("jsRecordContainer");
const recordBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");

let streamObject; //public 데이터
let videoRecorder; //public 데이터

const handleVideoData = (event) => {
  const { data: videoFile } = event;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(videoFile);
  link.download = "recorded.webm";
  document.body.appendChild(link);
  link.click();
};

const stopRecording = () => {
  videoRecorder.stop();
  recordBtn.removeEventListener("click", stopRecording);
  recordBtn.addEventListener("click", getVideo);
  recordBtn.innerHTML = "녹화 시작하기🔴";
};

const startRecording = () => {
  videoRecorder = new MediaRecorder(streamObject);
  videoRecorder.start();
  //console.log(videoRecorder);
  videoRecorder.addEventListener("dataavailable", handleVideoData);
  recordBtn.addEventListener("click", stopRecording);
};

const getVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 2580, height: 1020 },
    });

    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();
    recordBtn.innerHTML = "녹화 중지하기⛔";
    streamObject = stream;
    startRecording();
  } catch (error) {
    recordBtn.innerHTML = "녹화를 할 수 없습니다.☹️";
  } finally {
    recordBtn.removeEventListener("click", getVideo);
  }
};

function init() {
  recordBtn.addEventListener("click", getVideo);
}

if (recorderContainer) {
  init();
}
