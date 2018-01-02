(function() {
	var audioCtx = new AudioContext();

	var fullBeatTime = 2.5; //全音时间

	function Paino() {

	}

	function playNote(frequency, startTime, endTime) {

		var oscillator = audioCtx.createOscillator();
		// 创建音量控制对象  
		var gainNode = audioCtx.createGain();
		// 音调音量关联  
		oscillator.connect(gainNode);
		// 音量和设备关联  
		gainNode.connect(audioCtx.destination);
		// 音调类型指定为正弦波  
		oscillator.type = 'square';
		// 设置音调频率  
		oscillator.frequency.value = frequency;
		// 先把当前音量设为0  
		gainNode.gain.setValueAtTime(0, startTime);
		// 0.01秒时间内音量从刚刚的0变成1，线性变化 
		gainNode.gain.linearRampToValueAtTime(1, startTime + 0.01);

		gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

		// 声音走起 
		oscillator.start(startTime);

		oscillator.stop(endTime);
	}


	Paino.prototype.play = function(osmd) {
		osmd.cursor.show();

		var startTime = audioCtx.currentTime;

		//由于insturment-sheet中找不到休止符所以使用graphic中的对象
		//遍历小节

		var curMeasuresTime = startTime;
		osmd.graphic.measureList.forEach((measures, index) => {


			//当前小节cursor长度
			var cursorLength = Math.max.apply(null, measures.map(measureItem => {
				return measureItem.staffEntries.length;
			}));

			var isMaxCursor = false;


			measures.forEach((measureItem, index) => {
				var thisMeasureTime = curMeasuresTime;

				isMaxCursor = !isMaxCursor && measureItem.staffEntries.length === cursorLength;

				measureItem.staffEntries.forEach((staffEntry, index) => {
					staffEntry.notes.forEach((coNote, index) => {
						var endTime = thisMeasureTime + coNote[0].sourceNote.length.realValue * fullBeatTime;

						coNote.forEach((note, index) => {


							//非休止符
							if (note.sourceNote.pitch) {
								playNote(note.sourceNote.pitch.frequency, thisMeasureTime, endTime);
							}


						})

						if(isMaxCursor){
							setTimeout(function(){
								osmd.cursor.next();	
							}, (endTime - startTime) * 1000)
						}

						thisMeasureTime = endTime;
					})
				})
			})

			//节拍在measureItem.parentSourceMeasure.duration上
			curMeasuresTime += fullBeatTime * measures[0].parentSourceMeasure.duration.realValue;
		});
	}

	window.Paino = new Paino();
})();