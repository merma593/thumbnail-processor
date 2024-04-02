const imageService = require('./services/imageService');

// Lambda handler for processing images from S3 and changing size
const processImageFromS3 = async (event, context) => {
  try {
    await imageService.processUploadedImage(event);
  } catch (error) {
    console.error('Error processing image from S3:', error);
    throw error;
  }
};

module.exports = {
  processImageFromS3,
};
