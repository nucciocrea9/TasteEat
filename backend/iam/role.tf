# aws_iam_role.authenticated:
resource "aws_iam_role" "authenticated" {
  assume_role_policy = jsonencode(
    {
      Statement = [
        {
          Action = "sts:AssumeRoleWithWebIdentity"
          Condition = {
            "ForAnyValue:StringLike" = {
              "cognito-identity.amazonaws.com:amr" = "authenticated"
            }
            StringEquals = {
              "cognito-identity.amazonaws.com:aud" = [var.identity_pool_id_west]
              //aws_cognito_identity_pool.identities_pool.id
            }
          }
          Effect = "Allow"
          Principal = {
            Federated = "cognito-identity.amazonaws.com"
          }
        },
      ]
      Version = "2012-10-17"
    }
  )
  force_detach_policies = true
  max_session_duration  = 3600
  name                  = "tasteEat_idp_Auth_role"
  tags                  = {}
}

# aws_iam_role.unauthenticated:
resource "aws_iam_role" "unauthenticated" {
  assume_role_policy = jsonencode(
    {
      Statement = [
        {
          Action = "sts:AssumeRoleWithWebIdentity"
          Condition = {
            "ForAnyValue:StringLike" = {
              "cognito-identity.amazonaws.com:amr" = "unauthenticated"
            }
            StringEquals = {
              "cognito-identity.amazonaws.com:aud" = [ var.identity_pool_id_west]
              //aws_cognito_identity_pool.identities_pool.id
            }
          }
          Effect = "Allow"
          Principal = {
            Federated = "cognito-identity.amazonaws.com"
          }
        },
      ]
      Version = "2012-10-17"
    }
  )
  force_detach_policies = true
  max_session_duration  = 3600
  name                  = "tasteEat_idp_Unauth_role"
  tags                  = {}
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_dyndb_update_item_userpool_get_user" {
  name = "lambda_dyndb_policy"
  policy = jsonencode(
    {
      Version = "2012-10-17"
      Statement = [
        {
          Action   = ["dynamodb:*"]
          Effect   = "Allow"
          Resource = "*"
        },
      ]
    }
  )
}

resource "aws_iam_role_policy_attachment" "lambda_dyndb_update_item_userpool_get_user" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_dyndb_update_item_userpool_get_user.arn
}
