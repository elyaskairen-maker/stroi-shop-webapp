// ===============================================
// ASOSIY DO'KON LOGIKASI - NOVA SHOP
// ===============================================

class ShopApp {
   constructor() {
        this.tg = window.Telegram?.WebApp;
        this.cart = [];
        this.allProducts = [];
        this.currentCategory = 'Barcha mahsulotlar';
        
        this.initTelegram();
        this.initDOM();
        this.initEventListeners();
        this.init();
    }

    // Telegram Web App ni ishga tushirish
    initTelegram() {
        if (this.tg) {
            this.tg.ready();
            this.tg.expand();
            if (this.tg.colorScheme === 'dark') {
                document.body.classList.add('telegram-dark-theme');
            }
        }
    }

    // DOM elementlarini olish
    initDOM() {
        this.elements = {
            catalogContainer: document.getElementById('product-catalog'),
            loader: document.getElementById('loader'),
            cartButton: document.getElementById('cart-button'),
            cartCounter: document.getElementById('cart-counter'),
            cartModal: document.getElementById('cart-modal'),
            closeCartButton: document.getElementById('close-cart-button'),
            cartItemsContainer: document.getElementById('cart-items-container'),
            cartTotalPriceEl: document.getElementById('cart-total-price'),
            submitOrderButton: document.getElementById('submit-order-button'),
            customerNameInput: document.getElementById('customer-name-input'),
            organizationInput: document.getElementById('organization-input'),
            phoneInput: document.getElementById('phone-input'),
            addressInput: document.getElementById('address-input'),
            categoriesContainer: document.getElementById('categories-container'),
            orderForm: document.getElementById('order-form'),
            cartSummary: document.querySelector('.cart-summary')
        };
    }

    // Event listenerlar
    initEventListeners() {
        // Savatcha
        this.elements.cartButton.addEventListener('click', () => this.openCart());
        this.elements.closeCartButton.addEventListener('click', () => this.closeCart());
        this.elements.cartModal.addEventListener('click', (e) => {
            if (e.target === this.elements.cartModal) this.closeCart();
        });

        // Buyurtma formasi
        this.elements.submitOrderButton.addEventListener('click', () => this.submitOrder());

        // Klaviatura
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.cartModal.style.display === 'flex') {
                this.closeCart();
            }
        });
    }

    // Asosiy ishga tushirish
    async init() {
        this.applyConfig();
        this.renderCategories();
        await this.loadProducts();
        this.filterProductsByCategory(this.currentCategory);
    }

    // Konfiguratsiyani qo'llash
    applyConfig() {
        document.title = SHOP_CONFIG.shopTitle;
        document.getElementById('shop-title').textContent = SHOP_CONFIG.shopTitle;
        
        const logoImg = document.getElementById('logo-img');
        logoImg.src = SHOP_CONFIG.logoPath;
        logoImg.onerror = () => { logoImg.style.display = 'none'; };
        
        // Ranglarni qo'llash
        const root = document.documentElement;
        root.style.setProperty('--primary-color', SHOP_CONFIG.colors.primary);
        root.style.setProperty('--secondary-color', SHOP_CONFIG.colors.secondary);
        root.style.setProperty('--accent-color', SHOP_CONFIG.colors.accent);
        root.style.setProperty('--success-color', SHOP_CONFIG.colors.success);

        // Sarlavhalarni yangilash
        document.querySelector('.categories-section .section-title').textContent = SHOP_CONFIG.sectionTitles.categories;
        document.querySelector('.products-section .section-title').textContent = SHOP_CONFIG.sectionTitles.products;
    }

    // Mahsulotlarni yuklash
    async loadProducts() {
        try {
            this.showLoader();
            
            // Ichki katalogni tekshirish
            if (window.EMBEDDED_CATALOG && Array.isArray(window.EMBEDDED_CATALOG)) {
                console.log('Ichki katalog ishlatilmoqda');
                this.allProducts = window.EMBEDDED_CATALOG;
                this.renderProducts(this.allProducts);
                return;
            }
            
            // JSON fayldan yuklashga urinish
            try {
                const response = await fetch('data/catalog.json');
                if (response.ok) {
                    const data = await response.json();
                    this.allProducts = data;
                    console.log('Katalog JSON dan yuklandi');
                } else {
                    throw new Error('Fayl topilmadi');
                }
            } catch (error) {
                console.log('catalog.json yuklanmadi');
                this.allProducts = [];
            }
            
            this.renderProducts(this.allProducts);
        } catch (error) {
            console.error('Mahsulotlarni yuklashda xato:', error);
            this.showError('Mahsulotlar yuklanmadi');
        } finally {
            this.hideLoader();
        }
    }

    // Loader ko'rsatish
    showLoader() {
        this.elements.loader.style.display = 'block';
        this.elements.catalogContainer.style.display = 'none';
    }

    // Loader yashirish
    hideLoader() {
        this.elements.loader.style.display = 'none';
        this.elements.catalogContainer.style.display = 'grid';
    }

    // Xatoni ko'rsatish
    showError(message) {
        this.elements.loader.innerHTML = `
            <div style="text-align: center; color: white;">
                <div style="font-size: 48px; margin-bottom: 16px;">😞</div>
                <p>${message}</p>
            </div>
        `;
    }

    // Mahsulotlarni ko'rsatish
    renderProducts(productsToRender) {
        this.elements.catalogContainer.innerHTML = '';
        
        if (productsToRender.length === 0) {
            this.elements.catalogContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: white;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🤷‍♂️</div>
                    <p style="font-size: 18px; opacity: 0.8;">${SHOP_CONFIG.messages.noProducts}</p>
                </div>
            `;
            return;
        }
        
        productsToRender.forEach((product, index) => {
            const card = this.createProductCard(product);
            if (SHOP_CONFIG.animation.enabled) {
                card.style.animationDelay = `${index * SHOP_CONFIG.animation.staggerDelay}ms`;
            }
            this.elements.catalogContainer.appendChild(card);
        });
    }

    // Mahsulot kartochkasini yaratish
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const formattedPrice = this.formatPrice(product.price);
        
        card.innerHTML = `
            <div class="product-photo">
                <img src="${product.photo}" alt="${product.name}" 
                     onerror="this.src='https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=300&fit=crop';">
            </div>
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">${formattedPrice}</div>
                    <button class="add-to-cart-button">Savatchaga</button>
                </div>
            </div>
        `;
        
        const addToCartButton = card.querySelector('.add-to-cart-button');
        addToCartButton.addEventListener('click', () => {
            this.addToCart(product);
            this.animateAddToCart(addToCartButton);
        });
        
        return card;
    }

    // Savatchaga qo'shish animatsiyasi
    animateAddToCart(button) {
        const originalText = button.textContent;
        button.style.transform = 'scale(0.9)';
        button.textContent = SHOP_CONFIG.messages.addedToCart;
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.textContent = originalText;
        }, 500);
    }

    // Narxni formatlash
    formatPrice(price) {
        const formatted = new Intl.NumberFormat('uz-UZ', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
        
        return `${formatted} ${SHOP_CONFIG.currency.symbol}`;
    }

    // Savatcha logikasi
    addToCart(product) {
        const existingProduct = this.cart.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.updateCart();
        
        // Taktil aloqa
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('light');
        }
    }

    // Miqdorni o'zgartirish
    changeQuantity(productId, delta) {
        const product = this.cart.find(p => p.id === productId);
        if (!product) return;

        product.quantity += delta;

        if (product.quantity <= 0) {
            this.cart = this.cart.filter(p => p.id !== productId);
        }
        this.updateCart();
    }

    // Savatchani yangilash
    updateCart() {
        const totalItems = this.cart.reduce((sum, product) => sum + product.quantity, 0);
        this.elements.cartCounter.textContent = totalItems;
        this.elements.cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
        this.renderCartItems();
        this.calculateTotalPrice();
    }

    // Savatcha elementlarini ko'rsatish
    renderCartItems() {
        this.elements.cartItemsContainer.innerHTML = '';

        if (this.cart.length === 0) {
            this.elements.cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: white;">
                    <div style="font-size: 64px; margin-bottom: 16px;">🛒</div>
                    <p style="font-size: 18px; opacity: 0.8;">${SHOP_CONFIG.messages.emptyCart}</p>
                    <p style="font-size: 14px; opacity: 0.6; margin-top: 8px;">${SHOP_CONFIG.messages.emptyCartDescription}</p>
                </div>
            `;
            this.elements.orderForm.style.display = 'none';
            this.elements.cartSummary.style.display = 'none';
            return;
        }
        
        this.elements.orderForm.style.display = 'block';
        this.elements.cartSummary.style.display = 'block';

        this.cart.forEach(product => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            const formattedPrice = this.formatPrice(product.price);
            
            itemEl.innerHTML = `
                <img src="${product.photo}" class="cart-item-img" alt="${product.name}" 
                     onerror="this.src='https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=100&h=100&fit=crop';">
                <div class="cart-item-details">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">${formattedPrice}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" data-product-id="${product.id}" data-delta="-1">−</button>
                    <span class="item-quantity">${product.quantity}</span>
                    <button class="quantity-btn" data-product-id="${product.id}" data-delta="1">+</button>
                </div>
            `;
            this.elements.cartItemsContainer.appendChild(itemEl);
        });

        // Miqdor tugmalari uchun handlerlar
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId, 10);
                const delta = parseInt(e.target.dataset.delta, 10);
                this.changeQuantity(productId, delta);
            });
        });
    }

    // Umumiy narxni hisoblash
    calculateTotalPrice() {
        const total = this.cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        const formattedTotal = this.formatPrice(total);
        this.elements.cartTotalPriceEl.textContent = formattedTotal;
    }

    // Savatcha oynasini boshqarish
    openCart() {
        this.elements.cartModal.style.display = 'flex';
        this.renderCartItems();
    }

    closeCart() {
        this.elements.cartModal.style.display = 'none';
    }

    // Buyurtma yuborish
    submitOrder() {
        const customerName = this.elements.customerNameInput.value.trim();
        const organization = this.elements.organizationInput.value.trim();
        const phone = this.elements.phoneInput.value.trim();
        const address = this.elements.addressInput.value.trim();
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        if (this.cart.length === 0) {
            this.showAlert(SHOP_CONFIG.messages.emptyCart);
            return;
        }
        
        // Telefon raqamni tekshirish
        const phoneRegex = /^\+998\d{9}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            this.showAlert('Telefon raqam noto\'g\'ri. Format: +998901234567');
            return;
        }
        
        if (!customerName || !organization || !phone || !address) {
            this.showAlert('Iltimos, ism, familiya, telefon va manzilni to\'ldiring.');
            return;
        }

        // Telegram foydalanuvchi ma'lumotlari
        const telegramUser = this.tg ? this.tg.initDataUnsafe.user : null;

        const orderData = {
            items: this.cart.map(p => ({ 
                id: p.id, 
                sku: p.sku,
                name: p.name, 
                price: p.price, 
                quantity: p.quantity 
            })),
            totalPrice: this.cart.reduce((sum, p) => sum + (p.price * p.quantity), 0),
            customer: {
                name: customerName,
                organization: organization,
                phone: phone,
                address: address,
                paymentMethod: this.getPaymentMethodLabel(paymentMethod),
                telegramId: telegramUser?.id || '',
                telegramUsername: telegramUser?.username || '',
                telegramFirstName: telegramUser?.first_name || '',
                telegramLastName: telegramUser?.last_name || ''
            },
            orderDate: new Date().toISOString(),
            shopInfo: {
                name: SHOP_CONFIG.shopTitle,
                contact: SHOP_CONFIG.contact
            }
        };

        this.processOrder(orderData);
    }

    // To'lov usulini olish
    getPaymentMethodLabel(value) {
        const method = SHOP_CONFIG.paymentMethods.find(m => m.value === value);
        return method ? method.label : 'Ko\'rsatilmagan';
    }

    // Buyurtmani qayta ishlash
    processOrder(orderData) {
        // Yuborish animatsiyasi
        this.elements.submitOrderButton.innerHTML = SHOP_CONFIG.messages.sending;
        this.elements.submitOrderButton.disabled = true;

        setTimeout(() => {
            // Matn ko'rinishida tayyorlash
            const orderText = this.formatOrderForBot(orderData);
            
            if (this.tg && this.tg.sendData) {
                this.tg.sendData(orderText);
            } else {
                console.log('Buyurtma:', orderText);
            }

            this.showAlert(SHOP_CONFIG.messages.orderSuccess);

            // Savatcha va formani tozalash
            this.cart = [];
            this.updateCart();
            this.clearOrderForm();
            this.closeCart();

            this.elements.submitOrderButton.innerHTML = '✅ Buyurtma berish';
            this.elements.submitOrderButton.disabled = false;

            if (this.tg && this.tg.close) {
                setTimeout(() => this.tg.close(), 1500);
            }
        }, 1500);
    }

    // Buyurtmani bot uchun matn ko'rinishida tayyorlash
    formatOrderForBot(orderData) {
        let text = "🆕 YANGI BUYURTMA\n";
        text += "━━━━━━━━━━━━━━━━━━━━\n\n";
        text += `👤 Ism: ${orderData.customer.name}\n`;
        text += `👤 Familiya: ${orderData.customer.organization}\n`;
        text += `📞 Telefon: ${orderData.customer.phone}\n`;
        text += `📍 Manzil: ${orderData.customer.address}\n`;
        text += `💵 To'lov: ${orderData.customer.paymentMethod}\n\n`;
        
        text += "🛒 Mahsulotlar:\n";
        orderData.items.forEach(item => {
            const sum = item.price * item.quantity;
            text += `• ${item.name} × ${item.quantity} = ${sum.toLocaleString()} so'm\n`;
        });
        
        text += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        text += `💰 JAMI: ${orderData.totalPrice.toLocaleString()} so'm\n\n`;
        text += `🆔 Telegram: ${orderData.customer.telegramUsername ? '@' + orderData.customer.telegramUsername : orderData.customer.telegramId}`;
        
        return text;
    }

    // Buyurtma formasini tozalash
    clearOrderForm() {
        this.elements.customerNameInput.value = '';
        this.elements.organizationInput.value = '';
        this.elements.phoneInput.value = '';
        this.elements.addressInput.value = '';
    }

    // Ogohlantirish ko'rsatish
    showAlert(message) {
        if (this.tg && this.tg.showAlert) {
            this.tg.showAlert(message);
        } else {
            alert(message);
        }
    }

    // Kategoriyalarni ko'rsatish
    renderCategories() {
        this.elements.categoriesContainer.innerHTML = '';
        
        // Xavfsiz yechim - window.CATEGORIES || []
        const enabledCategories = (window.CATEGORIES || []).filter(cat => cat.enabled);
        
        enabledCategories.forEach((category, index) => {
            const button = document.createElement('div');
            button.className = 'category-button';
            
            if (SHOP_CONFIG.animation.enabled) {
                button.style.animationDelay = `${index * SHOP_CONFIG.animation.staggerDelay}ms`;
            }
            
            if (category.name === this.currentCategory) {
                button.classList.add('active');
            }
            
            button.innerHTML = `
                <span class="category-icon">${category.icon}</span>
                <span class="category-name">${category.name}</span>
                <span class="category-description">${category.description}</span>
            `;
            
            button.addEventListener('click', () => {
                this.filterProductsByCategory(category.name);
                document.querySelectorAll('.category-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
            });
            
            this.elements.categoriesContainer.appendChild(button);
        });
    }

    // Kategoriya bo'yicha filtrlash
    filterProductsByCategory(categoryName) {
        this.currentCategory = categoryName;
        let filtered = [];

        if (categoryName === 'Barcha mahsulotlar') {
            filtered = this.allProducts;
        } else {
            // Xavfsiz yechim - window.CATEGORIES || []
            const selectedCategory = (window.CATEGORIES || []).find(
                cat => cat.name === categoryName
            );
            
            if (selectedCategory && selectedCategory.keywords.length > 0) {
                filtered = this.allProducts.filter(product => {
                    const productNameLower = product.name.toLowerCase();
                    const productDescriptionLower = product.description.toLowerCase();
                    return selectedCategory.keywords.some(keyword => 
                        productNameLower.includes(keyword.toLowerCase()) || 
                        productDescriptionLower.includes(keyword.toLowerCase())
                    );
                });
            } else {
                filtered = [];
            }
        }
        this.renderProducts(filtered);
    }
}

// Ilovani ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    new ShopApp();
});
