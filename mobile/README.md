# Next Level — mobile app

React Native + Expo SDK 57, Expo Router, TypeScript. Styled with `StyleSheet` + design tokens (no UI kit, no NativeWind), per the design handoff.

```bash
npm install
npx expo start          # scan the QR code with Expo Go, or press i / a / w
npx tsc --noEmit        # typecheck
npx expo lint           # lint (needs the Microsoft Visual C++ runtime on Windows)
```

## Structure

- `src/app/` — routes (Expo Router). `(auth)/` welcome → role → sign-up → verify, plus log-in and forgot-password. `onboarding/athlete/` (4 steps) and `onboarding/recruiter/` (3 steps). `(tabs)/` home (athlete or recruiter dashboard by role), discover, messages, profile. `athlete/[id]` is the full prospect profile. `chat/[id]` is a conversation thread and `chat/new` picks a recipient. `edit-profile` is the full edit form.
- `src/features/` — `AthleteDashboard` and `RecruiterDashboard`, composed from `src/components/dashboard/` and `src/components/recruiter/`.
- `src/data/demo.ts` — **sample data** (made-up people and numbers) used by the dashboards until the backend exists.
- `src/design/tokens.ts` — colour roles (light/dark table from the handoff), brand navy, spacing, radius, shadows.
- `src/design/typography.ts` — brand fonts (Big Shoulders Display, Archivo, Martian Mono) and text variants. Select fonts by family name; never set `fontWeight` on them.
- `src/theme/ThemeProvider.tsx` — user-facing theme toggle (system / light / dark, persisted). Components read colours with `useThemeColors()`.
- `src/components/` — primitives: `Text`, `Button`, `Input`/`PasswordInput`, `IconChip`, `Chip`, `ConfirmSheet`, `OtpInput`, `StepShell`, `AuthScaffold`, `BrandBackdrop`, `TradingCard`, `Ticker`.
- `src/state/chat.tsx` — conversations, threads, unread counts and sending. Delivery, read receipts and one reply per thread are **simulated** until the messaging backend exists (`TODO(backend)`).
- `src/state/session.tsx` — session, onboarding, MaxStats games, saved prospects. **Auth calls are simulated** and logging in loads a sample athlete profile; replace with the real backend (see the `TODO(backend)` notes).

## Placeholders

- Profile share links (`nextlevel.app/<name>` in `components/profile/ShareSheet.tsx`) are placeholders until real profile URLs exist.
- Notification switches and delete account are local only (`TODO(backend)`).

## Conventions (from the handoff)

- Brand navy chrome is identical in light and dark; everything else is themed.
- ~40px circular icon chips for back and icon actions; tab-root screens use a large left-aligned title.
- No card nested inside another card; no data point shown twice in one view.
- Destructive actions confirm through `ConfirmSheet`, never the OS alert.
