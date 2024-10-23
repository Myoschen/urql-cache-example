CORE_DIR := "core"
WEB_DIR := "web"

default:
  @just --list

dev-core:
  @cd {{ CORE_DIR }} && pnpm i && pnpm run dev

dev-web:
  @cd {{ WEB_DIR }} && pnpm i && pnpm run dev