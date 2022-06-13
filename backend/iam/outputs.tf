output "authenticated_role" {
  value = aws_iam_role.authenticated.arn
}

output "unauthenticated_role" {
  value = aws_iam_role.unauthenticated.arn
}

output "lambda_role" {
  value = aws_iam_role.iam_for_lambda.arn
}