#!/bin/bash
# AntiGravity APK Builder - Simple Version

cd "$(dirname "$0")" || exit 1

echo ""
echo "🚀 AntiGravity APK Builder"
echo "============================"
echo ""

# Step 1: Prebuild
echo "📦 Step 1: Generating native code (1-2 min)..."
npx expo prebuild --clean --yes 2>/dev/null || {
    echo "❌ Prebuild failed"
    exit 1
}
echo "✓ Native code ready"
echo ""

# Step 2: Build APK
echo "🔨 Step 2: Building debug APK (5-10 min)..."
echo "   (This may take a while, be patient...)"
echo ""
cd android 2>/dev/null || {
    echo "❌ android/ directory not found"
    exit 1
}

./gradlew assembleDebug -x lint -x test -q 2>/dev/null

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    
    # Find APK
    APK=$(find app/build/outputs/apk -name "*.apk" 2>/dev/null | head -1)
    
    if [ -n "$APK" ]; then
        SIZE=$(du -h "$APK" | cut -f1)
        echo "📱 APK Location: $APK"
        echo "📊 Size: $SIZE"
        echo ""
        echo "📥 To install on device:"
        echo "   adb install \"$APK\""
        echo ""
    fi
else
    echo "❌ Build failed"
    exit 1
fi

cd - > /dev/null || exit 1
