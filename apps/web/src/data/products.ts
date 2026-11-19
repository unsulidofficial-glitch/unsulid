export interface ProductGalleryItem {
  src: string;
  alt: string;
  label: string;
}

export interface ProductStoryPillar {
  title: string;
  desc: string;
}

export interface ProductDetailData {
  id: string;
  slug: 'high-class' | 'black';
  name: string;
  brand: string;
  category: string;
  tagline: string;
  headline: string;
  description: string;
  brandPositioning: string;
  badge: string;
  occasions: string[];
  targetAudience: string[];
  personality: string[];
  bottleDetails: string;
  availableSizes: string[];
  price?: number;
  originalPrice?: number;
  pricePlaceholder: string;
  stockStatus: string;
  isAvailable: boolean;
  palette: {
    primary: string;
    accent: string;
    badgeBg: string;
    badgeText: string;
    themeMode: 'burgundy' | 'dark';
  };
  gallery: ProductGalleryItem[];
  counterpart: {
    slug: string;
    name: string;
    relation: string;
    category: string;
    description: string;
    image: string;
  };
  story: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    pillars: ProductStoryPillar[];
    quote: string;
  };
  presentation: {
    flaconSpecs: string;
    atomiserSpecs: string;
    packagingSpecs: string;
    batchNote: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const productsData: Record<'high-class' | 'black', ProductDetailData> = {
  'high-class': {
    id: 'prod_high_class',
    slug: 'high-class',
    name: 'HIGH CLASS',
    brand: 'UNSULID',
    category: 'Everyday Fragrance',
    tagline: 'Everyday Fragrance • Daily Wear',
    headline: 'Make Every Day Your Signature.',
    description:
      'Meet HIGH CLASS, an everyday fragrance expression created for moments that deserve a little more sophistication.',
    brandPositioning:
      'A sophisticated everyday fragrance identity designed for people who want to express confidence and elegance in their daily routine.',
    badge: 'LAUNCH EDITION',
    occasions: ['College', 'Office', 'Daily Wear', 'Casual Outings', 'Meetings'],
    targetAudience: [
      'College & university scholars',
      'Corporate executives & professionals',
      'Daily fragrance wearers seeking effortless refinement',
    ],
    personality: ['Sophisticated', 'Fresh', 'Elegant', 'Modern', 'Confident', 'Classy'],
    bottleDetails:
      'Heavy transparent glass flacon with luminous crimson ruby refraction, weighted gold collar, and metallic gold-embossed typography.',
    availableSizes: ['50 ml Eau de Parfum'],
    price: 1499,
    originalPrice: 1999,
    pricePlaceholder: '₹1,499',
    stockStatus: 'Launch Edition • In Stock',
    isAvailable: true,
    palette: {
      primary: '#5B0F18',
      accent: '#C6A15B',
      badgeBg: 'bg-[#5B0F18]',
      badgeText: 'text-[#F8F1E7]',
      themeMode: 'burgundy',
    },
    gallery: [
      {
        src: '/images/products/high-class-front.jpg',
        alt: 'UNSULID HIGH CLASS 50ml Eau de Parfum Front View',
        label: 'Front View',
      },
      {
        src: '/images/products/high-class-side.jpg',
        alt: 'UNSULID HIGH CLASS Architectural Glass Bevel and Facet Profile',
        label: 'Profile',
      },
      {
        src: '/images/products/high-class-closeup.jpg',
        alt: 'UNSULID HIGH CLASS Macro Close-up of Gold Cap and Label',
        label: 'Cap Detail',
      },
      {
        src: '/images/products/high-class-lifestyle.jpg',
        alt: 'UNSULID HIGH CLASS Daytime Presentation with Jasmine Flower on Nero Marquina Plinth',
        label: 'Ritual Scene',
      },
    ],
    counterpart: {
      slug: 'black',
      name: 'BLACK',
      relation: 'The Evening Counterpart',
      category: 'Evening Fragrance • Party Wear',
      description:
        'A bold fragrance identity for evenings, celebrations, and unforgettable moments.',
      image: '/images/products/black-front.jpg',
    },
    story: {
      eyebrow: 'DAYTIME SOPHISTICATION',
      title: 'Poise in Motion, Composure in Presence',
      paragraphs: [
        'HIGH CLASS was formulated to challenge the mundane daytime compromise between ephemeral body mists and inaccessible designer markups. It is engineered as an elevated daily companion that speaks before you do and lingers with quiet assurance.',
        'Whether navigating university lecture halls, boardroom presentations, or relaxed midday rendezvous across India, HIGH CLASS projects crisp authority, immaculate freshness, and authentic personal elegance.',
      ],
      pillars: [
        {
          title: 'Office & Boardroom',
          desc: 'Refined, discreetly magnetic, and designed not to overpower enclosed executive spaces.',
        },
        {
          title: 'University & Campus',
          desc: 'Youthful poise with modern sophistication that elevates daily style effortlessly.',
        },
        {
          title: 'Casual Encounters',
          desc: 'Warm, approachable elegance that leaves an inviting and memorable trail.',
        },
      ],
      quote:
        '“True high class never shouts. It is the subtle, undeniable certainty of your presence.”',
    },
    presentation: {
      flaconSpecs:
        'Weighted high-density European architectural glass with polished ruby interior walls and hand-buffed bevels.',
      atomiserSpecs:
        'Custom electroplated gold micro-diffusion pump engineered for a continuous 0.12ml ultra-fine mist.',
      packagingSpecs:
        'Rigid velvet-lined burgundy slide-coffret stamped with gold foil certification and individual batch serial.',
      batchNote:
        'Inaugural Batch 01 — strictly numbered and limited for the initial direct-to-consumer launch edition.',
    },
    faqs: [
      {
        question: 'What is the character and wear-time of HIGH CLASS?',
        answer:
          'HIGH CLASS is developed as an all-day Eau de Parfum formulation. Designed for daytime longevity, it provides a balanced, refined sillage that accompanies you seamlessly from early morning meetings through late afternoon engagements.',
      },
      {
        question: 'When should I choose HIGH CLASS over BLACK?',
        answer:
          'HIGH CLASS is your daytime signature—tailored for professional environments, campus life, daily meetings, and casual outings where clean, approachable sophistication is desired. BLACK is its nocturnal counterpart, designed for bold parties, celebrations, and evening events.',
      },
      {
        question: 'How should HIGH CLASS be applied for optimal presence?',
        answer:
          'Apply 2-3 sprays directly onto clean, moisturized pulse points: the base of the throat, inner wrists, and behind the ears. To extend sillage on warm Indian days, a light mist over your collar or jacket fabric will hold the fragrance longer without staining.',
      },
      {
        question: 'What is included in the Launch Edition packaging?',
        answer:
          'Each 50ml flacon arrives housed in a bespoke velvet-lined presentation coffret with gold foil lettering, an embossed authenticity certificate, and temperature-controlled protective outer shipping packaging.',
      },
    ],
  },

  black: {
    id: 'prod_black',
    slug: 'black',
    name: 'BLACK',
    brand: 'UNSULID',
    category: 'Evening Fragrance',
    tagline: 'Evening Fragrance • Party Wear',
    headline: 'Own Every Entrance.',
    description:
      'Meet BLACK, a bold fragrance expression designed for evenings, celebrations, and unforgettable moments.',
    brandPositioning:
      'A bold fragrance identity for people who want to express confidence and individuality.',
    badge: 'NOCTURNAL STATEMENT',
    occasions: ['Parties', 'Evening Outings', 'Celebrations', 'Special Occasions', 'Nightlife'],
    targetAudience: [
      'Young adults & nightlife trendsetters',
      'Ambitious professionals attending evening events',
      'Individuals who demand an unmistakable, magnetic presence',
    ],
    personality: ['Bold', 'Mysterious', 'Powerful', 'Attractive', 'Confident', 'Presence-driven'],
    bottleDetails:
      'Opaque obsidian black lacquered architectural glass flacon, mirror-finished gold sprayer collar and cap, with embossed gold typography.',
    availableSizes: ['50 ml Eau de Parfum'],
    price: 1699,
    originalPrice: 2299,
    pricePlaceholder: '₹1,699',
    stockStatus: 'Launch Edition • In Stock',
    isAvailable: true,
    palette: {
      primary: '#0B0B0B',
      accent: '#C6A15B',
      badgeBg: 'bg-[#0B0B0B]',
      badgeText: 'text-[#C6A15B]',
      themeMode: 'dark',
    },
    gallery: [
      {
        src: '/images/products/black-front.jpg',
        alt: 'UNSULID BLACK 50ml Eau de Parfum Front View',
        label: 'Front View',
      },
      {
        src: '/images/products/black-side.jpg',
        alt: 'UNSULID BLACK Lacquered Obsidian Silhouette and Profile',
        label: 'Profile',
      },
      {
        src: '/images/products/black-closeup.jpg',
        alt: 'UNSULID BLACK Macro Close-up of Gold Cap and Gold Inscription',
        label: 'Cap Detail',
      },
      {
        src: '/images/products/black-lifestyle.jpg',
        alt: 'UNSULID BLACK Nocturnal Presentation with Oud Wood on Nero Marquina Plinth',
        label: 'Ritual Scene',
      },
    ],
    counterpart: {
      slug: 'high-class',
      name: 'HIGH CLASS',
      relation: 'The Daytime Counterpart',
      category: 'Everyday Fragrance • Daily Wear',
      description:
        'An expression of effortless sophistication, designed for your everyday moments.',
      image: '/images/products/high-class-front.jpg',
    },
    story: {
      eyebrow: 'NOCTURNAL STATEMENT',
      title: 'Hypnotic Depth for Unforgettable Nights',
      paragraphs: [
        'BLACK was engineered for the hours after sunset when ambiance darkens, music quickens, and an uncompromising olfactory signature is required. It is an exploration of nocturnal magnetism and bold individuality.',
        'Created for gala celebrations, rooftop soirées, and high-energy nightlife across India, BLACK wraps the wearer in an intoxicating aura of deep charisma and dark architectural allure that commands the entire room.',
      ],
      pillars: [
        {
          title: 'Parties & Nightlife',
          desc: 'A robust sillage built to project through ambient indoor and outdoor energy.',
        },
        {
          title: 'Celebrations & Galas',
          desc: 'Black-tie authority that pairs seamlessly with structured evening tailoring.',
        },
        {
          title: 'Intimate Evenings',
          desc: 'A magnetic, warm closeness that leaves a hypnotic impression long after departure.',
        },
      ],
      quote:
        '“In a room full of noise, BLACK is the silence that everyone turns to look at.”',
    },
    presentation: {
      flaconSpecs:
        'Jet black UV-blocking opaque lacquered glass engineered to preserve perfume oil potency against ambient light degradation.',
      atomiserSpecs:
        'Mirror-polished gold micro-atomiser with tactile resistance for measured, ceremonial dosage.',
      packagingSpecs:
        'Matte obsidian presentation coffret lined with black velvet and sealed with metallic gold security ribbon.',
      batchNote:
        'Inaugural Batch 01 — individually inspected, numbered, and held in climate-controlled reserve.',
    },
    faqs: [
      {
        question: 'What makes BLACK the ideal evening fragrance?',
        answer:
          'BLACK is formulated with a higher oil concentration specifically designed for evening projection. It creates a bold, magnetic sillage that cuts through cool evening air and vibrant social environments without becoming cloying.',
      },
      {
        question: 'Can BLACK and HIGH CLASS be worn together or layered?',
        answer:
          'While each fragrance is designed as a standalone masterpiece, many connoisseurs transition from HIGH CLASS during the work day directly into BLACK for evening celebrations, as their warm gold bases harmonize naturally.',
      },
      {
        question: 'How should BLACK be applied for evening longevity?',
        answer:
          'Apply 3-4 sprays to warm pulse points: the neck, clavicle, and chest. Spraying onto the lapels or shoulders of your evening jacket or blazer provides exceptional projection in air-conditioned party venues.',
      },
      {
        question: 'What is the volume and concentration of BLACK?',
        answer:
          'BLACK is bottled exclusively in a 50ml high-concentration Eau de Parfum flacon, delivering months of daily or ceremonial evening wear.',
      },
    ],
  },
};

export const getProductBySlug = (slug: string): ProductDetailData | undefined => {
  return productsData[slug as 'high-class' | 'black'];
};

export const getAllProductSlugs = (): string[] => {
  return Object.keys(productsData);
};

