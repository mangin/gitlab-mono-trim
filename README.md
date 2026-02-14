# GitLab MonoTrim Chrome Extension

<p align="center">
  <img src="assets/icon128.png" alt="GitLab Copy Path Extension" width="128" height="128">
</p>

A Chrome extension that adds a "Copy Path" button to file headers in GitLab merge request diffs.

## Features

- Automatically activates on GitLab merge request diff pages
- Adds a copy button with icon to each file header
- Configurable regex pattern to remove path prefixes (set at build time)
- Visual feedback when path is copied
- Works with any GitLab instance (gitlab.com, self-hosted, etc.)
- No runtime configuration needed - everything is set during build

## Installation

### 1. Build the Extension

Clone this repository and run the build script:

```bash
git clone <repo-url>
cd gitlab-mono-x
python build.py
```

You'll be prompted to enter:
- **GitLab domain** (e.g., `gitlab.com` or `gitlab.yourcompany.com`)
  - Default: `gitlab.com`
  - Enter only the domain, no `http://` or paths
- **Default path pattern** to remove (e.g., `^services/[^/]+/`)
  - Default: `^services/[^/]+/`
  - This is a regex pattern that will be applied to file paths

### 2. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `gitlab-mono-x` directory
5. The extension is now installed!

## Usage

1. Navigate to any GitLab merge request diff page on your configured domain
2. Look for the copy button (with copy icon) in each file header
3. Click the button to copy the processed file path to your clipboard
4. The button will turn green for 2 seconds as confirmation

## Rebuilding

To change the GitLab domain or path pattern:

```bash
python build.py
```

Enter your new domain and pattern when prompted. After rebuilding, reload the extension in Chrome:
1. Go to `chrome://extensions/`
2. Click the reload icon on the extension card

**Note:** This extension does not have a settings UI. All configuration is done at build time.

## File Path Processing

The extension uses a regex pattern configured during build to remove path prefixes:

- Pattern is set when running `build.py`
- Default: `^services/[^/]+/` 
  - Removes `services/x/`, `services/auth/`, etc.
- To change the pattern, rebuild: `python build.py`
- If no pattern matches, the original path is copied

### Example Patterns

- `^services/[^/]+/` - Removes "services/" + any subdirectory
- `^src/components/` - Removes "src/components/" prefix
- `^(frontend|backend)/` - Removes "frontend/" or "backend/"
- `^[^/]+/` - Removes the first directory level

## Project Structure

```
gitlab-mono-x/
├── manifest.template.json  (template)
├── manifest.json           (generated)
├── build.py               (build script)
├── .gitignore
├── assets/
│   ├── copy.svg           (copy button icon)
│   └── icon*.png          (extension icons)
└── src/
    ├── content.template.js (template)
    ├── content.js         (generated)
    └── styles.css
```

## Development

### Requirements

- Python 3.6+
- Git

### Building

The build process:
1. Prompts for GitLab domain and default pattern
2. Generates `manifest.json` from `manifest.template.json`
3. Generates `src/content.js` from `src/content.template.js`
4. Ready to load as unpacked extension

### Template System

Templates use placeholders that are replaced during build:
- `manifest.template.json`: `{{GITLAB_DOMAIN}}` - Replaced with user's GitLab domain
- `src/content.template.js`: `{{DEFAULT_PATTERN}}` - Replaced with user's path pattern

Generated files (`manifest.json`, `src/content.js`) are not tracked in git (see `.gitignore`).

## License

MIT License - see [LICENSE](LICENSE) file for details.

