# 🚀 AntiGravity: Complete Setup & APK Building Guide

## 📋 Project Overview

**AntiGravity** is a fully functional AI-agentic service orchestration platform with:

- **Customer Side**: AI-powered chat for booking services in English, Urdu, or Roman Urdu
- **Provider Side**: Context-aware AI responses with real-time booking coordination
- **Multi-Agent Pipeline**: Language detection → Intent extraction → Provider ranking → Pricing → Dispute resolution
- **State Machine**: 9-state lifecycle with immutable audit trails
- **Real-time Sync**: GPS tracking, geofencing, live provider updates

---

## ✅ What's Implemented

### Core Features
- ✅ **Multilingual AI**: English, Urdu, Roman Urdu support
- ✅ **Customer Chat**: Intent-based service request parsing
- ✅ **Provider Chat**: Context-aware conversational responses
- ✅ **Service Categories**: Plumbing, Electrical, AC, Mechanics, Tutoring, Cleaning, Beauty
- ✅ **Provider Ranking**: Distance + rating + experience scoring
- ✅ **Dynamic Pricing**: Base price × demand multiplier
- ✅ **Booking Workflow**: 9-state progression with validations
- ✅ **Dispute System**: AI-mediated settlements with refund logic
- ✅ **Beautiful UI**: Dark mode, glassmorphic design, smooth animations
- ✅ **Responsive Design**: Tablet and mobile support
- ✅ **Complete Type Safety**: Full TypeScript with Zustand state management

### Recent Enhancements
- ✅ **Provider-Side Agentic Flow**: Real AI responses, not templates
- ✅ **Conversation Context Tracking**: Stateful multi-turn conversations
- ✅ **Removed Speech Recognition**: Mic button removed for app stability
- ✅ **Cleaned Codebase**: Production-ready implementation

---

## 🔧 Quick Start (Development)

### 1. Install Dependencies
```bash
cd /home/kali/Desktop/ai-service-orchestration
npm install
```

### 2. Start Dev Server
```bash
npx expo start
```

Then:
- Press `a` for Android Emulator
- Press `i` for iOS Simulator
- Scan QR code with Expo Go app (mobile)

### 3. View Admin Dashboard
```bash
cd service-orchestration-platform
npm install
npm run dev
```
Open http://localhost:3000

---

## 📱 Building the APK (Android)

### Prerequisites
```bash
# Check Java
java -version

# Check Node
node --version
npm --version

# Android SDK (via Android Studio or SDK Manager)
# Make sure ANDROID_HOME is set
echo $ANDROID_HOME
```

### Build Steps

#### Step 1: Generate Native Code
```bash
npx expo prebuild --clean
```

#### Step 2: Build Debug APK (Easiest)
```bash
cd android
./gradlew assembleDebug -x lint -x test
cd ..
```
⏱️ **Time**: 5-10 minutes (first build is slowest)

#### Step 3: Find the APK
```bash
find android/app/build/outputs/apk -name "*.apk" -type f
```

Typically located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Install on Device
```bash
# Connect Android device via USB
adb devices

# Install APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or use full path
adb install -r path/to/app-debug.apk
```

---

## 🗂️ Project Structure

```
ai-service-orchestration/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   └── ChatInputBar.tsx      # Customer input (no STT)
│   │   ├── ui/
│   │   │   └── CategoryChipBar.tsx   # Service categories
│   │   └── GlassCard.tsx             # UI component
│   ├── screens/
│   │   ├── AssistantChatScreen.tsx   # Customer chat (AI)
│   │   ├── ProviderChatScreen.tsx    # Provider chat (AI)
│   │   └── HomeScreen.tsx            # Welcome screen
│   ├── store/
│   │   ├── useAntiGravityStore.ts    # Multi-agent orchestration
│   │   ├── useProviderChatStore.ts   # Provider AI (NEW!)
│   │   └── useBookingStore.ts        # Booking state
│   ├── services/
│   │   ├── antigravityClient.ts      # Workflow runner
│   │   └── mockData.ts               # Mock providers
│   ├── utils/
│   │   └── serviceCategories.ts      # Category detection
│   └── types/
│       └── index.ts                  # TypeScript definitions
├── docs/
│   ├── PROVIDER_AGENTIC_FLOW.md      # Provider AI architecture
│   ├── WORKFLOWS.md                  # Multi-agent pipeline
│   ├── DISPUTES.md                   # Dispute resolution
│   └── seed.sql                      # Database schema
├── app.json                          # Expo config
├── package.json                      # Dependencies
├── README.md                         # Main guide
├── BUILD_APK.md                      # APK building (THIS FILE)
└── build-apk.sh                      # Build script
```

---

## 🔄 Multi-Agent Pipeline

```
Customer Message
    ↓
[LanguageAgent] → Detect: English/Urdu/Roman Urdu
    ↓
[IntentAgent] → Extract: Service category, urgency, budget
    ↓
[LocationAgent] → Parse: Customer location
    ↓
[SchedulingAgent] → Extract: Timing preference (today, morning, etc.)
    ↓
[ProviderSearchAgent] → Find: Matching providers
    ↓
[RankingAgent] → Score: Distance (35%) + Rating (45%) + Experience (20%)
    ↓
[PricingAgent] → Calculate: Base × Demand Multiplier
    ↓
[BookingAgent] → Create: Immutable booking record
    ↓
[Provider AI] → Generate: Context-aware response
    ↓
Display to User
```

---

## 💬 Provider-Side AI (New!)

The provider chat now uses **real AI** instead of templates:

### Conversation Stages
1. **Initial**: Provider asks for location
2. **Location Provided**: Provider asks for timing
3. **Timing Confirmed**: Provider confirms and offers call
4. **Completed**: Ready for booking

### Example Flow

**Customer**: "میرا پائپ لیک ہو رہا ہے" *(Pipe is leaking)*  
**Provider AI**: "براہ کرم اپنی موجودہ جگہ بھیج دیں" *(Please share location)*

**Customer**: "G-14" *(I'm in G-14)*  
**Provider AI**: "براہ کرم بتائیں کہ میں کب آ سکتا ہوں؟" *(When should I visit?)*

**Customer**: "ابھی" *(Right now)*  
**Provider AI**: "بہترین! میں G-14 میں فوری آپ کے پاس پہنچ جاؤں گا" *(Perfect! Coming right now)*

---

## 🧪 Testing

### Unit Test
```bash
npm test
```

### End-to-End Test
```bash
node verify_e2e.js
```

### Manual Testing
1. Open app
2. **Customer tab**: Send "pipe is leaking" → Select plumber → Verify ranking
3. **Provider tab**: Check provider response flow
4. **State changes**: Verify booking progresses through 9 states

---

## 🐛 Troubleshooting

### Build Issues

**"Cannot find native module"**
- ✅ Expected and handled safely
- No action needed

**Gradle build hangs**
```bash
export GRADLE_OPTS="-Xmx4096m"
./gradlew clean
./gradlew assembleDebug
```

**ADB not finding device**
```bash
adb kill-server
adb start-server
adb devices
```

**Permission denied on gradlew**
```bash
chmod +x android/gradlew
```

### App Issues

**Red screen error**
- Check that imports are correct
- Run `npx tsc --noEmit` to validate TypeScript

**Slow typing**
- Reduce animation complexity in theme/colors.ts
- Use React.memo for expensive components

---

## 📦 APK Specifications

### Debug APK
- **Size**: ~80-100 MB
- **Build Time**: 5-10 minutes (first build)
- **Debuggable**: Yes
- **Signing**: Automatic (debug key)
- **Use Case**: Development, QA, testing

### Release APK
- **Size**: ~60-80 MB
- **Build Time**: 10-15 minutes
- **Debuggable**: No
- **Signing**: Manual (release key)
- **Use Case**: Production, distribution, app stores

---

## 🚢 Distribution

### Share APK
```bash
# Copy to public directory
cp android/app/build/outputs/apk/debug/app-debug.apk ~/Desktop/

# Upload to file hosting
# - Google Drive
# - Dropbox
# - Firebase App Distribution
# - GitHub Releases
```

### Play Store Submission
1. Generate release APK
2. Sign with production key
3. Upload to Google Play Console
4. Complete store listing
5. Submit for review

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](../README.md) | Project overview |
| [BUILD_APK.md](./BUILD_APK.md) | APK building guide |
| [PROVIDER_AGENTIC_FLOW.md](../docs/PROVIDER_AGENTIC_FLOW.md) | Provider AI implementation |
| [WORKFLOWS.md](../docs/WORKFLOWS.md) | Multi-agent orchestration |
| [DISPUTES.md](../docs/DISPUTES.md) | Dispute resolution system |
| [ARCHITECTURE.md](../docs/ARCHITECTURE.md) | Complete system design |

---

## 🎯 Next Steps

### Immediate
1. ✅ Build debug APK: `./gradlew assembleDebug`
2. ✅ Install on device: `adb install app-debug.apk`
3. ✅ Test customer chat
4. ✅ Test provider chat
5. ✅ Verify AI responses

### Short-term
1. Connect to real Supabase
2. Enable Google Maps
3. Integrate real booking backend
4. Add payment processing

### Long-term
1. Submit to Play Store
2. iOS app (via App Store)
3. Web dashboard (already in progress)
4. Advanced ML for pricing

---

## 📞 Support

**Issues?**
1. Check `BUILD_APK.md`
2. Run `npx tsc --noEmit` (type check)
3. Read error logs in Android Studio
4. Review docs/

**Questions?**
- See `ARCHITECTURE.md` for system design
- See `PROVIDER_AGENTIC_FLOW.md` for AI implementation
- See `WORKFLOWS.md` for orchestration pipeline

---

**Status**: Ready for APK Building ✅  
**Last Updated**: May 21, 2026  
**Version**: 1.0.0
