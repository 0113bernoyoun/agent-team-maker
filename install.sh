#!/bin/bash
# agent-team-maker installer — works without npm/node
# Usage: curl -fsSL https://raw.githubusercontent.com/YOUR_REPO/main/install.sh | bash

set -e

REPO_URL="https://github.com/YOUR_REPO/agent-team-maker"
TEMP_DIR=$(mktemp -d)
TARGET_DIR="${1:-.}"

echo ""
echo "  agent-team-maker installer"
echo ""

# Clone or download
if command -v git &> /dev/null; then
  echo "  Cloning repository..."
  git clone --depth 1 --quiet "$REPO_URL" "$TEMP_DIR/agent-team-maker" 2>/dev/null || {
    echo "  Error: Failed to clone repository."
    echo "  Make sure the repository URL is correct."
    rm -rf "$TEMP_DIR"
    exit 1
  }
else
  echo "  Error: git is required for installation."
  echo "  Install git or use: npx agent-team-maker init"
  rm -rf "$TEMP_DIR"
  exit 1
fi

SRC="$TEMP_DIR/agent-team-maker"
CLAUDE_DIR="$TARGET_DIR/.claude"

# Create directories
mkdir -p "$CLAUDE_DIR/templates/agent-team-maker"
mkdir -p "$CLAUDE_DIR/commands/team"
mkdir -p "$CLAUDE_DIR/agents"

# Copy templates
cp -r "$SRC/templates/"* "$CLAUDE_DIR/templates/agent-team-maker/"
echo "  Copied templates → .claude/templates/agent-team-maker/"

# Copy commands
cp -r "$SRC/commands/team/"* "$CLAUDE_DIR/commands/team/"
echo "  Copied commands → .claude/commands/team/"

# Clean up
rm -rf "$TEMP_DIR"

echo ""
echo "  Setup complete!"
echo ""
echo "  Next steps:"
echo "  1. Open Claude Code in your project"
echo "  2. Run /team:create to generate your agent team"
echo "  3. Or run /team:list to browse available presets"
echo ""
