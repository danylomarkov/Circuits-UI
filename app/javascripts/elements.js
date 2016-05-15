import plumb from 'jsplumb';

// element styles
const common = {
  connector: ["Flowchart"],
  paintStyle: { fillStyle: "#445566", radius: 5 },
  hoverPaintStyle:{ fillStyle: "red" },
  connectorHoverStyle:{ strokeStyle:"red" }
};

class Element {
  constructor(id) {
    jsPlumb.draggable(id, { containment: true } );
  }
}

export class AndElement extends Element {
  constructor(id) {
    super(id);

    // input
    jsPlumb.addEndpoint(id, {
      anchor: "Right",
      isSource: true
    }, common);
    // outputs
    jsPlumb.addEndpoint(id, {
      anchor: [0, 0.75, -1, 0],
      isTarget: true
    }, common);
    jsPlumb.addEndpoint(id, {
      anchor: [0, 0.25, -1, 0],
      isTarget: true
    }, common);
  }
}

export class Generator extends Element {
  constructor(id) {
    super(id);

    jsPlumb.addEndpoint(id, {
      anchor: "Right",
      isSource: true
    }, common);
  }
}

export class Indicator extends Element {
  constructor(id) {
    super(id);

    jsPlumb.addEndpoint(id, {
      anchor: "Left",
      isTarget: true
    }, common);
  }
}
