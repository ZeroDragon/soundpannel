<style lang="sass" scoped>
.exporter
  .btn
    margin-left: 0
    margin-top: 10px
  p
    font-size: 12px
    opacity: 0.5
    margin-bottom: 0
  b
    display: block
    margin: 20px 0 10px
  input
    display: none
</style>

<template lang="pug">
  .exporter
    b Import / Export buttons
    p.
      You can export your configured buttons to another computer
      WARNING: Importing will override existing buttons
    btn.blue(:action="downloadBtns") Export
    btn.green(:action="clickInput") Import
    input(
      type="file"
      ref="fileSelector"
      accept=".json"
      @change="uploadBtns"
    )
</template>
<script>
import { saveToMemory } from '../api'
import { store } from '../store'
import btn from './btn.vue'

export default {
  data: () => ({
    exportPath: null
  }),
  computed: {
    serverUrl () { return store.serverUrl }
  },
  methods: {
    async downloadBtns () {
      await window.fetch(`${this.serverUrl}downloadbuttons`)
    },
    clickInput () {
      this.$refs.fileSelector.click()
    },
    async uploadBtns () {
      const f = this.$refs.fileSelector.files[0]
      const reader = new FileReader()
      reader.readAsText(f)
      reader.onload = (theFile => {
        return async e => {
          const json = JSON.parse(e.target.result)
          await saveToMemory(`${this.serverUrl}buttons.json?willReload=true`, json)
        }
      })(f)
    }
  },
  components: {
    btn
  }
}
</script>
