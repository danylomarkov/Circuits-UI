import { View } from 'backbone'
import { Toolbar } from './components/Toolbar.js'
import { CircuitPainter } from './components/CircuitPainter.js'
import { MacroElementModal } from './components/MacroElementModal.js'
import { ErrorModalView } from '../ErrorModalView.js'

export class IndexView extends View {
  constructor() {
    super({
      el: 'body',
      events: {
        'click #run': 'run'
      }
    })
  }

  initialize() {
    this.toolbar = new Toolbar({ el: this.$('.toolbar') })
    this.errorModal = new ErrorModalView({ el: this.$('.error-modal') })
    this.macroModal = new MacroElementModal({ el: this.$('.macro-modal') })
    this.circuitPainter = new CircuitPainter({
      el: this.$('.circuit'),
      errorModal: this.errorModal,
      macroModal: this.macroModal
    })
  }

  render() {
    this.toolbar.render()
    this.circuitPainter.render()
  }
}
