import R from 'ramda'
import $ from 'jquery'

export const minElement = array => R.reduce((min, current) => R.min(min, current), Infinity, array)

export const makeDraggable = () => {
  $('.toolbar .add-el').draggable({
    appendTo: 'body',
    containment: 'body',
    helper() {
      return $(this).clone()
    }
  })
}
