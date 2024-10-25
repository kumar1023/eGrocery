document.addEventListener('DOMContentLoaded', () => {
    const cartCount = document.querySelector('.cart span');
    const wishlistCount = document.querySelector('.like span');
    let cartItems = 0;
    let wishlistItems = 0;

    const cartItemsContainer = document.getElementById('cart-items');
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    const totalAmountSpan = document.getElementById('total-amount');

    const imagePath = 'images\\'; // Path to images

    function addItemToCart(item) {
        const existingItem = cartItemsContainer.querySelector(`.cart-item[data-name="${item.name}"]`);
        if (existingItem) {
            const quantitySpan = existingItem.querySelector('.quantity span');
            const currentQuantity = parseInt(quantitySpan.textContent, 10);
            quantitySpan.textContent = currentQuantity + 1;
            const priceSpan = existingItem.querySelector('.total-price');
            priceSpan.textContent = (item.price * (currentQuantity + 1)).toFixed(2);
        } else {
            const cartItemHTML = `
                <div class="cart-item" data-name="${item.name}" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                    <div>${item.name}</div>
                    <div class="price">${item.price.toFixed(2)}</div>
                    <div class="quantity" style="display: flex; align-items: center;">
                        <button class="quantity-btn increase" style="margin-right: 5px;">+</button>
                        <span>1</span>
                        <button class="quantity-btn decrease" style="margin-left: 5px;">-</button>
                    </div>
                    <div class="total-price">${item.price.toFixed(2)}</div>
                    <button class="remove-btn" style="margin-left: 10px;">×</button>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        }
        updateTotalAmount();
    }

    function addItemToWishlist(item) {
        const existingItem = wishlistItemsContainer.querySelector(`.wishlist-item[data-name="${item.name}"]`);
        if (!existingItem) {
            const wishlistItemHTML = `
                <div class="wishlist-item" data-name="${item.name}" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                    <div>${item.name}</div>
                    <div>${item.price.toFixed(2)}</div>
                    <button class="remove-btn" style="margin-left: 10px;">×</button>
                </div>
            `;
            wishlistItemsContainer.insertAdjacentHTML('beforeend', wishlistItemHTML);
        }
    }

    function updateTotalAmount() {
        const cartItems = cartItemsContainer.querySelectorAll('.cart-item');
        let totalAmount = 0;
        cartItems.forEach(item => {
            const itemPrice = parseFloat(item.querySelector('.total-price').textContent);
            totalAmount += itemPrice;
        });
        totalAmountSpan.textContent = totalAmount.toFixed(2);
    }

    // Add event listeners to cart buttons
    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productBox = btn.closest('.product-box');
            const productName = productBox.querySelector('strong').textContent;
            const productPrice = parseInt(productBox.querySelector('.price').textContent.replace('$', ''), 10);
            const productImage = imagePath + productName.toLowerCase() + '.png';

            cartItems += 1;
            cartCount.textContent = cartItems;

            addItemToCart({ name: productName, price: productPrice, image: productImage });
        }, { once: true });
    });

    // Add event listeners to wishlist buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productBox = btn.closest('.product-box');
            const productName = productBox.querySelector('strong').textContent;
            const productPrice = parseInt(productBox.querySelector('.price').textContent.replace('$', ''), 10);
            const productImage = imagePath + productName.toLowerCase() + '.png';

            wishlistItems += 1;
            wishlistCount.textContent = wishlistItems;

            addItemToWishlist({ name: productName, price: productPrice, image: productImage });
        }, { once: true });
    });

    // Search functionality
    const searchForm = document.querySelector('.search-box');
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchForm.search.value.toLowerCase();
        const products = document.querySelectorAll('.product-box');

        products.forEach(product => {
            const productName = product.querySelector('strong').textContent.toLowerCase();
            if (productName.includes(query)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });

    // Category filter functionality
    const categoryLinks = document.querySelectorAll('#category .category-box');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.querySelector('span').textContent.toLowerCase();
            const products = document.querySelectorAll('.product-box');

            products.forEach(product => {
                const productCategory = product.querySelector('.quantity').textContent.toLowerCase();
                if (productCategory.includes(category)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    // Open and close popup functions
    const cartPopup = document.getElementById('cart-popup');
    const wishlistPopup = document.getElementById('wishlist-popup');

    function openPopup(popup) {
        popup.style.display = 'block';
    }

    function closePopup(popup) {
        popup.style.display = 'none';
    }

    document.querySelectorAll('.cart').forEach(btn => {
        btn.addEventListener('click', () => openPopup(cartPopup));
    });

    document.querySelectorAll('.like').forEach(btn => {
        btn.addEventListener('click', () => openPopup(wishlistPopup));
    });

    document.querySelectorAll('.close').forEach(span => {
        span.addEventListener('click', () => {
            closePopup(cartPopup);
            closePopup(wishlistPopup);
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == cartPopup) closePopup(cartPopup);
        if (event.target == wishlistPopup) closePopup(wishlistPopup);
    });

    // Add functionality for quantity buttons and remove button
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-btn')) {
            const cartItem = e.target.closest('.cart-item');
            const quantitySpan = cartItem.querySelector('.quantity span');
            let quantity = parseInt(quantitySpan.textContent, 10);
            if (e.target.classList.contains('increase')) {
                quantity += 1;
            } else if (e.target.classList.contains('decrease')) {
                quantity -= 1;
                if (quantity < 1) quantity = 1;
            }
            quantitySpan.textContent = quantity;
            const price = parseFloat(cartItem.querySelector('.price').textContent);
            cartItem.querySelector('.total-price').textContent = (price * quantity).toFixed(2);
            updateTotalAmount();
        } else if (e.target.classList.contains('remove-btn')) {
            e.target.closest('.cart-item').remove();
            cartItems -= 1;
            cartCount.textContent = cartItems;
            updateTotalAmount();
        }
    });

    wishlistItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            e.target.closest('.wishlist-item').remove();
            wishlistItems -= 1;
            wishlistCount.textContent = wishlistItems;
        }
    });

    // Add functionality for clear cart and place order buttons
    document.getElementById('clear-cart').addEventListener('click', () => {
        cartItemsContainer.innerHTML = '';
        totalAmountSpan.textContent = '0.00';
        cartCount.textContent = 0;
        cartItems = 0;
    });

    document.getElementById('place-order').addEventListener('click', () => {
        if (cartItems > 0) {
            alert('Order placed successfully!');
            cartItemsContainer.innerHTML = '';
            totalAmountSpan.textContent = '0.00';
            cartCount.textContent = 0;
            cartItems = 0;
        } else {
            alert('Cart is empty! Add items to the cart before placing an order.');
        }
    });
});
