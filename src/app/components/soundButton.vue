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
    &:after
      font-family: SoundPannel
      content: '\ea1c'
      font-size: 50px
      display: inline-block
      margin: 12px 25px
      color: #aaa
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
      background-color: #4f5b62
      border-radius: 8px
      i
        line-height: 100px
    .text
      text-align: center
      bottom: 6px
      left: 0
      width: 100%
      background-color: rgba(#000, 0.7)
    .image
      width: 100%
      height: 100%
      border-radius: 8px
      overflow: hidden
      background-size: cover
      background-position: center
      background-repeat: no-repeat
      box-shadow: inset 0px 0px 4px 3px rgba(255,255,255,0.48)
</style>
<template lang="pug">
  .soundButton(
    :class="isNew ? 'isNew': ''"
    :draggable="isNormal"
    @dragstart="$emit('dragstart', button)"
    @dragend="$emit('dragend')"
  )
    template(v-if="normal")
      template(v-if="isNew")
        .addIcon(@click="options"): i.sp-plus
      template(v-else)
        .image(
          :style="'background-image:url(' + button.image + ')'"
        )
        .text {{button.text}} {{deviceId}}
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
import { store } from '../store'
export default {
  data: () => ({
    audio: null,
    normal: true,
    uid: null,
    shadow: {
      image: null,
      text: null,
      sound: null,
      volume: null,
      overlaySettings: {}
    }
  }),
  computed: {
    isNormal () {
      return this.normal
    },
    agent () { return store.agent },
    deviceId () {
      if (!this.audio) return
      this.audio.setSinkId(store.deviceId)
      return null
    }
  },
  methods: {
    loadData () {
      this.audio = null
      if (this.button.sound) {
        this.audio = new Audio(this.button.sound)
        this.audio.volume = this.button.volume
        this.shadow.sound = this.button.sound
        this.shadow.volume = this.button.volume
      }
      this.shadow.image = this.button.image
      this.shadow.text = this.button.text
      const defaultOverlaySettings = {
        enable: false,
        animationIn: null,
        animationOut: null,
        duration: null,
        image: null,
        start: {},
        finish: {}
      }
      this.shadow.overlaySettings = JSON.parse(
        JSON.stringify(
          this.button.overlaySettings || defaultOverlaySettings
        )
      )
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
        if (this.audio && this.audio.duration > 0 && !this.audio.paused) {
          this.audio.pause()
          this.audio.currentTime = 0
        } else {
          if (this.audio) this.audio.play()
        }
        this.socket.emit('triggerOvelay', { btn: this.button })
      } else {
        this.socket.emit('userClick', {uid: this.uid})
      }
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
  },
  props: {
    isNew: {
      default: false
    },
    button: {},
    socket: {
      default: null
    }
  }
}
</script>
