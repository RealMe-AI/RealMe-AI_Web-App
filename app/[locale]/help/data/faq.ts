export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  icon: string;
  items: FaqItem[];
}

export const faqCategories: FaqCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "getting-started",
    items: [
      {
        id: "gs-1",
        question: "How do I create an account?",
        answer:
          "You can create an account using your email, phone number, or Google account. Simply click the 'Get Started' button on the homepage and follow the registration process.",
      },
      {
        id: "gs-2",
        question: "Can I change my password?",
        answer:
          "Yes. Go to Settings → Security to update your password. You'll need your current password to create a new one.",
      },
      {
        id: "gs-3",
        question: "Is RealMe AI free to use?",
        answer:
          "RealMe AI is completely free right now. Premium features — faster responses, higher message limits, and advanced AI models — are coming soon. Stay tuned!",
      },
      {
        id: "gs-4",
        question: "Can I use RealMe AI on multiple devices?",
        answer:
          "Yes. Your account syncs across all devices. Simply log in on any device to access your conversations and settings.",
      },
    ],
  },
  {
    id: "voice",
    title: "Voice Features",
    icon: "voice",
    items: [
      {
        id: "vo-1",
        question: "How do I use voice chat?",
        answer:
          "Tap the microphone icon in the chat interface to speak naturally with RealMe AI. Your speech will be transcribed and responded to in real time.",
      },
      {
        id: "vo-2",
        question: "Can RealMe AI read responses aloud?",
        answer:
          "Yes. Tap the speaker icon on any AI response to have it read aloud. You can also enable auto-read in Voice Settings for a hands-free experience.",
      },
      {
        id: "vo-3",
        question: "Which languages are supported for voice?",
        answer:
          "Voice input and output currently support English, Hausa, Igbo, and Yoruba. More languages are being added regularly.",
      },
      {
        id: "vo-4",
        question: "Can I adjust the voice speed?",
        answer:
          "Yes. Visit Settings → Voice Settings to adjust the speech speed using the speed slider. You can preview changes in real time.",
      },
    ],
  },
  {
    id: "languages",
    title: "Languages",
    icon: "languages",
    items: [
      {
        id: "ln-1",
        question: "Which languages are supported?",
        answer:
          "RealMe AI supports English, Hausa, Igbo, Yoruba, and many international languages. We are continuously expanding our language offerings.",
      },
      {
        id: "ln-2",
        question: "How do I switch languages?",
        answer:
          "Use the language selector in the sidebar or navigate to Settings to choose your preferred language. The interface will update instantly.",
      },
      {
        id: "ln-3",
        question: "Does RealMe AI translate between languages?",
        answer:
          "Yes. RealMe AI can understand and respond across multiple languages, making it easy to communicate in your preferred language regardless of the input.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    icon: "privacy",
    items: [
      {
        id: "pr-1",
        question: "How is my data protected?",
        answer:
          "Your conversations are encrypted in transit and at rest. We follow industry-standard security practices to ensure your data remains private and secure.",
      },
      {
        id: "pr-2",
        question: "Are my conversations private?",
        answer:
          "Yes. Your conversations are stored securely and are only accessible to you. We do not share your chat data with third parties.",
      },
      {
        id: "pr-3",
        question: "Can I delete my chat history?",
        answer:
          "Yes. You can delete individual conversations or clear your entire chat history from the settings menu at any time.",
      },
      {
        id: "pr-4",
        question: "How do I delete my account?",
        answer:
          "Go to Settings → Danger Zone to permanently delete your account and all associated data. This action cannot be undone.",
      },
    ],
  },
  {
    id: "account",
    title: "Account Settings",
    icon: "account",
    items: [
      {
        id: "ac-1",
        question: "How do I update my profile?",
        answer:
          "Click on your avatar or go to Account Info from the sidebar to update your name, email, and profile picture.",
      },
      {
        id: "ac-2",
        question: "Can I change my email address?",
        answer:
          "Yes. Visit Account Settings to update your email address. You will need to verify the new email before the change takes effect.",
      },
      {
        id: "ac-3",
        question: "How do I reset my password?",
        answer:
          "On the login page, click 'Forgot Password' and follow the instructions sent to your email. You can also reset it from Settings → Security while logged in.",
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: "troubleshooting",
    items: [
      {
        id: "tr-1",
        question: "I can't log in",
        answer:
          "Ensure you are using the correct email and password. Try resetting your password or clearing your browser cache. If the issue persists, contact support.",
      },
      {
        id: "tr-2",
        question: "Voice isn't working",
        answer:
          "Check that your browser has microphone permissions enabled. Ensure voice features are enabled in Settings → Voice Settings. Try using a supported browser like Chrome or Firefox.",
      },
      {
        id: "tr-3",
        question: "The AI isn't responding",
        answer:
          "Refresh the page and check your internet connection. If the problem continues, try starting a new conversation or clearing your chat history.",
      },
      {
        id: "tr-4",
        question: "My messages disappeared",
        answer:
          "Conversations are stored securely and should persist across sessions. Try refreshing the page. If messages are still missing, check if you are logged into the correct account.",
      },
      // {
      //   id: "tr-5",
      //   question: "Payment failed",
      //   answer:
      //     "Verify your payment details and ensure your card has sufficient funds. Try a different payment method or contact your bank. Contact our support team for further assistance.",
      // },
      {
        id: "tr-6",
        question: "Email verification isn't arriving",
        answer:
          "Check your spam or junk folder. Ensure you entered the correct email address. You can request a new verification email from your account settings.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact Support",
    icon: "contact",
    items: [
      {
        id: "ct-1",
        question: "How do I contact the support team?",
        answer:
          "You can reach us via email at support@realmeai.com. Our team typically responds within 24 hours during business days (Monday to Saturday).",
      },
      {
        id: "ct-2",
        question: "Is live chat available?",
        answer:
          "Live chat is coming soon! We are working on implementing real-time chat support for faster assistance.",
      },
      {
        id: "ct-3",
        question: "How do I report a bug?",
        answer:
          "Send a detailed description of the bug along with screenshots to support@realmeai.com. Include your device type and browser version to help us resolve it faster.",
      },
      {
        id: "ct-4",
        question: "Can I suggest a feature?",
        answer:
          "Absolutely! We love hearing from our users. Send your feature suggestions to support@realmeai.com and our team will review them.",
      },
    ],
  },
];
