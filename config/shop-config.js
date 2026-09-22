// ===============================================
// DO'KON SOZLAMALARI - HAMMASINI O'ZGARTIRISH MUMKIN
// ===============================================

const SHOP_CONFIG = {
    // === ASOSIY MA'LUMOT ===
    shopTitle: "NOVA SHOP",
    shopDescription: "Sifatli mahsulotlar - qulay narxlar",
    
    // === LOGOTIP ===
    // O'zingizning logotipingizni qo'ying
    logoPath: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=100&h=100&fit=crop&crop=center",
    
    // === DO'KON RANGLARI ===
    colors: {
        primary: "#16a34a",      // Asosiy rang (yashil)
        secondary: "#22c55e",    // Qo'shimcha (ochiq yashil)
        accent: "#f59e0b",       // Aksent (to'q sariq)
        success: "#10b981"       // Muvaffaqiyat (yashil)
    },
    
    // === VALYUTA ===
    currency: {
        code: "UZS",             // Valyuta kodi
        symbol: "so'm"           // Valyuta belgisi
    },
    
    // === ALOQA MA'LUMOTLARI ===
    contact: {
        phone: "+998 90 123 45 67",
        email: "info@novashop.uz",
        address: "Toshkent sh., Chilonzor tumani"
    },
    
    // === YETKAZIB BERISH ===
    delivery: {
        freeDeliveryFrom: 500000,  // Bepul yetkazish (so'm)
        deliveryCost: 20000,       // Yetkazish narxi (so'm)
        deliveryText: "Toshkent bo'ylab yetkazib berish"
    },
    
    // === TO'LOV USULLARI ===
    paymentMethods: [
        { value: "cash", label: "💵 Naqd pul", enabled: true },
        { value: "card", label: "💳 Karta", enabled: true },
        { value: "transfer", label: "🏦 O'tkazma", enabled: false }
    ],
    
    // === BO'LIM SARLAVHALARI ===
    sectionTitles: {
        categories: "📱 Kategoriyalar",
        products: "🛍️ Mahsulotlar",
        cart: "🛒 Savatchangiz",
        order: "📋 Buyurtma berish"
    },
    
    // === XABAR MATNLARI ===
    messages: {
        emptyCart: "Savatchangiz bo'sh",
        emptyCartDescription: "Buyurtma berish uchun mahsulot qo'shing",
        addedToCart: "✅ Qo'shildi!",
        orderSuccess: "Buyurtma qabul qilindi! Tez orada siz bilan bog'lanamiz.",
        fillRequiredFields: "Iltimos, ism, telefon va manzilni to'ldiring.",
        loading: "Mahsulotlar yuklanmoqda...",
        sending: "⏳ Yuborilmoqda...",
        noProducts: "Bu kategoriyada mahsulotlar yo'q"
    },
    
    // === ANIMATSIYA ===
    animation: {
        enabled: true,
        duration: 300,
        staggerDelay: 100
    }
};
