class OnePole {
	/* 		
	Simple autoregressive smoothing filter. Use tick to accept and output values.
	
	a1 (float)	:	smoothing coefficient (0 < a1 < 1)
	*/


	constructor(a1){
		this._a1 = a1;
		this._a2 = 1 - a1;

		// One-sample memory.
		this._yn1 = 0;
	}


	tick(in_){
		/*
		Main method for filtering. Accepts and outputs one sample.

		in:
			in_	(float)		:	a single input sample
		
		returns:
			_yn1 (float)	:	a single output sample
		*/

		this._yn1  = this._a1 * in_ + this._a2 * this._yn1;
		return this._yn1
	}
}
