import { Toolbar } from './components/Toolbar.js';
import { CircuitPainter } from './components/CircuitPainter.js';
import { APIManager } from '../API/APIManager.js';
import { ErrorModalView } from '../ErrorModalView.js';

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
        this.errorModal = new ErrorModalView({el: this.$('.error-modal')});
        this.circuitPainter = new CircuitPainter({el: this.$('.circuit'), errorModal: this.errorModal});
    }

    render() {
        this.toolbar.render();
        this.circuitPainter.render();
    }
}
