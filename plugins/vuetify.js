import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify)
Vue.mixin({
  methods: {
    noResultText(search) {
      return `Aradığınız "${search.toUpperCase()}" kelime ile ilgili bir sonuç bulunamadı`
    },
    titleColor(title) {
      if (title.length == 100) return "red";
    },
  },
})