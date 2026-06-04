const accountKey = 'pnjhostUser';

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(accountKey) || 'null');
}

function getCartKey() {
  const user = getCurrentUser();
  return user ? `cart_${user.email}` : 'cart_guest';
}

function getCart() {
  return JSON.parse(localStorage.getItem(getCartKey()) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}

function mergeGuestCart() {
  const user = getCurrentUser();
  if (!user) {
    return;
  }

  const guestCart = JSON.parse(localStorage.getItem('cart_guest') || '[]');
  if (!guestCart.length) {
    return;
  }

  const userCartKey = `cart_${user.email}`;
  const currentCart = JSON.parse(localStorage.getItem(userCartKey) || '[]');

  guestCart.forEach(guestItem => {
    const existing = currentCart.find(item => item.planId === guestItem.planId && item.specs === guestItem.specs);
    if (existing) {
      existing.quantity = (existing.quantity || 0) + (guestItem.quantity || 1);
    } else {
      currentCart.push(guestItem);
    }
  });

  localStorage.setItem(userCartKey, JSON.stringify(currentCart));
  localStorage.removeItem('cart_guest');
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

function updateCartCount() {
  const totalItems = getCartCount();
  const panierLink = document.querySelector('a[href="panier.html"]');
  if (panierLink) {
    panierLink.setAttribute('data-count', totalItems || '');
  }
}

function clearCart() {
  localStorage.removeItem(getCartKey());
}
