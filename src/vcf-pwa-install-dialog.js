import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { ElementMixin } from '@vaadin/vaadin-element-mixin';

class VcfPwaInstallDialog extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
    `;
  }

  static get is() {
    return 'vcf-pwa-install-dialog';
  }

  static get version() {
    return '0.1.0';
  }

  static get properties() {
    return {};
  }
}

customElements.define(VcfPwaInstallDialog.is, VcfPwaInstallDialog);

/**
 * @namespace Vaadin
 */
window.Vaadin.VcfPwaInstallDialog = VcfPwaInstallDialog;

if (window.Vaadin.runIfDevelopmentMode) {
  window.Vaadin.runIfDevelopmentMode('vaadin-license-checker', VcfPwaInstallDialog);
}
