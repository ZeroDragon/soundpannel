<style lang="sass" scoped>
.switchField
  font-size: 30px
  font-weight: bold
  cursor: pointer
  display: flex
  align-items: center
  margin-bottom: 10px
.icon
  margin-right : 10px
  position: relative
  border-radius: 4px
  width: 58px
  height: 5px
  background-color: #000
  .knob
    position: absolute
    top: -12px
    width: 28px
    height: 28px
    border-radius: 4px
    transition: left 200ms linear
  &.disabled .knob
    left: 1px
    background-color: #ff7158
  &.enabled .knob
    left: 28px
    background-color: #4CAF50
</style>

<template lang="pug">
  .switchField(@click="$emit('input', !value)")
    .icon(:class="state"): .knob
    |Overlay is {{state}}
</template>
<script>
export default {
  computed: {
    state () {
      return this.value ? 'enabled' : 'disabled'
    }
  },
  props: {
    value: {}
  }
}
</script>
