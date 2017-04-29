import $ from 'jquery'
import { IndexView } from './indexView.js'

$(() => {
  if ($('body').hasClass('index')) {
    const indexView = new IndexView()
    indexView.render()
  }
})
