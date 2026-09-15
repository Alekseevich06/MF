#!/usr/bin/env bash
set -e

export MF_BUILD_VERSION=$(git rev-parse --short HEAD)
export MF_BUILD_NAME=$(git rev-parse --abbrev-ref HEAD)

echo "Building MF with version=$MF_BUILD_VERSION, name=$MF_BUILD_NAME"

pnpm --filter @bookhub/catalog build
pnpm --filter @bookhub/authors build
pnpm --filter @bookhub/analytics build