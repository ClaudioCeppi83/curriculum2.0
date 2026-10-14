#!/bin/bash
set -e
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$ROOT_DIR/.env" ]; then
  export $(grep -v '^#' "$ROOT_DIR/.env" | xargs)
fi
export PATH=$HOME/.local/bin:$HOME/.local/go/bin:$PATH
cd "$ROOT_DIR/org-cyf-itp"
echo "🔨 Compiling Hugo with live GitHub backlog issues..."
hugo --minify
echo "🔍 Indexing Pagefind..."
npx -y pagefind --site public
echo "✅ Build completed successfully!"
