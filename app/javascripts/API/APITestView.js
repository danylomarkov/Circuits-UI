import R from 'ramda'
import { View } from 'backbone'
import { APIManager } from './APIManager.js'

export class APITestView extends View {
  constructor(options) {
    const newOptions = R.merge(options, {
      events: {
        'click .send-test': 'sendTest'
      }
    })
    super(newOptions)
  }

  initialize(options) {
    this.testdata = options.testdata
    this.errorModal = options.errorModal
  }

  render() {
    this.$('.test-request').val(JSON.stringify(this.testdata))
  }

  sendTest() {
    APIManager.calcCircuit(
      JSON.parse(this.$('.test-request').val())
    ).then(data => {
      this.$('.test-result').text(JSON.stringify(data))
    }).catch(response => {
      this.errorModal.show(response)
    })
  }
}
