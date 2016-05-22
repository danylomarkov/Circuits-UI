import plumb from 'jsplumb';
import { AndElement, OrElement, XorElement, NotElement, Generator, Indicator, Coupler } from './Elements.js';
import { ElementType } from '../../ElementType.js';

const contextMenu = (type, position) =>
  `<div class='context-menu' style="top: ${position.top}px; left: ${position.left}px">
    <span>Delete ${type}</span>
  </div>`;

export class CircuitPainter extends Backbone.View {
    constructor(options) {
        _.extend(options, {
            events: {
                'contextmenu .element': 'changeContextMenu',
                'click': 'closeContextMenu'
            }
        });
        super(options);
    }

    initialize() {
        const that = this;
        this.elements = {};
        this.$el.droppable({
            drop: function(e, ui) {
                that.createElement($(this), ui);
            }
        });
    }

    render() {
        const that = this;
        jsPlumb.ready(() => {
          jsPlumb.setContainer(this.$el);

          jsPlumb.bind("connection", (info) => {
            if (info.sourceId === info.targetId) {
              jsPlumb.detach(info.connection);
            }
          });

          jsPlumb.bind('contextmenu', function (connection, e) {
            e.preventDefault();
            that.closeContextMenu();
            that.openConnectionContextMenu(e, connection);
          });
        });
    }

    openElementContextMenu(e) {
        $('body').append(contextMenu('element', { left: e.clientX, top: e.clientY }));
        $('.context-menu').on('click', () => this.deleteElement(e.currentTarget.getAttribute('id')));
    }

    openConnectionContextMenu(e, connection) {
        $('body').append(contextMenu('connection', { left: e.clientX, top: e.clientY }));
        $('.context-menu').on('click', () => this.deleteConnection(connection));
    }

    deleteElement(id) {
        jsPlumb.remove(id);
        delete this.elements[id];
        this.closeContextMenu();
    }

    deleteConnection(connection) {
        jsPlumb.detach(connection);
        this.closeContextMenu();
    }

    closeContextMenu() {
        $('.context-menu').remove();
    }

    changeContextMenu(e) {
        e.preventDefault();
        this.closeContextMenu();
        this.openElementContextMenu(e);
    }

    getJSON() {
        var result = {
            elements: [],
            connections: []
        }
        jsPlumb.select().each((connection) => {
            result.connections.push(connection.getParameters());
        });
        _.each(this.elements, (elem) => {
            var parameters = {
                id: elem.id,
                type: elem.type
            }
            if(elem.type === ElementType.OnePortGenerator) {
                parameters.value = elem.getValue();
            }
            result.elements.push(parameters);
        });
        return result;
    }

    applyResult(results) {
        var that = this;
        _.each(results, function (item) {
            that.elements[item.id].setValue(item.values[0]);
        });
    }

    createElement($target, ui) {
        const id = jsPlumbUtil.uuid();
        const position = {
            top: ui.offset.top - $target.offset().top,
            left: ui.offset.left - $target.offset().left
        };
        switch(ui.draggable.context.id) {
            case 'and-drag': {
                this.elements[id] = new AndElement(id, position);
                break;
            }
            case 'or-drag': {
                this.elements[id] = new OrElement(id, position);
                break;
            }
            case 'not-drag': {
                this.elements[id] = new NotElement(id, position);
                break;
            }
            case 'xor-drag': {
                this.elements[id] = new XorElement(id, position);
                break;
            }
            case 'gen-drag': {
                this.elements[id] = new Generator(id, position);
                break;
            }
            case 'ind-drag': {
                this.elements[id] = new Indicator(id, position);
                break;
            }
            case 'coup-drag': {
                this.elements[id] = new Coupler(id, position);
                break;
            }
        }
    }
}
