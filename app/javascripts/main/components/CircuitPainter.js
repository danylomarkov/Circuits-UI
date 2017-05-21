import { jsPlumb, jsPlumbUtil } from 'jsplumb'
import { View } from 'backbone'
import $ from 'jquery'
import R from 'ramda'
import {
  AndElement, OrElement, XorElement, NotElement,
  Generator, Indicator, Coupler,
  NAndElement, NOrElement, XNorElement,
  RSTrigger, EncoderElement, DecoderElement,
  SevenSegmentIndicator, MacroElement
} from './Elements.js'
import { ElementType } from '../../ElementType.js'
import { APIManager } from '../../API/APIManager.js'

const contextMenu = (type, position) =>
  `<div class='context-menu' style="top: ${position.top}px; left: ${position.left}px">
    <span>Delete ${type}</span>
  </div>`

const getElementId = event => event.currentTarget.getAttribute('id')

const getPosition = (element) => ({
  left: element.offset().left,
  top: element.offset().top,
  right: element.offset().left + element.outerWidth(),
  bottom: element.offset().top + element.outerHeight()
})

export class CircuitPainter extends View {
  constructor(options) {
    const newOptions = R.merge(options, {
      events: {
        'contextmenu .element': 'changeContextMenu',
        'change .element': 'onElementChange',
        'dblclick .element': 'onElementDblClick',
        'click': 'onSchemeClick',
        'mousedown': 'onSchemeMouseDown',
        'mousemove': 'onSchemeMouseMove',
        'mouseup': 'onSchemeMouseUp',
        'click .create-macro': 'onCreateMacro'
      }
    })
    super(newOptions)
  }

  initialize(options) {
    const that = this
    this.errorModal = options.errorModal
    this.macroModal = options.macroModal
    this.elements = {}
    this.macroElements = {
      mymacro: { // example
        elements: [],
        connections: [],
        inPorts: [],
        outPorts: []
      }
    }
    this.rubberbandStartPoint = { x: 0, y: 0 }
    this.$el.droppable({
      drop(e, ui) {
        that.createElement($(this), ui)
      }
    })
  }

  render() {
    const that = this
    jsPlumb.ready(() => {
      jsPlumb.setContainer(this.$el)

      jsPlumb.bind('connection', info => {
        if (info.sourceId === info.targetId) {
          jsPlumb.detach(info.connection)
        }
        that.calcCircuit()
      })

      jsPlumb.bind('contextmenu', (connection, e) => {
        e.preventDefault()
        that.closeContextMenu()
        that.openConnectionContextMenu(e, connection)
      })
    })
  }

  onCreateMacro() {
    const selectedElements = this.selectedElements()
    if (!R.isEmpty(selectedElements)) {
      this.macroModal.show(selectedElements, this.macroElements)
      this.removeSelection()
    }
  }

  onElementDblClick(e) {
    this.elements[getElementId(e)].toggleSelection()
  }

  onElementChange() {
    this.calcCircuit()
  }

  onSchemeClick(e) {
    this.closeContextMenu()
    if (!$(e.target).hasClass('circuit')) return
    if (this.rubberbandStartPoint.x === e.pageX && this.rubberbandStartPoint.y === e.pageY) {
      this.removeSelection()
    }
  }

  onSchemeMouseDown(e) {
    if (!$(e.target).hasClass('circuit')) return
    this.rubberbandStartPoint = { x: e.pageX, y: e.pageY }
    $('#rubberband').css({ top: e.pageY, left: e.pageX, height: 1, width: 1 })
    $('#rubberband').show()
  }

  onSchemeMouseMove(e) {
    if (!$('#rubberband').is(':visible')) return
    const width = event.pageX - this.rubberbandStartPoint.x
    const height = event.pageY - this.rubberbandStartPoint.y
    $('#rubberband').css({
      top: (event.pageY > this.rubberbandStartPoint.y) ? this.rubberbandStartPoint.y : event.pageY,
      left: (event.pageX >= this.rubberbandStartPoint.x) ? this.rubberbandStartPoint.x : event.pageX,
      height: (event.pageY > this.rubberbandStartPoint.y) ? height : (height * -1),
      width: (event.pageX > this.rubberbandStartPoint.x) ? width : (width * -1)
    })
    this.findSelectedElements()
  }

  onSchemeMouseUp(e) {
    if (!$('#rubberband').is(':visible')) return
    $('#rubberband').hide()
  }

  openElementContextMenu(e) {
    $('body').append(contextMenu('element', { left: e.clientX, top: e.clientY }))
    $('.context-menu').on('click', () => this.deleteElement(getElementId(e)))
  }

  openConnectionContextMenu(e, connection) {
    $('body').append(contextMenu('connection', { left: e.clientX, top: e.clientY }))
    $('.context-menu').on('click', () => this.deleteConnection(connection))
  }

  deleteElement(id) {
    jsPlumb.remove(id)
    delete this.elements[id]
    this.closeContextMenu()
    this.calcCircuit()
  }

  deleteConnection(connection) {
    jsPlumb.detach(connection)
    this.closeContextMenu()
    this.calcCircuit()
  }

  closeContextMenu() {
    $('.context-menu').remove()
  }

  removeSelection() {
    R.forEachObjIndexed(element => element.removeSelection(), this.elements)
  }

  findSelectedElements() {
    const rubberbandPosition = getPosition($('#rubberband'))
    R.forEachObjIndexed(element => {
      const elementPosition = getPosition($(`#${element.id}`))
      /* check if two rectangles overlap */
      if (!(
        rubberbandPosition.bottom < elementPosition.top ||
        rubberbandPosition.left > elementPosition.right ||
        rubberbandPosition.top > elementPosition.bottom ||
        rubberbandPosition.right < elementPosition.left
      )) {
        element.addSelection()
      } else {
        element.removeSelection()
      }
    }, this.elements)
  }

  selectedElements() {
    return R.filter(element => element.selected, this.elements)
  }

  changeContextMenu(e) {
    e.preventDefault()
    this.closeContextMenu()
    this.openElementContextMenu(e)
  }

  getJSON() {
    const result = {
      elements: [],
      connections: []
    }
    jsPlumb.select().each((connection) => {
      result.connections.push(connection.getParameters())
    })
    result.elements = R.mapObjIndexed(elem => ({
      id: elem.id,
      type: elem.type,
      value: elem.type === ElementType.OnePortGenerator ? elem.getValue() : undefined
    }), this.elements)
    return result
  }

  calcCircuit() {
    const that = this
    APIManager.calcCircuit(
      this.getJSON()
    ).then(data => {
      that.applyResult(data)
    }).catch(response => {
      that.errorModal.show(response)
    })
  }

  applyResult(results) {
    const that = this
    R.forEachObjIndexed(elem => elem.reset(), this.elements)
    results.forEach(result => that.elements[result.id].setValues(result))
  }

  createElement($target, ui) {
    const id = jsPlumbUtil.uuid()
    const position = {
      top: ui.offset.top - $target.offset().top,
      left: ui.offset.left - $target.offset().left
    }
    switch (ui.draggable.context.id) {
      case 'and-drag': {
        this.elements[id] = new AndElement(id, position)
        break
      }
      case 'or-drag': {
        this.elements[id] = new OrElement(id, position)
        break
      }
      case 'not-drag': {
        this.elements[id] = new NotElement(id, position)
        break
      }
      case 'xor-drag': {
        this.elements[id] = new XorElement(id, position)
        break
      }
      case 'gen-drag': {
        this.elements[id] = new Generator(id, position)
        break
      }
      case 'ind-drag': {
        this.elements[id] = new Indicator(id, position)
        break
      }
      case 'coup-drag': {
        this.elements[id] = new Coupler(id, position)
        break
      }
      case 'nand-drag': {
        this.elements[id] = new NAndElement(id, position)
        break
      }
      case 'nor-drag': {
        this.elements[id] = new NOrElement(id, position)
        break
      }
      case 'xnor-drag': {
        this.elements[id] = new XNorElement(id, position)
        break
      }
      case 'rs-drag': {
        this.elements[id] = new RSTrigger(id, position)
        break
      }
      case 'enc-drag': {
        this.elements[id] = new EncoderElement(id, position)
        break
      }
      case 'dec-drag': {
        this.elements[id] = new DecoderElement(id, position)
        break
      }
      case 'ind-seven-drag': {
        this.elements[id] = new SevenSegmentIndicator(id, position)
        break
      }
      default: {
        if ($(ui.draggable.context).hasClass('add-macro')) {
          const name = ui.draggable.context.id.split('-drag')[0] // TODO fix
          this.elements[id] = new MacroElement(
            id, position, name, this.macroElements[name].inPorts, this.macroElements[name].outPorts
          )
        }
      }
    }
    this.calcCircuit()
  }
}
