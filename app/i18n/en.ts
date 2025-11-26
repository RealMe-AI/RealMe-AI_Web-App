// app/i18n/en.ts

const en = {
  navbar: {
    help: "Help & Support",
    about: "About RealMe AI",
  },

  landing: {
    hero: {
      first: "Powered by GPT-5",
      title: "Converse with AI That Understands Your Professional Needs",
      subtitle:
        "Get instant, intelligent responses with multilingual support. RealMe AI adapts to your communication style for truly professional conversations in English, Hausa, Igbo, and Yoruba.",
      offer1: "Real-time AI chat",
      offer2: "Personalized settings",
      offer3: "Voice input",
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
      email: "email",
      phone: "phone",
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
    },

    network: "Network error. Please try again.",
  },

  dashboard: {
    sidebar: {
      chat_button: "New Chat",
      footer_full: "All Rights Reserved",
      upgrade: "Upgrade",
      logout: "Log out",
    },
    search: {
      chats_placeholder: "Search chats...",
      no_results: 'No chat found with the title "{searchTerm}"',
    },
    
    no_chat: "No chats yet start one!",
    thinking: "RealMe is thinking...",
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
    new_conversation_title: "Chat {chatNumber}",
    new_conversation_started: "New conversation started...",
    transcribing: "Transcribing…",
  },

  fileupload: {
    upload_title: "Upload a file",
    button_label: "Upload",
    limit_reached: "Upgrade to Pro",
  },

  chat: {
    send_button: "Send",
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
      label: "Account Settings",
      sync: "Edit Profile",
    },
    preferences: {
      label: "Preferences",
    },
    theme: {
      label: "Theme Mode",
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
    support: {
      label: "Support & Help",
      contact: "Contact Support",
      faq: "FAQs / Help Center",
    },
    danger_zone: {
      label: "Danger Zone",
    },
    delete_account: "Delete Account",
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
};

export type Messages = typeof en;
export default en;
