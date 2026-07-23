#!/bin/zsh
set -e

cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Node.js is required. Install the current LTS version from nodejs.org first."
  read -k 1 "?Press any key to close..."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "Installing project dependencies..."
  npm install
fi

echo "Starting Quincy's 3D portfolio..."
npm run dev -- --host 0.0.0.0
