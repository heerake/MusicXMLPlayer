(function() {
    var audioCtx = new AudioContext();

    var fullLengthTime = 2; //全音时间

    function Paino() {

    }

    function playNote(frequency, startTime, endTime) {

    	console.log('platNote:', startTime, endTime, frequency);

        var oscillator = audioCtx.createOscillator();
        // 创建音量控制对象  
        var gainNode = audioCtx.createGain();
        // 音调音量关联  
        oscillator.connect(gainNode);
        // 音量和设备关联  
        gainNode.connect(audioCtx.destination);
        // 音调类型指定为正弦波  
        oscillator.type = 'triangle';
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

    Paino.prototype.play = function(instruments) {
    	var startTime = audioCtx.currentTime;
        instruments.forEach((instrument, index) => {
        	var curStartTime = startTime;
            var voice = instrument.voices && instrument.voices[0];
            if (voice && voice.voiceEntries) {
                
                voice.voiceEntries.forEach((voiceEntry, index) => {
                	//if(index > 10) return;
                    voiceEntry.notes && voiceEntry.notes.forEach((note, index) => {
                        var endTime = curStartTime + note.length.numerator / note.length.denominator * fullLengthTime;

                        playNote(note.pitch.frequency, curStartTime, endTime)

                        if (index === voiceEntry.notes.length - 1) {
                            curStartTime = endTime;
                        }
                    })
                })
            }
        });
    }

    window.Paino = new Paino();
})();