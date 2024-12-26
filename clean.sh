#!/bin/bash
# 删除所有构建文件和缓存
rm -rf .next
rm -rf out
rm -rf node_modules
rm -f *.tsbuildinfo
rm -rf src/game/audio
find . -name "*.js.map" -type f -delete
find . -name "*.d.ts" -type f -delete
npm cache clean --force 