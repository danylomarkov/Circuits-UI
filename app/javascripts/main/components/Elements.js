import { jsPlumb } from 'jsplumb'
import $ from 'jquery'
import R from 'ramda'
import { ElementType } from '../../ElementType.js'

// element styles
const connectionStyle = {
  defaultStyle: { stroke: '#445566', strokeWidth: 4 },
  activeStyle: { stroke: '#55D456', strokeWidth: 4 }
}
const endpointStyle = {
  defaultStyle: { fill: '#445566', radius: 5 },
  activeStyle: { fill: '#55D456', radius: 5 }
}
const common = {
  connector: ['Flowchart'],
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
    this.selected = false
    jsPlumb.draggable(id, { containment: true })
  }

  addEndpoint(anchor, port, role) {
    const parameters = {}
    if (role) {
      parameters[role] = {
        id: this.id,
        port
      }
    }
    jsPlumb.addEndpoint(this.id, {
      anchor,
      isSource: role === anchorRole.source,
      isTarget: role === anchorRole.target,
      parameters
    }, common)
  }

  reset() {
    jsPlumb.getEndpoints(`${this.id}`).forEach((endpoint) => {
      endpoint.setPaintStyle(endpointStyle.defaultStyle)
    })
  }

  setValues(result) {
    const that = this
    result.outputValues.forEach((value, index) => {
      jsPlumb.select({ source: that.id }).each((connection) => {
        if (connection.getParameters().source.port == (index + 1)) {
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
  }

  toggleSelection() {
    $(`#${this.id}`).toggleClass('selected')
    this.selected = !this.selected
  }

  addSelection() {
    $(`#${this.id}`).addClass('selected')
    this.selected = true
  }

  removeSelection() {
    $(`#${this.id}`).removeClass('selected')
    this.selected = false
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

    // toggle
    $(`#${this.id}`).append('<label class="switch"><input type="checkbox"><div class="slider"></div></label>')
  }
  getValue() {
    return $(`#${this.id}`).find('input[type="checkbox"]').prop('checked')
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
  }
  setValues(result) {
    super.setValues(result)
    if (result.outputValues.length) {
      $(`#${this.id}`).toggleClass('switched', result.outputValues[0])
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
