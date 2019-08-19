import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { ElementMixin } from '@vaadin/vaadin-element-mixin';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-dialog';
import '@vaadin/vaadin-checkbox';

import { openPwaInstallPrompt } from './pwa-install-prompt';

/**
 * The following selectors are available for styling:
 *
 * Selector | Description
 * ----------------|----------------
 * `[part='step-content']` | The element that wraps the contents of dialog
 *
 * How to provide and style content of the steps:
 *  Add a style tag with 'dialog-styles' attribute and place your styles inside it.
 *  Wrap the content dialog in an element with 'dialog-content' attribute.
 *
 * ```html
 * <style dialog-styles></style>
 * <div dialog-content>
 *    Dialog content
 * </div>
 * ```
 */
class VcfPwaInstallDialog extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          justify-content: space-between;
          font-size: var(--lumo-font-size-s);
        }

        vaadin-button {
          font-size: inherit;
          cursor: pointer;
          padding: 0;
        }
      </style>

      <vaadin-dialog opened="{{opened}}" on-opened-changed="onDialogOpenedChanged">
        <template>
          <style>
            .close {
              margin: 0;
              padding: 0;
              margin-top: calc(var(--lumo-space-s) * -1);
            }

            .install-button {
              width: 100%;
              margin-top: var(--lumo-space-m);
            }

            .stop-showing-container {
              padding-top: var(--lumo-space-m);
              font-size: var(--lumo-font-size-xs);
            }
          </style>
          <style inner-h-t-m-l="[[styles.innerHTML]]"></style>
          <vaadin-button theme="tertiary" class="close" on-click="closeDialog">[[closeText]]</vaadin-button>
          <div part="content" inner-h-t-m-l="[[content.innerHTML]]"></div>
          <template is="dom-if" if="[[!ios]]">
            <vaadin-button theme="primary" class="install-button" on-click="showInstallDialog">
              <span>[[buttonText]]</span>
            </vaadin-button>
          </template>
          <div class="stop-showing-container">
            <vaadin-checkbox id="stop-showing" on-change="onCheckNeverShow"
              >[[stopShowingText]]</vaadin-checkbox
            >
          </div>
        </template>
      </vaadin-dialog>
    `;
  }

  static get is() {
    return 'vcf-pwa-install-dialog';
  }

  static get version() {
    return '0.1.1';
  }

  static get properties() {
    return {
      closeText: {
        type: String,
        value: 'Close'
      },
      buttonText: {
        type: String,
        value: 'Install app'
      },
      stopShowingText: {
        type: String,
        value: 'Don\'t show me this message again'
      },
      ios: {
        type: Boolean,
        value: false
      },
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        notify: true
      },
      styles: {
        type: Object,
        value: () => {}
      },
      content: {
        type: Object,
        value: () => {}
      }
    };
  }

  ready() {
    super.ready();

    this.ios = this.iOSSafari();

    this.styles = this.querySelector('[dialog-styles]');
    this.content = this.querySelector('[dialog-content]');

    this.innerHTML = '';
  }

  iOSDevice() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  }

  iOSSafari() {
    return this.iOSDevice() && navigator.userAgent.match(/AppleWebKit/) && !navigator.userAgent.match(/CriOS/i);
  }

  onDialogOpenedChanged() {
    if (window.ga) {
      window.ga('send', 'event', 'PWA', `custom prompt ${this.$.dialog.opened ? 'shown' : 'dismissed'}`);
    }
  }

  closeDialog() {
    this.opened = false;
  }

  showInstallDialog() {
    // Track the event
    if (window.ga) {
      window.ga('send', 'event', 'PWA', 'install triggered', 'vcf-pwa-install-dialog');
    }

    // Show the prompt
    openPwaInstallPrompt().then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        if (window.ga) {
          window.ga('send', 'event', 'PWA', 'install successful', 'vcf-pwa-install-dialog');
        }

        localStorage.setItem('vcf-pwa-installed', 'true');
        this.closeDialog();
      } else {
        if (window.ga) {
          window.ga('send', 'event', 'PWA', 'install cancelled', 'vcf-pwa-install-dialog');
        }
      }
    });
  }

  onCheckNeverShow() {
    const stopShowing = document
      .querySelector('vaadin-dialog-overlay')
      .shadowRoot.getElementById('content')
      .shadowRoot.getElementById('stop-showing');

    if (stopShowing.checked) {
      localStorage.setItem('vcf-pwa-stop-showing', 'true');
    } else {
      localStorage.removeItem('vcf-pwa-stop-showing');
    }
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
