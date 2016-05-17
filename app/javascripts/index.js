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

$(document).ready(() => {
  // adding elements
  $('#add-and').click(() => {
    const id = jsPlumbUtil.uuid();
    $('.circuit').append($('<div><span>And</span></div>').addClass(`element el-and`).attr('id', id));
    elements[id] = new AndElement(id);
  });

  $('#add-or').click(() => {
    const id = jsPlumbUtil.uuid();
    $('.circuit').append($('<div><span>Or</span></div>').addClass(`element el-or`).attr('id', id));
    elements[id] = new OrElement(id);
  });

  $('#add-xor').click(() => {
    const id = jsPlumbUtil.uuid();
    $('.circuit').append($('<div><span>Xor</span></div>').addClass(`element el-xor`).attr('id', id));
    elements[id] = new XorElement(id);
  });

  $('#add-not').click(() => {
    const id = jsPlumbUtil.uuid();
    $('.circuit').append($('<div><span>Not</span></div>').addClass(`element el-not`).attr('id', id));
    elements[id] = new NotElement(id);
  });

  $('#add-gen').click(() => {
    const id = jsPlumbUtil.uuid();
    $('.circuit').append($('<div></div>').addClass(`element el-gen`).attr('id', id));
    elements[id] = new Generator(id);
  });

  $('#add-ind').click(() => {
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
