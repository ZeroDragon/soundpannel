<style lang="sass" scoped>
.previewAnimation
  width: 370px
  height: 208px
  background-color: rgba(#fff, 0.3)
  overflow: hidden
  .screen
    width: 256px
    height: 144px
    position: relative
    background-color: #fff
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    color: #000
  .text
    position: absolute
    bottom: -20px
    width: 100%
    text-align: center
  .item
    position: absolute
    background-repeat: no-repeat
    background-position: center
    background-size: cover
    &.start
      border: 2px dashed blue
    &.finish
      border: 2px dashed green
</style>

<template lang="pug">
  .previewAnimation
    .screen
      .text 1280 x 720
      .item.start(:style="start")
      .item.finish(:style="finish")
</template>

<script>
const transformSize = (size) => {
  if (size.indexOf('calc') !== -1) {
    const [left, sign, right] = size
      .replace('calc(', '')
      .replace(')', '')
      .split(' ')
    const val = [
      transformSize(left),
      sign,
      transformSize(right)
    ].join(' ')
    return `calc(${val})`
  }
  if (size.slice(-2) !== 'px') return size
  return `${parseInt(size, 10) / 10}px`
}
export default {
  methods: {
    parseVals (id) {
      const retval = {}
      Object.keys(this.settings[id]).forEach(key => {
        retval[key] = transformSize(this.settings[id][key])
      })
      retval['background-image'] = `url('${this.settings.image}')`
      retval.opacity = this.settings[id].opacity
      return retval
    }
  },
  computed: {
    start () {
      return this.parseVals('start')
    },
    finish () { return Object.assign(this.parseVals('start'), this.parseVals('finish')) }
  },
  props: ['settings']
}
</script>
