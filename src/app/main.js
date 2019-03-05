import Vue from 'vue'
import App from './components/app.vue'

(() => {
  const vue = new Vue({
    el: '#app',
    render: h => h(App)
  })
  return vue
})()
