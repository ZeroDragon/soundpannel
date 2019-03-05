<style lang="sass" scoped>
.crudButton
  position: fixed
  top: 26px
  left: 0
  width: 100%
  height: calc(100% - 26px)
  background-color: #00497d
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
    btn(:action="save" v-if="sound !== ''").green Save
    btn(:action="cancel") Cancel
    btn(:action="del" v-if="!isNew").red Delete
</template>
<script>
import btn from './btn.vue'
export default {
  data: () => ({
    image: '',
    text: '',
    sound: ''
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
        sound: this.sound
      })
    }
  },
  mounted () {
    if (this.isNew) return
    this.image = this.value.image
    this.text = this.value.text
    this.sound = this.value.sound
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
