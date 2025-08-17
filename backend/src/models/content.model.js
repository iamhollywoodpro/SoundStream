const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentType: {
    type: String,
    enum: ['song', 'album', 'podcast', 'playlist'],
    default: 'song'
  },
  coverArtUrl: {
    type: String,
    default: 'default-cover.jpg'
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  genres: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  isExclusive: {
    type: Boolean,
    default: false // pro tier only
  },
  streamCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  streamingUrl: {
    low: String, // 128kbps
    high: String // 320kbps
  },
  storagePath: {
    low: String,
    high: String
  },
  waveformData: String, // JSON string of waveform
  lyrics: String,
  credits: {
    producer: String,
    songwriter: String,
    featuring: [String]
  },
  monetization: {
    revenueSharing: {
      type: Boolean,
      default: true
    },
    syncLicensing: {
      type: Boolean,
      default: false
    },
    directSales: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for search
ContentSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Content', ContentSchema);
