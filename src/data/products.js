// ─────────────────────────────────────────────────────────────────────────────
// src/data/products.js
// Local product catalogue for BAYO Masala
//
// HOW TO ADD YOUR REAL IMAGES:
//   1. Put your image files inside the  assets/  folder (e.g. assets/chilli_powder.png)
//   2. Replace each  image: null  line with:
//        image: require('../../../assets/YOUR_FILENAME.png'),
//   3. You can also delete the  backgroundColor  key once the real image is added.
//
// IMAGE NAMING SUGGESTION (snake_case):
//   bayo_logo.png          ← app logo
//   chilli_powder.png
//   kanda_lasun.png
//   kitchen_king.png
//   mutton_masala.png
//   chicken_masala.png
//   goda_masala.png
//   coriander_powder.png
//   black_pepper.png
//   cloves.png
//   cinnamon.png
//   bay_leaf.png
//   hotel_blend.png
//   turmeric.png
//   cumin.png
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORIES = ['All', 'Khada Masala', 'Masale', 'Special Blends', 'Others'];

export const PRODUCTS = [

  // ── KHADA MASALA ──────────────────────────────────────────────────────────
  {
    id: 'p1',
    name: 'kanda lasun masala',
    category: 'Khada Masala',
    price: 650,
    unit: 'kg',
    packSize: '500 g',
    description: 'Bold, pungent whole black pepper. Ideal for marinades and slow-cook curries.',
    backgroundColor: '#2D2D2D',
    badge: 'PREMIUM',
    // ↓ Replace null with: require('../../assets/black_pepper.png')
    image: require('../../assets/1.png'),
  },
  {
    id: 'p2',
    name: 'Paneer Masala',
    category: 'Special Blends',
    price: 1200,
    unit: 'kg',
    packSize: '250 g',
    description: 'Aromatic whole cloves. Rich flavour for biryanis and masala chai.',
    backgroundColor: '#6B3A2A',
    badge: null,
    // ↓ Replace null with: require('../../assets/cloves.png')
    image: require('../../assets/2.png'),
  },
  {
    id: 'p3',
    name: 'Cinnamon Sticks',
    category: 'Khada Masala',
    price: 680,
    unit: 'kg',
    packSize: '500 g',
    description: 'Premium Ceylon cinnamon sticks. Sweet, warm aroma for curries and desserts.',
    backgroundColor: '#8B4513',
    badge: null,
    // ↓ Replace null with: require('../../assets/cinnamon.png')
    image: require('../../assets/3.png'),
  },
  {
    id: 'p4',
    name: 'Chicken Masala',
    category: 'Special Blends',
    price: 320,
    unit: 'kg',
    packSize: '200 g',
    description: 'Fragrant dried bay leaves. Essential base for stocks, gravies and rice.',
    backgroundColor: '#4A7C59',
    badge: null,
    // ↓ Replace null with: require('../../assets/bay_leaf.png')
    image: require('../../assets/4.png'),
  },

  // ── MASALE ────────────────────────────────────────────────────────────────
  {
    id: 'p5',
    name: 'Kanda Lasun Masala (1 kg)',
    category: 'Masale',
    price: 720,
    unit: 'kg',
    packSize: '1 kg',
    description: 'Vibrant Guntur-grade red chilli powder. Consistent heat, bright colour.',
    backgroundColor: '#C0392B',
    badge: 'BESTSELLER',
    // ↓ Replace null with: require('../../assets/chilli_powder.png')
    image: require('../../assets/5.png'),
  },
  {
    id: 'p6',
    name: 'Red Chilli Powder',
    category: 'Masale',
    price: 380,
    unit: 'kg',
    packSize: '500 g',
    description: 'Authentic onion-garlic masala blend. The backbone of Maharashtrian cooking.',
    backgroundColor: '#E67E22',
    badge: null,
    // ↓ Replace null with: require('../../assets/kanda_lasun.png')
    image: require('../../assets/6.png'),
  },
  {
    id: 'p7',
    name: 'Turmeric Powder',
    category: 'Others',
    price: 450,
    unit: 'kg',
    packSize: '500 g',
    description: 'Traditional Maharashtrian goda masala. Deep earthy flavour with warm spices.',
    backgroundColor: '#7D4E1E',
    badge: null,
    // ↓ Replace null with: require('../../assets/goda_masala.png')
    image: require('../../assets/7.png'),
  },
  {
    id: 'p8',
    name: 'Coriander Powder',
    category: 'Others',
    price: 260,
    unit: 'kg',
    packSize: '1 kg',
    description: 'Stone-ground coriander powder. Light citrusy base spice for any curry.',
    backgroundColor: '#C8A951',
    badge: null,
    // ↓ Replace null with: require('../../assets/coriander_powder.png')
    image: require('../../assets/8.png'),
  },

  // ── SPECIAL BLENDS ────────────────────────────────────────────────────────
  {
    id: 'p9',
    name: 'Kitchen King Masala',
    category: 'Special Blends',
    price: 520,
    unit: 'kg',
    packSize: '500 g',
    description: 'All-purpose kitchen king blend. Elevates any curry, dal or vegetable instantly.',
    backgroundColor: '#D35400',
    badge: 'HOT',
    // ↓ Replace null with: require('../../assets/kitchen_king.png')
    image: require('../../assets/14.png'),
  },
  {
    id: 'p10',
    name: 'Chicken Masala',
    category: 'Special Blends',
    price: 490,
    unit: 'kg',
    packSize: '500 g',
    description: 'Restaurant-grade chicken masala. Consistent taste every time — no MSG.',
    backgroundColor: '#E74C3C',
    badge: 'POPULAR',
    // ↓ Replace null with: require('../../assets/chicken_masala.png')
    image: require('../../assets/15.png'),
  },
  {
    id: 'p11',
    name: 'Mutton Masala',
    category: 'Special Blends',
    price: 560,
    unit: 'kg',
    packSize: '500 g',
    description: 'Bold mutton masala with deep flavour. Ideal for slow-cooked curries and kebabs.',
    backgroundColor: '#922B21',
    badge: null,
    // ↓ Replace null with: require('../../assets/mutton_masala.png')
    image: require('../../assets/17.png'),
  },
  {
    id: 'p12',
    name: 'Special Hotel Blend',
    category: 'Special Blends',
    price: 720,
    unit: 'kg',
    packSize: '1 kg',
    description: 'Exclusive BAYO hotel blend. Used by top hotels for consistent premium taste.',
    backgroundColor: '#1A5276',
    badge: 'EXCLUSIVE',
    // ↓ Replace null with: require('../../assets/hotel_blend.png')
    image: require('../../assets/19.png'),
  },

  // ── OTHERS ────────────────────────────────────────────────────────────────
  {
    id: 'p13',
    name: 'Turmeric Powder',
    category: 'Others',
    price: 280,
    unit: 'kg',
    packSize: '1 kg',
    description: 'Pure high-curcumin turmeric. Vibrant colour and authentic flavour guaranteed.',
    backgroundColor: '#F39C12',
    badge: null,
    // ↓ Replace null with: require('../../assets/turmeric.png')
    image: require('../../assets/Mirch.png'),
  },
  {
    id: 'p14',
    name: 'Cumin Seeds',
    category: 'Others',
    price: 360,
    unit: 'kg',
    packSize: '500 g',
    description: 'Hand-cleaned cumin seeds. Earthy, warm aroma — perfect for tadka and rice.',
    backgroundColor: '#6E5234',
    badge: null,
    // ↓ Replace null with: require('../../assets/cumin.png')
    image: require('../../assets/Vatan Masala.png'),
  },
];