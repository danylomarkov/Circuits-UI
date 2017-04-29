import { View } from 'backbone'
import $ from 'jquery'

export class Toolbar extends View {
  initialize(options) {
    this.$('.add-el').draggable({
      appendTo: 'body',
      containment: 'body',
      helper() {
        return $(this).clone()
      }
    })
  }

  render() {
    // $('#and-drag').dblclick(() => {
    //   const id = jsPlumbUtil.uuid();
    //   elements[id] = new AndElement(id, { top: 5, left: 5 });
    // });
    //
    // $('#or-drag').dblclick(() => {
    //   const id = jsPlumbUtil.uuid();
    //   elements[id] = new OrElement(id, { top: 5, left: 5 });
    // });
    //
    // $('#xor-drag').dblclick(() => {
    //   const id = jsPlumbUtil.uuid();
    //   elements[id] = new XorElement(id, { top: 5, left: 5 });
    // });
    //
    // $('#not-drag').dblclick(() => {
    //   const id = jsPlumbUtil.uuid();
    //   elements[id] = new NotElement(id, { top: 5, left: 5 });
    // });
    //
    // $('#gen-drag').dblclick(() => {
    //   const id = jsPlumbUtil.uuid();
    //   elements[id] = new Generator(id, { top: 5, left: 5 });
    // });
    //
    // $('#ind-drag').dblclick(() => {
    //   const id = jsPlumbUtil.uuid();
    //   elements[id] = new Indicator(id, { top: 5, left: 5 });
    // });
    //
    // $('#coup-drag').dblclick(() => {
    //   const id = jsPlumbUtil.uuid();
    //   elements[id] = new Coupler(id, { top: 5, left: 5 });
    // });
  }
}
