import plumb from 'jsplumb';
import { AndElement, OrElement, XorElement, NotElement, Generator, Indicator, Coupler } from './elements.js';
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
    containment: 'body',
    helper: function() {
      return $(this).clone();
    }
  });

  $('.circuit').droppable({
    drop: function(e, ui) {
      const id = jsPlumbUtil.uuid();
      const position = {
        top: ui.offset.top - $(this).offset().top,
        left: ui.offset.left - $(this).offset().left
      };

      switch(ui.draggable.context.id) {
        case 'and-drag': {
          elements[id] = new AndElement(id, position);
          break;
        }
        case 'or-drag': {
          elements[id] = new OrElement(id, position);
          break;
        }
        case 'not-drag': {
          elements[id] = new NotElement(id, position);
          break;
        }
        case 'xor-drag': {
          elements[id] = new XorElement(id, position);
          break;
        }
        case 'gen-drag': {
          elements[id] = new Generator(id, position);
          break;
        }
        case 'ind-drag': {
          elements[id] = new Indicator(id, position);
          break;
        }
        case 'coup-drag': {
          elements[id] = new Coupler(id, position);
          break;
        }
      }
    }
  });

  $('#and-drag').dblclick(() => {
    const id = jsPlumbUtil.uuid();
    elements[id] = new AndElement(id, { top: 5, left: 5 });
  });

  $('#or-drag').dblclick(() => {
    const id = jsPlumbUtil.uuid();
    elements[id] = new OrElement(id, { top: 5, left: 5 });
  });

  $('#xor-drag').dblclick(() => {
    const id = jsPlumbUtil.uuid();
    elements[id] = new XorElement(id, { top: 5, left: 5 });
  });

  $('#not-drag').dblclick(() => {
    const id = jsPlumbUtil.uuid();
    elements[id] = new NotElement(id, { top: 5, left: 5 });
  });

  $('#gen-drag').dblclick(() => {
    const id = jsPlumbUtil.uuid();
    elements[id] = new Generator(id, { top: 5, left: 5 });
  });

  $('#ind-drag').dblclick(() => {
    const id = jsPlumbUtil.uuid();
    elements[id] = new Indicator(id, { top: 5, left: 5 });
  });

  $('#coup-drag').dblclick(() => {
    const id = jsPlumbUtil.uuid();
    elements[id] = new Coupler(id, { top: 5, left: 5 });
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
