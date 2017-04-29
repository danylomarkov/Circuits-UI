import { View } from 'backbone'

export class ErrorModalView extends View {
  show(response, status, error) {
    // responseText = jQuery.parseJSON(response.responseText);
    this.$('.error-title').text(`${status} ${error}`)
    // this.$('.exception-type').text(responseText.ExceptionType);
    // this.$('.stack-trace').text(responseText.StackTrace);
    this.$('.message').text(response.responseText)
    this.$el.modal('show')
  }
}
