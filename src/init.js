import i18n from 'i18next'
import resources from './locales/index.js'
import runApp from './app.js'

export default () => {
  i18n.init({
    lng: 'ru',
    resources,
  })
    .then(() => runApp(i18n))
    .catch(() => {})
}
