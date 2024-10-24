<template>
  <div id="app">
    <div id="poz">
      <cover class="cover" prop-url="imgPlay.jpg" prop-disc="playlist"></cover>
      <cover
        class="cover"
        :key="disc + i"
        v-for="(disc, i) in discs"
        :prop-url="disc[1]"
        :prop-disc="disc[0]"
      ></cover>
    </div>

    <div id="panel">
      <button @click="prevSong()">prev</button>
      <button @click="pauseUnpause()">pause/unpause</button>
      <button @click="nextSong()">next</button>
      <input
        @change="changeProgress()"
        type="range"
        id="progressBar"
        name="progressBar"
        min="0"
        max="0"
        value="0"
      />
      <label id="here">0</label>
      <label>/</label>
      <label id="max">0</label>
    </div>

    <audio id="audio" @canplaythrough="progress()" controls>
      <source :src="songToPlay" id="audio_src" type="audio/mp3" />
    </audio>

    <div id="show">
      <items
        :key="item.file + i"
        v-for="(item, i) in items"
        :prop-name="item.file"
        :prop-album="item.album"
        :prop-size="item.size"
        :prop-source="'http://' + item.src"
      >
      </items>
    </div>
  </div>
</template>
<script>
import Cover from "./components/Cover.vue";
import Items from "./components/Items.vue";

export default {
  name: "App",
  components: {
    Cover,
    Items,
  },
  data() {
    return {};
  },

  mounted() {
    this.$store.dispatch("firstAction");
  },

  methods: {
    pauseUnpause() {
      if (this.$store.getters.getPause) {
        document.getElementById("audio").pause();
        this.$store.commit("SET_PAUSE");
      } else {
        document.getElementById("audio").play();
        this.$store.commit("SET_PLAY");
      }
    },

    nextSong() {
      this.$store.commit("NEXT_PLAY");
      this.$store.commit("SET_PLAY");
      document.getElementById("audio").load();
      document.getElementById("audio").play();
    },

    prevSong() {
      this.$store.commit("PREV_PLAY");
      this.$store.commit("SET_PLAY");
      document.getElementById("audio").load();
      document.getElementById("audio").play();
    },
    progress() {
      let audio = document.getElementById("audio");
      let barOfProgress = document.getElementById("progressBar");
      let maximum = document.getElementById("max");
      let here = document.getElementById("here");

      barOfProgress.max = audio.duration;
      let m = Math.floor((audio.duration % 3600) / 60);
      let s = Math.floor((audio.duration % 3600) % 60);
      let mDisplay = m > 0 ? m : "0";
      let sDisplay = s > 0 ? s : "0";

      maximum.innerHTML = `${mDisplay}:${sDisplay}`;

      audio.ontimeupdate = function (e) {
        //console.log(e.target.currentTime);
        barOfProgress.value = e.target.currentTime;
        let mm = Math.floor((e.target.currentTime % 3600) / 60);
        let ss = Math.floor((e.target.currentTime % 3600) % 60);
        let mmDisplay = mm > 0 ? mm : "0";
        let ssDisplay = ss > 0 ? ss : "0";
        here.innerHTML = `${mmDisplay}:${ssDisplay}`;
      };
    },
    changeProgress() {
      let audio = document.getElementById("audio");
      let barOfProgress = document.getElementById("progressBar");
      audio.pause;
      console.log("changed??", barOfProgress.value);
      audio.currentTime = barOfProgress.value;
      audio.play;
    },
  },

  computed: {
    discs() {
      return this.$store.getters.getImages;
    },
    items() {
      console.log(this.$store.getters.getItems);
      return this.$store.getters.getItems;
    },
    tstsrc() {
      console.log(this.$store.getters.gettstsrc);
      return this.$store.getters.gettstsrc;
    },
    songToPlay() {
      console.log(this.$store.getters.getSong);
      return this.$store.getters.getSong;
    },
  },
};
</script>


<style>
img {
  width: 300px;
  height: 300px;
}

.cover {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-repeat: no-repeat;
  position: relative;
  top: 0%;
  left: 0%;
  width: 400px;
  height: 100%;
}

#show {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  background-repeat: no-repeat;
  position: relative;
  top: 20%;
  left: 20%;
  width: 2000px;
  height: 3000px;
}
.app {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-repeat: no-repeat;
  position: relative;
}
#poz {
  display: flex;
  align-items: center;
  background-repeat: no-repeat;
  position: relative;
  top: 0%;
  left: 0%;
  width: 1000px;
  height: 300px;
  overflow-x: scroll;
}
#audio {
  display: none;
}

#panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-repeat: no-repeat;
  position: relative;
  background-color: aqua;
  left: 20%;
  width: 4000px;
  height: 100px;
}
</style>
