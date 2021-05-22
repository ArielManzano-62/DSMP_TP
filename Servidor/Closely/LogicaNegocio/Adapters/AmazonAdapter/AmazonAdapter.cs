using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace LogicaNegocio.Adapters.AmazonAdapter
{
    public class AmazonAdapter : IImageUploader
    {
        private static string accessKey = "AKIAIKI7YG2QAAUDWOGQ";
        private static string accessSecret = "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";
        private static string bucket = "closely";

        public async Task<string> SubirImagen(IFormFile file)
        {
            //TODO: Verificar que este segurizando bien esto, creo q actualmente no porq esta publico el S3
            var client = new AmazonS3Client(accessKey, accessSecret, Amazon.RegionEndpoint.SAEast1);

            // get the file and convert it to the byte[]
            byte[] fileBytes = new Byte[file.Length];
            file.OpenReadStream().Read(fileBytes, 0, Int32.Parse(file.Length.ToString()));

            // create unique file name for prevent the mess
            var fileName = Guid.NewGuid() + file.FileName;

            PutObjectResponse response = null;

            using (var stream = new MemoryStream(fileBytes))
            {
                var request = new PutObjectRequest
                {
                    BucketName = bucket,
                    Key = fileName,
                    InputStream = stream,
                    ContentType = file.ContentType,
                    CannedACL = S3CannedACL.PublicRead
                };

                response = await client.PutObjectAsync(request);
            };



            if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
            {
                return "https://closely.s3.sa-east-1.amazonaws.com/" + fileName;

            }
            return "";
        }
    }
}
