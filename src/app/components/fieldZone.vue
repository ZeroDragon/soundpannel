<style lang="sass" scoped>
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
p
  font-size: 12px
  opacity: 0.5
  margin-bottom: 0
</style>

<template lang="pug">
  .fieldHolder
    .fieldZone(v-if="placeholder")
      label.label(:for="itm") {{label}}
      p(v-if="p" v-html="p")
      input.input(
        :key="itm"
        :value="value"
        @input="emit"
        :placeholder="placeholder"
      )
      slot
    .fieldZone(v-else)
      label.label(:for="itm") {{label}}
      input#volume.slider(
        :key="itm"
        type="range"
        min="0"
        max="10"
        :value="value"
        @input="emit"
      )
      span.volumeInd {{value}}
</template>
<script>
export default {
  methods: {
    emit (e) {
      this.$emit('input', e.target.value)
    }
  },
  props: ['value', 'placeholder', 'label', 'itm', 'p']
}
</script>
