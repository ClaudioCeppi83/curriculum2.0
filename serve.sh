#!/bin/bash
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "🚀 Starting static web server on http://localhost:3333..."
python3 -m http.server 3333 --directory "$ROOT_DIR/org-cyf-itp/public"
