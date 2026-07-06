// app/i18n/en.ts

const en = {
  navbar: {
    help: "Help & Support",
    about: "About RealMe",
  },

  landing: {
    hero: {
      first: "Powered by GPT-5",
      title: "Converse with AI That Understands Your Professional Needs",
      subtitle:
        "Get instant, intelligent responses with multilingual support. RealMe AI adapts to your communication style for truly professional conversations in English, Hausa, Igbo, and Yoruba.",
      offer1: "Real-time AI chat",
      offer2: "Real-Time Voice",
      offer3: "Multilingual Understanding",
      badge1: "AI Model",
      badge2: "Languages",
    },

    cta: {
      primary: "Experience RealMe AI",
      secondary: "View Pricing",
    },

    features: {
      title: "Why Choose",
      subtitle:
        "Experience professional AI conversations with features designed for excellence",
      items: {
        intelligence: {
          title: "GPT-5 Intelligence",
          desc: "Powered by OpenAI's latest GPT-5 model for unmatched accuracy, context understanding, and professional responses.",
        },
        languages: {
          title: "Multilingual Support",
          desc: "Converse seamlessly in English, Hausa, Igbo, and Yoruba with culturally-aware responses",
        },
        voice: {
          title: "Voice Interaction",
          desc: "Speak naturally with voice input and listen to AI responses with advanced text-to-speech technology.",
        },
        history: {
          title: "Persistent History",
          desc: "Access your complete conversation history anytime, anywhere. Never lose important insights or discussions.",
        },
        privacy: {
          title: "Secure & Private",
          desc: "Enterprise-grade security with encrypted conversations. Your data stays private and protected.",
        },
        customization: {
          title: "Customizable Experience",
          desc: "Personalize AI tone, theme, language preferences, and interface settings to match your workflow.",
        },
      },
    },

    get_started: {
      title: "Get Started in 3 Simple Steps",
      subtitle:
        "Experience professional AI conversations in minutes no technical setup required.",
      step1: {
        title: "Create Your Account",
        desc: "Sign up with your email, phone, or Google account. Takes less than 30 seconds with no credit card required.",
      },
      step2: {
        title: "Customize Your Preferences",
        desc: "Choose your language, AI tone, and interface theme. Enable voice features for hands-free conversations.",
      },
      step3: {
        title: "Start Conversing",
        desc: "Ask questions, get insights, and evolve professionally with AI that learns your communication style.",
      },
      cta: "Get Started Now",
      image: {
        title: "Start chatting in",
        desc: "Seconds",
      },
    },

    footer: {
      rights: "All rights reserved",
      contact: "Contact Us",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
  },

  auth: {
    page: {
      hero_title: "Welcome to",
      back_button: "Back",
    },
    login: {
      email_placeholder: "Email address or phone number...",
      password_placeholder: "Password...",
      full_name_placeholder: "Full name...",
    },
    button: {
      sign_in: "Sign In",
      create_account: "Create Account",
      continue_email: "Continue with Email",
      continue_google: "Continue with Google",
      redirecting: "Redirecting…",
      creating: "Creating…",
      signing_in: "Signing in…",
      success: "Success",
    },
    toggle: {
      no_account: "Don't have an account?",
      already_have_account: "Already have an account?",
      sign_in: "Sign In",
      sign_up: "Sign Up",
      show_password: "Show password",
      hide_password: "Hide password",
    },
    divider: {
      or: "OR",
    },
    identifier: {
      email: "Email",
      phone: "Phone",
      google: "Google",
    },
  },

  error: {
    generic: "An unexpected error occurred.",

    required_identifier: "Email or phone is required.",
    invalid_identifier: "Enter a valid email or E.164 phone number.",

    required_password: "Password is required.",
    short_password: "Password must be at least 6 characters.",

    required_fullname: "Full name is required.",
    invalid_fullname: "Enter a valid full name.",

    sign_in: {
      email_number: "Email or phone is required.",
      password: {
        required: "Password is required.",
      },
    },

    sign_up: {
      email_number:
        "Enter a valid email or E.164 phone number (e.g. +123456789).",
      password: {
        min_length: "Password must be at least 6 characters.",
      },
      full_name: {
        required: "Full name is required for sign up.",
        default: "Enter your full name.",
      },
      general: "Already have an account!",
    },

    network: "Network error. Please try again.",

    message: {
      failed: "Sorry, something went wrong. Please try again.",
    },
    forgot_password: {
      enter_email: "Please enter your email address",
      invalid_email: "Please enter a valid email address",
      send_failed: "Failed to send verification code. Please try again.",
    },
    voice: {
      not_supported: "Speech recognition is not supported in this browser.",
      recognition_error: "Speech recognition error: {error}",
      start_failed: "Failed to start speech recognition.",
    },
  },

  dashboard: {
    greeting: {
      fallback_name: "there",
      subtitle: "I'm RealMe, your AI assistant. How can I help you today?",
    },
    rename: "Rename",
    realMeThinking: "is thinking",
    sidebar: {
      chat_button: "New Chat",
      footer_full: "By",
      upgrade: "Upgrade",
      logout: "Log out",
      logout_confirm_title: "Log Out?",
      logout_confirm_message:
        'Are you sure you want to log out <styled>{name}</styled> ?',
    },
    search: {
      chats_placeholder: "Search chats...",
      no_results: "No chat found with the title",
      no_chat: "No chats yet start one!",
      thinking: "RealMe is thinking...",
      new_conversation_title: "Chat {chatNumber}",
      new_conversation_started: "New conversation started...",
    },

    voice_input: {
      start_recording: "Start recording",
    },
    record_voice: {
      in_process: "Recording…",
    },
    voice: {
      button: {
        start: "Start",
        stop: "Stop",
      },
    },

    transcribing: "Transcribing…",

    offline: {
      title: "You are offline",
      subtitle: "Turn on your internet connection",
    },

    delete_modal: {
      title: "Delete Conversation",
      description: "Are you sure you want to delete this conversation?",
      cancel: "Cancel",
      confirm: "Delete",
      default_message: 'This will permanently delete <styled>{title}</styled>. This action cannot be undone.',
    },
  },

  clipboard: {
    title: "Paste from clipboard?",
    yes: "Yes",
    no: "No",
  },

  fileupload: {
    upload_title: "Upload a file",
    button_label: "Upload",
    limit_reached: "Upgrade to Pro",
  },

  chat: {
    send_button: "Send",
    input: {
      placeholder: "Type a message...",
    },
    file: {
      processing: "Processing…",
    },
  },

  account_info: {
    title: "View Account Info",
    loading: "Loading account info...",
    signed_in_with: "Signed in with",
    plan: "Plan",
    full_name: "Full Name",
    email: "Email",
    account_type: "Account Type",
    date_joined: "Date Joined",
    last_login: "Last Login",
    manage_subscription: "Manage Subscription",
    avatar_alt: "Image",
  },

  settings: {
    title: "Settings",
    account: {
      label: "Account",
      sync: "Edit Profile",
      name: "Name",
      email: "Email",
      delete: "Delete",
    },
    preferences: {
      label: "Preferences",
    },
    theme: {
      label: "Appearance",
      Light: "Light",
      Dark: "Dark",
      System: "System",
    },
    language: {
      label: "Language",
      english: "English",
      hausa: "Hausa",
      igbo: "Igbo",
      yoruba: "Yoruba",
    },
    notifications: {
      label: "Email Notifications",
    },
    voice: {
      label: "Voice",
      allow: "Allow AI Voice",
      speed: "Speed",
      autoRead: "Auto-read AI responses",
    },
    security: {
      label: "Security",
      update_password: "Update your password",
      update: "Update",
    },
    support: {
      label: "Support & About",
      contact: "Help & Support",
      faq: "FAQs / Help Center",
    },
    danger_zone: {
      label: "Danger Zone",
    },
    delete_account: "Delete Account",
    delete_account_title: "Delete Account?",
    delete_account_message:
      "This will permanently delete your account and all associated data. This action cannot be undone.",
  },

  modal: {
    edit_profile: {
      title: "Edit Profile",
      name_placeholder: "Enter full name",
      error_empty_name: "Full name cannot be empty",
      save_button: "Save",
    },
    edit: {
      no_data: {
        success: "Failed to update profile",
      },
    },
    saving: "Saving...",
    avatar_cropper: {
      save_button: "Save",
    },
    uploading: "Uploading…",
    avatar_upload_failed: "Failed to upload Image.",
  },

  plans: {
    free: {
      title: "Free Plan",
      subtitle: "Perfect for getting started",
      price: "month",
      features1: "10 prompts per day",
      features2: "GPT-5 access",
      features3: "Voice input",
      features4: "4 language support",
      features5: "Chat history",
      cta: "Get Started Free",
    },
    pro: {
      title: "RealMe AI Pro",
      subtitle: "For professionals who need more",
      price_monthly: "month",
      price_yearly: "year",
      features1: "Unlimited prompts per day",
      features2: "Advanced voice features",
      features3: "Faster GPT-5 Turbo responses",
      features4: "Custom themes",
      features5: "Priority support",
      features6: "Export conversations",
      cta: "Upgrade to Pro",
      most_popular: "MOST POPULAR",
      yearly_discount: "Save 25% when you pay yearly",
    },
    billing: {
      monthly: "Monthly",
      yearly: "Yearly",
    },
    pricing_footer: {
      billing_note:
        "All plans include secure authentication, persistent chat history, and multilingual support.",
    },
  },

  message_actions: {
    copy: "Copy Message",
    read_aloud: "Read aloud",
    edit: "Edit Message",
  },

  ai: {
    response: {
      placeholder: "AI response will appear here",
      error: "Failed to get AI response",
      loading: "AI is thinking...",
    },
    prompt: {
      placeholder: "Type your message here...",
      send_button: "Send",
    },
  },

  help: {
    hero: {
      title: "Help & Support",
      subtitle:
        "Welcome to RealMe AI Support. Access guidance, troubleshooting steps, and expert assistance to ensure the best experience while using our platform.",
    },
    mobile_drawer: {
      title: "Topics",
    },
    badge: {
      currently_free: "Currently Free",
    },
    coming_soon: "Coming Soon",
    contacts: {
      email_support: {
        label: "Email Support",
        description: "Get a response within 24 hours",
        cta: "officialrealme.ai@gmail.com",
      },
      live_chat: {
        label: "Live Chat",
        description: "Real-time support from our team",
        cta: "Coming Soon",
      },
      report_bug: {
        label: "Report a Bug",
        description: "Help us improve by reporting issues",
        cta: "Report Now",
      },
      suggest_feature: {
        label: "Suggest a Feature",
        description: "Share your ideas with our team",
        cta: "Suggest",
      },
    },
    faq: {
      categories: {
        getting_started: {
          title: "Getting Started",
        },
        voice: {
          title: "Voice Features",
        },
        languages: {
          title: "Languages",
        },
        privacy: {
          title: "Privacy & Security",
        },
        account: {
          title: "Account",
        },
        troubleshooting: {
          title: "Troubleshooting",
        },
        contact: {
          title: "Contact Support",
        },
      },
      items: {
        gs_1: {
          question: "How do I create an account?",
          answer:
            "You can create an account using your email, phone number, or Google account. Simply click the 'Get Started' button on the homepage and follow the registration process.",
        },
        gs_2: {
          question: "Can I change my password?",
          answer:
            "Yes. Go to Settings \u2192 Security to update your password. You'll need your current password to create a new one.",
        },
        gs_3: {
          question: "Is RealMe AI free to use?",
          answer:
            "RealMe AI is completely free right now. Premium features faster responses, higher message limits, and advanced AI models are coming soon. Stay tuned!",
        },
        gs_4: {
          question: "Can I use RealMe AI on multiple devices?",
          answer:
            "Yes. Your account syncs across all devices. Simply log in on any device to access your conversations and settings.",
        },
        vo_1: {
          question: "How do I use voice chat?",
          answer:
            "Tap the microphone icon in the chat interface to speak naturally with RealMe AI. Your speech will be transcribed and responded to in real time.",
        },
        vo_2: {
          question: "Can RealMe AI read responses aloud?",
          answer:
            "Yes. Tap the speaker icon on any AI response to have it read aloud. You can also enable auto-read in Voice Settings for a hands free experience.",
        },
        vo_3: {
          question: "Which languages are supported for voice?",
          answer:
            "Voice input and output currently support English, Hausa, Igbo, and Yoruba. More languages are being added regularly.",
        },
        vo_4: {
          question: "Can I adjust the voice speed?",
          answer:
            "Yes. Visit Settings \u2192 Voice Settings to adjust the speech speed using the speed slider. You can preview changes in real time.",
        },
        ln_1: {
          question: "Which languages are supported?",
          answer:
            "RealMe AI supports English, Hausa, Igbo, Yoruba, and many international languages. We are continuously expanding our language offerings.",
        },
        ln_2: {
          question: "How do I switch languages?",
          answer:
            "Use the language selector in the sidebar or navigate to Settings to choose your preferred language. The interface will update instantly.",
        },
        ln_3: {
          question: "Does RealMe AI translate between languages?",
          answer:
            "Yes. RealMe AI can understand and respond across multiple languages, making it easy to communicate in your preferred language regardless of the input.",
        },
        pr_1: {
          question: "How is my data protected?",
          answer:
            "Your conversations are encrypted in transit and at rest. We follow industry-standard security practices to ensure your data remains private and secure.",
        },
        pr_2: {
          question: "Are my conversations private?",
          answer:
            "Yes. Your conversations are stored securely and are only accessible to you. We do not share your chat data with third parties.",
        },
        pr_3: {
          question: "Can I delete my chat history?",
          answer:
            "Yes. You can delete individual conversations or clear your entire chat history from the settings menu at any time.",
        },
        pr_4: {
          question: "How do I delete my account?",
          answer:
            "Go to Settings \u2192 Danger Zone to permanently delete your account and all associated data. This action cannot be undone.",
        },
        ac_1: {
          question: "How do I update my profile?",
          answer:
            "Click on your avatar or go to Account Info from the sidebar to update your name, email, and profile picture.",
        },
        ac_2: {
          question: "Can I change my email address?",
          answer:
            "Yes. Visit Account to update your email address. You will need to verify the new email before the change takes effect.",
        },
        ac_3: {
          question: "How do I reset my password?",
          answer:
            "On the login page, click 'Forgot Password' and follow the instructions sent to your email. You can also reset it from Settings \u2192 Security while logged in.",
        },
        tr_1: {
          question: "I can't log in",
          answer:
            "Ensure you are using the correct email and password. Try resetting your password or clearing your browser cache. If the issue persists, contact support.",
        },
        tr_2: {
          question: "Voice isn't working",
          answer:
            "Check that your browser has microphone permissions enabled. Ensure voice features are enabled in Settings \u2192 Voice Settings. Try using a supported browser like Chrome or Firefox.",
        },
        tr_3: {
          question: "The AI isn't responding",
          answer:
            "Refresh the page and check your internet connection. If the problem continues, try starting a new conversation or clearing your chat history.",
        },
        tr_4: {
          question: "My messages disappeared",
          answer:
            "Conversations are stored securely and should persist across sessions. Try refreshing the page. If messages are still missing, check if you are logged into the correct account.",
        },
        tr_6: {
          question: "Email verification isn't arriving",
          answer:
            "Check your spam or junk folder. Ensure you entered the correct email address. You can request a new verification email from your account settings.",
        },
        ct_1: {
          question: "How do I contact the support team?",
          answer:
            "You can reach us via email at support@realmeai.com. Our team typically responds within 24 hours during business days (Monday to Saturday).",
        },
        ct_2: {
          question: "Is live chat available?",
          answer:
            "Live chat is coming soon! We are working on implementing real-time chat support for faster assistance.",
        },
        ct_3: {
          question: "How do I report a bug?",
          answer:
            "Send a detailed description of the bug along with screenshots to support@realmeai.com. Include your device type and browser version to help us resolve it faster.",
        },
        ct_4: {
          question: "Can I suggest a feature?",
          answer:
            "Absolutely! We love hearing from our users. Send your feature suggestions to support@realmeai.com and our team will review them.",
        },
      },
    },
  },

  report_form: {
    title_report_bug: "Report an Issue",
    title_suggest_feature: "Suggest a Feature",
    subtitle_report_bug: "Found something broken? Tell us what happened and we'll fix it.",
    subtitle_suggest_feature: "Have an idea that would make RealMe AI better? We'd love to hear it.",
    name_placeholder: "Your Name",
    email_placeholder: "Your Email",
    subject_placeholder: "Subject",
    message_placeholder: "Your Message",
    send_button: "Send Message",
    status: {
      success_title: "Message Sent Successfully!",
      success_message: "Thank you! We'll get back to you soon.",
      error_title: "Failed to Send Message",
      error_message: "Please try again later.",
    },
  },

  shared: {
    not_found_title: "Conversation not found",
    error_title: "Something went wrong",
    retry: "Try again",
    shared_by: "Shared by",
    powered_by: "Powered by RealMe AI",
  },
};

export type Messages = typeof en;
export default en;
