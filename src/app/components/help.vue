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
p
  opacity: 0.5
h3
  margin-top: 0
.icon
  position: absolute
  top: 10px
  right: 10px
  width: 20px
  height: 20px
  text-align: center
  font-size: 20px
  line-height: 20px
  cursor: pointer
  &.open
    left: -30px
.helpSection
  top: 10px
  left: 10px
  width: calc(100% - 20px)
  height: calc(100% - 20px)
  position: absolute
  display: flex
  .column
    width: 50%
    padding: 0 5px
    overflow: auto
</style>

<template lang="pug">
  .help(:style="{left: left + '%'}")
    .holder
      .icon.open(@click="open" v-show="left===100"): i.sp-cog
      .helpSection
        .column
          fieldZone.searcher(
            label="Ngrok location"
            v-model="settings.ngrok"
            itm="ngrok"
            placeholder="/absolute/path/to/ngrok"
            p=`
              Ngrok is used to create a unique URL for your Sound Pannel that can be used for overlaying or remote controller over the internet.
              <br/><br/>
              You can get ngrok from https://ngrok.com/
            `
          )
            btn.green(:action="saveUserSettings")
              i.sp-checkmark
              |&nbsp;&nbsp;Save
        .column
          h3 Help
          b Create a new button
          p Just click on the <i class="sp-plus"></i> icon
          b Modify a button
          p Right click on an existing item
          b Delete a buttom
          p There is a delete button inside the edit section
          b Change the order of buttons
          p You can drag-and-drop them to desired location
          b Remote controller
          p.
            You can control your SoundPannel from any smartphone or tablet connected to the same network.
            Just open the URL after the <i class="sp-tablet"></i> icon
          b Broadcast overlay
          p.
            You can also add custom overlays to your broadcast on any software that supports adding a web browser.
            Just add a web view on your broadcast software and point it to the URL after the <i class="sp-display"></i> icon
          b Activate the internet
          p.
            Once Ngrok is configurated, just click the <i class="sp-cloud"></i> icon on the app footer to toggle it.
          b Author: ZeroDragon (Carlos Flores)
          p.
            - twitter.com/zerodragon <br/>
            - github.com/zerodragon <br/>
            - telegram.me/zerodragon <br/>
            - floresbenavides.com
      .icon(@click="close" v-show="left===0"): i.sp-cross
</template>
<script>
import fieldZone from './fieldZone.vue'
import btn from './btn.vue'
export default {
  data: () => ({
    left: 100,
    settings: {}
  }),
  methods: {
    open () {
      this.left = 0
    },
    close () {
      this.left = 100
    },
    async saveUserSettings () {
      const response = await window.fetch(`${this.serverUrl}settings.json`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(this.settings)
      })
      const json = await response.json()
    },
    async getUserSettigng () {
      const response = await window.fetch(`${this.serverUrl}settings.json`)
      const json = await response.json()
      this.settings = json
    }
  },
  mounted () {
    this.getUserSettigng()
  },
  components: {
    fieldZone,
    btn
  },
  props: {
    serverUrl: {
      default: ''
    }
  }
}
</script>
