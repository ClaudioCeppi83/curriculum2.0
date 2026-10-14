#!/usr/bin/env bash
# ==============================================================================
# MigraCode Curriculum Module Scaffolder
# Usage: ./create_module.sh <site_name> <module_name>
#
# Generates a standard curriculum module architecture following the MigraCode/CYF
# pedagogical structure:
#   - Module Root: _index.md, prep/, success/
#   - Sprints (1-4): _index.md, prep/, backlog/, day-plan/, success/
#   - Product Track: _index.md, prep/, backlog/, success/
# ==============================================================================

set -euo pipefail

# Display usage helper
show_help() {
    cat <<EOF
Usage: $(basename "$0") <site_name> <module_name>

Arguments:
  site_name    The target organization directory (e.g., org-cyf-itp)
  module_name  The kebab-case name of the new module (e.g., modern-javascript)

Options:
  -h, --help   Display this documentation and exit

Example:
  ./tooling/create_module.sh org-cyf-itp fullstack-integration
EOF
}

# Handle help flags
if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
    show_help
    exit 0
fi

# Validate positional arguments
if [[ -z "${1:-}" || -z "${2:-}" ]]; then
    echo "Error: Missing required arguments." >&2
    show_help >&2
    exit 1
fi

SITE_NAME="$1"
MODULE_NAME="$2"

# Verify Hugo binary availability
if ! command -v hugo &> /dev/null; then
    echo "Error: hugo executable not found in PATH." >&2
    echo "Please ensure Hugo is installed and added to PATH (e.g., export PATH=\$HOME/.local/bin:\$PATH)." >&2
    exit 1
fi

# Determine directory paths
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SITE_ROOT="${REPO_ROOT}/${SITE_NAME}"
CONTENT_DIR="${SITE_ROOT}/content"
MODULE_DIR="${CONTENT_DIR}/${MODULE_NAME}"
SPRINT_DIR="${MODULE_DIR}/sprints"
PRODUCT_DIR="${MODULE_DIR}/product"

# Verify site root existence
if [[ ! -d "${SITE_ROOT}" ]]; then
    echo "Error: Site directory  does not exist." >&2
    exit 1
fi

# Ensure content directory exists
if [[ ! -d "${CONTENT_DIR}" ]]; then
    mkdir -p "${CONTENT_DIR}"
    echo "==> Created content root: ${CONTENT_DIR}"
fi

# Change working directory to site root for Hugo archetypes resolution
cd "${SITE_ROOT}"

echo "==> Scaffolding module: ${MODULE_NAME} in ${SITE_NAME}"

# 1. Create the main module index
hugo new --kind module "${MODULE_DIR}/_index.md"

# 2. Create top-level module files (prep, success)
TOP_LEVEL_FILES=("prep" "success")
for file in "${TOP_LEVEL_FILES[@]}"; do
    FILE_PATH="${MODULE_DIR}/${file}/index.md"
    hugo new --kind "module-${file}" "${FILE_PATH}"
done

# 3. Create sprint directories (sprints 1-4)
# Each sprint contains: _index.md, prep, backlog, day-plan, success
for i in {1..4}; do
    SPRINT_PATH="${SPRINT_DIR}/${i}"
    hugo new --kind sprint "${SPRINT_PATH}/_index.md"
    
    SPRINT_FILES=("prep" "backlog" "day-plan" "success")
    for file in "${SPRINT_FILES[@]}"; do
        FILE_PATH="${SPRINT_PATH}/${file}/index.md"
        hugo new --kind "${file}" "${FILE_PATH}"
    done
done

# 4. Create product track directory
# Product contains: _index.md, prep, backlog, success
hugo new --kind product "${PRODUCT_DIR}/_index.md"

PRODUCT_FILES=("prep" "backlog" "success")
for file in "${PRODUCT_FILES[@]}"; do
    FILE_PATH="${PRODUCT_DIR}/${file}/index.md"
    hugo new --kind "product-${file}" "${FILE_PATH}"
done

echo "✅ Module  successfully created at: ${MODULE_DIR}"
