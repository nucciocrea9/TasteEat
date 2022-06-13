resource "aws_s3_bucket" "storage" {
  bucket_prefix = "region-bucket-"
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET", "HEAD", "DELETE"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}
resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket= "${aws_s3_bucket.storage.id}"

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Id": "Policy01",
    "Statement": [
        {
            "Sid": "Statement01",
            "Effect": "Allow",
            "Principal": {
                "AWS": "${var.cognitoRole}"
            },
            "Action": "s3:*",
            "Resource": "${aws_s3_bucket.storage.arn}/*"
        }
    ]
}

POLICY
}


