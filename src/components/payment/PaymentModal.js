import React, { useState } from 'react';
import './PaymentModal.css';

function PaymentModal({ isOpen, onClose, onPaymentSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      // In production, this would integrate with Stripe
      console.log('Processing payment for Stage-Life...', formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate device activation key
      const activationKey = generateActivationKey();
      
      // Store activation locally (in production, this would be server-validated)
      localStorage.setItem('stage-life-activation', JSON.stringify({
        email: formData.email,
        activationKey: activationKey,
        purchaseDate: new Date().toISOString(),
        deviceId: getDeviceFingerprint()
      }));

      setIsProcessing(false);
      onPaymentSuccess(activationKey);
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
      alert('Payment failed. Please try again.');
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
    // Simple device fingerprint for demo
    const navigator_info = navigator.userAgent + navigator.language + screen.width + screen.height;
    return btoa(navigator_info).substring(0, 16);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData({ ...formData, cardNumber: formatted });
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
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="paypal-info">
                <p>You will be redirected to PayPal to complete your payment.</p>
              </div>
            )}

            <button 
              className="purchase-button"
              onClick={processPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span>
                  <span className="spinner"></span>
                  Processing Payment...
                </span>
              ) : (
                `Purchase Stage-Life - $9.00`
              )}
            </button>

            <div className="security-info">
              <div className="security-item">🔒 Secure SSL encryption</div>
              <div className="security-item">✅ 30-day money-back guarantee</div>
              <div className="security-item">📱 Instant activation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;