'use babel'

const ViewTemplate = `
<div class="godoc-container">
  <div class="godoc-scroller">
    <div class="godoc-tooltip">
      <div id="godoc-message"></div>
      <div id="godoc-progress">
        <span class='loading loading-spinner-large inline-block'></span>
        </div>
      <div id="close-button" class="close icon icon-x"></div>
    </div>
  </div>
</div>
`

export default class GodocView extends HTMLElement {

  createdCallback () {
    this.innerHTML = ViewTemplate
    this.message = this.querySelector('#godoc-message')
    this.progress = this.querySelector('#godoc-progress')
    this.closebutton = this.querySelector('#close-button')
    this.closebutton.addEventListener('click', () => {
      if (this.onclose) {
        this.onclose()
      }
    })
    this.setInProgress()
  }

  attachedCallback () {
    this.classList.add('godoc')
    this.addActiveClassToEditor()
  }

  detachedCallback () {
    this.removeActiveClassFromEditor()
  }

  updateText (text) {
    this.message.innerText = text
    this.message.classList.remove('godoc-in-progress')
    this.progress.classList.remove('godoc-in-progress')
    this.addActiveClassToEditor()
  }

  setInProgress () {
    this.message.classList.add('godoc-in-progress')
    this.progress.classList.add('godoc-in-progress')
  }

  setCloseCallback (onclose) {
    this.onclose = onclose
  }

  addActiveClassToEditor () {
    let editor = atom.views.getView(atom.workspace.getActiveTextEditor())
    if (editor && editor.classList) {
      editor.classList.add('godoc-display-active')
    }
  }

  removeActiveClassFromEditor () {
    let editor = atom.views.getView(atom.workspace.getActiveTextEditor())
    if (editor && editor.classList) {
      editor.classList.remove('godoc-display-active')
    }
  }

  static create () {
    return document.createElement('godoc-view')
  }
}

document.registerElement('godoc-view', {
  prototype: GodocView.prototype
})
