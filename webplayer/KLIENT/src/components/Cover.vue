<template>
  <div class="zdj">
    <img @click="needNewDisc(propDisc)" :src="propUrl" />
  </div>
</template>

<script>
export default {
  props: ["propUrl", "propDisc"],

  methods: {
    needNewDisc(disc) {
      this.$store.dispatch("next", disc);
    },
  },
};
</script>

<style scoped>
.zdj {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-repeat: no-repeat;
  position: relative;
  width: 300px;
  height: 300px;
}
</style>