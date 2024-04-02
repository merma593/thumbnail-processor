const { GetObjectCommand, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const client = new S3Client({});

const extractS3EventData = (event) => {
    const record = event.Records[0]; 
    const bucketName = record.s3.bucket.name;
    const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    return { bucketName, objectKey };
  };

const getObject = async (bucketName, bucketKey) => {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: bucketKey,
    });

    try {
      const response = await client.send(command);
      const str = await response.Body.transformToByteArray();
      console.log(str);
      return str;
    } catch (err) {
      console.error("Error getting object from s3", err);
    }
};

// const moveObject = async (bucketName, sourceKey, destinationFolder) => {
//   console.log("CopySource", `${bucketName}/${sourceKey}`)
//   console.log("Bucket", bucketName)
//   console.log("new object key", `${destinationFolder}/${sourceKey}`)
//   const copyParams = {
//     CopySource: `${bucketName}/${sourceKey}`,
//     Bucket: bucketName,
//     Key: `${destinationFolder}/${sourceKey}`
//   };

//   const deleteParams = {
//     Bucket: bucketName,
//     Key: sourceKey
//   };

//   try {
//     const copyCommand = new CopyObjectCommand(copyParams);
//     await client.send(copyCommand);

//     const deleteCommand = new DeleteObjectCommand(deleteParams);
//     await client.send(deleteCommand);

//     console.log(`Object moved successfully to '${destinationFolder}' folder`);
//   } catch (err) {
//     console.error("Error moving object:", err);
//     throw err; 
//   }
// };

const putObject = async (bucketName, bucketKey, data) => {
  const params = {
    Bucket: bucketName,
    Key: bucketKey,
    Body: data 
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await client.send(command);
    return response;
  } catch (err) {
    console.error("Error uploading object:", err);
    throw err; 
  }
};
  
module.exports = {
    extractS3EventData,
    putObject,
    moveObject,
    getObject
}