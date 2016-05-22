import {Toolbar} from './components/Toolbar.js';
import {CircuitPainter} from './components/CircuitPainter.js';

export class IndexView extends Backbone.View {
    constructor() {
        super({
            el: 'body',
            events: {
                'click #run': 'run'
            }
        });
    }

    initialize() {
        this.toolbar = new Toolbar({el: this.$('.toolbar')});
        this.circuitPainter = new CircuitPainter({el: this.$('.circuit')});
    }

    render() {
        this.toolbar.render();
        this.circuitPainter.render();
    }

    run() {
        jsPlumb.select().each((connection) => {
           console.log(connection);
        });
    }
}
