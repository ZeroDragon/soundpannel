<style lang="sass" scoped>
.appSection
  display: flex
  height: calc(100% - 26px)
  .buttons, .config
    padding: 6px
  .buttons
    width: 100%
    overflow: auto
  .config
    width: 250px
    border-left: 1px dashed rgba(#fff, 0.4)
</style>

<template lang="pug">
  .mainApp
    appHeader
    .appSection
      .buttons
        soundButton(
          v-for="button in buttons"
          :key="button.key"
          :button="button"
          :agent="agent"
          :socket="socket"
          @update="changeButton"
          @del="del"
        )
        soundButton(
          :isNew="true"
          @update="changeButton"
          v-if="agent === 'server'"
        )
      .config(v-if="agent === 'server'")
</template>

<script>
import io from 'socket.io-client'
import appHeader from './header.vue'
import soundButton from './soundButton.vue'

export default {
  data: () => ({
    buttons: [],
    agent: 'client',
    socket: io('http://192.168.0.102:3000')
  }),
  methods: {
    async loadFromMemory () {
      const response = await window.fetch('http://192.168.0.102:3000/buttons.json')
      const json = await response.json()
      this.buttons = json.map((itm, index) => {
        itm.key = index + 1
        return itm
      })
    },
    async saveToMemory () {
      const response = await window.fetch('http://192.168.0.102:3000/buttons.json', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(this.buttons)
      })
      const json = await response.json()
      console.log(json)
    },
    del (button) {
      this.buttons = this.buttons.filter(btn => {
        return btn.key !== button.key
      })
      this.saveToMemory()
    },
    insertButton (data) {
      const btn = {
        sound: data.sound,
        text: data.text,
        image: data.image,
        key: this.buttons.length + 1
      }
      this.buttons.push(btn)
      this.saveToMemory()
    },
    changeButton ({shadow, button}) {
      if (!button) {
        this.insertButton(shadow)
        return
      }
      const btn = this.buttons.find(bt => bt.key === button.key)
      btn.sound = shadow.sound
      btn.text = shadow.text
      btn.image = shadow.image
      btn.key = Math.round((Math.random() * 1000) * (Math.random() * 1000))
      btn.key = button.key
      this.saveToMemory()
    }
  },
  components: {
    appHeader,
    soundButton
  },
  beforeMount () {
    const agent = navigator.userAgent.toLowerCase()
    if (agent.indexOf('electron') !== -1) {
      this.agent = 'server'
    }
    this.loadFromMemory()
  }
}
</script>

