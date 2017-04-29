import { View } from 'backbone'
import R from 'ramda'

import { APITestView } from './APITestView.js'
import { ErrorModalView } from '../ErrorModalView.js'

export class APITestsView extends View {
  constructor(options) {
    const newOptions = R.merge(options, {
      el: 'body'
    })
    super(newOptions)
  }

  initialize(options) {
    const that = this
    this.tests = []
    this.testdata = options.testdata
    this.errorModal = new ErrorModalView({ el: this.$('.error-modal') })
    this.$('.test').each((key, test) => {
      that.tests.push(new APITestView({
        el: test,
        testdata: that.testdata[key],
        errorModal: that.errorModal
      }))
    })
  }

  render() {
    this.tests.forEach(test => test.render())
  }
}
