# PWA Experiment

## Getting Started

1. Make sure you have the [Shopify App CLI](https://shopify.github.io/shopify-app-cli/getting-started/install/) installed
2. Run the `shopify connect` command to setup this app with your partner account and install this app on your dev store
3. In the Partner Dashboard, select your app > extensions > Online Store > App Proxy
4. Setup your App Proxy with the following values:
```bash
  Subpath prefix: apps
  Subpath: pwa-test
  Proxy URL: the HOST value found in your the **.env** file created by `shopify connect`
```
5. In your dev store theme code editor, add the following somewhere in the `<head>` of your theme inside **layouts/theme.liquid**
```html
<link rel="manifest" href="/apps/pwa-test/manifest.json" />
<script>
    async function sw() {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/apps/pwa-test/sw.js', {scope: '/'})
          console.log('SW registered: ', registration);
        } catch (error) {
          console.log('Error registering SW: ', error)
        }
      } else {
        console.log('Service worker not supported');
      }
    }
    
    sw();
  </script>
```
6. Run `shopify serve` in this project to start the server to serve your **manifest.json** + **sw.js**
