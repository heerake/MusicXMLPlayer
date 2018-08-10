"use strict";
(function () {
    var audioCtx = new AudioContext();
    var fullBeatTime = 2.5;
    function Paino() {
    }
    function playNote(frequency, startTime, endTime) {
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'square';
        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(1, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
        oscillator.start(startTime);
        oscillator.stop(endTime);
    }
    Paino.prototype.play = function (osmd) {
        osmd.cursor.show();
        var startTime = audioCtx.currentTime;
        var curMeasuresTime = startTime;
        osmd.graphic.measureList.forEach(function (measures, index) {
            var cursorLength = Math.max.apply(null, measures.map(function (measureItem) {
                return measureItem.staffEntries.length;
            }));
            var isMaxCursor = false;
            measures.forEach(function (measureItem, index) {
                var thisMeasureTime = curMeasuresTime;
                isMaxCursor = !isMaxCursor && measureItem.staffEntries.length === cursorLength;
                measureItem.staffEntries.forEach(function (staffEntry, index) {
                    staffEntry.notes.forEach(function (coNote, index) {
                        var endTime = thisMeasureTime + coNote[0].sourceNote.length.realValue * fullBeatTime;
                        coNote.forEach(function (note, index) {
                            if (note.sourceNote.pitch) {
                                playNote(note.sourceNote.pitch.frequency, thisMeasureTime, endTime);
                            }
                        });
                        if (isMaxCursor) {
                            setTimeout(function () {
                                osmd.cursor.next();
                            }, (endTime - startTime) * 1000);
                        }
                        thisMeasureTime = endTime;
                    });
                });
            });
            curMeasuresTime += fullBeatTime * measures[0].parentSourceMeasure.duration.realValue;
        });
    };
    window.Paino = new Paino();
})();
//# sourceMappingURL=piano.js.map