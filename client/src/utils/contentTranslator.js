// utils/contentTranslator.js
// Utility to translate dynamic listing content

export const translateContent = (content, t, type = 'text') => {
  if (!content || !t) return content;

  switch (type) {
    case 'description':
      return translateDescription(content, t);
    case 'title':
      return translateTitle(content, t);
    case 'amenity':
      return translateAmenity(content, t);
    default:
      return content;
  }
};

const translateDescription = (description, t) => {
  // Common patterns for translating descriptions
  const patterns = {
    'Discover the perfect blend of comfort and style': 'content.descriptions.luxury_hotel',
    'Experience authentic Indian hospitality': 'content.descriptions.heritage_property',
    'Welcome to a sanctuary of peace and luxury': 'content.descriptions.boutique_hotel',
    'Immerse yourself in the royal heritage': 'content.descriptions.royal_heritage',
    'Experience modern comfort meets traditional charm': 'content.descriptions.modern_comfort',
    'Step into a world of elegance and sophistication': 'content.descriptions.elegant_stay',
    'Welcome to our oasis of tranquility': 'content.descriptions.tranquil_oasis'
  };

  // Try to find matching pattern
  for (const [pattern, key] of Object.entries(patterns)) {
    if (description.includes(pattern)) {
      return t(key, { defaultValue: description });
    }
  }

  // Translate common phrases within descriptions
  let translatedDesc = description;
  
  // Common English-to-translation mappings
  const phraseReplacements = {
    'About this place': t('content.aboutThisPlace', { defaultValue: 'About this place' }),
    'state-of-the-art facilities': t('content.phrases.stateOfTheArt', { defaultValue: 'state-of-the-art facilities' }),
    'gourmet dining options': t('content.phrases.gourmetDining', { defaultValue: 'gourmet dining options' }),
    'business and leisure travelers': t('content.phrases.businessLeisure', { defaultValue: 'business and leisure travelers' }),
    'major attractions': t('content.phrases.majorAttractions', { defaultValue: 'major attractions' }),
    'contemporary hotel': t('content.phrases.contemporaryHotel', { defaultValue: 'contemporary hotel' })
  };

  // Apply phrase replacements
  Object.entries(phraseReplacements).forEach(([english, translation]) => {
    translatedDesc = translatedDesc.replace(new RegExp(english, 'gi'), translation);
  });

  return translatedDesc;
};

const translateTitle = (title, t) => {
  // Extract property type suffixes and translate them
  const propertyTypes = [
    'Hotel', 'Resort', 'Palace', 'Inn', 'Lodge', 'Suites', 'Residency', 
    'Manor', 'Villa', 'Retreat', 'Grand', 'Royale', 'Continental', 
    'International', 'Plaza', 'Tower', 'Heights', 'Park', 'Garden', 
    'Heritage', 'Luxury', 'Premium', 'Elite', 'Crown', 'Imperial', 
    'Regency', 'Mahal', 'Haveli'
  ];

  let translatedTitle = title;

  propertyTypes.forEach(type => {
    const regex = new RegExp(`\\b${type}\\b`, 'gi');
    if (regex.test(title)) {
      const translatedType = t(`content.propertyTitles.${type.toLowerCase()}`, { defaultValue: type });
      translatedTitle = translatedTitle.replace(regex, translatedType);
    }
  });

  return translatedTitle;
};

const translateAmenity = (amenity, t) => {
  // This is already handled in the component with t(`amenities.${amenity}`)
  return t(`amenities.${amenity}`, { defaultValue: amenity });
};

// Function to check if content needs translation
export const needsTranslation = (content, currentLanguage) => {
  // If current language is English, no translation needed
  if (currentLanguage === 'en') return false;
  
  // If content contains English words/patterns, it likely needs translation
  const englishPatterns = [
    /\bHotel\b/, /\bResort\b/, /\bPalace\b/, /\bDiscover\b/, /\bExperience\b/,
    /\bWelcome\b/, /\bStep into\b/, /\bImmerse yourself\b/, /\bAbout this place\b/
  ];
  
  return englishPatterns.some(pattern => pattern.test(content));
};