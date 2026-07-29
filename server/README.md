# AlmaQuake server

## Persistent data on Railway

The server stores Telegram subscriber IDs, FCM tokens, and monitor state in
`DATA_DIR`. Railway deployments must use a persistent Volume:

1. Open the server service in Railway and add a Volume mounted at `/data`.
2. Add the service variable `DATA_DIR=/data`.
3. Redeploy once. Future Git pushes/redeploys will keep the files on the Volume.

Without a mounted Volume, Railway's deployment filesystem is ephemeral and no
application code can guarantee that subscribers survive a redeploy.

For local development, omit `DATA_DIR`; data is stored in `server/data`.
