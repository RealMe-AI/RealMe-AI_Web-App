// app/i18n/ig.ts

const ig = {
  navbar: {
    help: "Enyemaka & Nkwado",
    about: "Banyere RealMe AI",
  },

  landing: {
    hero: {
      first: "Dị ike site na GPT-5",
      title: "Kparịta ụka na AI nke na-aghọta mkpa ọrụ gị",
      subtitle:
        "Nweta azịza n’ụzọ ozugbo na amamihe yana nkwado ọtụtụ asụsụ. RealMe AI na-eme ka ụkpụrụ nkwurịta okwu gị nwee nhata maka mkparịta ụka nke ọkachamara n’English, Hausa, Igbo, na Yoruba.",
      offer1: "Mkparịta ụka AI ozugbo",
      offer2: "Nhazi ahaziri iche",
      offer3: "Ntinye olu",
      badge1: "Ụdị AI",
      badge2: "Asụsụ",
    },

    cta: {
      primary: "Nwee ahụmịhe RealMe AI",
      secondary: "Lee Ọnụahịa",
    },

    features: {
      title: "Ihe Mere Ị Ga-eji Họrọ",
      subtitle:
        "Nwee mkparịta ụka AI nke ọkachamara na atụmatụ e mere maka ịdị mma",
      items: {
        intelligence: {
          title: "Amamihe GPT-5",
          desc: "Dị ike site na ụdị GPT-5 ọhụrụ nke OpenAI maka izi ezi kachasị elu, nghọta nke ọnọdụ, na azịza ọkachamara.",
        },
        languages: {
          title: "Nkwado ọtụtụ asụsụ",
          desc: "Kparịta ụka nke ọma n’English, Hausa, Igbo, na Yoruba na azịza kwesịrị ekwesị maka omenala.",
        },
        voice: {
          title: "Nkwurịta okwu olu",
          desc: "Kwuo n’ụdị okike site na ntinye olu ma gee azịza AI na teknụzụ ederede-na-olu dị elu.",
        },
        history: {
          title: "Akụkọ Mkparịta ụka Na-adịgide adịgide",
          desc: "Nweta akụkọ mkparịta ụka gị niile mgbe ọ bụla, ebe ọ bụla. Echela data dị mkpa ma ọ bụ mkparịta ụka efu.",
        },
        privacy: {
          title: "Nche & Nzuzo",
          desc: "Nche nke ụlọ ọrụ nwere mkparịta ụka echekwara. Data gị nọ na nzuzo ma chekwaa ya.",
        },
        customization: {
          title: "Ahụmịhe Ahaziri",
          desc: "Hazi ụda AI, isiokwu, asụsụ, na ntọala interface iji kwekọọ na usoro ọrụ gị.",
        },
      },
    },

    get_started: {
      title: "Malite na Nzọụkwụ 3 Dị mfe",
      subtitle:
        "Nwee mkparịta ụka AI nke ọkachamara n'ime nkeji ole na ole, enweghị nhazi teknụzụ dị mkpa.",
      step1: {
        title: "Mepụta Akaụntụ Gị",
        desc: "Debanye aha na email gị, ekwentị, ma ọ bụ akaụntụ Google. Ọ na-ewe obere karịa sekọnd 30, enweghị kaadị kredit achọrọ.",
      },
      step2: {
        title: "Hazie Nhọrọ Gị",
        desc: "Họrọ asụsụ gị, ụda AI, na isiokwu interface. Gbanye atụmatụ olu maka mkparịta ụka na-enweghị aka.",
      },
      step3: {
        title: "Malite Kparịta ụka",
        desc: "Jụọ ajụjụ, nweta nghọta, ma nwee mmụta ọrụ nke ọma na AI nke na-amụta ụkpụrụ nkwurịta okwu gị.",
      },
      cta: "Malite Ugbu a",
      image: {
        title: "Malite ikwu okwu na",
        desc: "Sekọnd",
      },
    },

    footer: {
      rights: "All rights reserved",
      contact: "Kpọtụrụ Anyị",
      privacy: "Atụmatụ Nzuzo",
      terms: "Okwu Ọrụ",
    },
  },

  auth: {
    page: {
      hero_title: "Nabata na",
      back_button: "Laghachi",
    },
    login: {
      email_placeholder: "Adreesị email ma ọ bụ nọmba ekwentị...",
      password_placeholder: "Okwuntughe...",
      full_name_placeholder: "Aha zuru ezu...",
    },
    button: {
      sign_in: "Banye",
      create_account: "Mepụta Akaụntụ",
      continue_email: "Gaa n’ihu na Email",
      continue_google: "Gaa n’ihu na Google",
      creating: "Na-emepụta…",
      signing_in: "Na-abanye…",
      success: "Mmeri",
    },
    toggle: {
      no_account: "Enweghị akaụntụ?",
      already_have_account: "Ị nwere akaụntụ?",
      sign_in: "Banye",
      sign_up: "Debanye",
      show_password: "Gosi okwuntughe",
      hide_password: "Zoo okwuntughe",
    },
    divider: {
      or: "MA Ọ BỤ",
    },
    identifier: {
      email: "Email",
      phone: "Ekwentị",
      google: "Google"
    },
  },

  error: {
    generic: "Enweghi mmejọ a tụrụ anya ya.",

    required_identifier: "Email ma ọ bụ ekwentị chọrọ.",
    invalid_identifier: "Tinye email ziri ezi ma ọ bụ nọmba ekwentị E.164.",

    required_password: "Okwuntughe chọrọ.",
    short_password: "Okwuntughe ga-adịkarịkarịa mkpụrụedemede 6.",

    required_fullname: "Aha zuru ezu chọrọ.",
    invalid_fullname: "Tinye aha zuru ezu ziri ezi.",

    sign_in: {
      email_number: "Email ma ọ bụ ekwentị chọrọ.",
      password: {
        required: "Okwuntughe chọrọ.",
      },
    },

    sign_up: {
      email_number:
        "Tinye email ziri ezi ma ọ bụ nọmba ekwentị E.164 (dịka +123456789).",
      password: {
        min_length: "Okwuntughe ga-adịkarịkarịa mkpụrụedemede 6.",
      },
      full_name: {
        required: "Aha zuru ezu chọrọ maka ndebanye.",
        default: "Tinye aha zuru ezu gị.",
      },
      general: "Ị nwere akaụntụ already!",
    },

    network: "Njehie netwọk. Biko nwaa ọzọ.",
  },

  dashboard: {
    realMeThinking: "ọ na-eche",
    sidebar: {
      chat_button: "Mkparịta ụka Ọhụrụ",
      footer_full: "Site na",
      upgrade: "Melite",
      logout: "Pụọ",
    },
    search: {
      chats_placeholder: "Chọgharịa mkparịta ụka...",
      no_results: "Enweghị mkparịta ụka nke aha ya bụ ",
      no_chat: "Enweghị mkparịta ụka ka malite otu!",
      thinking: "RealMe na-eche echiche...",
      new_conversation_title: "Mkparịta ụka {chatNumber}",
      new_conversation_started: "Malitere mkparịta ụka ọhụrụ...",
    },

    voice_input: {
      start_recording: "Malite idekọ",
    },
    record_voice: {
      in_process: "Na-edekọ…",
    },
    voice: {
      button: {
        start: "Malite",
        stop: "Kwụsị",
      },
    },
    transcribing: "Na-ede ihe e kwuru…",
  },

  fileupload: {
    upload_title: "Bulite faịlụ",
    button_label: "Bulite",
    limit_reached: "Melite gaa Pro",
  },

  chat: {
    send_button: "Zipu",
  },

  account_info: {
    title: "Lee Ozi Akaụntụ",
    loading: "Na-ebunye ozi akaụntụ...",
    signed_in_with: "Banyere nbanye na",
    plan: "Atụmatụ",
    full_name: "Aha Zuru Ezu",
    email: "Email",
    account_type: "Ụdị Akaụntụ",
    date_joined: "Ụbọchị sonyere",
    last_login: "Mbanye ikpeazụ",
    manage_subscription: "Jikwaa Ndebanye",
    avatar_alt: "Foto",
  },

  settings: {
    title: "Ntọala",
    account: {
      label: "Ntọala Akaụntụ",
      sync: "Hazie profaịlụ",
    },
    preferences: {
      label: "Nhọrọ",
    },
    theme: {
      label: "Ụdị isiokwu",
      Light: "Ọma",
      Dark: "Ojii",
      System: "Sistemụ",
    },
    language: {
      label: "Asụsụ",
      english: "English",
      hausa: "Hausa",
      igbo: "Igbo",
      yoruba: "Yoruba",
    },
    notifications: {
      label: "Mgbasa ozi Email",
    },
    voice: {
      label: "Olu",
      allow: "Kwe ka Olu AI",
      speed: "Ọsọ",
      autoRead: "Gụọ akpaaka nzaghachi AI",
    },
    support: {
      label: "Nkwado & Enyemaka",
      contact: "Kpọtụrụ Nkwado",
      faq: "Ajụjụ na Azịza / Ọdịmụ Enyemaka",
    },
    danger_zone: {
      label: "Ebe ize ndụ",
    },
    delete_account: "Hichapụ Akaụntụ",
  },

  modal: {
    edit_profile: {
      title: "Hazie Profaịlụ",
      name_placeholder: "Tinye aha zuru ezu",
      error_empty_name: "Aha zuru ezu agaghị adị efu",
      save_button: "Chekwaa",
    },
    edit: {
      no_data: {
        success: "E mebiela imezi profaịlụ",
      },
    },
    saving: "Na-echekwa...",
    avatar_cropper: {
      save_button: "Chekwaa",
    },
    uploading: "Na-ebunye…",
    avatar_upload_failed: "Enweghị ike bulite Foto.",
  },

  plans: {
    free: {
      title: "Atụmatụ Efụ",
      subtitle: "Dabara adaba maka mmalite",
      price: "ọnwa",
      features1: "Ajụjụ 10 kwa ụbọchị",
      features2: "Nweta GPT-5",
      features3: "Ntinye olu",
      features4: "Nkwado asụsụ 4",
      features5: "Akụkọ mkparịta ụka",
      cta: "Malite N’efu",
    },
    pro: {
      title: "RealMe AI Pro",
      subtitle: "Maka ọkachamara chọrọ ihe ndị ọzọ",
      price_monthly: "ọnwa",
      price_yearly: "afọ",
      features1: "Ajụjụ na-enweghị njedebe kwa ụbọchị",
      features2: "Atụmatụ olu dị elu",
      features3: "Azịza GPT-5 Turbo ngwa ngwa",
      features4: "Isiokwu ahaziri iche",
      features5: "Nkwado nke mbu",
      features6: "Mbupụ mkparịta ụka",
      cta: "Melite gaa Pro",
      most_popular: "NA-EJU ANYA KARỊ",
      yearly_discount: "Zọpụta 25% mgbe ị na-akwụ kwa afọ",
    },
    billing: {
      monthly: "Kwa ọnwa",
      yearly: "Kwa afọ",
    },
    pricing_footer: {
      billing_note:
        "Atụmatụ niile gụnyere nbanye echekwara, akụkọ mkparịta ụka na-adịgide adịgide, na nkwado ọtụtụ asụsụ.",
    },
  },

  ai: {
    response: {
      placeholder: "Azịza AI ga-apụta ebe a",
      error: "Enweghị ike ịnweta azịza AI",
      loading: "AI na-eche echiche...",
    },
    prompt: {
      placeholder: "Tinye ozi gị ebe a...",
      send_button: "Zipu",
    },
  },
};

export type Messages = typeof ig;
export default ig;
