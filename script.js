// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动导航
    initSmoothScrolling();
    
    // 购物车功能
    initShoppingCart();
    
    // 滚动效果
    initScrollEffects();
    
    // 产品交互
    initProductInteractions();
});

// 平滑滚动导航
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// 购物车功能
function initShoppingCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    let cartCount = 0;
    
    // 创建购物车图标
    const cartIcon = createCartIcon();
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 添加动画效果
            this.style.transform = 'scale(0.95)';
            this.style.backgroundColor = '#4caf50';
            this.textContent = '已添加!';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.backgroundColor = '#e91e63';
                this.textContent = '加入购物车';
            }, 1000);
            
            // 更新购物车计数
            cartCount++;
            updateCartCount(cartIcon, cartCount);
            
            // 显示成功提示
            showNotification('商品已添加到购物车！', 'success');
        });
    });
}

// 创建购物车图标
function createCartIcon() {
    const cartIcon = document.createElement('div');
    cartIcon.className = 'cart-icon';
    cartIcon.innerHTML = '🛒';
    cartIcon.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #e91e63;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1001;
        box-shadow: 0 4px 15px rgba(233, 30, 99, 0.3);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(cartIcon);
    
    // 悬停效果
    cartIcon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    cartIcon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    return cartIcon;
}

// 更新购物车计数
function updateCartCount(cartIcon, count) {
    const countBadge = cartIcon.querySelector('.cart-count') || document.createElement('span');
    countBadge.className = 'cart-count';
    countBadge.textContent = count;
    countBadge.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ff5722;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    `;
    
    if (!cartIcon.querySelector('.cart-count')) {
        cartIcon.appendChild(countBadge);
    }
}

// 滚动效果
function initScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // 头部背景透明度变化
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
        
        // 滚动方向检测
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // 元素进入视口动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.feature-card, .product-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 产品交互
function initProductInteractions() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // 悬停效果
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // 点击效果
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-to-cart')) {
                // 创建产品详情模态框
                showProductModal(this);
            }
        });
    });
}

// 显示产品详情模态框
function showProductModal(productCard) {
    const productName = productCard.querySelector('h4').textContent;
    const productPrice = productCard.querySelector('.price').textContent;
    const productImage = productCard.querySelector('.product-image').textContent;
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-body">
                    <div class="product-detail-image">${productImage}</div>
                    <div class="product-detail-info">
                        <h3>${productName}</h3>
                        <p class="product-detail-price">${productPrice}</p>
                        <p class="product-detail-description">
                            这是一束精心挑选的美丽花朵，适合各种场合使用。
                            我们保证花朵的新鲜度和品质，让您的每一份心意都能完美传达。
                        </p>
                        <div class="quantity-selector">
                            <label>数量：</label>
                            <button class="quantity-btn" data-action="decrease">-</button>
                            <span class="quantity">1</span>
                            <button class="quantity-btn" data-action="increase">+</button>
                        </div>
                        <button class="modal-add-to-cart">加入购物车</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加样式
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const modalOverlay = modal.querySelector('.modal-overlay');
    modalOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        position: relative;
        animation: modalSlideIn 0.3s ease;
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(-50px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    // 关闭模态框
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #999;
    `;
    
    closeBtn.addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modal.remove();
            style.remove();
        }
    });
    
    // 数量选择器
    const quantitySpan = modal.querySelector('.quantity');
    const decreaseBtn = modal.querySelector('[data-action="decrease"]');
    const increaseBtn = modal.querySelector('[data-action="increase"]');
    
    decreaseBtn.addEventListener('click', () => {
        let quantity = parseInt(quantitySpan.textContent);
        if (quantity > 1) {
            quantitySpan.textContent = quantity - 1;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        let quantity = parseInt(quantitySpan.textContent);
        quantitySpan.textContent = quantity + 1;
    });
    
    // 模态框内加入购物车
    const modalAddToCart = modal.querySelector('.modal-add-to-cart');
    modalAddToCart.style.cssText = `
        background: #e91e63;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 25px;
        cursor: pointer;
        font-size: 1rem;
        margin-top: 1rem;
        width: 100%;
    `;
    
    modalAddToCart.addEventListener('click', () => {
        showNotification('商品已添加到购物车！', 'success');
        modal.remove();
        style.remove();
    });
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// 添加键盘支持
document.addEventListener('keydown', function(e) {
    // ESC键关闭模态框
    if (e.key === 'Escape') {
        const modal = document.querySelector('.product-modal');
        if (modal) {
            modal.remove();
        }
    }
});

// 页面加载动画
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
