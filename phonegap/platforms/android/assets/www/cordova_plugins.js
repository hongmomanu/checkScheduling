cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.ququplay.websocket.WebSocket/www/phonegap-websocket.js",
        "id": "com.ququplay.websocket.WebSocket.websocket",
        "clobbers": [
            "WebSocket"
        ]
    },
    {
        "file": "plugins/com.wordsbaking.cordova.tts/www/tts.js",
        "id": "com.wordsbaking.cordova.tts.tts",
        "clobbers": [
            "TTS"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.speech.speechsynthesis/www/SpeechSynthesis.js",
        "id": "org.apache.cordova.speech.speechsynthesis.SpeechSynthesis",
        "clobbers": [
            "window.speechSynthesis"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.speech.speechsynthesis/www/SpeechSynthesisUtterance.js",
        "id": "org.apache.cordova.speech.speechsynthesis.SpeechSynthesisUtterance",
        "clobbers": [
            "SpeechSynthesisUtterance"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.speech.speechsynthesis/www/SpeechSynthesisEvent.js",
        "id": "org.apache.cordova.speech.speechsynthesis.SpeechSynthesisEvent",
        "clobbers": [
            "SpeechSynthesisEvent"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.speech.speechsynthesis/www/SpeechSynthesisVoice.js",
        "id": "org.apache.cordova.speech.speechsynthesis.SpeechSynthesisVoice",
        "clobbers": [
            "SpeechSynthesisVoice"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.speech.speechsynthesis/www/SpeechSynthesisVoiceList.js",
        "id": "org.apache.cordova.speech.speechsynthesis.SpeechSynthesisVoiceList",
        "clobbers": [
            "SpeechSynthesisVoiceList"
        ]
    },
    {
        "file": "plugins/com.lefortsoftware.ttsplugin/www/TtsPlugin.js",
        "id": "com.lefortsoftware.ttsplugin.TtsPlugin",
        "clobbers": [
            "ttsPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.ququplay.websocket.WebSocket": "0.1.0",
    "com.wordsbaking.cordova.tts": "0.2.1",
    "org.apache.cordova.speech.speechsynthesis": "0.1.0",
    "com.lefortsoftware.ttsplugin": "0.1.0"
}
// BOTTOM OF METADATA
});