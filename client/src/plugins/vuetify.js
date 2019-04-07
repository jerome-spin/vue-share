import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import 'vuetify/dist/vuetify.min'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: colors.teal.lighten1,
    secondary: colors.teal.lighten3,
    accent: colors.red.lighten1,
    error: colors.red.accent1,
    warning: colors.amber.base,
    info: colors.blue.accent3,
    success: colors.green.darken4
  }
})
