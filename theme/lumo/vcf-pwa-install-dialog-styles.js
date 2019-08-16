const theme = document.createElement('dom-module');
theme.id = 'vcf-pwa-install-dialog-lumo';
theme.setAttribute('theme-for', 'vcf-pwa-install-dialog');
theme.innerHTML = `
    <template>
      <style>
        :host {}
      </style>
    </template>
  `;
theme.register(theme.id);
