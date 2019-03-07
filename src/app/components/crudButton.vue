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
</style>

<template lang="pug">
  .crudButton
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
    btn(:action="save" v-if="sound !== ''").blue Save
    btn(:action="cancel") Cancel
    btn(:action="del" v-if="!isNew").red Delete
</template>
<script>
import btn from './btn.vue'
export default {
  data: () => ({
    image: '',
    text: '',
    sound: '',
    volume: 10
  }),
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    del () {
      this.$emit('del')
    },
    save () {
      if (this.sound === '') return
      this.$emit('update', {
        image: this.image,
        text: this.text,
        sound: this.sound,
        volume: this.volume / 10
      })
    }
  },
  mounted () {
    if (this.isNew) return
    this.image = this.value.image
    this.text = this.value.text
    this.sound = this.value.sound
    this.volume = this.value.volume * 10
  },
  props: {
    value: {},
    isNew: {
      default: false
    }
  },
  components: {
    btn
  }
}
</script>
