#!/bin/bash

# AntiGravity APK Build Script
# This script builds a debug APK for Android testing and distribution

set -e

echo "🚀 AntiGravity APK Builder"
echo "=========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo -e "${BLUE}Step 1: Cleaning previous builds...${NC}"
rm -rf android/app/build
echo -e "${GREEN}✓ Cleaned${NC}"
echo ""

echo -e "${BLUE}Step 2: Generating native code with Expo prebuild...${NC}"
npx expo prebuild --clean --yes
echo -e "${GREEN}✓ Prebuild complete${NC}"
echo ""

echo -e "${BLUE}Step 3: Building debug APK (this may take 5-10 minutes)...${NC}"
cd android
./gradlew assembleDebug \
  -x lint \
  -x test \
  -PreactNativeArchitectures=arm64-v8a,armeabi-v7a \
  --parallel \
  --daemon
cd ..
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Find the APK
APK_PATH=$(find android/app/build/outputs -name "*.apk" -type f | head -1)

if [ -z "$APK_PATH" ]; then
  echo -e "${YELLOW}⚠ Could not locate APK automatically${NC}"
  echo "Try: find android/app/build/outputs -name '*.apk'"
else
  echo -e "${GREEN}✓ APK created successfully!${NC}"
  echo ""
  echo -e "${YELLOW}APK Location:${NC}"
  echo "$APK_PATH"
  echo ""
  echo -e "${YELLOW}APK Size:${NC}"
  du -h "$APK_PATH"
  echo ""
  echo -e "${BLUE}To install on a connected device:${NC}"
  echo "adb install \"$APK_PATH\""
  echo ""
  echo -e "${BLUE}To install on an Android emulator:${NC}"
  echo "adb install \"$APK_PATH\""
fi

echo ""
echo -e "${GREEN}✓ Build process complete!${NC}"
