import plumb from 'jsplumb';

jsPlumb.ready(() => {
  jsPlumb.setContainer("circuit");

  const common = {
    connector: ["Flowchart"],
    paintStyle: { fillStyle: "#445566", radius: 5 },
    hoverPaintStyle:{ fillStyle: "red" },
    connectorHoverStyle:{ strokeStyle:"red" }
  };

  jsPlumb.addEndpoint("el-1", {
    anchor: "Right",
    isSource: true
  }, common);
  jsPlumb.addEndpoint("el-1", {
    anchor: [0, 0.75, -1, 0],
    isTarget: true
  }, common);
  jsPlumb.addEndpoint("el-1", {
    anchor: [0, 0.25, -1, 0],
    isTarget: true
  }, common);
  jsPlumb.addEndpoint("el-4", {
    anchor: "Left",
    isTarget: true
  }, common);
  /*jsPlumb.connect({
    connector: ["Flowchart"],
    source: "el-1",
    target: "el-4",
    anchor: ["Right", "Left"],
    endpoint: [ "Dot", { width: 2, height: 2 } ],
    paintStyle: { strokeStyle: "gray", lineWidth: 1 },
    endpointStyle: { fillStyle: "lightgray", outlineColor: "gray", radius: 5 },
    endpointHoverStyles:[ { fillStyle:"red" }, { fillStyle:"red" } ]
  });*/
  jsPlumb.draggable("el-1", { containment: true } );
  jsPlumb.draggable("el-4", { containment: true } );

  jsPlumb.bind("connection", (info) => {
    if (info.sourceId === info.targetId) {
      jsPlumb.detach(info.connection);
    }
  });
});

$(document).ready(() => {
  $('#run').click(() => { //temporary button, should be removed
    jsPlumb.select().each((connection) => {
       console.log(connection);
    });
  });
});
