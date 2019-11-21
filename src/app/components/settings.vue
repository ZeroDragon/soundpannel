<style lang="sass" scoped>
p
  font-size: 12px
  opacity: 0.5
  margin-bottom: 0
.field
  display: block
  width: 100%
  margin: 5px 0 20px
  color: #fff
  background-color: transparent
  border: none
  font-size: 16px
  outline: none
.btn
  margin-left: 0
.textarea
  width: 100%
  margin: 5px 0
  color: #000
  code
    outline: none
</style>

<template lang="pug">
  .settings
    b Output device
    p Select any desired output device for all sounds
    select.field(v-model="settings.deviceId")
      option(v-for="(device, k) in audioDevices" :value="device.deviceId") {{device.label}}
    b Ngrok location
    p
      |Ngrok is used to create a unique URL for your Sound Pannel that can be used for overlaying or remote controller over the internet.
      <br/><br/>
      |You can get ngrok from https://ngrok.com/
    input.field(v-model="settings.ngrok" placeholder="/path/to/ngrok c:\\path\\to\\ngrok.exe")
    b Discord
    p Get discord live chat on your stream, you'll need a discord token
    input.field(v-model="settings.discordToken", placeholder="Discord token")
    p and define a discord channel
    input.field(v-model="settings.discordChannel", placeholder="discord channel")

    b Youtube
    p To get youtube live chat on your stream, You'll need to setup a restream free account and get the token from their chat
    input.field(v-model="settings.restreamToken", placeholder="Restream chat token")

    b Chat stylesheet
    p This are the styles that are in the chat overlay. To reset them to default, just erase everything and click save.
    pre.textarea: code.css(ref="styleSheet" contenteditable="true") {{settings.chatStyles}}
    btn.green(:action="saveUserSettings")
      i.sp-checkmark
      |&nbsp;&nbsp;{{saving}}
    exporter
</template>
<script>
import btn from './btn.vue'
import { store, mutations } from '../store'
import { loadFromMemory, saveToMemory } from '../api'
import exporter from './exporter.vue'
import defaultStyles from '../defaultStyles'
export default {
  data: () => ({
    settings: {},
    updating: false,
    timeout: 0,
    exportPath: null
  }),
  methods: {
    async openWebAmp () {
      await window.fetch('/openWebAmp')
    },
    async saveUserSettings () {
      if (this.updating) return
      this.updating = true
      this.timeout = new Date().getTime()
      this.settings.chatStyles = this.$refs.styleSheet.innerText
      await saveToMemory(`${this.serverUrl}settings.json`, this.settings)
      this.getUserSettigns()
    },
    async setupStyles () {
      if (this.settings.chatStyles == null || this.settings.chatStyles === '') {
        this.settings.chatStyles = defaultStyles
        await saveToMemory(`${this.serverUrl}settings.json`, this.settings)
        this.getUserSettigns()
      }
      setTimeout(() => {
        hljs.highlightBlock(this.$refs.styleSheet)
      }, 100)
    },
    async getUserSettigns () {
      const json = await loadFromMemory(`${this.serverUrl}settings.json`)
      json.deviceId = json.deviceId || 'default'
      this.settings = json
      this.setupStyles()
      mutations.set('deviceId', this.settings.deviceId)
      this.timeout = new Date().getTime() - this.timeout
      setTimeout(() => {
        this.updating = false
      }, 1000 - this.timeout)
    }
  },
  computed: {
    serverUrl () { return store.serverUrl },
    audioDevices () { return store.audioDevices },
    saving () {
      if (!this.updating) return 'Save'
      return 'Saving...'
    }
  },
  mounted () {
    this.getUserSettigns()
  },
  components: {
    btn,
    exporter
  }
}
</script>
