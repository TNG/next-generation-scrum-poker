# How to deploy the frontend to AWS S3

1. Run `npm run build` in frontend folder. This will generate a `dist` folder in the frontend 
folder.
2. Login to [AWS console](https://tng-playground.signin.aws.amazon.com/console)  and generate a new S3 bucket.
3. Upload the content of the `dist` folder via the UI of the AWS console
4. Set the index document to `index.html` while uploading
5. Under permissions tab (button block public access) we no need to switch off 'blocking all public access'
6. Press button 'Bucket Policy' and add the following content to the editor:
```
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "AllowPublicRead",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```
