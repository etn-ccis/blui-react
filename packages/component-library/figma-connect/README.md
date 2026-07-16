# Figma Code Connect — React Components

This project uses [Figma Code Connect](https://github.com/figma/code-connect) to link React components to their corresponding Figma designs.

## Setup

### Environment Variables

A `.env` file is required at the package root (`blui-react/packages/component-library/.env`). This file is **not committed to the repository**.

| Variable                       | Description                                                        |
| ------------------------------ | ------------------------------------------------------------------ |
| `FIGMA_ACCESS_TOKEN`           | Personal access token generated from your Figma account            |
| `HTTPS_PROXY`                  | Corporate proxy URL for HTTPS requests (if applicable)             |
| `HTTP_PROXY`                   | Corporate proxy URL for HTTP requests (if applicable)              |
| `NODE_TLS_REJECT_UNAUTHORIZED` | Set to `0` to bypass corporate SSL certificate verification issues |

### Generating a Figma Access Token

1. Go to [figma.com](https://www.figma.com)
2. Click your avatar (top-left) → **Settings**
3. Navigate to **Security** → **Personal access tokens**
4. Click **Generate new token**
5. Copy the token and add it to your `.env` file

## Publishing

From the package root (`blui-react/packages/component-library/`):

```sh
pnpm run figma:publish
```

## Project Structure

```
packages/component-library/figma-connect/
├── AppBar.figma.tsx
├── ChannelValue.figma.tsx
├── Drawer.figma.tsx
├── DrawerFooter.figma.tsx
├── DrawerLite.figma.tsx
├── DrawerNavItem.figma.tsx
├── DrawerRailItem.figma.tsx
├── EmptyState.figma.tsx
├── FileDragUpload.figma.tsx
├── Hero.figma.tsx
├── HeroBanner.figma.tsx
├── InfoListItem.figma.tsx
├── ListItemTag.figma.tsx
├── ScoreCard.figma.tsx
├── UserMenu.figma.tsx
└── README.md
```

## Adding a New Component

1. Get the Figma component URL (right-click the component in Figma → **Copy link**)
2. Run the create command from the package root:
   ```sh
   pnpm exec figma connect create '<figma-url>' --outFile figma-connect/<ComponentName>.figma.tsx
   ```
3. Update the generated file to import from the correct source path and map props accurately
4. Run `pnpm run figma:publish`
