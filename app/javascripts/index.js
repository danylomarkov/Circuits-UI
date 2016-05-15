import plumb from 'jsplumb';
import { AndElement, Generator, Indicator } from './elements.js';

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
    $('.circuit').append($('<div>And</div>').addClass(`element el-and`).attr('id', id));
    new AndElement(id);
    elementId++;
  });

  $('#add-gen').click(() => {
    const id = `el-${elementId}`;
    $('.circuit').append($('<div>0</div>').addClass(`element el-gen`).attr('id', id));
    new Generator(id);
    elementId++;
  });

  $('#add-ind').click(() => {
    const id = `el-${elementId}`;
    $('.circuit').append($('<div>0</div>').addClass(`element el-ind`).attr('id', id));
    new Indicator(id);
    elementId++;
  });

  // changing value of Generator
  $('.circuit').on('mouseup', '.el-gen', function() {
    if (!$(this).hasClass('jsplumb-drag')) {
      if ($(this).hasClass('positive')) {
        $(this).removeClass('positive');
      }
      else {
        $(this).addClass('positive');
      }
    }
  });

  // ...
  $('#run').click(() => { //temporary button, should be removed
    jsPlumb.select().each((connection) => {
       console.log(connection);
    });
  });
});
