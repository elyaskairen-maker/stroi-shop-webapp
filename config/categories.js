// v2
// ===============================================
// MAHSULOT KATEGORIYALARI - NOVA SHOP
// ===============================================

window.CATEGORIES = [
  {
    name: 'Barcha mahsulotlar',
    icon: '🛍️',
    description: 'Barcha mahsulotlarni ko\'rish',
    keywords: [],
    enabled: true
  },
  {
    name: 'Telefonlar',
    icon: '📱',
    description: 'Smartfon va planshetlar',
    keywords: ['samsung', 'redmi', 'poco', 'infinix', 'galaxy', 'note', 'telefon', 'smartfon'],
    enabled: true
  },
  {
    name: 'Audio',
    icon: '🎧',
    description: 'Quloqchin va dinamiklar',
    keywords: ['airpods', 'buds', 'jbl', 'earbuds', 'speaker', 'quloqchin', 'audio', 'dinamik'],
    enabled: true
  },
  {
    name: 'Zaryadlash',
    icon: '🔌',
    description: 'Quvvatlagich va kabellar',
    keywords: ['charger', 'cable', 'power', 'bank', 'zaryad', 'kabel', 'quvvat'],
    enabled: true
  },
  {
    name: 'Aksessuarlar',
    icon: '📱',
    description: 'G'ilof va himoya oynalari',
    keywords: ['case', 'glass', 'holder', 'stick', 'g\'ilof', 'oyna', 'aksessuar'],
    enabled: true
  },
  {
    name: 'Kiyimlar',
    icon: '👕',
    description: 'Erkaklar va ayollar kiyimi',
    keywords: ['shirt', 'hoodie', 'shim', 'kostyum', 'kepka', 'kiyim', 'futbolka'],
    enabled: true
  },
  {
    name: 'Gadjetlar',
    icon: '⌚',
    description: 'Aqlli soat va boshqa gadjetlar',
    keywords: ['watch', 'lamp', 'fan', 'usb', 'flash', 'soat', 'gadjet', 'led'],
    enabled: true
  }
];

// ===============================================
// KATEGORIYALARNI SOZLASH
// ===============================================
/*

1. YANGI KATEGORIYA QO'SHISH:
   Quyidagi blokni nusxalab, o'zgartiring:
   
   {
       name: 'Kategoriya nomi',
       icon: '🔥',  // Har qanday emoji
       description: 'Kategoriya tavsifi',
       keywords: ['kalit', 'so\'z', 'qidiruv'],
       enabled: true  // true = ko'rsatish, false = yashirish
   }

2. KALIT SO'ZLAR (keywords):
   - Mahsulot nomida bor so'zlarni yozing
   - Mahsulotlar shu so'zlar bo'yicha filtrlanadi

3. KATEGORIYANI O'CHIRISH:
   enabled: false qo'ying

4. TARTIB:
   Kategoriyalar massiv tartibida ko'rsatiladi

*/
