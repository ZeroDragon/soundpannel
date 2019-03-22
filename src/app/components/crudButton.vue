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
.fieldZone
  display: block
  margin-bottom: 10px
.label
  display: block
  font-size: 30px
  font-weight: bold
.input
  width: 100%
  font-size: 20px
  padding: 4px
  border: 1px solid transparent
  background-color: transparent
  outline: none
  color: #fff
  &::placeholder
    color: rgba(#fff, 0.6)
  &:focus
    border-bottom: 1px solid #fff
.slider
  -webkit-appearance: none
  height: 25px
  background: none
  outline: none
  transition: background .2s
  background: linear-gradient(to bottom, transparent 49%, #d3d3d3 50%, transparent 51%)
  &::-webkit-slider-thumb
    -webkit-appearance: none
    appearance: none
    width: 25px
    height: 25px
    border-radius: 50%
    background-color: #4CAF50
    cursor: pointer
.volumeInd
  vertical-align: top
  line-height: 29px
  margin-left: 10px
.searcher
  input
    width: calc(100% - 120px)
.crudSection
  height: calc(100% - 50px)
  display: flex
  .column
    width: 50%
  .results
    overflow: auto
    max-height: calc(100% - 88px)
</style>

<template lang="pug">
  .crudButton
    .crudSection
      template(v-if="showAudio")
        .column
          .fieldZone
            label.label(for="text") Text
            input#text.input(v-model="text" placeholder="Display text")
          .fieldZone
            label.label(for="image") Image
            input#image.input(v-model="image" placeholder="URL to image")
          .fieldZone
            label.label(for="sound") Sound
            input#sound.input(v-model="sound" placeholder="Url to mp3")
          .fieldZone
            label.label(for="volume") Volume
            input#volume.slider(type="range" min="0" max="10" v-model="volume")
            span.volumeInd {{volume}}
        .column
          .fieldZone.searcher
            label.label(for="search") Search for sfx
            input#search.input(v-model="searchT" placeholder="its over 9000")
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
          .fieldZone
            label.label(for="enableOl") Enable overlay
            input#enableOl(type="checkbox" value="true" v-model="overlaySettings.enable")
          .fieldZone
            label.label(for="animationIn") Animation In
            input#animationIn.input(v-model="overlaySettings.animationIn" placeholder="Time of enter animation")
          .fieldZone
            label.label(for="animationOut") Animation Out
            input#animationOut.input(v-model="overlaySettings.animationOut" placeholder="Time of exit animation")
          .fieldZone
            label.label(for="duration") Duration
            input#duration.input(v-model="overlaySettings.duration" placeholder="infinite")
          .fieldZone
            label.label(for="olImage") Overlay image
            input#olImage.input(v-model="overlaySettings.image" placeholder="Url")
        .column
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
        volume: this.volume / 10,
        overlaySettings: this.overlaySettings
      })
    }
  },
  mounted () {
    if (this.isNew) return
    this.image = this.value.image
    this.text = this.value.text
    this.sound = this.value.sound
    this.volume = this.value.volume * 10
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
    stateEditor
  }
}
</script>
