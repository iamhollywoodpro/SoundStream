import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Music, Building, Users, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ mode: initialMode, onClose, onSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    userType: 'artist' as 'listener' | 'artist' | 'label',
    subscription: 'free' as 'free' | 'pro' | 'pro_plus' | 'elite'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleUserTypeSelect = (userType: 'listener' | 'artist' | 'label') => {
    setFormData(prev => ({ ...prev, userType }));
    if (mode === 'signup') {
      setStep(2);
    }
  };

  const handleSubscriptionSelect = (subscription: 'free' | 'pro' | 'pro_plus' | 'elite') => {
    setFormData(prev => ({ ...prev, subscription }));
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        // TODO: Implement actual signup API call
        console.log('Signing up user:', formData);
        
        setTimeout(() => {
          onSuccess();
          setIsLoading(false);
        }, 1000);
      } else {
        // TODO: Implement actual signin API call
        console.log('Signing in user:', { email: formData.email, password: formData.password });
        
        setTimeout(() => {
          onSuccess();
          setIsLoading(false);
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsLoading(false);
    }
  };

  const userTypeOptions = [
    {
      type: 'listener' as const,
      title: 'Music Lover',
      description: 'Discover and support amazing artists',
      icon: <Users size={32} />,
      features: ['Discover new music', 'Support artists', 'Exclusive content', 'Community features']
    },
    {
      type: 'artist' as const,
      title: 'Artist/Producer/Songwriter',
      description: 'Create, analyze, and monetize your music',
      icon: <Music size={32} />,
      features: ['AI A&R analysis', 'Career guidance', 'Sync opportunities', 'Revenue optimization']
    },
    {
      type: 'label' as const,
      title: 'Record Label',
      description: 'Discover talent and manage your roster',
      icon: <Building size={32} />,
      features: ['Talent discovery', 'Roster management', 'Market analytics', 'A&R intelligence']
    }
  ];

  const subscriptionOptions = [
    {
      tier: 'free' as const,
      name: 'Free',
      price: '$0/month',
      split: '70/30 Revenue Split',
      popular: false
    },
    {
      tier: 'pro' as const,
      name: 'Pro',
      price: '$19/month',
      split: '100% Artist Royalties',
      popular: false
    },
    {
      tier: 'pro_plus' as const,
      name: 'Pro+',
      price: '$49/month',
      split: '100% Artist Royalties',
      popular: true
    },
    {
      tier: 'elite' as const,
      name: 'Elite',
      price: '$99/month',
      split: '100% Artist Royalties',
      popular: false
    }
  ];

  // Get current step for display
  const getCurrentStep = () => {
    if (mode === 'signin') return 0;
    if (step === 1) return 1;
    if (step === 2) return 2;
    if (step === 3) return 3;
    return 4;
  };

  const stepLabels = [
    'Choose Your Role',
    'Select Your Plan', 
    'Create Account',
    'Start Streaming'
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="auth-modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="auth-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="auth-modal-close" onClick={onClose}>
            <X size={24} />
          </button>

          {/* Step Indicator - Only show for signup */}
          {mode === 'signup' && (
            <div className="step-indicator">
              {stepLabels.map((label, index) => (
                <div key={index} className={`step ${index + 1 <= getCurrentStep() ? 'active' : ''} ${index + 1 === getCurrentStep() ? 'current' : ''}`}>
                  <div className="step-number">{index + 1}</div>
                  <div className="step-label">{label}</div>
                </div>
              ))}
            </div>
          )}

          <div className="auth-modal-content">
            {mode === 'signin' || step === 3 ? (
              <div className="auth-form-container">
                <div className="auth-header">
                  <h2>{mode === 'signin' ? 'Welcome Back!' : 'Complete Your Account'}</h2>
                  <p>{mode === 'signin' ? 'Sign in to your SoundStream account' : 'Just a few details to get started'}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  {mode === 'signup' && (
                    <div className="form-group">
                      <label>Full Name</label>
                      <div className="input-wrapper">
                        <User size={20} />
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                      <Mail size={20} />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                      <Lock size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <div className="input-wrapper">
                        <Lock size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="auth-submit-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <div className="auth-switch">
                  {mode === 'signin' ? (
                    <p>
                      Don't have an account?{' '}
                      <button onClick={() => setMode('signup')}>Sign up here</button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{' '}
                      <button onClick={() => setMode('signin')}>Sign in here</button>
                    </p>
                  )}
                </div>
              </div>
            ) : step === 1 ? (
              <div className="user-type-selection">
                <div className="auth-header">
                  <h2>Choose Your Journey</h2>
                  <p>Select your role to get a personalized SoundStream experience</p>
                </div>

                <div className="user-type-grid">
                  {userTypeOptions.map((option) => (
                    <motion.div
                      key={option.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`user-type-card ${formData.userType === option.type ? 'selected' : ''}`}
                      onClick={() => handleUserTypeSelect(option.type)}
                    >
                      <div className="user-type-icon">
                        {option.icon}
                      </div>
                      <h3>{option.title}</h3>
                      <p>{option.description}</p>
                      <ul className="user-type-features">
                        {option.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="subscription-selection">
                <div className="auth-header">
                  <h2>Choose Your Plan</h2>
                  <p>Select the subscription tier that fits your needs</p>
                </div>

                <div className="subscription-grid">
                  {subscriptionOptions.map((option) => (
                    <motion.div
                      key={option.tier}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`subscription-card ${option.popular ? 'popular' : ''} ${formData.subscription === option.tier ? 'selected' : ''}`}
                      onClick={() => handleSubscriptionSelect(option.tier)}
                    >
                      {option.popular && <div className="popular-badge">Most Popular</div>}
                      <h3>{option.name}</h3>
                      <div className="subscription-price">{option.price}</div>
                      <div className="subscription-split">{option.split}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="subscription-note">
                  <p>💎 All plans include 100% royalty retention • Cancel anytime • 14-day money-back guarantee</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Header Component (replace the existing Header component)
export const Header: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleLogin = () => {
    setAuthMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleGetStarted = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    console.log('Authentication successful!');
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <div className="waveform">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
              </div>
            </div>
            <span className="logo-text">SoundStream</span>
          </div>

          <nav className="nav-buttons">
            <button 
              className="login-button"
              onClick={handleLogin}
            >
              Login
            </button>
            <button 
              className="get-started-button"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {isAuthModalOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};

export default AuthModal;