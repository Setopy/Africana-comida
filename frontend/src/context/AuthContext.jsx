function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/:id" element={<MenuItem />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reviews" element={<Reviews />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute element={<Dashboard />} />} />
            <Route path="/admin/menu" element={<AdminRoute element={<AdminMenu />} />} />
            <Route path="/admin/orders" element={<AdminRoute element={<AdminOrders />} />} />
            <Route path="/admin/reviews" element={<AdminRoute element={<AdminReviews />} />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;