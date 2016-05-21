import { APITestView } from './APITestView.js';
import { ErrorModalView } from './ErrorModalView.js';

export class APITestsView extends Backbone.View {
    constructor(options) {
        _.extend(options, {
            el: 'body'
        });
        super(options);
    }

    initialize(options) {
        var that = this;
        this.tests = [];
        this.testdata = options.testdata;
        this.errorModal = new ErrorModalView({el: this.$('.error-modal')});
        this.$('.test').each(function(key, test) {
            that.tests.push(new APITestView({
                el: test,
                testdata: that.testdata[key],
                errorModal: that.errorModal
            }));
        });
    }

    render() {
        var that = this;
        _.each(this.tests, function(test) {
            test.render();
        });
    }
};
