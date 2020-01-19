// Generate random room name if needed
if (!location.hash) {
    location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
}
const roomHash = location.hash.substring(1);


//To connect to a channel you need to first create it in the admin panel of Scaledrone's website. One instance of Scaledrone establishes a single connection.
// TODO: Replace with your own channel ID
const drone = new ScaleDrone('yiS12Ts5RdNhebyM');
// Room name needs to be prefixed with 'observable-'
const roomName = 'observable-' + roomHash;
const configuration = {
    iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
    }]
};
let room;
let pc;


function onSuccess() {};

function onError(error) {
    console.error(error);
};



//A connection has been opened. The error argument indicates a problem with the connection.
drone.on('open', error => {
    if (error) {
        return console.error(error);
    }

    //// Subscribe after the 'open' or 'authenticate' event from the Scaledrone instance
    room = drone.subscribe(roomName);
    room.on('open', error => {
        if (error) {
            onError(error);
        }
    });
    // We're connected to the room and received an array of 'members'
    // connected to the room (including us). Signaling server is ready.
    room.on('members', members => {
        console.log('MEMBERS', members);
        // If we are the second user to connect to the room we will be creating the offer
        const isOfferer = members.length === 2;
        startWebRTC(isOfferer);
    });
});

//All users subscribed to the room will receive the message
// Send signaling data via Scaledrone
function sendMessage(message) {
    drone.publish({
        room: roomName,
        message
    });
}

// 呼叫 start() 開始建立連線    
function startWebRTC(isOfferer) {
    pc = new RTCPeerConnection(configuration);

    // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
    // message to the other peer through the signaling server
    // 當有任何 ICE candidates 可用時，
    // 透過 signalingChannel 將 candidate 傳送給對方
    pc.onicecandidate = event => {
        if (event.candidate) {
            sendMessage({
                'candidate': event.candidate
            });
        }
    };

    // If user is offerer let the 'negotiationneeded' event create the offer
    if (isOfferer) {
        pc.onnegotiationneeded = () => {
            pc.createOffer().then(localDescCreated).catch(onError);
        }
    }

    // When a remote stream arrives display it in the #remoteVideo element
    pc.ontrack = event => {
        const stream = event.streams[0]; 
        if (!remoteVideo.srcObject || remoteVideo.srcObject.id !== stream.id) {
            remoteVideo.srcObject = stream;
        }
    };

    //進行影像串流的擷取
    navigator.mediaDevices.getUserMedia({
        audio: false, //不擷取聲音
        video: true, //擷取影像
    }).then(stream => {
        // Display your local video in #localVideo element
        localVideo.srcObject = stream;
        // Add your stream to be sent to the conneting peer
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
    }, onError);

    // Listen to signaling data from Scaledrone
    room.on('data', (message, client) => {
        // Message was sent by us
        if (client.id === drone.clientId) {
            return;
        }

        if (message.sdp) {
            // This is called after receiving an offer or answer from another peer
            pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
                // When receiving an offer lets answer it 當接收到 offer 時，要回應一個 answer
                if (pc.remoteDescription.type === 'offer') {
                    pc.createAnswer().then(localDescCreated).catch(onError);
                }
            }, onError);
        } else if (message.candidate) {
            // Add the new ICE candidate to our connections remote description
            // 接收對方的 candidate 並加入自己的 RTCPeerConnection
            if (pc.remoteDescription) {
                pc.addIceCandidate(
                    new RTCIceCandidate(message.candidate), onSuccess, onError
                );
            }
        }
    });
}

function localDescCreated(desc) {
    pc.setLocalDescription(
        desc,
        () => sendMessage({
            'sdp': pc.localDescription
        }),
        onError
    );
}