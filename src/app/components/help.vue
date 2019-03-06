<style lang="sass" scoped>
.help
  position: absolute
  top: 26px
  width: 100%
  height: calc(100% - 26px)
  transition: left 500ms ease
.holder
  position: relative
  width: 100%
  height: 100%
  background-color: #4f5b62
.icon
  position: absolute
  top: 10px
  left: 10px
  width: 20px
  height: 20px
  text-align: center
  line-height: 20px
  background-color: #4f83cc
  border-radius: 50%
  cursor: pointer
  &.open
    left: -30px
.helpSection
  top: 40px
  left: 40px
  width: calc(100% - 80px)
  height: calc(100% - 80px)
  position: absolute
  display: flex
  overflow: auto
  .column
    width: 50%
</style>

<template lang="pug">
  .help(:style="{left: left + '%'}")
    .holder
      .icon.open(@click="open" v-show="left===100") ?
      .helpSection
        .column
          h2 Create a new button
          p Just click on the [ + ] icon
          h2 Modify a button
          p Right click on an existing item
          h2 Delete a buttom
          p There is a delete button inside the edit section
          h2 Change the order of buttons
          p You can drag-and-drop them to desired location
        .column
          h2 Remote controller
          p Open the url that is shown at the bottom of the app in your smartphone to operate your Sound Pannel from there
          h2 Author
          h3 ZeroDragon (Carlos Flores)
          p twitter.com/zerodragon
          p github.com/zerodragon
          p telegram.me/zerodragon
          p floresbenavides.com
      .icon(@click="close" v-show="left===0") X
</template>
<script>
export default {
  data: () => ({
    left: 100
  }),
  methods: {
    open () {
      this.left = 0
    },
    close () {
      this.left = 100
    }
  }
}
</script>
