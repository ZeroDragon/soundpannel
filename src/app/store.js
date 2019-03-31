import Vue from 'vue'

export const store = Vue.observable({
  serverUrl: `${window.location.origin}/`,
  agent: 'client',
  audioDevices: [],
  deviceId: 'default'
})

export const mutations = {
  set (key, val) {
    store[key] = val
  }
}
