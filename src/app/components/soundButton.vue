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
    background-color: #4f5b62
    background-image: url('data:image/svg+xml;charset=utf8,<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve"><path d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M45.563,30.826l-22,15 C23.394,45.941,23.197,46,23,46c-0.16,0-0.321-0.038-0.467-0.116C22.205,45.711,22,45.371,22,45V15c0-0.371,0.205-0.711,0.533-0.884 c0.328-0.174,0.724-0.15,1.031,0.058l22,15C45.836,29.36,46,29.669,46,30S45.836,30.64,45.563,30.826z"/></svg>')
    background-size: 55%
    background-repeat: no-repeat
    background-position: center 10px
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
      background-color: #4f5b62
      border-radius: 8px
    .text
      text-align: center
      bottom: 6px
      left: 0
      width: 100%
    .image
      width: 100%
      height: 100%
      border-radius: 8px
      overflow: hidden
      background-size: cover
      background-position: center
      background-repeat: no-repeat
</style>
<template lang="pug">
  .soundButton(
    :class="isNew ? 'isNew': ''"
    draggable="true"
    @dragstart="$emit('dragstart', button)"
    @dragend="$emit('dragend')"
  )
    template(v-if="normal")
      template(v-if="isNew")
        .addIcon(@click="options") +
      template(v-else)
        .image(
          :style="'background-image:url(' + button.image + ')'"
        )
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
    drag (evt) {
      console.log('dragstart', evt)
    },
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
