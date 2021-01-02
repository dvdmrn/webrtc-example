_debug = false;

var _parameters = {
    semantic:{
        is_nature: 0,
        is_artificial: 0,
        is_indoor: 0,
        is_outdoor: 0,
        is_foreground: 0,
        is_background: 0            
    },
    acoustic:{
        amp:0,
        spec:[]
    }
}




scores = tf.tensor([])

window.onload = () => {
	// Get microphone stream.       
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(successCallback)
    .catch(e=>{console.log("Nuts. Got error: ",e)});
        

    function successCallback(stream) {
        console.log("success callback");
        let audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000});
        

        // Builds running buffer of last 0.96s of audio @ 16k.
        myPlayer = new BufferPlayer(2048, 15360);


        // Webaudio: create a source from our MediaStream
        let source = audioContext.createMediaStreamSource(stream);
        let node = audioContext.createScriptProcessor(2048, 1, 1);


		// Smoothing filters for prediction outputs.
		const a1 = 0.25
		var filt0 = new OnePole(a1);
		var filt1 = new OnePole(a1);
		var filt2 = new OnePole(a1);
		var filt3 = new OnePole(a1);
		var filt4 = new OnePole(a1);
		var filt5 = new OnePole(a1);		


        // Main loop.
        node.onaudioprocess = function(data) {

            
            
            // Read frame from mic.
            let thisBuffer = data.inputBuffer.getChannelData(0);
            

            // Build and output from buffer. 
            _parameters.acoustic.amp = rms(thisBuffer);         

    
            let waveform = myPlayer.tick(thisBuffer);
            let wvTensor = tf.tensor(waveform);
            
            
            // Yamnet predictions.
            try{
                [scores, embeddings, spectrogram] = model.predict(wvTensor);
                // [scores] = model.predict(tf.tensor(waveform));
                
                // embeddings.data().then(data => console.log(data));

                spectrogram.data().then(data=>_parameters.acoustic.spec = data);
            }
            catch(err){
                console.log("prediction error: ",err)
            }

            // Transform scores: tensor -> array -> context predictions.
            (async () => { return Array.from(scores.dataSync()) })()
            .then((result) => {

                
                // Contextual predictions here.
                let predictions = matMult(remaps, result);


                // sets global smenatic _parameters
                _parameters.semantic.is_nature = filt0.tick(predictions[0]);
                _parameters.semantic.is_artificial = filt1.tick(predictions[1]);
                _parameters.semantic.is_indoor = filt2.tick(predictions[2]);
                _parameters.semantic.is_outdoor = filt3.tick(predictions[3]);
                _parameters.semantic.is_foreground = filt4.tick(predictions[4]);
                _parameters.semantic.is_background = filt5.tick(predictions[5]);
                
                // console.log(tf.memory().numTensors);
                waveform = null
                scores.dispose()
                embeddings.dispose()
                spectrogram.dispose()
                wvTensor.dispose()
                if(_debug) document.getElementById("console").innerHTML = JSON.stringify(_parameters, null, "<br>");


            });
        }

        // Webaudio: connect the microphone to the script processor.
        source.connect(node);
        node.connect(audioContext.destination);
    }
    }
