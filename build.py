#!/usr/bin/env python3

import json
import os
import re
import sys


def main():
    print("=== GitLab File Path Copy - Extension Builder ===\n")

    # Check for required template files
    required_templates = ["manifest.template.json", "src/content.template.js"]
    for template in required_templates:
        if not os.path.exists(template):
            print(f"Error: Required template file not found: {template}")
            sys.exit(1)

    # Check if manifest.json exists
    if os.path.exists("manifest.json"):
        overwrite = (
            input("manifest.json already exists. Overwrite? (y/n): ").strip().lower()
        )
        if overwrite != "y":
            print("Build cancelled.")
            sys.exit(0)

    # Get GitLab domain
    domain = input("\nEnter your GitLab domain (default: gitlab.com): ").strip()
    if not domain:
        domain = "gitlab.com"

    # Validate domain
    domain = validate_domain(domain)

    # Get default path pattern
    pattern = input(
        "Enter default path pattern to remove (default: ^services/[^/]+/): "
    ).strip()
    if not pattern:
        pattern = "^services/[^/]+/"

    # Validate pattern
    pattern = validate_pattern(pattern)

    # Display validation results
    print("\nValidating inputs...")
    print(f"✓ Domain: {domain}")
    print(f"✓ Pattern: {pattern}")

    # Generate manifest.json
    print("\nGenerating manifest.json...")
    generate_manifest(domain)
    print("✓ manifest.json created successfully!")

    # Generate content.js from template
    print("Generating src/content.js...")
    generate_from_template(
        "src/content.template.js", "src/content.js", {"{{DEFAULT_PATTERN}}": pattern}
    )
    print("✓ src/content.js created successfully!")

    # Show next steps
    print("\nNext steps:")
    print("1. Open Chrome and go to chrome://extensions/")
    print("2. Enable 'Developer mode'")
    print("3. Click 'Load unpacked'")
    print(f"4. Select this directory: {os.path.abspath('.')}")
    print("5. The extension is now installed!")
    print(f"\nDefault path pattern is set to: {pattern}")
    print("To change the pattern, rebuild the extension with: python build.py")
    print("\nTo reconfigure, run: python build.py")


def validate_domain(domain):
    # Remove protocol if present
    domain = re.sub(r"^https?://", "", domain)
    # Remove trailing slash
    domain = domain.rstrip("/")
    # Remove path if present
    domain = domain.split("/")[0]

    # Basic validation
    if not domain or " " in domain:
        print("Error: Invalid domain format")
        sys.exit(1)

    # Check for valid hostname pattern
    if not re.match(r"^[a-zA-Z0-9]([a-zA-Z0-9\-\.]*[a-zA-Z0-9])?$", domain):
        print("Error: Invalid domain format")
        sys.exit(1)

    return domain


def validate_pattern(pattern):
    # Test if valid regex
    try:
        re.compile(pattern)
    except re.error as e:
        print(f"Error: Invalid regex pattern: {e}")
        sys.exit(1)

    return pattern


def generate_manifest(domain):
    # Read template
    try:
        with open("manifest.template.json", "r") as f:
            template = f.read()
    except FileNotFoundError:
        print("Error: manifest.template.json not found")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading template: {e}")
        sys.exit(1)

    # Replace placeholder
    manifest_content = template.replace("{{GITLAB_DOMAIN}}", domain)

    # Validate JSON
    try:
        json.loads(manifest_content)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in template: {e}")
        sys.exit(1)

    # Write manifest.json
    try:
        with open("manifest.json", "w") as f:
            f.write(manifest_content)
    except Exception as e:
        print(f"Error writing manifest.json: {e}")
        sys.exit(1)


def generate_from_template(template_path, output_path, replacements):
    """Generate file from template by replacing placeholders"""
    try:
        with open(template_path, "r") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {template_path} not found")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading {template_path}: {e}")
        sys.exit(1)

    # Replace all placeholders
    for placeholder, value in replacements.items():
        content = content.replace(placeholder, value)

    # Write output
    try:
        with open(output_path, "w") as f:
            f.write(content)
    except Exception as e:
        print(f"Error writing {output_path}: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
