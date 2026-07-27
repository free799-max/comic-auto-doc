import DefaultTheme from 'vitepress/theme'
import Carousel from './components/Carousel.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.component('Carousel', Carousel)
  }
}
