

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Hide loader when page is loaded
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 1500);

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Testimonial slider
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        if (testimonialCards.length === 0) return;

        testimonialCards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });
    }

    if (prevBtn && nextBtn && testimonialCards.length > 0) {
        prevBtn.addEventListener('click', function () {
            currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
            showTestimonial(currentTestimonial);
        });

        nextBtn.addEventListener('click', function () {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            showTestimonial(currentTestimonial);
        });

        // Auto-rotate testimonials
        setInterval(function () {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }

    // Cart functionality
    const cartCount = document.querySelector('.cart-count');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartNotification = document.getElementById('cartNotification');
    let cartItems = [];

    // Load cart from localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('cookieHeavenCart');
        if (savedCart) {
            cartItems = JSON.parse(savedCart);
            updateCartCount();
            updateCartDisplay();
        }
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cookieHeavenCart', JSON.stringify(cartItems));
    }

    // Update cart count
    function updateCartCount() {
        if (cartCount) {
            const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    // Update cart display on products page
    function updateCartDisplay() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCart = document.querySelector('.empty-cart');
        const subtotalElement = document.querySelector('.subtotal');
        const totalElement = document.querySelector('.total-amount');

        if (cartItemsContainer && cartItems.length > 0) {
            let cartHTML = '<h3>Your Items</h3>';
            let subtotal = 0;

            cartItems.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                cartHTML += `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
                        </div>
                        <div class="cart-item-actions">
                            <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
                            <button class="remove-btn" onclick="removeFromCart(${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            cartHTML += `
                <button class="btn secondary-btn clear-cart" onclick="clearCart()">Clear Cart</button>
            `;

            cartItemsContainer.innerHTML = cartHTML;

            if (subtotalElement) {
                subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            }

            if (totalElement) {
                const delivery = 5.00;
                const total = subtotal + delivery;
                totalElement.textContent = `$${total.toFixed(2)}`;
            }
        } else if (cartItemsContainer && emptyCart) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="#products" class="btn primary-btn">Continue Shopping</a>
                </div>
            `;

            if (subtotalElement) {
                subtotalElement.textContent = '$0.00';
            }

            if (totalElement) {
                totalElement.textContent = '$5.00';
            }
        }
    }

    // Update quantity in cart
    window.updateQuantity = function (index, change) {
        if (cartItems[index]) {
            cartItems[index].quantity += change;

            if (cartItems[index].quantity <= 0) {
                cartItems.splice(index, 1);
            }

            saveCart();
            updateCartCount();
            updateCartDisplay();
        }
    };

    // Remove from cart
    window.removeFromCart = function (index) {
        if (cartItems[index]) {
            cartItems.splice(index, 1);
            saveCart();
            updateCartCount();
            updateCartDisplay();
        }
    };

    // Clear cart
    window.clearCart = function () {
        cartItems = [];
        saveCart();
        updateCartCount();
        updateCartDisplay();
    };

    // Add to cart functionality
    if (addToCartBtns) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const productName = this.getAttribute('data-product');
                const productPrice = parseFloat(this.getAttribute('data-price'));

                if (!productName || isNaN(productPrice)) return;

                // Check if product is already in cart
                const existingItem = cartItems.find(item => item.name === productName);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cartItems.push({
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    });
                }

                saveCart();
                updateCartCount();
                updateCartDisplay();

                // Show notification
                if (cartNotification) {
                    const message = cartNotification.querySelector('p');
                    if (message) {
                        message.textContent = `${productName} added to cart!`;
                    }
                    cartNotification.classList.add('show');
                    setTimeout(() => {
                        cartNotification.classList.remove('show');
                    }, 3000);
                }

                // Animate button
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }

    // Filter functionality
    const filterTabs = document.querySelectorAll('.filter-tab');
    const productCards = document.querySelectorAll('.product-card');

    if (filterTabs && productCards) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                const filter = this.getAttribute('data-filter');

                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Filter products
                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        // Add animation
                        card.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Sort functionality
    const sortSelect = document.getElementById('sort');
    if (sortSelect && productCards) {
        sortSelect.addEventListener('change', function () {
            const sortValue = this.value;
            const productsArray = Array.from(productCards);
            const container = productsArray[0]?.parentNode;

            if (!container) return;

            productsArray.sort((a, b) => {
                switch (sortValue) {
                    case 'price-low':
                        const priceA = parseFloat(a.querySelector('.product-price')?.textContent.replace('$', '') || 0);
                        const priceB = parseFloat(b.querySelector('.product-price')?.textContent.replace('$', '') || 0);
                        return priceA - priceB;
                    case 'price-high':
                        const priceC = parseFloat(a.querySelector('.product-price')?.textContent.replace('$', '') || 0);
                        const priceD = parseFloat(b.querySelector('.product-price')?.textContent.replace('$', '') || 0);
                        return priceD - priceC;
                    case 'name':
                        const nameA = a.querySelector('h3')?.textContent || '';
                        const nameB = b.querySelector('h3')?.textContent || '';
                        return nameA.localeCompare(nameB);
                    default:
                        return 0;
                }
            });

            // Re-append sorted products
            productsArray.forEach(product => {
                container.appendChild(product);
            });
        });
    }

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            if (question) {
                question.addEventListener('click', function () {
                    // Close other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });

                    // Toggle current item
                    item.classList.toggle('active');
                });
            }
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]')?.value;

            if (!email) return;

            // Show success notification
            if (cartNotification) {
                const message = cartNotification.querySelector('p');
                if (message) {
                    message.textContent = 'Successfully subscribed to newsletter!';
                }
                cartNotification.classList.add('show');
                setTimeout(() => {
                    cartNotification.classList.remove('show');
                    if (message) {
                        message.textContent = 'Item added to cart!';
                    }
                }, 3000);
            }

            // Reset form
            this.reset();
        });
    }

    // Order form
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        // Quantity controls for order form
        const quantityInputs = document.querySelectorAll('.quantity-input');
        const minusBtns = document.querySelectorAll('.quantity-btn.minus');
        const plusBtns = document.querySelectorAll('.quantity-btn.plus');

        minusBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const input = this.nextElementSibling;
                if (input) {
                    const currentValue = parseInt(input.value) || 0;
                    if (currentValue > 0) {
                        input.value = currentValue - 1;
                        updateOrderSummary();
                    }
                }
            });
        });

        plusBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const input = this.previousElementSibling;
                if (input) {
                    const currentValue = parseInt(input.value) || 0;
                    input.value = currentValue + 1;
                    updateOrderSummary();
                }
            });
        });

        quantityInputs.forEach(input => {
            input.addEventListener('change', updateOrderSummary);
        });

        function updateOrderSummary() {
            // This function would update a summary section if needed
            console.log('Order summary updated');
        }

        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(this);
            const orderData = {};

            // Get selected products and quantities
            const selectedProducts = [];
            const productOptions = document.querySelectorAll('.product-option');

            productOptions.forEach(option => {
                const checkbox = option.querySelector('input[type="checkbox"]');
                const quantityInput = option.querySelector('.quantity-input');

                if (checkbox && quantityInput && checkbox.checked && parseInt(quantityInput.value) > 0) {
                    selectedProducts.push({
                        name: checkbox.value,
                        quantity: parseInt(quantityInput.value)
                    });
                }
            });

            if (selectedProducts.length === 0) {
                alert('Please select at least one product');
                return;
            }

            // Show success notification
            if (cartNotification) {
                const message = cartNotification.querySelector('p');
                if (message) {
                    message.textContent = 'Order placed successfully! We will contact you soon.';
                }
                cartNotification.classList.add('show');
                setTimeout(() => {
                    cartNotification.classList.remove('show');
                    if (message) {
                        message.textContent = 'Item added to cart!';
                    }
                }, 5000);
            }

            // Reset form
            this.reset();
            quantityInputs.forEach(input => input.value = 0);

            // In a real application, you would send this data to a server
            console.log('Order submitted:', {
                customer: Object.fromEntries(formData),
                products: selectedProducts
            });
        });
    }

    // Set minimum date for delivery to today
    const deliveryDateInput = document.getElementById('delivery-date');
    if (deliveryDateInput) {
        const today = new Date().toISOString().split('T')[0];
        deliveryDateInput.min = today;
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.product-card, .feature-card, .value-card, .team-member, .award-card, .info-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - scrolled / 600;
        }
    });

    // Initialize cart on page load
    loadCart();
});