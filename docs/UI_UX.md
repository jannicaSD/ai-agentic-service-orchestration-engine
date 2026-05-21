# UI / UX

This page documents the current interface improvements that made the app usable on small phones and safer around the keyboard.

## 1) Responsive design approach

- `SafeAreaView` is used to protect top and bottom content from system insets
- Responsive spacing and scale helpers are available in `src/utils/responsive.ts`
- Provider cards and chips use flexible width and text truncation to avoid overflow on small screens
- Tap targets are kept at or above 44px where possible

## 2) Keyboard-safe chat input

- `KeyboardAvoidingView` keeps the composer visible while the keyboard is open
- The message list uses `FlatList` so it can scroll cleanly to the latest item
- The bottom composer stays pinned above the safe area
- The typed text stays visible inside a multiline input with its own max height

## 3) Category filter chip bar

Current categories:

- All
- Plumber
- Electrician
- AC Technician
- Mechanic
- Tutor
- Cleaner
- Beautician
- Painter/Handyman

Behavior:

- The active chip is highlighted visually
- Each chip shows a provider count, for example `Plumber (12)`
- Selecting a chip filters provider recommendations immediately
- The selected category is sent to AntiGravity as `preferredCategory` and `uiFilters.category`
- AntiGravity can override the preference if the text strongly indicates another category, and that rationale is logged in trace metadata

## 4) Accessibility

- Buttons are sized for comfortable tapping
- Contrast stays high on the neon glass theme
- Key statuses and counts are text-based, not color-only
- The chat input and chip bar are placed in a predictable bottom layout

## 5) Screenshots placeholder section

For submission, add screenshots of:

- Assistant chat on a small phone
- Keyboard open with input still visible
- Category bar showing an active filter
- TraceLogs screen with a live trace sequence
- A provider card list filtered to a category

## Implementation references

- [src/screens/AssistantChatScreen.tsx](../src/screens/AssistantChatScreen.tsx)
- [src/components/chat/ChatInputBar.tsx](../src/components/chat/ChatInputBar.tsx)
- [src/components/ui/CategoryChipBar.tsx](../src/components/ui/CategoryChipBar.tsx)
- [src/utils/responsive.ts](../src/utils/responsive.ts)