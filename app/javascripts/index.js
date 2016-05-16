import plumb from 'jsplumb';
import { AndElement, OrElement, XorElement, NotElement, Generator, Indicator } from './elements.js';

jsPlumb.ready(() => {
  jsPlumb.setContainer("circuit");

  jsPlumb.bind("connection", (info) => {
    if (info.sourceId === info.targetId) {
      jsPlumb.detach(info.connection);
    }
  });
});

$(document).ready(() => {
  // adding elements
  let elementId = 0;

  $('#add-and').click(() => {
    const id = `el-${elementId}`;
    $('.circuit').append($('<div><span>And</span></div>').addClass(`element el-and`).attr('id', id));
    new AndElement(id);
    elementId++;
  });

  $('#add-or').click(() => {
    const id = `el-${elementId}`;
    $('.circuit').append($('<div><span>Or</span></div>').addClass(`element el-or`).attr('id', id));
    new OrElement(id);
    elementId++;
  });

  $('#add-xor').click(() => {
    const id = `el-${elementId}`;
    $('.circuit').append($('<div><span>Xor</span></div>').addClass(`element el-xor`).attr('id', id));
    new XorElement(id);
    elementId++;
  });

  $('#add-not').click(() => {
    const id = `el-${elementId}`;
    $('.circuit').append($('<div><span>Not</span></div>').addClass(`element el-not`).attr('id', id));
    new NotElement(id);
    elementId++;
  });

  $('#add-gen').click(() => {
    const id = `el-${elementId}`;
    $('.circuit').append($('<div></div>').addClass(`element el-gen`).attr('id', id));
    new Generator(id);
    elementId++;
  });

  $('#add-ind').click(() => {
    const id = `el-${elementId}`;
    $('.circuit').append($('<div><span>0</span></div>').addClass(`element el-ind`).attr('id', id));
    new Indicator(id);
    elementId++;
  });

  // ...
  $('#run').click(() => { //temporary button, should be removed
    jsPlumb.select().each((connection) => {
       console.log(connection);
    });
  });
});
