/** Site copy — edit text here; mirrors React `src/constants/*.js`. */
export const site = { name: 'AXIS-3D', legalName: 'Axis-3D' }

/** Homepage `#works` featured block — set `true` to show again. */
export const showHomeWorksSection = false
export const storeHref = 'https://store.axis3dlab.com'
export const footer = {
  address: 'Chennai, Tamilnadu',
  email: 'info@axis3dlab.com',
  phone: '63838 60114',
  phoneTel: '+916383860114',
  year: new Date().getFullYear(),
}
export const mailto = `mailto:${footer.email}?subject=${encodeURIComponent('3D Printing/Laser requirement')}`

export const navItems = [
  { label: 'Home', href: 'home' },
  { label: 'Works', href: 'works' },
  { label: 'Gallery', href: 'gallery' },
  { label: 'About', href: 'about' },
  { label: 'Contact Us', href: 'contact' },
  { label: 'Store', href: storeHref, external: true },
]

export const galleryPage = {
  eyebrow: 'Gallery',
  title: 'From the studio bench.',
  sub: 'Prints, laser work, boxes, awards, and builds.',
}

export const hero = {
  eyebrow: 'Premium fabrication studio',
  titleLines: ['Premium 3D', 'Printing &', 'Custom\u00A0Fabrication', 'Studio'],
  sub: 'Transforming concepts into premium physical products through precision 3D printing, laser cutting, acrylic fabrication, and modern manufacturing technologies.',
}

export const metrics = [
  {
    value: '50',
    suffix: '+',
    label: 'Engineered Projects',
    note: 'Product development, fabrication systems, prototypes & custom builds',
  },
  {
    value: '5',
    suffix: '+',
    label: 'Fabrication Technologies',
    note: '3D printing, laser fabrication, electronics integration & precision assembly',
  },
  {
    value: '2019',
    suffix: '',
    label: 'Building Since',
    note: 'Evolving from digital fabrication into full-scale product development',
  },
  {
    value: 'End-to-End',
    suffix: '',
    label: 'Development Workflow',
    note: 'From concept and prototyping to fabrication and finishing',
  },
]

export const capabilities = [
  { title: 'Additive manufacturing', description: 'FDM · SLA · SLS — tuned profiles for engineering parts and presentation models.', image: 'service-print.png' },
  { title: 'Laser fabrication', description: 'Cutting, marking, and engraving across sheet goods and engineered plastics.', image: 'service-laser.png' },
  { title: 'Precision prototyping', description: 'CAD-to-part workflows with documented tolerances and revision control.', image: 'service-proto.png' },
  { title: 'Spatial & architectural', description: 'Large-format builds, sectional models, and installation-ready assemblies.', image: 'service-decor.png' },
  { title: 'Awards & objects', description: 'Weighted bases, crystal interfaces, and metalwork with controlled finishes.', image: 'service-brand.png' },
  { title: 'MDF gift boxes', description: 'Laser-cut MDF boxes with fitted interiors, branded lids, and controlled finishes for gifting and retail.', image: 'service-mdf.jpg' },
]

export const featuredWorks = [
  { title: 'Helix Pavilion', meta: 'Bronze resin · sectional assembly', image: 'work-helix.png' },
  { title: 'Orbit Console', meta: 'PC-ABS · soft-touch secondary ops', image: 'work-orbit.png' },
  { title: 'Lumen Trophy', meta: 'Optical acrylic · brass interface', image: 'work-lumen.png' },
]

export const standards = [
  { title: 'Documented process', body: 'Build parameters, machine logs, and inspection notes travel with the part.' },
  { title: 'Measured outcomes', body: 'Critical dimensions are verified against CAD — not assumed.' },
  { title: 'Controlled finishing', body: 'Surface preparation is treated as a manufacturing step, not an afterthought.' },
]

export const inquiry = {
  headline: 'Request a fabrication review',
  line: 'Send drawings, material intent, and timeline. We respond with feasibility and next steps.',
  primary: { label: 'Email the studio', href: mailto },
}

export const worksHero = {
  eyebrow: 'Selected work',
  title: 'Crafted Through Engineering.',
  sub: 'From advanced product development to premium fabrication, every project is designed with precision, functionality, and detail.',
}

export const worksDiatone = {
  title: 'DiaTone',
  subtitle: 'Non-Invasive Sugar Level Analyzer',
  description: 'Complete product development including electronics integration, embedded systems, enclosure design, prototyping, and fabrication.',
  tags: ['Product Development', 'Electronics', 'Embedded Systems', '3D Printed Enclosure', 'Prototype Engineering'],
}

export const worksIncubator = {
  title: 'Biological Incubator',
  subtitle: 'Developed in collaboration with the National Institute of Ocean Technology (NIOT)',
  description:
    'Designed and fabricated a portable microbiological incubation system for culture growth applications, including embedded control systems, precision fabrication, thermal management, acrylic and metal laser-cut structures, and complete assembly integration.',
  tags: [
    'NIOT · National Institute of Ocean Technology',
    'Industrial Fabrication',
    'Embedded Systems',
    'Acrylic Fabrication',
    'Metal Fabrication',
    'Product Engineering',
  ],
}

export const worksAwards = {
  title: 'Premium Awards & Recognition Pieces',
  description: 'Custom-designed awards and recognition pieces crafted using acrylic, wood, precision laser fabrication, and premium finishing techniques.',
  strips: [
    { caption: 'Crystal · brass interface', image: 'works/awards/strip-1.png' },
    { caption: 'Layered acrylic · edge lighting', image: 'works/awards/strip-2.png' },
    { caption: 'Walnut · anodized detail', image: 'works/awards/strip-3.png' },
  ],
}

export const worksSculptures = {
  title: 'Sculptures & Custom Installations',
  description: 'Large-format artistic fabrication and statement installations designed for luxury interiors, commercial spaces, and custom environments.',
}

export const worksConfidential = {
  title: 'Confidential Development Projects',
  description: 'We collaborate on multiple private and NDA-protected projects involving industrial prototyping, product development, electronics integration, and fabrication solutions.',
  cards: [
    { label: 'Industrial prototype', image: 'works/confidential/preview-1.png' },
    { label: 'Electronics integration', image: 'works/confidential/preview-2.png' },
    { label: 'Fabrication program', image: 'works/confidential/preview-3.png' },
  ],
}

export const worksFinalCta = {
  title: 'Have an Idea Worth Building?',
  sub: "Let's transform concepts into engineered reality.",
}

export const aboutHero = {
  eyebrow: 'About the studio',
  title: 'Engineering Creativity Into Reality.',
  sub: 'Axis-3D is a modern fabrication and product development studio focused on precision manufacturing, engineering innovation, and custom-built solutions.',
}

export const aboutStory = {
  eyebrow: 'From Ideas to Engineered Solutions',
  paragraph1Parts: [
    'Started as a small 3D printing initiative, Axis-3D evolved into a multidisciplinary fabrication studio',
    'delivering product development, laser fabrication, engineering prototypes, custom installations, and premium manufacturing solutions.',
  ],
  paragraph2: 'Today, the studio combines creativity, engineering, and digital fabrication to transform concepts into functional and visually refined products.',
}

export const aboutJourney = {
  title: 'Our Journey',
  milestones: [
    { year: '2019', text: 'Foundation of Axis-3D & First 3D Printing Projects' },
    { year: '2021', text: 'Integration of Advanced PCB Manufacturing & Electronics Development' },
    { year: '2023', text: 'Expansion into Precision Laser Fabrication & Custom Manufacturing' },
    { year: '2024', text: 'Evolved into a Full-Scale Product Development & Fabrication Studio' },
    { year: '2025', text: 'Development of Engineering Projects, Industrial Prototypes & Premium Fabrication Solutions' },
  ],
}

export const aboutWhatWeBuild = {
  title: 'What We Build',
  cards: [
    { title: 'Product Development', body: 'Functional prototypes, enclosure systems, embedded integration, and engineering fabrication.' },
    { title: 'Precision Fabrication', body: 'Laser cutting, acrylic fabrication, metal integration, and custom-built assemblies.' },
    { title: 'Premium Creations', body: 'Awards, sculptures, installations, decor, and custom artistic fabrication.' },
  ],
}

export const aboutPhilosophy = {
  title: 'Precision in Every Detail.',
  paragraph1: 'Every project is approached with a balance of engineering precision, modern fabrication techniques, and refined visual design.',
  paragraph2: 'Axis-3D focuses on creating products that are not only functional, but also thoughtfully crafted and professionally finished.',
}

export const aboutWorkspace = {
  title: 'Inside the workflow',
  sub: 'Fabrication, prototyping, and engineering — built in-house with disciplined process.',
}

export const aboutWhy = {
  title: 'Why Axis-3D',
  points: ['Engineering-focused workflow', 'Modern fabrication techniques', 'Precision manufacturing', 'Rapid prototyping', 'Premium finishing quality'],
}

export const aboutFinalCta = {
  title: "Let's Build Something Exceptional.",
  sub: 'Transforming concepts into engineered reality through precision fabrication and modern product development.',
}

export const contactPage = {
  label: 'CONTACT',
  title: 'Start with Files and Intent.',
  sub: 'Reach out with concepts, fabrication requirements, product ideas, technical drawings, or custom manufacturing discussions. Projects can be discussed remotely or in person by appointment.',
  addressLine: 'Chennai, Tamil Nadu',
  phoneDisplay: '+91 63838 60114',
  availability: { title: 'Availability', lines: ['Monday — Saturday', '10:00 AM — 7:00 PM'] },
  preferredFiles: { title: 'Preferred Project Files', items: ['STL', 'STEP', '3MF', 'DXF', 'Reference Images', 'Technical Drawings'] },
  projectCategories: { title: 'Project Categories', items: ['Product Development', '3D Printing', 'Laser Fabrication', 'Custom Awards', 'Sculptures & Installations'] },
  professionalNote: 'Include dimensions, materials, quantity, timeline, or fabrication requirements wherever possible for faster project discussions.',
  cardTitle: 'Studio Details',
}
