import {Toolbar} from './components/Toolbar.js';
import {CircuitPainter} from './components/CircuitPainter.js';
import {APIManager} from '../API/APIManager.js'
import {ErrorModalView} from '../ErrorModalView.js';

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
        this.errorModal = new ErrorModalView({el: this.$('.error-modal')});
    }

    render() {
        this.toolbar.render();
        this.circuitPainter.render();
    }

    run() {
        var data = this.circuitPainter.getJSON();
        APIManager.calcCircuit(data)
            .then((data) => {
                this.circuitPainter.applyResult(data);
            })
            .catch((response) => {
                this.errorModal.show(response);
            });
    }
}
