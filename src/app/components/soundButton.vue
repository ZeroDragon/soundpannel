<style lang="sass" scoped>
  .soundButton
    border-radius: 8px
    margin: 10px
    width: 100px
    height: 100px
    display: inline-block
    position: relative
    cursor: pointer
    border: 1px solid #444
    background-color: #666
    &.isNew
      border: 1px dashed #fff
    .addIcon, .playIcon, .text, .image
      position: absolute
      user-select: none
    .addIcon, .playIcon, .image
      width: 100%
      height: 100%
      top: 0
      left: 0
    .addIcon
      font-size: 50px
      text-align: center
      line-height: 100px
    .text
      text-align: center
      bottom: 6px
      left: 0
      width: 100%
    .image
      border-radius: 8px
      overflow: hidden
      background-size: cover
      background-position: center
      background-repeat: no-repeat
</style>
<template lang="pug">
  .soundButton(:class="isNew ? 'isNew': ''")
    template(v-if="normal")
      template(v-if="isNew")
        .addIcon(@click="options") +
      template(v-else)
        .image(:style="'background-image:url(' + button.image + ')'")
        .text {{button.text}}
        .playIcon(
          @click="playSound"
          @contextmenu="options"
        )
    template(v-else)
      crudButton(
        v-model="shadow"
        @update="update"
        @cancel="options"
        @del="del"
        :isNew="isNew"
      )
</template>
<script>
import crudButton from './crudButton.vue'
export default {
  data: () => ({
    audio: null,
    normal: true,
    uid: null,
    shadow: {
      image: null,
      text: null,
      sound: null
    }
  }),
  methods: {
    loadData () {
      this.audio = null
      this.audio = new Audio(this.button.sound)
      this.shadow.image = this.button.image
      this.shadow.text = this.button.text
      this.shadow.sound = this.button.sound
    },
    update (newVals) {
      this.$emit('update', {shadow: newVals, button: this.button})
      this.normal = !this.normal
    },
    del () {
      this.$emit('del', this.button)
      this.normal = !this.normal
    },
    options () {
      this.normal = !this.normal
    },
    playSound () {
      if (this.agent === 'server') {
        if (this.audio.duration > 0 && !this.audio.paused) {
          this.audio.pause()
          this.audio.currentTime = 0
        } else {
          this.audio.play()
        }
      } else {
        this.socket.emit('userClick', {uid: this.uid})
      }
    }
  },
  props: {
    isNew: {
      default: false
    },
    button: {},
    agent: {
      default: 'client'
    },
    socket: {
      default: null
    }
  },
  mounted () {
    if (this.isNew) return
    this.loadData()
    this.uid = `${this.button.sound}`
    this.socket.on('userClicked', data => {
      if (data.uid === this.uid && this.agent === 'server') this.playSound()
    })
  },
  components: {
    crudButton
  }
}
</script>
