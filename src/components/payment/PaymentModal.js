import React, { useState, useEffect } from 'react';
import StripePayment from '../../payment/StripePayment';
import { errorHandler, PaymentError, PaymentValidator } from '../../utils/ErrorHandling';
import './PaymentModal.css';

function PaymentModal({ isOpen, onClose, onPaymentSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [stripePayment, setStripePayment] = useState(null);
  const [paymentElement, setPaymentElement] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    name: ''
  });

  useEffect(() => {
    if (isOpen && !stripePayment) {
      initializeStripe();
    }
  }, [isOpen]);

  const initializeStripe = async () => {
    try {
      const stripe = new StripePayment();
      const initialized = await stripe.initialize();
      
      if (initialized) {
        setStripePayment(stripe);
        console.log('Stripe payment system ready');
      } else {
        setError('Failed to initialize payment system');
      }
    } catch (error) {
      console.error('Stripe initialization error:', error);
      setError('Payment system unavailable');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fallback methods for demo mode when Stripe is not available
  const processSimulatedPayment = async () => {
    // Validate form data
    try {
      PaymentValidator.validateEmail(formData.email);
      PaymentValidator.validateName(formData.name);
    } catch (validationError) {
      setError(validationError.message);
      errorHandler.logError(validationError, { 
        component: 'PaymentModal', 
        method: 'processSimulatedPayment',
        formData: { email: formData.email, name: formData.name }
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('Processing simulated payment...', formData);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate activation key
      const activationKey = generateActivationKey();
      
      // Store activation locally
      localStorage.setItem('stage-life-activation', JSON.stringify({
        email: formData.email,
        activationKey: activationKey,
        purchaseDate: new Date().toISOString(),
        deviceId: getDeviceFingerprint(),
        paymentMethod: 'demo'
      }));

      setIsProcessing(false);
      onPaymentSuccess(activationKey);
      onClose();
    } catch (error) {
      console.error('Simulated payment failed:', error);
      
      const paymentError = new PaymentError(
        'Payment simulation failed. Please try again.',
        'DEMO_PAYMENT_FAILED',
        { originalError: error.message }
      );
      
      errorHandler.logError(paymentError, { 
        component: 'PaymentModal', 
        method: 'processSimulatedPayment'
      });
      
      setIsProcessing(false);
      setError(paymentError.message);
    }
  };

  const processPayment = async () => {
    if (!stripePayment || !stripePayment.isReady) {
      setError('Payment system not ready');
      return;
    }

    // Validate form data
    try {
      PaymentValidator.validateEmail(formData.email);
      PaymentValidator.validateName(formData.name);
    } catch (validationError) {
      setError(validationError.message);
      errorHandler.logError(validationError, { 
        component: 'PaymentModal', 
        method: 'processPayment',
        formData: { email: formData.email, name: formData.name }
      });
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      console.log('Creating payment intent...');
      
      // Create payment intent
      const { clientSecret } = await stripePayment.createPaymentIntent(900, {
        customerEmail: formData.email,
        customerName: formData.name
      });

      console.log('Processing payment with Stripe...');
      
      // Process payment (this will use the simulated backend for now)
      const result = await stripePayment.processPayment(paymentElement, {
        email: formData.email,
        name: formData.name
      });

      if (result.success) {
        console.log('Payment successful!', result);
        
        setIsProcessing(false);
        onPaymentSuccess(result.activationKey);
        onClose();
      } else {
        throw new PaymentError('Payment processing failed', 'PAYMENT_FAILED');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      
      const paymentError = new PaymentError(
        error.message || 'Payment failed. Please try again.',
        error.code || 'UNKNOWN_ERROR',
        { 
          customerEmail: formData.email,
          amount: 900,
          originalError: error
        }
      );
      
      errorHandler.logError(paymentError, { 
        component: 'PaymentModal', 
        method: 'processPayment'
      });
      
      setError(paymentError.message);
      setIsProcessing(false);
    }
  };

  const generateActivationKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) result += '-';
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getDeviceFingerprint = () => {
    const navigator_info = navigator.userAgent + navigator.language + screen.width + screen.height;
    return btoa(navigator_info).substring(0, 16);
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal glass-effect">
        <div className="modal-header">
          <h2>Get Stage-Life Professional</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="payment-content">
          <div className="product-summary">
            <h3>Stage-Life Professional</h3>
            <p>Professional live performance recording, mixing, and mastering solution</p>
            <div className="price">$9.00 USD</div>
            <div className="features-list">
              <div className="feature-item">✅ Unlimited recordings</div>
              <div className="feature-item">✅ Logic Pro plugin</div>
              <div className="feature-item">✅ AI-powered processing</div>
              <div className="feature-item">✅ Multi-platform support</div>
              <div className="feature-item">✅ Lifetime license</div>
            </div>
          </div>

          <div className="payment-form">
            <div className="payment-methods">
              <label className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                💳 Credit Card
              </label>
              <label className={`payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}>
                <input
                  type="radio"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                🔵 PayPal
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                {error && (
                  <div className="error-message">
                    ⚠️ {error}
                  </div>
                )}

                {stripePayment && stripePayment.isReady ? (
                  <div className="stripe-form">
                    <p className="payment-info">
                      💳 Secure payment powered by Stripe
                    </p>
                    <div id="stripe-payment-element">
                      {/* Stripe Elements would be mounted here in production */}
                      <div className="stripe-placeholder">
                        <p>🔒 Stripe payment form would appear here</p>
                        <p>Currently using demo mode</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="demo-mode-notice">
                    <p>🧪 Demo Mode - No real payment required</p>
                    <p>Click purchase to simulate activation</p>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="paypal-info">
                <p>You will be redirected to PayPal to complete your payment.</p>
              </div>
            )}

            <button 
              className="purchase-button"
              onClick={stripePayment && stripePayment.isReady ? processPayment : processSimulatedPayment}
              disabled={isProcessing || !formData.email || !formData.name}
            >
              {isProcessing ? (
                <span>
                  <span className="spinner"></span>
                  Processing Payment...
                </span>
              ) : (
                stripePayment && stripePayment.isReady ? 
                  `Purchase Stage-Life - ${stripePayment.formattedAmount}` :
                  `Demo Purchase - $9.00`
              )}
            </button>

            <div className="security-info">
              <div className="security-item">🔒 Secure SSL encryption</div>
              <div className="security-item">✅ 30-day money-back guarantee</div>
              <div className="security-item">📱 Instant activation</div>
              {stripePayment && stripePayment.isReady && (
                <div className="security-item">💳 Powered by Stripe</div>
              )}
              {(!stripePayment || !stripePayment.isReady) && (
                <div className="security-item">🧪 Demo mode active</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;