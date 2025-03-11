mkdir -p 
frontend/src/{context,config,components/{layout,ui,auth,menu},pages} && \
touch frontend/src/main.jsx \
      frontend/src/App.jsx \
      frontend/src/context/AuthContext.jsx \
      frontend/src/context/CartContext.jsx \
      frontend/src/config/constants.js \
      frontend/src/components/layout/Navbar.jsx \
      frontend/src/components/layout/Footer.jsx \
      frontend/src/components/ui/Loading.jsx \
      frontend/src/components/auth/ProtectedRoute.jsx \
      frontend/src/components/auth/AdminRoute.jsx \
      frontend/src/components/menu/MenuCard.jsx \
      frontend/src/pages/Home.jsx \
      frontend/src/pages/Menu.jsx \
      frontend/src/pages/Cart.jsx \
      frontend/src/pages/Checkout.jsx \
      frontend/src/pages/OrderConfirmation.jsx
