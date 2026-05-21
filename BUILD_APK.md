# 📱 Building AntiGravity APK

This guide explains how to build an Android APK (.apk file) of the AntiGravity app.

---

## ⚡ Quick Start (Recommended)

### Option 1: Using the Build Script (Easiest)

```bash
cd /home/kali/Desktop/ai-service-orchestration
chmod +x build-apk.sh
./build-apk.sh
```

The script will:
1. Clean previous builds
2. Generate native code
3. Build the debug APK
4. Display the APK location

---

## 🔨 Manual Build Steps

### Prerequisites
Ensure you have:
- Node.js and npm installed
- Java Development Kit (JDK) 11+
- Android SDK (via Android Studio or sdkmanager)
- gradle (bundled with Android)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Generate Native Code
```bash
npx expo prebuild --clean
```

This generates the `android/` directory with native code.

### Step 3: Build Debug APK
```bash
cd android
./gradlew assembleDebug -x lint -x test
cd ..
```

**⏱️ Estimated time: 5-10 minutes** (first build takes longer)

### Step 4: Find Your APK
```bash
find android/app/build/outputs -name "*.apk" -type f
```

The APK is typically at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📲 Installing the APK

### On a Connected Android Device
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### On Android Emulator
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Manual Installation
1. Transfer the APK file to a USB device or cloud storage
2. Copy to Android phone
3. Open file manager on phone
4. Tap the APK file
5. Follow install prompts

---

## 🏗️ Build Variants

### Debug APK (Recommended for Testing)
```bash
./gradlew assembleDebug
```
- Faster build
- Larger file size (~80-100MB)
- Suitable for development and testing
- Can be debugged

### Release APK (For Production)
```bash
./gradlew assembleRelease
```
- Slower build
- Smaller file size (~60-80MB)
- Requires keystore signing
- Production-ready

---

## 📋 Build Status Reference

| Step | Status | Command |
|------|--------|---------|
| **Dependencies** | ✅ Done | `npm install` |
| **Native Code** | ✅ Done | `npx expo prebuild --clean` |
| **Compilation** | 🔄 In Progress | `./gradlew assembleDebug` |
| **APK Output** | ⏳ Pending | `find android/app/build/outputs -name "*.apk"` |

---

## 🆘 Troubleshooting

### Build Fails with "Cannot find native module"
**Solution**: This is expected for speech recognition module. It's safely handled in the code.

### Out of Memory Error
**Solution**: Increase Gradle memory:
```bash
export GRADLE_OPTS="-Xmx4096m"
./gradlew assembleDebug
```

### Build Hangs or Freezes
**Solution**: Use parallel builds with daemon:
```bash
./gradlew assembleDebug --parallel --daemon
```

### ADB Device Not Found
**Solution**: Enable USB debugging on phone and check:
```bash
adb devices
adb kill-server
adb start-server
```

---

## 📊 Build Timing

| Phase | Time |
|-------|------|
| **Prebuild** | 1-2 minutes |
| **First Gradle Build** | 3-5 minutes |
| **Subsequent Builds** | 1-2 minutes |
| **Total (First Time)** | 5-10 minutes |

---

## 🎯 What's Inside the APK

The APK includes:
- ✅ Customer-side AI chat
- ✅ Provider-side AI orchestration
- ✅ Real-time conversation context
- ✅ Service category detection
- ✅ Location tracking (mock)
- ✅ Multi-turn booking workflow
- ✅ Urdu/English/Roman Urdu support
- ✅ Beautiful dark-mode UI
- ✅ Complete state machine

---

## 📤 Sharing the APK

### File Size
- Debug APK: ~80-100 MB
- Release APK: ~60-80 MB

### Distribution Methods
1. **Email**: Too large for email attachment
2. **Google Drive**: Upload and share link
3. **Firebase App Distribution**: Recommended for testing
4. **GitHub Releases**: Upload to repository releases
5. **Multiple File Hosting**: Dropbox, OneDrive, etc.

---

## 🔗 Next Steps

After building the APK:

1. **Test on Device**
   ```bash
   adb install app-debug.apk
   ```

2. **Test Functionality**
   - Open customer chat screen
   - Send service requests
   - Switch to provider chat
   - Verify AI responses

3. **Generate Release Build** (when ready for production)
   ```bash
   ./gradlew assembleRelease
   ```

4. **Sign Release APK** (required for Play Store)
   - Generate signing key
   - Configure signing in build.gradle

---

## 📞 Support

For build issues:
1. Check Android Studio logs
2. Review `android/app/build/outputs/logs/`
3. Check Gradle daemon status: `./gradlew --status`
4. Clear cache if needed: `./gradlew clean`

---

**Build Status**: Ready to create APK ✅
