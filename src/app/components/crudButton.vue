<style lang="sass" scoped>
.crudButton
  position: fixed
  top: 26px
  left: 0
  width: 100%
  height: calc(100% - 26px)
  background-color: #4f5b62
  cursor: initial
  z-index: 1000
  padding: 10px
.crudSection
  height: calc(100% - 50px)
  display: flex
  .column
    width: 50%
    padding: 0 5px
    overflow: auto
  .results
    overflow: auto
    max-height: calc(100% - 88px)
</style>

<template lang="pug">
  .crudButton
    .crudSection
      template(v-if="showAudio")
        .column
          fieldZone(label="Text" v-model="text" itm="text" placeholder="Display Text")
          fieldZone(label="Image" v-model="image" itm="image" placeholder="URL to image")
          fieldZone(label="Sound" v-model="sound" itm="sound" placeholder="URL to mp3")
          fieldZone(label="Volume" v-model="volume" itm="volume")
        .column
          fieldZone(label="Search for sfx" v-model="searchT" itm="search" placeholder="Its over 9000").searcher
            btn(:action="search").green
              i.sp-search
              | &nbsp;Search
          .results
            resultsfx(
              v-for="(sfx, i) in results"
              :sfx="sfx"
              @addsfx="addsfx"
            )
      template(v-else)
        .column
          switchField(label="Enable overlay" v-model="overlaySettings.enable")
          fieldZone(label="Animation In" v-model="overlaySettings.animationIn" itm="animationIn" placeholder="Time of enter animation")
          fieldZone(label="Animation Out" v-model="overlaySettings.animationOut" itm="animationOut" placeholder="Time of exit animation")
          fieldZone(label="Duration" v-model="overlaySettings.duration" itm="duration" placeholder="infinite")
          fieldZone(label="Overlay image" v-model="overlaySettings.image" itm="olImage" placeholder="Url")
        .column
          previewAnimation(:settings="overlaySettings")
          .fieldZone
            label.label Start state
            stateEditor(v-model="overlaySettings.start")
          .fieldZone
            label.label Finish state
            stateEditor(v-model="overlaySettings.finish")

    btn.green(:action="() => {showAudio = !showAudio}")
      i.sp-equalizer
      template(v-if="showAudio") &nbsp;Overlay
      template(v-else) &nbsp;Audio
    btn(:action="save").blue
      i.sp-checkmark
      | &nbsp;Save
    btn(:action="cancel")
      i.sp-cross
      | &nbsp;Cancel
    btn(:action="del" v-if="!isNew").red
      i.sp-bin
      | &nbsp;Delete
</template>
<script>
import btn from './btn.vue'
import resultsfx from './resultsfx.vue'
import stateEditor from './stateEditor.vue'
import fieldZone from './fieldZone.vue'
import switchField from './switchField.vue'
import previewAnimation from './previewAnimation.vue'
export default {
  data: () => ({
    image: '',
    text: '',
    sound: '',
    searchT: '',
    serverUrl: window.location.href,
    showAudio: true,
    volume: 10,
    overlaySettings: {
      uuid: null,
      enable: false,
      animationIn: 300,
      animationOut: '',
      duration: 'infinite',
      image: '',
      start: {},
      finish: {}
    },
    results: []
  }),
  methods: {
    async search () {
      const response = await window.fetch(`${this.serverUrl}search?q=${this.searchT}`)
      const json = await response.json()
      this.results = json.sounds
    },
    addsfx (sfx) {
      this.text = sfx.title
      this.sound = sfx.link
    },
    cancel () {
      this.$emit('cancel')
    },
    del () {
      this.$emit('del')
    },
    save () {
      this.overlaySettings.uuid = this.overlaySettings.image
      this.$emit('update', {
        image: this.image,
        text: this.text,
        sound: this.sound,
        volume: this.volume / 100,
        overlaySettings: this.overlaySettings
      })
    }
  },
  mounted () {
    if (this.isNew) return
    this.image = this.value.image
    this.text = this.value.text
    this.sound = this.value.sound
    this.volume = this.value.volume * 100
    this.overlaySettings = JSON.parse(JSON.stringify(this.value.overlaySettings))
  },
  props: {
    value: {},
    isNew: {
      default: false
    }
  },
  components: {
    btn,
    resultsfx,
    stateEditor,
    fieldZone,
    previewAnimation,
    switchField
  }
}
</script>
