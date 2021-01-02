// Trying to make my bufferplayer class in javascript. Lord help me.

class BufferPlayer {
	constructor(inputSize, outputSize){
		this.inputSize = inputSize;
		this.outputSize = outputSize;
		this.buffer = Array(outputSize).fill(0);
		this.writePtr = outputSize - inputSize;
		this.readPtr = 0;
		this.output = Array(outputSize).fill(0);
	}

	tick(input){

		// read into the out
		for (var i = 0; i < this.inputSize; i++) {
			this.buffer[this.writePtr++] = input[i];
			this.writePtr %= this.outputSize;
		}


		for (var i = 0; i < this.outputSize; i++) {
			this.output[i] = this.buffer[this.readPtr++];
			this.readPtr %= this.outputSize;
		}

		this.readPtr += this.inputSize;
    	this.readPtr %= this.outputSize;
		return this.output;
	}

}