import React, { useState, useEffect, Component, ErrorInfo } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CoinWalletProvider } from './context/CoinWalletContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HygieneAdvisorModal } from './components/HygieneAdvisorModal';
import { testConnection } from './lib/firebase';
import { Sparkles, RefreshCw } from 'lucide-react';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { BulkOrderPage } from './pages/BulkOrderPage';
import { OffersPage } from './pages/OffersPage';
import { HygieneAdvisorPage } from './pages/HygieneAdvisorPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { PrivacyPolicyPage, TermsPage, ShippingPolicyPage, ReturnsPolicyPage } from './pages/PolicyPages';
import { SearchPage } from './pages/SearchPage';
import { AdminPage } from './pages/admin/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Robust Error Boundary to prevent white screen / blank page crashes
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WiZ App caught an error in ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-['Inter',sans-serif]">
          <div className="bg-white p-8 max-w-md w-full border border-gray-200 shadow-xl rounded-none">
            <div className="w-12 h-12 mx-auto bg-purple-50 text-[#7a49a6] flex items-center justify-center rounded-full mb-4">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              WiZ Hygiene &amp; Personal Care
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              The application encountered a temporary display issue.
            </p>
            <button
              onClick={this.handleReload}
              className="mt-6 w-full bg-[#7a49a6] hover:bg-black text-white py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Scroll to top on navigation helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [advisorOpen, setAdvisorOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <div className="flex-1">{children}</div>
      {!isAdminRoute && <Footer />}

      {/* Floating AI Hygiene Advisor Pill */}
      {!isAdminRoute && (
        <button
          onClick={() => setAdvisorOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#7a49a6] hover:bg-[#5f3786] text-white py-2.5 px-4 shadow-xl border border-white/20 flex items-center space-x-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          title="Ask WiZ AI Hygiene Advisor"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>Hygiene Advisor</span>
        </button>
      )}

      {/* AI Advisor Modal */}
      <HygieneAdvisorModal isOpen={advisorOpen} onClose={() => setAdvisorOpen(false)} />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    // Sanitize any malformed, repetitive, or lingering /docs hashes
    if (typeof window !== 'undefined' && window.location.hash) {
      if (window.location.hash.includes('docs') || (window.location.hash.match(/#/g) || []).length > 1) {
        window.history.replaceState(null, '', window.location.pathname + '#/');
      }
    }
    testConnection();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <CoinWalletProvider>
            <Router>
              <ScrollToTop />
              <MainLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/docs" element={<HomePage />} />
                  <Route path="/dist-static" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
                  <Route path="/bulk-order" element={<BulkOrderPage />} />
                  <Route path="/offers" element={<OffersPage />} />
                  <Route path="/advisor" element={<HygieneAdvisorPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faqs" element={<FaqPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                  <Route path="/returns-policy" element={<ReturnsPolicyPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </MainLayout>
            </Router>
          </CoinWalletProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
