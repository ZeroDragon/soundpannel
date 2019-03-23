<style lang="sass">
.cloud
  display: flex
.icon
  cursor: pointer
  &.online
    color: indianred
  .out
    display: initial
  .hover
    display: none
  &:hover
    .out
      display: none
    .hover
      display: initial
  
</style>
<template lang="pug">
.cloud
  template(v-if="active")
    .icon.online
      i.sp-cloud-ok.out
      i.sp-cloud-down.hover(@click="toggleCloud")
  template(v-else)
    .icon
      i.sp-cloud.out
      i.sp-cloud-up.hover(@click="toggleCloud")
</template>
<script>
export default {
  data: () => ({
    active: false,
    cloudUrl: ''
  }),
  methods: {
    async toggleCloud () {
      this.active = !this.active
      const action = { true: 'startCloud', false: 'stopCloud' }[this.active]
      const response = await window.fetch(`${this.serverUrl}${action}`)
      const json = await response.json()
      this.cloudUrl = json.url
    },
    async checkStatus () {
      const response = await window.fetch(`${this.serverUrl}cloudStatus`)
      const json = await response.json()
      this.active = false
      this.cloudUrl = ''
      if (json.status === 'online') {
        this.active = true
        this.cloudUrl = json.url
      }
    }
  },
  mounted () {
    this.checkStatus()
  },
  watch: {
    cloudUrl (current) {
      this.$emit('newUrl', current)
    }
  },
  props: {
    serverUrl: {
      default: ''
    }
  }
}
</script>
