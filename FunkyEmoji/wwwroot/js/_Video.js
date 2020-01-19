var emotion = ["anger", "contempt", "disgust", "fear", "happiness", "neutral", "sadness", "surprise"];
var translate = ["生氣", "鄙視", "厭惡", "恐懼", "快樂", "中性", "悲傷", "驚訝"];
var emoji = Math.floor(Math.random() * emotion.length);
var makeblob = function (dataURL) {
    var BASE64_MARKER = ";base64,";
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(",");
        var contentType = parts[0].split(":")[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], {
            type: contentType
        });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(":")[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {
        type: contentType
    });
};

//var app2 = new Vue({
//    el: '#Video',
//    data: {
//        video: {},
//        canvas: {},
//        captures: []
//        // image:backgroundImage
//    },
//    mounted: function () {
//        this.getVideo();
//    },
//    methods: {
//        getVideo: function () {
//            this.video = this.$refs.video; //取得要放影片的Video標籤節點

//            if (navigator.mediaDevices.getUserMedia === undefined) {
//                //判斷當前設備是否有攝影鏡頭
//                navigator.mediaDevices.getUserMedia = function (constraints) {
//                    //首先取得現存的getUserMedia(如果存在)
//                    var getUserMedia =
//                        navigator.webkitGetUserMedia ||
//                        navigator.mozGetUserMedia ||
//                        navigator.getUserMedia;
//                    //有些瀏覽器不支持，返回錯誤信息
//                    //保持接口一致
//                    if (!getUserMedia) {
//                        return Promise.reject(
//                            new Error("getUserMedia is not implemented in this browser")
//                        );
//                    }
//                    //反之，使用Promise調用包裝navigator.getUserMedia
//                    return new Promise(function (resolve, reject) {
//                        getUserMedia.call(navigator, constraints, resolve, reject);
//                    });
//                };
//            }
//            var constraints = {
//                audio: false,
//                video: true
//            };
//            navigator.mediaDevices
//                .getUserMedia(constraints)
//                .then(function (stream) {
//                    //瀏覽器可能没有srcObject
//                    if ("srcObject" in video) {
//                        video.srcObject = stream;
//                    } else {
//                        //避免在新的瀏覽器中使用它，因為他正在被棄用
//                        video.src = window.URL.createObjectURL(stream);
//                        this.video = video;
//                    }
//                    video.onloadedmetadata = function (e) {
//                        video.play(); //打開攝影機
//                    };
//                })
//                .catch(err => {
//                    console.log("Error", err);
//                });
//        },

//        capture: function () {
//            this.canvas = this.$refs.canvas;
//            var context = this.canvas
//                .getContext("2d")
//                .drawImage(this.video, 0, 0, 480, 360);
//            this.captures.push(canvas.toDataURL("image/png"));
//            var imgData = canvas.toDataURL("image/png");
//            const userRequest = axios.create({
//                baseURL: "https://eastasia.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceAttributes=emotion",
//                headers: {
//                    "Ocp-Apim-Subscription-Key": "8707bd81a0fb489f81cb0c310f5381dc",
//                    "Content-Type": "application/octet-stream"
//                }
//            });
//            userRequest.post('', makeblob(imgData))
//                .then(res => { console.log(res) })
//        }
//    }

//})