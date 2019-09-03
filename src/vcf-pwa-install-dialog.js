import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { ElementMixin } from '@vaadin/vaadin-element-mixin';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-dialog';
import '@vaadin/vaadin-checkbox';
import { openPwaInstallPrompt } from '@vaadin-component-factory/vcf-pwa-install-helpers';

/**
 * The following selectors are available for styling:
 *
 * Selector | Description
 * ----------------|----------------
 * `[part='wrapper']` | The element that wraps all the elements inside the dialog
 * `[part='content']` | The element that wraps the contents of dialog
 *
 * How to provide styles of the content:
 *  Create a `dom-module` element like the following example
 *
 * ```html
 * <dom-module id="my-pwa-styles" theme-for="vcf-pwa-install-dialog">
 *  <template>
 *    <style>
 *      [part='wrapper'] {
 *        padding: 1em;
 *      }
 *      [part='content'] {
 *        max-width: 25em;
 *      }
 *    </style>
 *  </template>
 * </dom-module>
 * ```
 *
 * How to provide content of the dialog:
 *  Wrap the content of dialog in an element with 'dialog-content' attribute.
 *
 * ```html
 * <div dialog-content>
 *    Dialog content
 * </div>
 * ```
 *
 * The component fires 5 custom events:
 *  - vcf-pwa-prompt-shown: when the dialog opens
 *  - vcf-pwa-prompt-dismissed: when the dialog is closed
 *  - vcf-pwa-install-triggered: when the user click the "install app" button
 *  - vcf-pwa-install-successful: when the user installs the app
 *  - vcf-pwa-install-cancelled: when the user cancels the installation of the app
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

      <vaadin-dialog id="dialog" opened="{{opened}}">
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
          <div part="wrapper">
            <vaadin-button theme="tertiary" class="close" on-click="closeDialog">[[closeText]]</vaadin-button>
            <div part="content" inner-h-t-m-l="[[content.innerHTML]]"></div>
            <template is="dom-if" if="[[!ios]]">
              <vaadin-button theme="primary" class="install-button" on-click="showInstallDialog">
                <span>[[buttonText]]</span>
              </vaadin-button>
            </template>
            <div class="stop-showing-container">
              <vaadin-checkbox id="stop-showing" on-change="onCheckNeverShow">[[stopShowingText]]</vaadin-checkbox>
            </div>
          </div>
        </template>
      </vaadin-dialog>
    `;
  }

  static get is() {
    return 'vcf-pwa-install-dialog';
  }

  static get version() {
    return '0.3.4';
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
        value: "Don't show me this message again"
      },
      ios: {
        type: Boolean,
        value: false
      },
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        notify: true,
        observer: 'onDialogOpenedChanged'
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

    this.content = this.querySelector('[dialog-content]');

    this.innerHTML = '';
  }

  iOSDevice() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  }

  iOSSafari() {
    return this.iOSDevice() && navigator.userAgent.match(/AppleWebKit/) && !navigator.userAgent.match(/CriOS/i);
  }

  onDialogOpenedChanged(newValue, oldValue) {
    if (oldValue !== null) {
      this.dispatchEvent(
        new CustomEvent(`vcf-pwa-prompt-${newValue ? 'shown' : 'dismissed'}`, {
          bubbles: true,
          composed: true,
          cancelable: true
        })
      );
    }
  }

  closeDialog() {
    this.opened = false;
  }

  showInstallDialog() {
    this.dispatchEvent(new CustomEvent('vcf-pwa-install-triggered', { bubbles: true, composed: true }));

    // Show the prompt
    openPwaInstallPrompt().then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        this.dispatchEvent(new CustomEvent('vcf-pwa-install-successful', { bubbles: true, composed: true }));

        localStorage.setItem('vcf-pwa-installed', 'true');
        this.closeDialog();
      } else {
        this.dispatchEvent(new CustomEvent('vcf-pwa-install-cancelled', { bubbles: true, composed: true }));
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
