<style lang="sass" scoped>
.mainApp
  position: relative
  overflow: hidden
.appSection
  display: flex
  flex-direction: column
  height: calc(100% - 26px)
  .buttons, .config
    padding: 6px
  .buttons
    height: 100%
    overflow: auto
  .dropZone
    height: 100px
    width: 20px
    display: inline-block
    margin: 10px -10px
    vertical-align: top
    color: #000
    position: relative
    z-index: 9999
    .drop
      position: absolute
      width: 120px
      height: 100px
      left: -50px
  .config
    border-top: 1px dashed rgba(#fff, 0.4)
    display: flex
    justify-content: center
</style>

<template lang="pug">
  .mainApp
    appHeader
    .appSection
      .buttons
        .dropZone(v-if="isVisible(-1)")
          .drop(
            @dragover.prevent="dragover"
            @drop.prevent="drop(0)"
          )
        template(v-for="(button, k) in buttons")
          soundButton(
            :key="button.key"
            :button="button"
            :socket="socket"
            @update="changeButton"
            @del="del"
            @dragstart="dragstart"
            @dragend="dragend"
          )
          .dropZone(v-if="isVisible(k)")
            .drop(
              @dragover.prevent="dragover"
              @drop.prevent="drop(k + 1)"
            )
        soundButton(
          :isNew="true"
          @update="changeButton"
          v-if="agent === 'server'"
        )
      .config(v-if="agent=== 'server'")
        cloud(
          :serverUrl="serverUrl"
          @newUrl="updateServer"
        )
        | &nbsp;&nbsp;
        i.sp-tablet
        | &nbsp;{{bottomUrl}}
        | &nbsp;&nbsp;
        i.sp-display
        | &nbsp;{{bottomUrl}}overlay
    help(v-if="agent=== 'server'")
</template>

<script>
import io from 'socket.io-client'
import { getUserIP } from '../ipFinder'
import { store, mutations } from '../store'
import { loadFromMemory, saveToMemory } from '../api'
import appHeader from './header.vue'
import soundButton from './soundButton.vue'
import help from './help.vue'
import cloud from './cloud.vue'
import { loadavg } from 'os';

export default {
  data: () => ({
    buttons: [],
    bottomUrl: `${window.location.origin}/`,
    socket: null,
    draggingItem: null
  }),
  methods: {
    isVisible (index) {
      if (!this.draggingItem) return false
      const itemIndex = this.buttons
        .map((item,k) => {
          if (item.sound === this.draggingItem.sound) return k
          return false
        })
        .find(item => item !== false)
      if (index === itemIndex) return false
      if (index + 1 === itemIndex) return false
      return true
    },
    dragstart (item) {
      this.draggingItem = item
    },
    dragend () {
      this.draggingItem = null
    },
    dragover () {},
    drop (index) {
      const itm = JSON.parse(JSON.stringify(this.draggingItem))
      this.buttons = this.buttons
        .map(bt => {
          bt.toDelete = false
          if (bt.sound !== itm.sound) return bt
          bt.toDelete = true
          return bt
        })
      this.buttons.splice(index, 0, itm)
      this.buttons = this.buttons.filter(bt => !bt.toDelete)
      this.saveToMemory()
    },
    async loadFromMemory () {
      const json = await loadFromMemory(`${this.serverUrl}buttons.json`)
      this.buttons = json.map((itm, index) => {
        itm.key = index + 1
        return itm
      })
    },
    async saveToMemory () {
      await saveToMemory(`${this.serverUrl}buttons.json`, this.buttons)
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
        volume: data.volume,
        overlaySettings: data.overlaySettings,
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
      btn.volume = shadow.volume
      btn.overlaySettings = shadow.overlaySettings
      btn.key = Math.round((Math.random() * 1000) * (Math.random() * 1000))
      btn.key = button.key
      this.saveToMemory()
    },
    updateServer (newUrl) {
      if (newUrl === '') {
        this.bottomUrl = this.serverUrl
        return
      }
      this.bottomUrl = `${newUrl}/`
    }
  },
  async beforeMount () {
    const agent = navigator.userAgent.toLowerCase()
    if (agent.indexOf('electron') !== -1) {
      mutations.set('agent', 'server')
    }
    if (this.agent === 'server') {

      const devices = await navigator.mediaDevices.enumerateDevices()
      const audioDevices = devices.filter(device => device.kind === 'audiooutput')
      mutations.set('audioDevices', audioDevices)

      getUserIP(ip => {
        mutations.set('serverUrl',`http://${ip}:3000/`)
        this.bottomUrl = this.serverUrl
        this.socket = io(this.serverUrl)
        this.loadFromMemory()
      })
    } else {
      this.socket = io(this.serverUrl)
      this.loadFromMemory()
    }
  },
  computed: {
    serverUrl () { return store.serverUrl },
    agent () { return store.agent }
  },
  components: {
    appHeader,
    soundButton,
    help,
    cloud
  }
}
</script>
