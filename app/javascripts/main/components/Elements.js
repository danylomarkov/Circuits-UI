import { jsPlumb } from 'jsplumb'
import $ from 'jquery'
import R from 'ramda'
import { ElementType } from '../../ElementType.js'

// element styles
const connectionStyle = {
  defaultStyle: { stroke: '#445566', strokeWidth: 3 },
  activeStyle: { stroke: '#55D456', strokeWidth: 3 }
}
const endpointStyle = {
  defaultStyle: { fill: '#445566', radius: 5 },
  activeStyle: { fill: '#55D456', radius: 5 }
}
const common = {
  connector: ['Flowchart', { gap: 4, cornerRadius: 5 }],
  paintStyle: R.merge(endpointStyle.defaultStyle, { stroke: '#445566' }),
  hoverPaintStyle: { fill: 'red' },
  connectorStyle: connectionStyle.defaultStyle,
  connectorHoverStyle: { stroke: 'red' }
}

const anchorRole = {
  source: 'source',
  target: 'target'
}

class Element {
  constructor(id) {
    this.id = id
    this.delay = 50
    this.inputValues = []
    this.outputValues = []
    this.selected = false
    jsPlumb.draggable(id, { containment: true })
    $(`#${this.id}`).append(`
      <div class="bar-wrapper">
        <div class="bar-counter"></div>
        <div class="bar"></div>
      </div>
    `)
  }

  addEndpoint(anchor, port, role) {
    const parameters = {}
    if (role) {
      parameters[role] = {
        id: this.id,
        port
      }
    }
    if (role === anchorRole.source) this.outputValues.push(false)
    if (role === anchorRole.target) this.inputValues.push(false)
    jsPlumb.addEndpoint(this.id, {
      anchor,
      isSource: role === anchorRole.source,
      isTarget: role === anchorRole.target,
      parameters
    }, common)
  }

  reset() {
    const that = this

    this.inputValues = []
    this.outputValues = []

    jsPlumb.getEndpoints(`${this.id}`).forEach(endpoint => {
      endpoint.setPaintStyle(endpointStyle.defaultStyle)
      if (endpoint.isTarget) {
        that.inputValues.push(false)
      }
      if (endpoint.isSource) {
        that.outputValues.push(false)
      }
    })

    if (this.type === ElementType.OnePortIndicator) {
      $(`#${this.id}`).removeClass('switched')
    }

    if (this.type === ElementType.WordGenerator) {
      this.inputValues = undefined
    }

    jsPlumb.select({ source: this.id }).each(connection => {
      connection.setPaintStyle(connectionStyle.defaultStyle)
    })
  }

  setValues(result, animate = true, time) {
    const that = this
    result.outputValues.forEach((value, index) => {
      jsPlumb.select({ source: that.id }).each(connection => {
        if (connection.getParameters().source.port === (index + 1)) {
          if (value) {
            connection.setPaintStyle(connectionStyle.activeStyle)
            connection.endpoints.forEach((endpoint) => {
              endpoint.setPaintStyle(endpointStyle.activeStyle)
            })
          } else {
            connection.setPaintStyle(connectionStyle.defaultStyle)
            connection.endpoints.forEach((endpoint) => {
              endpoint.setPaintStyle(endpointStyle.defaultStyle)
            })
          }
        }
      })
    })
    if (animate) {
      if (result.startTime !== -1) {
        this.animate((100 * (time - result.startTime)) / result.delay)
      }
    }
    this.inputValues = result.inputValues
    this.outputValues = result.outputValues
  }

  toggleSelection() {
    $(`#${this.id}`).toggleClass('selected')
    this.selected = !this.selected
    if (this.selected) {
      jsPlumb.addToDragSelection(this.id)
    } else {
      jsPlumb.removeFromDragSelection(this.id)
    }
  }

  addSelection() {
    $(`#${this.id}`).addClass('selected')
    this.selected = true
    jsPlumb.addToDragSelection(this.id)
  }

  removeSelection() {
    $(`#${this.id}`).removeClass('selected')
    this.selected = false
    jsPlumb.removeFromDragSelection(this.id)
  }

  animate(percent) {
    $(`#${this.id} .bar-wrapper`).show()
    $(`#${this.id} .bar-counter`).html(`${Math.round(percent)}%`)
    $(`#${this.id} .bar`).css('width', `${percent}%`)
    if (percent >= 100) {
      setTimeout(() => $(`#${this.id} .bar-wrapper`).hide(), 100)
    }
  }

  setDelay(delay) {
    this.delay = parseInt(delay, 10)
  }
}

export class AndElement extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>And</span></div>').addClass('element el-and').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
    )

    super(id)
    this.type = ElementType.AndElement
    // output
    this.addEndpoint('Right', 1, anchorRole.source)
    // input
    this.addEndpoint([0, 0.25, -1, 0], 1, anchorRole.target)
    this.addEndpoint([0, 0.75, -1, 0], 2, anchorRole.target)
  }
}

export class OrElement extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>Or</span></div>').addClass('element el-or').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
    )

    super(id)
    this.type = ElementType.OrElement
    // output
    this.addEndpoint('Right', 1, anchorRole.source)
    // input
    this.addEndpoint([0, 0.25, -1, 0], 1, anchorRole.target)
    this.addEndpoint([0, 0.75, -1, 0], 2, anchorRole.target)
  }
}

export class XorElement extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>Xor</span></div>').addClass('element el-xor').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
    )

    super(id)
    this.type = ElementType.XorElement
    // output
    this.addEndpoint('Right', 1, anchorRole.source)
    // input
    this.addEndpoint([0, 0.25, -1, 0], 1, anchorRole.target)
    this.addEndpoint([0, 0.75, -1, 0], 2, anchorRole.target)
  }
}

export class NotElement extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>Not</span></div>').addClass('element el-not').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
    )

    super(id)
    this.type = ElementType.NotElement
    // output
    this.addEndpoint('Right', 1, anchorRole.source)
    // input
    this.addEndpoint('Left', 1, anchorRole.target)
  }
}

export class Generator extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div></div>').addClass('element el-gen').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
    )

    super(id)
    this.type = ElementType.OnePortGenerator
    // output
    this.addEndpoint('Right', 1, anchorRole.source)

    this.delay = 0

    // toggle
    $(`#${this.id}`).append('<label class="switch"><input type="checkbox"><div class="slider"></div></label>')
  }
  getValue() {
    return $(`#${this.id}`).find('input[type="checkbox"]').prop('checked')
  }
  setValues(result) {
    super.setValues(result, false)
    this.inputValues = this.outputValues
  }
}

export class Indicator extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div></div>').addClass('element el-ind').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
    )
    super(id)
    this.type = ElementType.OnePortIndicator
    // input
    this.addEndpoint('Left', 1, anchorRole.target)

    this.delay = 0
  }
  setValues(result) {
    super.setValues(result, false)
    if (result.inputValues.length) {
      $(`#${this.id}`).toggleClass('switched', result.inputValues[0])
    } else {
      $(`#${this.id}`).removeClass('switched')
    }
  }
}

export class Coupler extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div></div>').addClass('element el-coup').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
    )

    super(id)
    this.type = ElementType.CouplerElement

    this.delay = 0
    // input
    this.addEndpoint('Left', 1, anchorRole.target)
    // output
    this.addEndpoint([1, 0.25, 1, 0], 1, anchorRole.source)
    this.addEndpoint([1, 0.75, 1, 0], 2, anchorRole.source)
  }
}

export class NAndElement extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>Nand</span></div>').addClass('element el-nand').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
    )

    super(id)
    this.type = ElementType.NAndElement
    // output
    this.addEndpoint('Right', 1, anchorRole.source)
    // input
    this.addEndpoint([0, 0.25, -1, 0], 1, anchorRole.target)
    this.addEndpoint([0, 0.75, -1, 0], 2, anchorRole.target)
  }
}

export class NOrElement extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>Nor</span></div>').addClass('element el-nor').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
    )

    super(id)
    this.type = ElementType.NOrElement
    // output
    this.addEndpoint('Right', 1, anchorRole.source)
    // input
    this.addEndpoint([0, 0.25, -1, 0], 1, anchorRole.target)
    this.addEndpoint([0, 0.75, -1, 0], 2, anchorRole.target)
  }
}

export class XNorElement extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>Xnor</span></div>').addClass('element el-xnor').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
    )

    super(id)
    this.type = ElementType.XNorElement
    // output
    this.addEndpoint('Right', 1, anchorRole.source)
    // input
    this.addEndpoint([0, 0.25, -1, 0], 1, anchorRole.target)
    this.addEndpoint([0, 0.75, -1, 0], 2, anchorRole.target)
  }
}

export class RSTrigger extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>RS</span></div>').addClass('element el-rs').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
    )

    super(id)
    this.type = ElementType.RSTrigger
    // output
    this.addEndpoint([1, 0.25, 1, 0], 1, anchorRole.source)
    this.addEndpoint([1, 0.75, 1, 0], 2, anchorRole.source)
    // input
    this.addEndpoint([0, 0.25, -1, 0], 1, anchorRole.target)
    this.addEndpoint([0, 0.75, -1, 0], 2, anchorRole.target)
  }
}

export class EncoderElement extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>Encoder</span></div>').addClass('element el-enc').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
    )

    super(id)
    this.type = ElementType.EncoderElement
    // input
    this.addEndpoint([0, 0.14, -1, 0], 1, anchorRole.target)
    this.addEndpoint([0, 0.38, -1, 0], 2, anchorRole.target)
    this.addEndpoint([0, 0.62, -1, 0], 3, anchorRole.target)
    this.addEndpoint([0, 0.86, -1, 0], 4, anchorRole.target)
    // output
    this.addEndpoint([1, 0.25, 1, 0], 1, anchorRole.source)
    this.addEndpoint([1, 0.75, 1, 0], 2, anchorRole.source)
  }
}

export class DecoderElement extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>Decoder</span></div>').addClass('element el-dec').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
    )

    super(id)
    this.type = ElementType.DecoderElement
    // input
    this.addEndpoint([0, 0.25, -1, 0], 1, anchorRole.target)
    this.addEndpoint([0, 0.75, -1, 0], 2, anchorRole.target)
    // output
    this.addEndpoint([1, 0.14, 1, 0], 1, anchorRole.source)
    this.addEndpoint([1, 0.38, 1, 0], 2, anchorRole.source)
    this.addEndpoint([1, 0.62, 1, 0], 3, anchorRole.source)
    this.addEndpoint([1, 0.86, 1, 0], 4, anchorRole.source)
  }
}

export class SevenSegmentIndicator extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div></div>').addClass('element el-ind-seven').attr('id', id)
        .append($('.toolbar #ind-seven-drag').html())
        .css('left', position.left)
        .css('top', position.top)
    )

    super(id)
    this.type = ElementType.SevenSegmentIndicator
    // input
    this.addEndpoint([0, 0.14, -1, 0], 1, anchorRole.target)
    this.addEndpoint([0, 0.38, -1, 0], 2, anchorRole.target)
    this.addEndpoint([0, 0.62, -1, 0], 3, anchorRole.target)
    this.addEndpoint([0, 0.86, -1, 0], 4, anchorRole.target)

    this.delay = 0
  }

  setValues(result) {
    super.setValues(result, false)
    const segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    result.outputValues.forEach((value, index) => {
      $(`#${this.id} .ind-seven-${segments[index]}`).toggleClass('switched', value)
    })
  }
}

export class WordGenerator extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>Word<br />Generator</span></div>').addClass('element el-word-gen').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
    )

    super(id)
    this.type = ElementType.WordGenerator
    // input
    R.times(index => {
      this.addEndpoint([1, (index + 0.5) * (1 / 8), 1, 0], 8 - index, anchorRole.source)
    }, 8)
    this.delay = 0
    this.inputValues = undefined
  }

  setValues(result) {
    super.setValues(result, false)
    const segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    result.outputValues.forEach((value, index) => {
      $(`#${this.id} .ind-seven-${segments[index]}`).toggleClass('switched', value)
    })
  }
}

export class MacroElement extends Element {
  constructor(id, position, name, inPorts, outPorts) {
    $('.circuit').append(
      $(`<div><span>${name}</span></div>`).addClass('element').attr('id', id)
        .css('left', position.left)
        .css('top', position.top)
        .css('width', `${R.max(50, R.max(inPorts.length, outPorts.length) * 20)}px`)
        .css('height', `${R.max(40, R.max(inPorts.length, outPorts.length) * 20)}px`)
    )

    super(id)
    this.type = name
    this.name = name
    // input
    inPorts.forEach((port, index) => {
      this.addEndpoint([0, (index + 0.5) * (1 / inPorts.length), -1, 0], index + 1, anchorRole.target)
    })
    // output
    outPorts.forEach((port, index) => {
      this.addEndpoint([1, (index + 0.5) * (1 / outPorts.length), 1, 0], index + 1, anchorRole.source)
    })
  }
}
