# fboucheros
Personal hub for Frank Boucher

## Preview Environment

This repository includes an automated preview environment for pull requests. When you open a PR, a preview deployment will automatically be created and a comment will be added to the PR with the preview URL.

### How it works

1. **Automatic Preview Creation**: When a PR is opened or updated, GitHub Actions automatically deploys the changes to a unique preview URL
2. **Preview URL**: Each PR gets its own preview at `https://fboucher.github.io/fboucheros/pr-[PR_NUMBER]/`
3. **PR Comments**: A bot will comment on your PR with the direct preview link
4. **Automatic Updates**: The preview updates automatically when you push new commits to the PR
5. **Automatic Cleanup**: When the PR is closed, the preview environment is cleaned up

### Manual Testing

To test your changes locally:
1. Clone the repository
2. Open `index.html` in your browser
3. Make your changes and refresh to see updates

The site is a static HTML/CSS/JavaScript application with no build process required.
