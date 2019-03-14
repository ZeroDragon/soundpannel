<style lang="sass" scoped>
.stateEditor
  .section
    width: 100%
    display: flex
    padding: 2px 0
    &.new
      margin-top: 4px
  span.key, select.key
    width: 100px
    text-align: right
    margin-right: 10px
</style>

<template lang="pug">
  .stateEditor
    .section(v-for="(val, key) in shadow")
      span.key {{key}}
      input(:value="val" @input="update($event.target.value, key)")
      btn.red.tiny(:action="() => {deleteKey(key)}") delete
    .section.new(v-show="optionsLeft.length > 0")
      select.key(v-model="newKey")
        option(:value="null" disabled) Select one
        option(v-for="opt in optionsLeft" :value="opt") {{opt}}
      input(v-model="newVal")
      btn.blue.tiny(:action="insertKey") insert
</template>
<script>
import btn from './btn.vue'
export default {
  data: () => ({
    newKey: null,
    newVal: null,
    shadow: {},
    options: [
      'top', 'bottom', 'left', 'right', 'width', 'height', 'opacity'
    ]
  }),
  computed: {
    optionsLeft () {
      const acum = []
      this.options.forEach(opt => {
        if (!this.shadow[opt]) acum.push(opt)
      })
      return acum
    }
  },
  methods: {
    triggerUpdate() {
      this.$emit('input', this.shadow)
      this.$forceUpdate()
    },
    deleteKey(key) {
      delete this.shadow[key]
      this.triggerUpdate()
    },
    insertKey() {
      this.shadow[this.newKey] = this.newVal
      this.triggerUpdate()
      this.newKey = null
      this.newVal = null
    },
    update (newVal, key) {
      this.shadow[key] = newVal
      this.triggerUpdate()
    }
  },
  watch: {
    value (newVal) {
      this.shadow = JSON.parse(JSON.stringify(newVal))
    }
  },
  mounted () {
    this.shadow = JSON.parse(JSON.stringify(this.value))
  },
  components: {
    btn
  },
  props: {
    value: {
      default: {}
    }
  }
}
</script>
