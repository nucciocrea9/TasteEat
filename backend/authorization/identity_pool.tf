# aws_cognito_identity_pool.identities_pool:
resource "aws_cognito_identity_pool" "identities_pool" {
  allow_unauthenticated_identities = false
  identity_pool_name               = "tasteat_idp"

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.web_client.id
    provider_name           = "cognito-idp.${var.region}.amazonaws.com/${aws_cognito_user_pool.users_pool.id}"
    server_side_token_check = false
  }
}

# aws_cognito_identity_pool_roles_attachment.identities_pool_roles:
resource "aws_cognito_identity_pool_roles_attachment" "identities_pool_roles" {
  identity_pool_id = aws_cognito_identity_pool.identities_pool.id
  roles = {
    "authenticated" = var.authenticated_role
    //aws_iam_role.authenticated.arn
    "unauthenticated" = var.unauthenticated_role
    //aws_iam_role.unauthenticated.arn
  }
}
