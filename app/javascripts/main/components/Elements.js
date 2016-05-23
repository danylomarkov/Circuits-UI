import plumb from 'jsplumb';
import { ElementType } from '../../ElementType.js';

// element styles
const common = {
  connector: ["Flowchart"],
  paintStyle: { fillStyle: '#445566', strokeStyle: '#445566', radius: 5 },
  hoverPaintStyle:{ fillStyle: "red" },
  connectorHoverStyle:{ strokeStyle:"red" }
};

const connectionStyle = {
  defaultStyle: { strokeStyle: '#445566', lineWidth: 4 },
  activeStyle: { strokeStyle: "#55D456", lineWidth: 4 }
};
const endpointStyle = {
  defaultStyle: { fillStyle: '#445566', strokeStyle: '#445566', radius: 5 },
  activeStyle: { fillStyle: "#55D456", strokeStyle: '#445566', radius: 5 }
};

const anchorRole = {
    source: 'source',
    target: 'target'
};

class Element {
  constructor(id) {
    this.id = id;
    jsPlumb.draggable(id, { containment: true } );
  }

  addEndpoint(anchor, port, role) {
      const isSource = role === anchorRole.source;
      const isTarget = role === anchorRole.target;
      let parameters = {};
      if (role) {
          parameters[role] = {
              id: this.id,
              port: port
          };
      }
      jsPlumb.addEndpoint(this.id, {
        anchor: anchor,
        isSource: isSource,
        isTarget: isTarget,
        parameters: parameters
      }, common);
  }

  setValues(result) {
      const that = this;
      jsPlumb.getEndpoints(`${this.id}`).forEach((endpoint) => {
          endpoint.setPaintStyle(common.paintStyle);
      });
      result.outputValues.forEach((value, index) => {
          jsPlumb.select({source: that.id}).each((connection) => {
              if (connection.getParameters().source.port == (index + 1)) {
                  if (value) {
                      connection.setPaintStyle(connectionStyle.activeStyle);
                      connection.repaint();
                      connection.endpoints.forEach((endpoint) => {
                          endpoint.setPaintStyle(endpointStyle.activeStyle);
                      });
                  } else {
                      connection.setPaintStyle(connectionStyle.defaultStyle);
                      connection.repaint();
                      connection.endpoints.forEach((endpoint) => {
                          endpoint.setPaintStyle(endpointStyle.defaultStyle);
                      });
                  }
              }
          });
      });
  }
}

export class AndElement extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>And</span></div>').addClass('element el-and').attr('id', id)
        .css('left', position.left).css('top', position.top)
    );

    super(id);
    this.type = ElementType.AndElement;
    // input
    this.addEndpoint("Right", 1, anchorRole.source);
    // output
    this.addEndpoint([0, 0.25, -1, 0], 1, anchorRole.target);
    this.addEndpoint([0, 0.75, -1, 0], 2, anchorRole.target);
  }
}

export class OrElement extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>Or</span></div>').addClass(`element el-or`).attr('id', id)
        .css('left', position.left).css('top', position.top)
    );

    super(id);
    this.type = ElementType.OrElement;
    // input
    this.addEndpoint("Right", 1, anchorRole.source);
    // output
    this.addEndpoint([0, 0.25, -1, 0], 1, anchorRole.target);
    this.addEndpoint([0, 0.75, -1, 0], 2, anchorRole.target);
  }
}

export class XorElement extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>Xor</span></div>').addClass(`element el-xor`).attr('id', id)
        .css('left', position.left).css('top', position.top)
    );

    super(id);
    this.type = ElementType.XorElement;
    // input
    this.addEndpoint("Right", 1, anchorRole.source);
    // output
    this.addEndpoint([0, 0.25, -1, 0], 1, anchorRole.target);
    this.addEndpoint([0, 0.75, -1, 0], 2, anchorRole.target);
  }
}

export class NotElement extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div><span>Not</span></div>').addClass(`element el-not`).attr('id', id)
        .css('left', position.left).css('top', position.top)
    );

    super(id);
    this.type = ElementType.NotElement;
    // input
    this.addEndpoint("Right", 1, anchorRole.source);
    // output
    this.addEndpoint("Left", 1, anchorRole.target);
  }
}

export class Generator extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div></div>').addClass(`element el-gen`).attr('id', id)
        .css('left', position.left).css('top', position.top)
    );

    super(id);
    this.type = ElementType.OnePortGenerator;
    // input
    this.addEndpoint("Right", 1, anchorRole.source);

    // toggle
    $(`#${this.id}`).append('<label class="switch"><input type="checkbox"><div class="slider"></div></label>');
    $(`#${this.id} input`).on('change', () => {
        $(`#${this.id}`).trigger('change');
    });
  }
  getValue() {
      return $(`#${this.id}`).find('input[type="checkbox"]').prop('checked');
  }
}

export class Indicator extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div></div>').addClass(`element el-ind`).attr('id', id)
        .css('left', position.left).css('top', position.top)
    );
    super(id);
    this.type = ElementType.OnePortIndicator;
    //input
    this.addEndpoint("Left", 1, anchorRole.target);
  }
  setValues(result) {
      super.setValues(result);
      if (result.outputValues.length) {
          $(`#${this.id}`).toggleClass("switched", result.outputValues[0]);
      } else {
          $(`#${this.id}`).removeClass("switched");
      }
  }
}

export class Coupler extends Element {
  constructor(id, position) {
    $('.circuit').append(
      $('<div></div>').addClass(`element el-coup`).attr('id', id)
        .css('left', position.left).css('top', position.top)
    );

    super(id);
    this.type = ElementType.CouplerElement;
    //input
    this.addEndpoint("Left", 1, anchorRole.target);
    //output
    this.addEndpoint([1, 0.25, 1, 0], 1, anchorRole.source);
    this.addEndpoint([1, 0.75, 1, 0], 2, anchorRole.source);
  }
}
