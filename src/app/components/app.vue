<style lang="sass" scoped>
.appSection
  display: flex
  flex-direction: column
  height: calc(100% - 26px)
  .buttons, .config
    padding: 6px
  .buttons
    height: 100%
    overflow: auto
  .config
    border-top: 1px dashed rgba(#fff, 0.4)
    text-align: center
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
      .config(v-if="agent=== 'server'")
        |Open this url in your smartphone: {{serverUrl}}
</template>

<script>
import io from 'socket.io-client'
import { getUserIP } from '../ipFinder'
import appHeader from './header.vue'
import soundButton from './soundButton.vue'

export default {
  data: () => ({
    buttons: [],
    agent: 'client',
    serverUrl: window.location.href,
    socket: null
  }),
  methods: {
    async loadFromMemory () {
      this.socket = io(this.serverUrl)
      const response = await window.fetch(`${this.serverUrl}buttons.json`)
      const json = await response.json()
      this.buttons = json.map((itm, index) => {
        itm.key = index + 1
        return itm
      })
    },
    async saveToMemory () {
      const response = await window.fetch(`${this.serverUrl}buttons.json`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(this.buttons)
      })
      const json = await response.json()
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
    if (this.agent === 'server') {
      getUserIP(ip => {
        this.serverUrl = `http://${ip}:3000/`
        this.loadFromMemory()
      })
    } else {
      this.loadFromMemory()
    }
  }
}
</script>

