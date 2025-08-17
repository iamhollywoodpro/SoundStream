import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Star, 
  TrendingUp, 
  Users, 
  Music, 
  Shield, 
  Check, 
  ArrowRight,
  Zap
} from 'lucide-react';
import AuthModal from './AuthModal';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const handleGetStarted = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-overlay"></div>
        </div>
        
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <div className="hero-badge">
              <Star size={16} />
              <span>Revolutionary AI Music Intelligence</span>
            </div>
            
            <h1 className="hero-title">
              Turn Your Music Into
              <span className="highlight"> Chart-Topping Hits</span>
            </h1>
            
            <p className="hero-subtitle">
              Three powerful AI systems analyze your tracks for hit potential, 
              manage your career strategy, and connect you to sync opportunities 
              worth up to $100K per placement.
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <TrendingUp size={24} />
                <span className="stat-number">95%</span>
                <span className="stat-label">Hit Prediction Accuracy</span>
              </div>
              <div className="stat-item">
                <Users size={24} />
                <span className="stat-number">50K+</span>
                <span className="stat-label">Artists Served</span>
              </div>
              <div className="stat-item">
                <Music size={24} />
                <span className="stat-number">$2M+</span>
                <span className="stat-label">Revenue Generated</span>
              </div>
            </div>
            
            <div className="hero-actions">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cta-button primary large"
                onClick={() => handleGetStarted('signup')}
              >
                <Play size={20} />
                Start Your Journey
                <ArrowRight size={20} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cta-button secondary large"
                onClick={() => handleGetStarted('signin')}
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-visual"
          >
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="preview-content">
                <div className="preview-chart">
                  <div className="chart-bars">
                    <div className="bar" style={{height: '60%'}}></div>
                    <div className="bar" style={{height: '80%'}}></div>
                    <div className="bar" style={{height: '45%'}}></div>
                    <div className="bar" style={{height: '90%'}}></div>
                    <div className="bar" style={{height: '70%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2>Revolutionary AI Music Intelligence</h2>
            <p>Three powerful AI systems working together to transform your music career</p>
          </motion.div>

          <div className="features-grid">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="feature-card ai-ar"
            >
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>AI A&R Analysis</h3>
              <p>
                Advanced Billboard algorithm analyzes your tracks for hit potential, 
                compares to chart data, and predicts commercial success with 95% accuracy.
              </p>
              <ul className="feature-list">
                <li><Check size={16} />Hit potential scoring (0-100%)</li>
                <li><Check size={16} />Billboard chart comparison</li>
                <li><Check size={16} />Market trend analysis</li>
                <li><Check size={16} />Success timeline prediction</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="feature-card ai-manager"
            >
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>AI Career Manager</h3>
              <p>
                Your personal AI manager provides strategic career guidance, monetization 
                strategies, and industry connections based on your music's potential.
              </p>
              <ul className="feature-list">
                <li><Check size={16} />Personalized career roadmaps</li>
                <li><Check size={16} />Revenue optimization strategies</li>
                <li><Check size={16} />Social media growth tactics</li>
                <li><Check size={16} />Collaboration opportunities</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="feature-card sync-engine"
            >
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Sync Placement Engine</h3>
              <p>
                Automated sync opportunity matching connects your music to TV, film, 
                commercials, and games with revenue potential up to $100K per placement.
              </p>
              <ul className="feature-list">
                <li><Check size={16} />Real-time opportunity matching</li>
                <li><Check size={16} />Automated submission process</li>
                <li><Check size={16} />Revenue tracking & analytics</li>
                <li><Check size={16} />Success probability scoring</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2>Choose Your Success Level</h2>
            <p>Artist-first pricing with the highest revenue splits in the industry</p>
          </motion.div>

          <div className="pricing-grid">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="pricing-card free"
            >
              <div className="pricing-header">
                <h3>Free</h3>
                <div className="price">$0<span>/month</span></div>
                <div className="revenue-split">20/80 Revenue Split</div>
              </div>
              <ul className="pricing-features">
                <li><Check size={16} />Basic streaming access</li>
                <li><Check size={16} />Profile creation</li>
                <li><Check size={16} />Playlist creation</li>
                <li><Check size={16} />100% royalties kept</li>
              </ul>
              <button className="pricing-button" onClick={() => handleGetStarted('signup')}>
                Get Started Free
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pricing-card pro"
            >
              <div className="pricing-header">
                <h3>Pro</h3>
                <div className="price">$19<span>/month</span></div>
                <div className="revenue-split">30/70 Revenue Split</div>
              </div>
              <ul className="pricing-features">
                <li><Check size={16} />Enhanced analytics</li>
                <li><Check size={16} />Basic promotional tools</li>
                <li><Check size={16} />Educational content access</li>
                <li><Check size={16} />AI track analysis</li>
                <li><Check size={16} />100% royalties kept</li>
              </ul>
              <button className="pricing-button" onClick={() => handleGetStarted('signup')}>
                Upgrade to Pro
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pricing-card pro-plus popular"
            >
              <div className="popular-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Pro+</h3>
                <div className="price">$49<span>/month</span></div>
                <div className="revenue-split">40/60 Revenue Split</div>
              </div>
              <ul className="pricing-features">
                <li><Check size={16} />Advanced analytics</li>
                <li><Check size={16} />AI A&R support</li>
                <li><Check size={16} />Marketing tools</li>
                <li><Check size={16} />Collaborative features</li>
                <li><Check size={16} />Sync opportunity access</li>
                <li><Check size={16} />100% royalties kept</li>
              </ul>
              <button className="pricing-button" onClick={() => handleGetStarted('signup')}>
                Choose Pro+
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pricing-card elite"
            >
              <div className="pricing-header">
                <h3>Elite</h3>
                <div className="price">$99<span>/month</span></div>
                <div className="revenue-split">50/50 Revenue Split</div>
              </div>
              <ul className="pricing-features">
                <li><Check size={16} />Full AI Manager Suite</li>
                <li><Check size={16} />Priority platform placement</li>
                <li><Check size={16} />Advanced fan engagement</li>
                <li><Check size={16} />Complete marketing tools</li>
                <li><Check size={16} />Direct label connections</li>
                <li><Check size={16} />100% royalties kept</li>
              </ul>
              <button className="pricing-button" onClick={() => handleGetStarted('signup')}>
                Go Elite
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="cta-content"
          >
            <h2>Ready to Transform Your Music Career?</h2>
            <p>Join thousands of artists already using AI to create chart-topping hits</p>
            <div className="cta-actions">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cta-button primary large"
                onClick={() => handleGetStarted('signup')}
              >
                <Star size={20} />
                Start Your Journey
                <ArrowRight size={20} />
              </motion.button>
            </div>
            <div className="cta-guarantee">
              <Shield size={16} />
              <span>14-day money-back guarantee • No commitment • Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            navigate('/dashboard');
          }}
        />
      )}
    </div>
  );
};

export default LandingPage;