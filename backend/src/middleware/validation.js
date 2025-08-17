const Joi = require('joi');

const trackUploadSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  artist: Joi.string().min(1).max(100).optional(),
  genre: Joi.string().min(1).max(50).optional()
});

const syncSubmissionSchema = Joi.object({
  trackId: Joi.string().required(),
  opportunityIds: Joi.array().items(Joi.string()).min(1).required(),
  userConsent: Joi.boolean().valid(true).required()
});

const chatMessageSchema = Joi.object({
  message: Joi.string().min(1).max(1000).required(),
  trackAnalysis: Joi.object().optional()
});

const validateTrackUpload = (req, res, next) => {
  const { error } = trackUploadSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateSyncSubmission = (req, res, next) => {
  const { error } = syncSubmissionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateChatMessage = (req, res, next) => {
  const { error } = chatMessageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateTrackUpload,
  validateSyncSubmission,
  validateChatMessage
};