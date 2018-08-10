let audioCtx = new AudioContext();
let fullBeatTime = 2.5;
function Paino() {
}
function playNote(frequency, startTime, endTime) {
  let oscillator = audioCtx.createOscillator();
  let gainNode = audioCtx.createGain();
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
  let startTime = audioCtx.currentTime;
  let curMeasuresTime = startTime;
  osmd.graphic.measureList.forEach(function (measures, index) {
    let cursorLength = Math.max.apply(null, measures.map(function (measureItem) {
      return measureItem.staffEntries.length;
    }));
    let isMaxCursor = false;
    measures.forEach(function (measureItem, index) {
      let thisMeasureTime = curMeasuresTime;
      isMaxCursor = !isMaxCursor && measureItem.staffEntries.length === cursorLength;
      measureItem.staffEntries.forEach(function (staffEntry, index) {
        staffEntry.sourceStaffEntry.voiceEntries[0].notes.forEach(function (notes, index) {
          let endTime = thisMeasureTime + notes.length.realValue * fullBeatTime;
          notes.beam && notes.beam.notes && notes.beam.notes.forEach(function (note, index) {
            if (note.pitch) {
              playNote(note.pitch.frequency, thisMeasureTime, endTime);
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

export default Paino
