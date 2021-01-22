# PWA Experiment

## Getting Started

1. Clone this repo and run `npm i` in this folder
2. Make sure you have the [Shopify App CLI](https://shopify.github.io/shopify-app-cli/getting-started/install/) installed
3. Create an new app in your Partner Dashboard to work out of.
4. Add the service-worker beta flag for your app in services internal to make sure the `allow-service-worker` header to be passed through the proxy
5. Run the `shopify connect` command to setup this app with your partner account and install this app on your dev store
6. Run `shopify serve` in this project to start the server to serve your **manifest.json** + **sw.js**
7. In the Partner Dashboard, select your app > extensions > Online Store > App Proxy
8. Setup your App Proxy with the following values:
```bash
  Subpath prefix: apps
  Subpath: pwa-test
  Proxy URL: the HOST value found in your the **.env** file created by `shopify connect`
```
9. In your dev store theme code editor, add the following somewhere in the `<head>` of your theme inside **layouts/theme.liquid**
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

