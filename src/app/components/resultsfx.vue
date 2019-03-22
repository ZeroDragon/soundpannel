<style lang="sass" scoped>
.sfx
  display: flex
  justify-content: space-between
  padding: 4px
  border-bottom: 1px solid #d3d3d3
.title
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  max-width: calc(100% - 80px)
</style>

<template lang="pug">
  .sfx
    .title {{sfx.title}}
    .buttons
      btn.tiny.green(:action="() => $emit('addsfx', sfx)"): i.sp-arrow-left
      template(v-if="playing")
        btn.tiny.red(:action="play"): i.sp-stop
      template(v-else)
        btn.tiny.blue(:action="play"): i.sp-play
</template>

<script>
import btn from './btn.vue'
export default {
  data: () => ({
    audio: null
  }),
  computed: {
    playing () {
      return this.audio != null
    }
  },
  methods: {
    play () {
      if (this.audio != null && this.audio.duration > 0 && !this.audio.paused) {
        this.audio.pause()
        this.audio.currentTime = 0
        this.audio = null
      } else {
        this.audio = null
        this.audio = new Audio(this.sfx.link)
        this.audio.play()
        this.audio.addEventListener('ended', () => {
          this.audio = null
        })
      }
    }
  },
  props: {
    sfx: {
      default: {}
    }
  },
  components: {
    btn
  }
}
</script>
