export class ErrorModalView extends Backbone.View {
    constructor(options) {
        super(options);
    }

    show(response, status, error) {
        // responseText = jQuery.parseJSON(response.responseText);
        this.$('.error-title').text(status + " " + error);
        // this.$('.exception-type').text(responseText.ExceptionType);
        // this.$('.stack-trace').text(responseText.StackTrace);
        this.$('.message').text(response.responseText);
        this.$el.modal('show')
    }
}
