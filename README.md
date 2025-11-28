This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
realme-ai
├─ app
│  ├─ api
│  │  ├─ auth
│  │  │  └─ route.ts
│  │  └─ chat
│  │     └─ route.ts
│  ├─ data
│  │  ├─ featuresData.ts
│  │  ├─ heroData.ts
│  │  ├─ NavData.ts
│  │  └─ planData.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ hooks
│  │  ├─ useActiveSection.ts
│  │  ├─ useBackdrop.ts
│  │  ├─ useNavigateToAuth.ts
│  │  ├─ useSettings.ts
│  │  ├─ useThemeToggle.ts
│  │  ├─ useTranslate.ts
│  │  └─ useVoiceInput.ts
│  ├─ i18n
│  │  ├─ en.ts
│  │  ├─ ha.ts
│  │  ├─ ig.ts
│  │  └─ yo.ts
│  ├─ lib
│  │  └─ utils.ts
│  ├─ slash-screen
│  │  └─ SplashScreen.tsx
│  ├─ theme-provider
│  │  └─ theme-provider.tsx
│  ├─ transcribe
│  │  └─ route.ts
│  ├─ types
│  │  └─ type.ts
│  ├─ utils
│  │  └─ cropUtils.ts
│  ├─ zustand
│  │  ├─ modalStore.ts
│  │  ├─ sendFileMessage.ts
│  │  ├─ useAboutStore.ts
│  │  ├─ useChatStore.ts
│  │  ├─ useLanguageStore.ts
│  │  ├─ useSidebarStore.ts
│  │  ├─ useThemeStore.ts
│  │  └─ useUserStore.ts
│  └─ [locale]
│     ├─ about
│     │  └─ page.tsx
│     ├─ account
│     │  ├─ AccountInfoModal.tsx
│     │  ├─ AvatarCropper.tsx
│     │  └─ AvatarEditor.tsx
│     ├─ auth
│     │  └─ page.tsx
│     ├─ components
│     │  ├─ auth
│     │  │  ├─ AuthForm.tsx
│     │  │  └─ Tabs.tsx
│     │  ├─ Badge.tsx
│     │  ├─ CTAButtons.tsx
│     │  ├─ Features.tsx
│     │  ├─ Footer.tsx
│     │  ├─ GetStartedSection.tsx
│     │  ├─ Hero.tsx
│     │  └─ Navbar
│     │     ├─ DesktopNav.tsx
│     │     ├─ MobileNav.tsx
│     │     └─ Navbar.tsx
│     ├─ dashboard
│     │  ├─ components
│     │  │  ├─ ChatMessage.tsx
│     │  │  ├─ ChatWindow.tsx
│     │  │  ├─ FileUploadPopup.tsx
│     │  │  ├─ MessageActions.tsx
│     │  │  ├─ ProfileFooter.tsx
│     │  │  ├─ Sidebar.tsx
│     │  │  └─ VoiceInput.tsx
│     │  └─ page.tsx
│     ├─ HomeClient.tsx
│     ├─ layout.tsx
│     ├─ page.tsx
│     ├─ pricingplans
│     │  └─ page.tsx
│     └─ setting
│        ├─ CustomSelect.tsx
│        ├─ EditProfileModal.tsx
│        ├─ EmailToggle.tsx
│        ├─ LanguageSelect.tsx
│        ├─ SettingsPanel.tsx
│        └─ ThemeSelect.tsx
├─ eslint.config.mjs
├─ i18n
│  ├─ request.ts
│  └─ routing.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ proxy.ts
├─ public
│  └─ avatar.png
├─ README.md
├─ structure.txt
└─ tsconfig.json

```