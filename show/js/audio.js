function audioFingerPrinting(cb, waveType) {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext),
        oscillator = audioCtx.createOscillator(),
        analyser = audioCtx.createAnalyser(),
        gainNode = audioCtx.createGain(),
        scriptProcessor = audioCtx.createScriptProcessor(4096,1,1);

    gainNode.gain.value = 0;
    oscillator.type = waveType;
    oscillator.frequency.value = 10000;
    oscillator.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    function ret(bins) {
        cb(bins);
    }

    scriptProcessor.onaudioprocess = function () {
        var bins = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(bins);

        analyser.disconnect();
        scriptProcessor.disconnect();
        gainNode.disconnect();
        ret(bins)
    };
    oscillator.start(0);
}
