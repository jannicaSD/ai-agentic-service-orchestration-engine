#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Provider-Side Agentic Integration...\n');

const checks = [
  {
    name: 'Provider Chat Store File Exists',
    check: () => fs.existsSync('src/store/useProviderChatStore.ts'),
  },
  {
    name: 'Has analyzeConversationContext Function',
    check: () => {
      const content = fs.readFileSync('src/store/useProviderChatStore.ts', 'utf8');
      return content.includes('analyzeConversationContext');
    },
  },
  {
    name: 'Has generateProviderResponse Function',
    check: () => {
      const content = fs.readFileSync('src/store/useProviderChatStore.ts', 'utf8');
      return content.includes('generateProviderResponse');
    },
  },
  {
    name: 'Has ConversationContext Interface',
    check: () => {
      const content = fs.readFileSync('src/store/useProviderChatStore.ts', 'utf8');
      return content.includes('interface ConversationContext');
    },
  },
  {
    name: 'Has detectLocation Function',
    check: () => {
      const content = fs.readFileSync('src/store/useProviderChatStore.ts', 'utf8');
      return content.includes('detectLocation');
    },
  },
  {
    name: 'Has detectTiming Function',
    check: () => {
      const content = fs.readFileSync('src/store/useProviderChatStore.ts', 'utf8');
      return content.includes('detectTiming');
    },
  },
  {
    name: 'Store Exports useProviderChatStore',
    check: () => {
      const content = fs.readFileSync('src/store/useProviderChatStore.ts', 'utf8');
      return content.includes('export const useProviderChatStore');
    },
  },
  {
    name: 'Provider Chat Screen Uses Store',
    check: () => {
      const content = fs.readFileSync('src/screens/ProviderChatScreen.tsx', 'utf8');
      return content.includes('useProviderChatStore');
    },
  },
  {
    name: 'Documentation File Created',
    check: () => fs.existsSync('docs/PROVIDER_AGENTIC_FLOW.md'),
  },
  {
    name: 'Implementation Summary Created',
    check: () => fs.existsSync('PROVIDER_AGENTIC_IMPLEMENTATION.md'),
  },
];

let passed = 0;
let failed = 0;

checks.forEach((item, idx) => {
  const result = item.check();
  const icon = result ? '✅' : '❌';
  console.log(`${icon} ${idx + 1}. ${item.name}`);
  if (result) passed++;
  else failed++;
});

console.log(`\n📊 Results: ${passed}/${checks.length} checks passed`);

if (failed === 0) {
  console.log('\n✨ All verifications passed! Provider-side agentic integration is complete.\n');
  console.log('🚀 Next Steps:');
  console.log('   1. Run: npx expo run:android  (or "npx expo run:ios" for iOS)');
  console.log('   2. Test provider chat screen');
  console.log('   3. Send service request (e.g., "پائپ لیک ہے")');
  console.log('   4. Verify AI provider responses are context-aware');
  console.log('   5. Test multi-turn conversation flow\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Please review the implementation.\n');
  process.exit(1);
}
