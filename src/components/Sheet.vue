<template>
  <div>
    <div ref="sheetCanvas"></div>
  </div>
</template>

<script lang="ts">
// import { Vue } from "vue-property-decorator";
import Vue from "vue";
import Component from "vue-class-component";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import Player from "../util/player";

@Component({})
export default class Sheet extends Vue {
  OSMD: OpenSheetMusicDisplay | null = null;
  mounted() {
    this.OSMD = new OpenSheetMusicDisplay(
      this.$refs.sheetCanvas as HTMLElement,
      false
    );

    this.OSMD.load(
      "/static/sheets/La_La_Land_-_Epilogue_piano_arrangement.mxl"
    ).then(
      () => {
        this.OSMD && this.OSMD.render();

        (window as any).OSMD = this.OSMD;

        new Player().play(this.OSMD);
      },
      err => {
        console.error(err);
      }
    );
  }
  methods = {
    play() {
    }
  };
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
