export function getStructuredData(SITE_URL: string) {
  const founder = {
    "@type": "Person",
    name: "Agunwa Chidiebele Calistus",
    jobTitle: "Founder",
    image: `${SITE_URL}/agunwa.jpeg`,
    worksFor: { "@type": "Organization", name: "RealMe AI", url: SITE_URL },
  };
  const coFounder = {
    "@type": "Person",
    name: "Ezechukwu Chukwudubem Daniel",
    jobTitle: "Co-Founder",
    image: `${SITE_URL}/daniel.jpeg`,
    worksFor: { "@type": "Organization", name: "RealMe AI", url: SITE_URL },
  };
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "RealMe AI",
      url: SITE_URL,
      description: "RealMe AI — Conversational AI for personal and professional growth.",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "RealMe AI",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}/agunwa.jpeg`,
      founder: [founder, coFounder],
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "RealMe AI",
      operatingSystem: "any",
      applicationCategory: "BusinessApplication",
      url: SITE_URL,
      description: "AI assistant for learning, conversation and productivity.",
      author: founder,
      publisher: {
        "@type": "Organization",
        name: "RealMe AI",
        url: SITE_URL,
      },
      potentialAction: {
        "@type": "UseAction",
        target: SITE_URL,
      },
    },
    founder,
    coFounder,
    {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      name: "RealMe AI multilingual assistant interface",
      caption:
        "RealMe AI multilingual assistant interface in English, Hausa, Igbo and Yoruba",
      contentUrl: `${SITE_URL}/realme-ai-assistant.webp`,
    },
    {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      name: "RealMe AI chatbot supporting English, Hausa, Igbo and Yoruba",
      caption: "RealMe AI chatbot supporting English, Hausa, Igbo and Yoruba",
      contentUrl: `${SITE_URL}/realme-ai-chatbot.webp`,
    },
    {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      name: "RealMe AI multilingual assistant mission banner",
      caption: "RealMe AI multilingual assistant mission banner",
      contentUrl: `${SITE_URL}/realme-banner.webp`,
    },
    {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      name: "RealMe AI multilingual assistant mission banner mobile",
      caption: "RealMe AI multilingual assistant mission banner mobile",
      contentUrl: `${SITE_URL}/Realme-mobile-banner.jpeg`,
    },
    {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      name: "RealMe AI logo",
      caption: "RealMe AI logo",
      contentUrl: `${SITE_URL}/logo.png`,
    },
  ];
}
