<style lang="sass" scoped>
.btn
  display: inline-block
  min-width: 100px
  text-align: center
  user-select: none
  background-color: #ccc
  color: #000
  padding: 4px
  border-radius: 6px
  margin: 0 10px
  cursor: pointer
  color: #fff
  background-color: #909090
  &.tiny
    min-width: 0
    font-size: 12px
    padding: 2px 4px
    margin: 0 2px
    border-radius: 2px
    i
      line-height: 14px
  &:hover
    background-color: darken(#909090, 10%)
  &.blue
    background-color: #4f83cc
    &:hover
      background-color: darken(#4f83cc, 10%)
  &.green
    background-color: darken(#4CAF50, 10%)
    &:hover
      background-color: darken(#4CAF50, 20%)
  &.red
    background-color: #ff7158
    &:hover
      background-color: darken(#ff7158, 10%)
</style>

<template lang="pug">
  .btn(
    @click="action"
  ): slot
</template>
<script>
export default {
  props: {
    action: {
      default: () => {}
    }
  }
}
</script>
