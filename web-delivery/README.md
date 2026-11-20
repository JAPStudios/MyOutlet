# MyOutlet frontend asset delivery

This service publishes the frontend JavaScript from `src/public/myoutlet-app.js` with the `application/javascript` MIME type. Railway rebuilds it from `JAPStudios/MyOutlet` on pushes to `main`. It does not host the Wix site or replace GitHub as the source repository.

- Asset: `/myoutlet-app.js`
- Health check: `/health`
- Container port: `8080`
