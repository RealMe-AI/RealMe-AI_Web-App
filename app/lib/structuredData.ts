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
      logo: `${SITE_URL}/logo2.jpeg`,
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
  ];
}
