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
      btn.tiny.blue(:action="() => $emit('addsfx', sfx)") use
      btn.tiny.blue(:action="play")
        template(v-if="playing") stop
        template(v-else) play
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
