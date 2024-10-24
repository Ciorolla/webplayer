<template>
  <div class="dane">
    <h1>{{ propName }} {{ propAlbum }} {{ propSize }}</h1>
    <button @click="iWantThisSong(propSource)">play</button>
    <button
      @click="
        addToPlaylist(
          JSON.stringify({
            file: propName,
            size: propSize,
            album: propAlbum,
            src: propSource.substring(7),
          })
        )
      "
    >
      add to playlist
    </button>
  </div>
</template>

<script>
export default {
  props: ["propName", "propAlbum", "propSize", "propSource"],

  methods: {
    iWantThisSong(songUrl) {
      this.$store.dispatch("iWantNewSong", songUrl);
      this.$store.commit("SET_PLAY");
      document.getElementById("audio").load();
      document.getElementById("audio").play();
    },
    addToPlaylist(customJson) {
      this.$store.dispatch("addToPlaylist", customJson);
    },
  },
};
</script>

<style scoped>
.dane {
  width: 1100px;
}
</style>