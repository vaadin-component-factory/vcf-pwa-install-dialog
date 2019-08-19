import { html } from '@polymer/polymer/polymer-element.js';

const template = html`
  <dom-module id="my-pwa-styles" theme-for="vcf-pwa-install-dialog">
    <template>
      <style>
        [part='wrapper'] {
          margin: -10px;
        }
        [part='content'] {
          max-width: 25em;
          text-transform: uppercase;
        }
      </style>
    </template>
  </dom-module>
`;

document.head.appendChild(template.content);
