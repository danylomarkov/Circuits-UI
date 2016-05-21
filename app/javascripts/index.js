import plumb from 'jsplumb';
import { AndElement, OrElement, XorElement, NotElement, Generator, Indicator } from './elements.js';
import { elements } from './store.js';

jsPlumb.ready(() => {
  jsPlumb.setContainer("circuit");

  jsPlumb.bind("connection", (info) => {
    if (info.sourceId === info.targetId) {
      jsPlumb.detach(info.connection);
    }
  });

  jsPlumb.bind('contextmenu', function (connection, e) {
    e.preventDefault();
    closeContextMenu();
    openConnectionContextMenu(e, connection);
  });
});

$(() => {
  // adding elements
  $('.add-el').draggable({
    appendTo: 'body',
    containment: 'outer-wrapper',
    helper: function() {
      return $(this).clone().css('height', this.clientHeight).css('width', this.clientWidth);
    }
  });

  $('.circuit').droppable({
    drop: function(e, ui) {
      const id = jsPlumbUtil.uuid();

      switch(ui.draggable.context.id) {
        case 'and-drag': {
          $('.circuit').append(
            $('<div><span>And</span></div>').addClass(`element el-and`).attr('id', id)
              .css('left', ui.offset.left - $(this).offset().left).css('top', ui.offset.top - $(this).offset().top)
          );
          elements[id] = new AndElement(id);
          break;
        }
        case 'or-drag': {
          $('.circuit').append(
            $('<div><span>Or</span></div>').addClass(`element el-or`).attr('id', id)
              .css('left', ui.offset.left - $(this).offset().left).css('top', ui.offset.top - $(this).offset().top)
          );
          elements[id] = new OrElement(id);
          break;
        }
        case 'not-drag': {
          $('.circuit').append(
            $('<div><span>Not</span></div>').addClass(`element el-not`).attr('id', id)
              .css('left', ui.offset.left - $(this).offset().left).css('top', ui.offset.top - $(this).offset().top)
          );
          elements[id] = new NotElement(id);
          break;
        }
        case 'xor-drag': {
          $('.circuit').append(
            $('<div><span>Xor</span></div>').addClass(`element el-xor`).attr('id', id)
              .css('left', ui.offset.left - $(this).offset().left).css('top', ui.offset.top - $(this).offset().top)
          );
          elements[id] = new XorElement(id);
          break;
        }
        case 'gen-drag': {
          $('.circuit').append(
            $('<div></div>').addClass(`element el-gen`).attr('id', id)
              .css('left', ui.offset.left - $(this).offset().left).css('top', ui.offset.top - $(this).offset().top)
          );
          elements[id] = new Generator(id);
          break;
        }
        case 'ind-drag': {
          $('.circuit').append(
            $('<div><span>0</span></div>').addClass(`element el-ind`).attr('id', id)
              .css('left', ui.offset.left - $(this).offset().left).css('top', ui.offset.top - $(this).offset().top)
          );
          elements[id] = new Indicator(id);
          break;
        }
      }
    }
  });

  $('#and-drag').dblclick(() => {
    const id = jsPlumbUtil.uuid();
    $('.circuit').append($('<div><span>And</span></div>').addClass(`element el-and`).attr('id', id));
    elements[id] = new AndElement(id);
  });

  $('#or-drag').dblclick(() => {
    const id = jsPlumbUtil.uuid();
    $('.circuit').append($('<div><span>Or</span></div>').addClass(`element el-or`).attr('id', id));
    elements[id] = new OrElement(id);
  });

  $('#xor-drag').dblclick(() => {
    const id = jsPlumbUtil.uuid();
    $('.circuit').append($('<div><span>Xor</span></div>').addClass(`element el-xor`).attr('id', id));
    elements[id] = new XorElement(id);
  });

  $('#not-drag').dblclick(() => {
    const id = jsPlumbUtil.uuid();
    $('.circuit').append($('<div><span>Not</span></div>').addClass(`element el-not`).attr('id', id));
    elements[id] = new NotElement(id);
  });

  $('#gen-drag').dblclick(() => {
    const id = jsPlumbUtil.uuid();
    $('.circuit').append($('<div></div>').addClass(`element el-gen`).attr('id', id));
    elements[id] = new Generator(id);
  });

  $('#ind-drag').dblclick(() => {
    const id = jsPlumbUtil.uuid();
    $('.circuit').append($('<div><span>0</span></div>').addClass(`element el-ind`).attr('id', id));
    elements[id] = new Indicator(id);
  });

  // context menu
  $('.circuit').on('contextmenu', '.element', (e) => {
    e.preventDefault();
    closeContextMenu();
    openElementContextMenu(e);
  });
  $('.circuit').click(() => {
    closeContextMenu();
  });

  // ...
  $('#run').click(() => { //temporary button, should be removed
    jsPlumb.select().each((connection) => {
       console.log(connection);
    });
  });
  $('#api-tests').click(() => {
      $(location).attr('href', 'api.html');
  });
});

function openElementContextMenu(e) {
  $('body').append(
    contextMenu('element', { top: e.clientY, left: e.clientX })
  );
  $('.context-menu').on('click', () => deleteElement(e.currentTarget.getAttribute('id')));
}

function openConnectionContextMenu(e, connection) {
  $('body').append(
    contextMenu('connection', { top: e.clientY, left: e.clientX })
  );
  $('.context-menu').on('click', () => deleteConnection(connection));
}

function closeContextMenu() {
  $('.context-menu').remove();
}

function deleteElement(id) {
  jsPlumb.remove(id);
  delete elements[id];
  closeContextMenu();
}

function deleteConnection(connection) {
  jsPlumb.detach(connection);
  closeContextMenu();
}

const contextMenu = (type, position) =>
  `<div class='context-menu' style="top: ${position.top}px; left: ${position.left}px">
    <span>Delete ${type}</span>
  </div>`;
