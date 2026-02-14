# GitLab File Path Copy Extension

A Chrome extension that adds a "Copy Path" button to file headers in GitLab merge request diffs.

## Features

- Automatically activates on GitLab merge request diff pages
- Adds a "Copy Path" button to each file header
- Strips "service/x/" prefix from file paths before copying
- Visual feedback when path is copied

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the folder containing these extension files
5. The extension is now installed and ready to use

## Usage

1. Navigate to any GitLab merge request diff page (URL containing "gitlab" and "merge_requests/*/diffs")
2. Look for the "Copy Path" button in each file header
3. Click the button to copy the processed file path to your clipboard
4. The button will show "Copied!" confirmation for 2 seconds

## File Path Processing

- If a file path starts with `service/x/`, that prefix is removed before copying
- If a file path does not contain `service/x/` at the beginning, no button is added

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main logic for adding copy buttons
- `styles.css` - Button styling
- `README.md` - This file

## Notes

You'll need to add icon files (icon16.png, icon48.png, icon128.png) or remove the icons section from manifest.json if you don't want custom icons.
