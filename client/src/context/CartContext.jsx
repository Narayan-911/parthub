import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'parthub_cart_items';

export const CartProvider = ({ children }) => {
  // Initialize cartItems from localStorage, conforming to [{ product, quantity }] schema
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);

      // Sanitize & migrate to [{ product, quantity }] structure
      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          if (item && item.product && item.product._id) {
            return {
              product: item.product,
              quantity: Math.max(1, Number(item.quantity) || 1),
            };
          }
          // Backwards compatibility migration if stored as flat item
          if (item && item._id) {
            return {
              product: {
                _id: item._id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                category: item.category,
                stock: item.stock,
              },
              quantity: Math.max(1, Number(item.quantity) || 1),
            };
          }
          return null;
        }).filter(Boolean);
      }
      return [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  });

  // Sync cartItems state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error writing cart to localStorage:', error);
    }
  }, [cartItems]);

  /**
   * Add a product to the cart or increment quantity if already present
   * @param {Object} product - Product document { _id, name, price, imageUrl, ... }
   * @param {number} quantity - Quantity to add (default 1)
   */
  const addToCart = (product, quantity = 1) => {
    const qtyToAdd = Math.max(1, Number(quantity) || 1);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingIndex > -1) {
        // Increment existing item quantity
        return prevItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }

      // Add new item adhering to [{ product, quantity }] schema
      return [
        ...prevItems,
        {
          product: {
            _id: product._id,
            name: product.name,
            price: Number(product.price) || 0,
            imageUrl: product.imageUrl,
            category: product.category,
            stock: product.stock,
          },
          quantity: qtyToAdd,
        },
      ];
    });
  };

  /**
   * Remove item from cart by productId
   * @param {string} productId - Product ID
   */
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product._id !== productId)
    );
  };

  /**
   * Modify quantity directly with minimum threshold of 1
   * @param {string} productId - Product ID
   * @param {number} quantity - New quantity (enforced min: 1)
   */
  const updateQuantity = (productId, quantity) => {
    const newQty = Math.max(1, Number(quantity) || 1);

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  /**
   * Clear all items from the cart upon checkout
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Derived total item count in cart
   */
  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  /**
   * Derived total price of all items in cart
   */
  const cartTotal = cartItems.reduce(
    (total, item) => total + (Number(item.product.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
