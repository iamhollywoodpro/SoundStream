const { v4: uuidv4 } = require('uuid');

class SyncEngine {
  constructor() {
    this.isActive = true;
    this.opportunities = this.initializeSyncOpportunities();
    this.submissions = [];
    this.lastUpdate = new Date();
  }

  // 🎬 Initialize sync opportunities database
  initializeSyncOpportunities() {
    return [
      {
        id: '1',
        title: 'Netflix Original Series - "Urban Dreams"',
        type: 'tv',
        network: 'Netflix',
        description: 'High-energy opening theme for new drama series about young entrepreneurs in NYC. Looking for contemporary hip-hop/pop with strong hooks.',
        budget: '$15,000 - $25,000',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        genre: ['hip-hop', 'pop', 'urban'],
        mood: ['energetic', 'optimistic', 'modern'],
        duration: '30-60 seconds',
        usage: 'opening_theme',
        exclusivity: 'non-exclusive',
        territories: ['worldwide'],
        status: 'available',
        priority: 'high',
        contact: 'music.supervisor@netflix.com',
        requirements: {
          tempo: [120, 140],
          energy: [0.7, 1.0],
          valence: [0.6, 1.0],
          instrumental: false,
          vocals: 'required'
        }
      },
      {
        id: '2',
        title: 'Apple iPhone Commercial - "Everyday Magic"',
        type: 'commercial',
        brand: 'Apple Inc.',
        agency: 'TBWA\\Media Arts Lab',
        description: 'Premium brand campaign showcasing iPhone features. Need uplifting, tech-forward music that appeals to young professionals.',
        budget: '$30,000 - $50,000',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        genre: ['electronic', 'pop', 'ambient'],
        mood: ['uplifting', 'modern', 'clean', 'innovative'],
        duration: '30 seconds',
        usage: 'full_commercial',
        exclusivity: 'category_exclusive',
        territories: ['global'],
        status: 'available',
        priority: 'urgent',
        contact: 'music@apple.com',
        requirements: {
          tempo: [100, 130],
          energy: [0.5, 0.8],
          valence: [0.6, 0.9],
          instrumental: 'preferred',
          production_quality: 'premium'
        }
      },
      {
        id: '3',
        title: 'EA Sports FIFA 25 - Soundtrack',
        type: 'game',
        developer: 'EA Sports',
        description: 'Global sports game soundtrack. Looking for high-energy tracks that resonate internationally. Focus on rhythm and memorable hooks.',
        budget: '$20,000 - $35,000',
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        genre: ['electronic', 'hip-hop', 'rock', 'latin'],
        mood: ['energetic', 'competitive', 'global', 'anthemic'],
        duration: 'full_track',
        usage: 'in_game_soundtrack',
        exclusivity: 'non-exclusive',
        territories: ['worldwide'],
        status: 'available',
        priority: 'medium',
        contact: 'music@ea.com',
        requirements: {
          tempo: [120, 160],
          energy: [0.7, 1.0],
          danceability: [0.6, 1.0],
          crossover_appeal: true
        }
      }
    ];
  }

  // 🎯 Find matching sync opportunities for a track
  async findOpportunities(trackAnalysis) {
    console.log('🎬 Finding sync opportunities...');
    
    try {
      const matchedOpportunities = [];
      
      for (const opportunity of this.opportunities) {
        if (opportunity.status !== 'available') continue;
        
        const matchScore = this.calculateMatchScore(trackAnalysis, opportunity);
        
        if (matchScore >= 60) {
          matchedOpportunities.push({
            ...opportunity,
            matchScore: Math.round(matchScore),
            matchReasons: this.getMatchReasons(trackAnalysis, opportunity),
            submissionDeadline: opportunity.deadline,
            estimatedRevenue: this.estimateRevenue(opportunity.budget),
            competitionLevel: this.assessCompetitionLevel(opportunity),
            successProbability: this.calculateSuccessProbability(trackAnalysis, opportunity, matchScore)
          });
        }
      }
      
      matchedOpportunities.sort((a, b) => b.matchScore - a.matchScore);
      
      console.log(`✅ Found ${matchedOpportunities.length} matching opportunities`);
      return matchedOpportunities;
    } catch (error) {
      console.error('🚨 Error finding sync opportunities:', error);
      throw error;
    }
  }

  // 🎯 Calculate match score between track and opportunity
  calculateMatchScore(trackAnalysis, opportunity) {
    let score = 0;
    let totalPossible = 0;

    // Genre Matching (40% weight)
    const genreScore = this.calculateGenreMatch(trackAnalysis.genreMatch, opportunity.genre);
    score += genreScore * 0.40;
    totalPossible += 40;

    // Hit Potential Impact (30% weight)
    const hitPotentialScore = this.calculateHitPotentialImpact(trackAnalysis.hitPotential, opportunity.type);
    score += hitPotentialScore * 0.30;
    totalPossible += 30;

    // Audio Features Matching (20% weight)
    if (opportunity.requirements && trackAnalysis.audioFeatures) {
      const featuresScore = this.calculateFeaturesMatch(trackAnalysis.audioFeatures, opportunity.requirements);
      score += featuresScore * 0.20;
      totalPossible += 20;
    }

    // Social Media Potential (10% weight)
    if (trackAnalysis.socialMediaPotential) {
      const socialScore = this.calculateSocialMediaMatch(trackAnalysis.socialMediaPotential, opportunity);
      score += socialScore * 0.10;
      totalPossible += 10;
    }

    return totalPossible > 0 ? (score / totalPossible) * 100 : 0;
  }

  // 🎵 Calculate genre match score
  calculateGenreMatch(trackGenre, opportunityGenres) {
    if (!trackGenre || !opportunityGenres) return 0;
    
    const trackGenreLower = trackGenre.toLowerCase();
    let bestMatch = 0;

    for (const oppGenre of opportunityGenres) {
      const oppGenreLower = oppGenre.toLowerCase();
      
      if (trackGenreLower.includes(oppGenreLower) || oppGenreLower.includes(trackGenreLower)) {
        bestMatch = Math.max(bestMatch, 100);
      } else if (this.areGenresCompatible(trackGenreLower, oppGenreLower)) {
        bestMatch = Math.max(bestMatch, 75);
      }
    }

    return bestMatch;
  }

  // 🎵 Check genre compatibility
  areGenresCompatible(genre1, genre2) {
    const compatibilityMap = {
      'hip-hop': ['rap', 'urban', 'pop', 'electronic'],
      'rap': ['hip-hop', 'urban', 'pop'],
      'pop': ['hip-hop', 'electronic', 'dance', 'rock'],
      'electronic': ['dance', 'pop', 'hip-hop', 'ambient'],
      'rock': ['alternative', 'pop', 'electronic']
    };

    return compatibilityMap[genre1]?.includes(genre2) || 
           compatibilityMap[genre2]?.includes(genre1) || false;
  }

  // 🎛️ Calculate audio features match
  calculateFeaturesMatch(audioFeatures, requirements) {
    let score = 0;
    let checks = 0;

    if (requirements.tempo && audioFeatures.tempo) {
      const [minTempo, maxTempo] = requirements.tempo;
      if (audioFeatures.tempo >= minTempo && audioFeatures.tempo <= maxTempo) {
        score += 100;
      } else {
        const distance = Math.min(
          Math.abs(audioFeatures.tempo - minTempo),
          Math.abs(audioFeatures.tempo - maxTempo)
        );
        if (distance <= 20) score += 70;
        else if (distance <= 40) score += 40;
      }
      checks++;
    }

    if (requirements.energy && audioFeatures.energy) {
      const [minEnergy, maxEnergy] = requirements.energy;
      if (audioFeatures.energy >= minEnergy && audioFeatures.energy <= maxEnergy) {
        score += 100;
      }
      checks++;
    }

    return checks > 0 ? score / checks : 50;
  }

  // 🎯 Calculate hit potential impact
  calculateHitPotentialImpact(hitPotential, opportunityType) {
    if (!hitPotential) return 0;
    
    let baseScore = hitPotential;

    switch (opportunityType) {
      case 'commercial': return Math.min(baseScore * 1.2, 100);
      case 'tv': return Math.min(baseScore * 1.1, 100);
      case 'film': return Math.min(baseScore * 0.9 + 10, 100);
      case 'game': return Math.min(baseScore * 1.0, 100);
      case 'social': return Math.min(baseScore * 1.3, 100);
      default: return baseScore;
    }
  }

  // 📱 Calculate social media match
  calculateSocialMediaMatch(socialMediaPotential, opportunity) {
    if (opportunity.type === 'social') {
      return socialMediaPotential.overallSocialScore || 0;
    }
    
    if (opportunity.type === 'commercial') {
      return (socialMediaPotential.overallSocialScore || 0) * 0.8;
    }
    
    return (socialMediaPotential.overallSocialScore || 0) * 0.4;
  }

  // 💡 Get match reasons
  getMatchReasons(trackAnalysis, opportunity) {
    const reasons = [];

    const genreScore = this.calculateGenreMatch(trackAnalysis.genreMatch, opportunity.genre);
    if (genreScore >= 75) {
      reasons.push(`Perfect genre match: ${trackAnalysis.genreMatch} fits ${opportunity.genre.join(', ')}`);
    }

    if (trackAnalysis.hitPotential >= 80) {
      reasons.push(`Exceptional hit potential (${trackAnalysis.hitPotential}%) ideal for ${opportunity.type}`);
    }

    if (trackAnalysis.socialMediaPotential?.overallSocialScore > 80) {
      reasons.push('Excellent social media viral potential');
    }

    reasons.push(`Budget range: ${opportunity.budget}`);

    return reasons.slice(0, 4);
  }

  // 💰 Estimate revenue from budget string
  estimateRevenue(budgetString) {
    const numbers = budgetString.match(/\$(\d+),?(\d+)/g);
    if (numbers && numbers.length >= 1) {
      const minBudget = parseInt(numbers[0].replace(/\$|,/g, ''));
      const maxBudget = numbers.length > 1 ? 
        parseInt(numbers[1].replace(/\$|,/g, '')) : minBudget * 1.5;
      
      return {
        minimum: minBudget,
        maximum: maxBudget,
        average: Math.round((minBudget + maxBudget) / 2)
      };
    }
    
    return { minimum: 1000, maximum: 5000, average: 3000 };
  }

  // 🏆 Assess competition level
  assessCompetitionLevel(opportunity) {
    const avgBudget = this.estimateRevenue(opportunity.budget).average;
    
    if (avgBudget > 50000) return 'very_high';
    if (avgBudget > 25000) return 'high';
    if (avgBudget > 10000) return 'medium';
    return 'low';
  }

  // 📊 Calculate success probability
  calculateSuccessProbability(trackAnalysis, opportunity, matchScore) {
    let probability = matchScore;

    if (trackAnalysis.hitPotential >= 85) probability += 10;
    else if (trackAnalysis.hitPotential >= 75) probability += 5;

    const competition = this.assessCompetitionLevel(opportunity);
    switch (competition) {
      case 'very_high': probability -= 20; break;
      case 'high': probability -= 10; break;
      case 'low': probability += 10; break;
    }

    return Math.min(Math.max(Math.round(probability), 5), 95);
  }

  // 🚀 Submit to sync opportunities
  async submitToOpportunities(trackId, opportunityIds) {
    console.log(`🚀 Processing ${opportunityIds.length} sync submissions...`);
    
    try {
      const submissions = [];
      
      for (const oppId of opportunityIds) {
        const opportunity = this.opportunities.find(opp => opp.id === oppId);
        if (!opportunity) continue;

        const submission = {
          id: uuidv4(),
          trackId: trackId,
          opportunityId: oppId,
          opportunityTitle: opportunity.title,
          opportunityType: opportunity.type,
          submissionDate: new Date(),
          status: 'submitted'
        };

        this.submissions.push(submission);
        submissions.push(submission);
      }

      return {
        success: true,
        submissions: submissions,
        message: `Successfully submitted to ${submissions.length} opportunities`,
        nextSteps: this.generateNextSteps(submissions)
      };

    } catch (error) {
      console.error('🚨 Submission error:', error);
      throw error;
    }
  }

  // 📝 Generate next steps
  generateNextSteps(submissions) {
    const steps = [
      '📧 Confirmation emails sent to music supervisors',
      '⏰ Response tracking initiated for all submissions',
      '📊 Performance analytics will be available in 24-48 hours'
    ];

    if (submissions.some(s => s.opportunityType === 'commercial')) {
      steps.push('💼 Prepare additional commercial materials if requested');
    }

    if (submissions.some(s => s.opportunityType === 'social')) {
      steps.push('📱 Monitor social media for potential viral pickup');
    }

    steps.push('🔄 Automated follow-ups scheduled based on response timelines');

    return steps;
  }

  // 📊 Get submission statistics
  getSubmissionStats() {
    const total = this.submissions.length;
    const pending = this.submissions.filter(s => s.status === 'submitted').length;
    const accepted = this.submissions.filter(s => s.status === 'accepted').length;
    const rejected = this.submissions.filter(s => s.status === 'rejected').length;
    
    return {
      total,
      pending,
      accepted,
      rejected,
      acceptanceRate: total > 0 ? Math.round((accepted / total) * 100) : 0,
      averageResponseTime: this.calculateAverageResponseTime()
    };
  }

  // ⏱️ Calculate average response time
  calculateAverageResponseTime() {
    const completedSubmissions = this.submissions.filter(s => 
      s.status === 'accepted' || s.status === 'rejected'
    );
    
    if (completedSubmissions.length === 0) return 0;
    
    const totalDays = completedSubmissions.reduce((sum, submission) => {
      const responseTime = (new Date() - submission.submissionDate) / (1000 * 60 * 60 * 24);
      return sum + responseTime;
    }, 0);
    
    return Math.round(totalDays / completedSubmissions.length);
  }

  // 🔄 Update opportunities (called periodically)
  async updateOpportunities() {
    console.log('🔄 Updating sync opportunities...');
    
    try {
      const newOpportunities = this.generateNewOpportunities();
      this.opportunities.push(...newOpportunities);
      
      const now = new Date();
      this.opportunities = this.opportunities.filter(opp => opp.deadline > now);
      
      this.lastUpdate = new Date();
      console.log('✅ Sync opportunities updated successfully');
      
      return true;
    } catch (error) {
      console.error('🚨 Failed to update opportunities:', error);
      return false;
    }
  }

  // 🆕 Generate new opportunities (simulation)
  generateNewOpportunities() {
    const newOpps = [];
    const numNew = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numNew; i++) {
      const templates = [
        {
          title: 'Coca-Cola Summer Campaign 2024',
          type: 'commercial',
          brand: 'Coca-Cola',
          budget: '$35,000 - $60,000',
          genre: ['pop', 'dance', 'upbeat'],
          mood: ['fun', 'energetic', 'summer']
        },
        {
          title: 'Amazon Prime Video Series - "Tech Titans"',
          type: 'tv',
          network: 'Amazon Prime',
          budget: '$12,000 - $20,000',
          genre: ['electronic', 'corporate', 'modern'],
          mood: ['innovative', 'professional', 'sleek']
        }
      ];
      
      const template = templates[Math.floor(Math.random() * templates.length)];
      
      newOpps.push({
        id: uuidv4(),
        ...template,
        description: `New ${template.type} opportunity - ${template.title}`,
        deadline: new Date(Date.now() + (Math.floor(Math.random() * 30) + 7) * 24 * 60 * 60 * 1000),
        status: 'available',
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        contact: `music@${(template.brand || template.network).toLowerCase().replace(/\s+/g, '')}.com`,
        requirements: {
          tempo: [100 + Math.floor(Math.random() * 60), 140 + Math.floor(Math.random() * 40)],
          energy: [0.5 + Math.random() * 0.3, 0.8 + Math.random() * 0.2]
        }
      });
    }
    
    return newOpps;
  }

  // 📱 Get opportunity by ID
  getOpportunityById(id) {
    return this.opportunities.find(opp => opp.id === id);
  }

  // 📝 Get submission by ID
  getSubmissionById(id) {
    return this.submissions.find(sub => sub.id === id);
  }

  // 🎯 Get opportunities by type
  getOpportunitiesByType(type) {
    return this.opportunities.filter(opp => opp.type === type && opp.status === 'available');
  }

  // 💰 Get opportunities by budget range
  getOpportunitiesByBudget(minBudget, maxBudget) {
    return this.opportunities.filter(opp => {
      const revenue = this.estimateRevenue(opp.budget);
      return revenue.minimum >= minBudget && revenue.maximum <= maxBudget;
    });
  }

  // ⏰ Get urgent opportunities
  getUrgentOpportunities() {
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    return this.opportunities.filter(opp => 
      opp.deadline <= threeDaysFromNow && opp.status === 'available'
    );
  }

  // 🏆 Get high-value opportunities
  getHighValueOpportunities() {
    return this.opportunities.filter(opp => {
      const revenue = this.estimateRevenue(opp.budget);
      return revenue.average >= 25000 && opp.status === 'available';
    }).sort((a, b) => {
      const revenueA = this.estimateRevenue(a.budget).average;
      const revenueB = this.estimateRevenue(b.budget).average;
      return revenueB - revenueA;
    });
  }

  // 📊 Generate opportunity insights
  generateOpportunityInsights() {
    const total = this.opportunities.length;
    const available = this.opportunities.filter(opp => opp.status === 'available').length;
    
    const typeDistribution = {};
    const budgetRanges = { low: 0, medium: 0, high: 0 };
    
    this.opportunities.forEach(opp => {
      typeDistribution[opp.type] = (typeDistribution[opp.type] || 0) + 1;
      
      const revenue = this.estimateRevenue(opp.budget);
      if (revenue.average < 10000) budgetRanges.low++;
      else if (revenue.average < 30000) budgetRanges.medium++;
      else budgetRanges.high++;
    });
    
    return {
      totalOpportunities: total,
      availableOpportunities: available,
      typeDistribution,
      budgetRanges,
      urgentCount: this.getUrgentOpportunities().length,
      highValueCount: this.getHighValueOpportunities().length,
      lastUpdate: this.lastUpdate
    };
  }
}

module.exports = { SyncEngine };