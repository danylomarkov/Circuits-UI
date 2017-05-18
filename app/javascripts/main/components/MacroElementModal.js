import { View } from 'backbone'
import $ from 'jquery'
import R from 'ramda'
import { jsPlumb } from 'jsplumb'
import pluralize from 'pluralize'
import { minElement, makeDraggable } from '../../helpers.js'

const portNumber = (type, number, top, left) =>
  `<div class="port" style="top: ${top}px; left: ${left}px;">
    ${type} port ${number}
  </div>`

export class MacroElementModal extends View {
  constructor(options) {
    const newOptions = R.merge(options, {
      events: {
        'click #macro-save': 'onMacroSaveClick'
      }
    })
    super(newOptions)
  }
  show(selectedElements, macroElements) {
    this.macroElements = macroElements

    $('.macro-circuit').empty()
    this.$el.modal('show')

    const selectedElementsIds = Object.keys(selectedElements)
    const selectedDOMElements = $(`${selectedElementsIds.map(id => `#${id}`)}`)
    $('.macro-circuit').append(selectedDOMElements.clone().removeClass('selected'))

    const selectedDOMConnections = []
    jsPlumb.select().each(connection => {
      if (
        R.contains(connection.sourceId, selectedElementsIds) &&
        R.contains(connection.targetId, selectedElementsIds)
      ) {
        selectedDOMConnections.push($(connection.canvas))
      }
    })
    selectedDOMConnections.forEach(connection => $('.macro-circuit').append(connection.clone()))

    const macroPorts = []
    const selectedDOMEndpoints = []
    jsPlumb.selectEndpoints().each(endpoint => {
      if (R.contains(endpoint.elementId, selectedElementsIds)) {
        selectedDOMEndpoints.push($(endpoint.canvas))
        if (
          R.isEmpty(endpoint.connections) ||
          (endpoint.isSource && !R.contains(endpoint.connections[0].targetId, selectedElementsIds)) ||
          (endpoint.isTarget && !R.contains(endpoint.connections[0].sourceId, selectedElementsIds))
        ) {
          macroPorts.push(endpoint)
        }
      }
    })
    selectedDOMEndpoints.forEach(endpoint => $('.macro-circuit').append(endpoint.clone()))

    this.inPorts = []
    this.outPorts = []
    R.sort((port1, port2) => (
      parseFloat($(port1.canvas).css('top')) - parseFloat($(port2.canvas).css('top'))
    ), macroPorts).forEach(port => {
      if (port.isTarget) {
        this.inPorts.push(port)
        const top = parseFloat($(port.canvas).css('top')) - 4
        const left = parseFloat($(port.canvas).css('left')) - 80
        $('.macro-circuit').append(portNumber('input', this.inPorts.length, top, left))
      } else if (port.isSource) {
        this.outPorts.push(port)
        const top = parseFloat($(port.canvas).css('top')) - 4
        const left = parseFloat($(port.canvas).css('left')) + 16
        $('.macro-circuit').append(portNumber('output', this.outPorts.length, top, left))
      }
    })

    const lefts = []
    const tops = []
    $('.macro-circuit').children().each(function () {
      tops.push(parseFloat($(this).css('top')))
      lefts.push(parseFloat($(this).css('left')))
    })
    const diffLeft = 20 - minElement(lefts)
    const diffTop = 20 - minElement(tops)
    $('.macro-circuit').children().each(function () {
      $(this).css('top', `${parseFloat($(this).css('top')) + diffTop}px`)
      $(this).css('left', `${parseFloat($(this).css('left')) + diffLeft}px`)
    })

    $('.macro-modal .message').html(
      `You are going to create Macroelement with ${pluralize('input port', this.inPorts.length, true)}
      and ${pluralize('output port', this.outPorts.length, true)}.`
    )
  }

  onMacroSaveClick() {
    const name = $('#macro-name').val()
    if (!R.isEmpty(name) && !this.macroElements[name]) {
      this.macroElements[name] = { name, inPorts: this.inPorts, outPorts: this.outPorts }
      $('.macro-section').append(`
        <div class="add-el-container">
          <div class="add-el add-macro" id="${name}-drag">
            <span>${name}</span>
          </div>
        </div>
      `)
      makeDraggable()
      $('#macro-name').val('')
      this.$el.modal('hide')
    }
  }
}
