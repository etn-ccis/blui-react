# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

This Vite application supports frozen documentation snapshots for each published release. The current documentation is deployed at the root of the hosting repository; snapshots are deployed to version folders and remain available from the version menu.

## URLs

| Environment | Current docs | Version snapshot |
| --- | --- | --- |
| Dev | `/react-dev/` | `/react-dev/vN/` |
| Production | `/react/` | `/react/vN/` |

`N` is the numeric value of `docsVersion` in `package.json`.

## Release Metadata

Before creating a snapshot, update these files:

1. In `docs/package.json`, set the next release number without the `v` prefix:

   ```json
   "docsVersion": "2"
   ```

2. In `src/__configuration__/navigationMenu/versionHistory.ts`, update the menu entries in newest-to-oldest order.

   - The newest release represents the current root deployment and uses `url: ''`.
   - Previous releases use their deployed folder, such as `url: '/v1'`.
   - Enter the package versions manually; use the published stable versions rather than alpha or beta qualifiers.

   ```ts
   export const versionHistory: VersionHistoryItem[] = [
	   {
		   date: 'October 2026',
		   url: '',
		   packages: [
			   { name: '@brightlayer-ui/react-components', version: '8.0.6' },
			   { name: '@brightlayer-ui/react-themes', version: '9.1.1' },
			   { name: '@brightlayer-ui/react-auth-workflow', version: '7.0.4' },
		   ],
	   },
	   {
		   date: 'Previous release month',
		   url: '/v1',
		   packages: [],
	   },
   ];
   ```

Do not add a historical entry until its snapshot has been deployed successfully.

## Publish A Snapshot

1. Commit and push the release metadata.
2. In GitHub Actions, run **Deploy React Docs Release Snapshot** with `environment: dev`.
3. Verify the snapshot and a deep link, for example `/react-dev/v2/` and `/react-dev/v2/components/app-bar/examples`.
4. Run the normal dev deployment to update `/react-dev/`.
5. Run **Deploy React Docs Release Snapshot** with `environment: prod`.
6. Verify `/react/` and `/react/v2/`.

The snapshot workflow builds the workspace component package before building the docs, so no tarball installation is required.

## Retention

The snapshot workflow keeps the three highest `vN` folders in each hosting repository. When a fourth snapshot is published, the oldest snapshot folder is removed. Remove its corresponding entry from `versionHistory.ts` when this happens.

Historical snapshots are frozen builds. A menu change made after a snapshot has been deployed does not update that already-deployed snapshot.

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
