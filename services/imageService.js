const jimp = require('jimp');
const s3Service = require('./s3Service');
const constants = require('../constants/constants')

const processUploadedImage = async (event) => {
    const { bucketName, objectKey } = s3Service.extractS3EventData(event);

    if(bucketName === constants.UNPROCESSED_BUCKET_NAME){
        try {
            const image = await s3Service.getObject(constants.UNPROCESSED_BUCKET_NAME, objectKey)
            const thumbnailBuffer = await resizeImage(image, constants.THUMBNAIL_WIDTH, constants.THUMBNAIL_HEIGHT);
            await s3Service.putObject(constants.PROCESSED_BUCKET_NAME, objectKey, thumbnailBuffer);
            //await s3Service.moveObject(constants.UNPROCESSED_BUCKET_NAME, objectKey, constants.ARCHIVES_FOLDER);
        } catch (error){
            console.log("Image not converted to Thumbnail", error)
        }
    } else {
        //todo: not implemented yet, once adding lambda to email image
        console.log("Not Implemented yet")
    }
}

const resizeImage = async (imageByteArray, width, height) => {
    try {
      let image = await jimp.read(Buffer.from(imageByteArray));
      image.resize(width, height);
      const resizedBuffer = await image.getBufferAsync(jimp.MIME_JPEG);
      console.log("Image resized successfully", resizedBuffer)
      return resizedBuffer;
    } catch (error) {
      console.error('Error resizing image:', error);
      throw error;
    }
  };

module.exports = {
    processUploadedImage,
}