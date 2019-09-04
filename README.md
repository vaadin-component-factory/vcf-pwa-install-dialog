# &lt;vcf-pwa-install-dialog&gt;

## Demo

https://vcf-pwa-install-dialog.netlify.com/

## Installation

Install `vcf-pwa-install-dialog`:

```sh
npm i @vaadin-component-factory/vcf-pwa-install-dialog --save
```

## Usage

Once installed, import it in your application:

```js
import '@vaadin-component-factory/vcf-pwa-install-dialog';
```

And use it:

```html
<vcf-pwa-install-dialog>
  <div dialog-content>
    Dialog content
  </div>
</vcf-pwa-install-dialog>
```

Wrap the content of dialog in an element with `dialog-content` attribute.

### Styling

The following selectors are available for styling:

- `[part='wrapper']`: The element that wraps all the elements inside the dialog.
- `[part='content']`: The element that wraps the contents of dialog.

#### How to provide styles of the content:

Create a `dom-module` element like the following example and add your styles:

```html
<dom-module id="my-pwa-styles" theme-for="vcf-pwa-install-dialog">
  <template>
    <style>
      [part='wrapper'] {
        padding: 1em;
      }
      [part='content'] {
        max-width: 25em;
      }
    </style>
  </template>
</dom-module>
```

_Refer to [demos](https://vcf-pwa-install-dialog.netlify.com/) for real-world examples._

### Attributes

- `close-text`: The text for "Close" button.
- `button-text`: The text for "Install" button.
- `stop-showing-text`: The text for "Stop Showing" checkbox.
- `opened`: Use it to toggle the dialog.

### Events

The component fires 5 custom events:

- `vcf-pwa-prompt-shown`: when the dialog opens.
- `vcf-pwa-prompt-dismissed`: when the dialog is closed.
- `vcf-pwa-install-triggered`: when the user clicks the "install app" button.
- `vcf-pwa-install-successful`: when the user installs the app.
- `vcf-pwa-install-cancelled`: when the user cancels the installation of the app.

When the user checks the "Stop Showing" checkbox, a variable called `vcf-pwa-stop-showing` is saved on localStorage. You can use this variable to avoid showing the dialog in future visits.

_Refer to [demos](https://vcf-pwa-install-dialog.netlify.com/) for an example._

## Running demo

1. Fork the `vcf-pwa-install-dialog` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vcf-pwa-install-dialog` directory, run `npm install` to install dependencies.

1. Run `npm start` to open the demo.

## Contributing

To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.

## License

Commercial Vaadin Add-on License version 3 (CVALv3). For license terms, see LICENSE.

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
