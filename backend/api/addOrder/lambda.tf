
data "archive_file" "python_lambda_package" {
  type        = "zip"
  source_file = "${path.module}/lambda_src/main.py"
  output_path = "addOrder.zip"
}

resource "aws_lambda_function" "function" {

  function_name    = "addOrder"
  filename         = "addOrder.zip"
  source_code_hash = data.archive_file.python_lambda_package.output_base64sha256
  handler          = "main.lambda_handler"
  runtime          = "python3.8"
  architectures    = ["x86_64"]
  publish          = true
  role             = var.lambda_role
  timeout          = 30

  environment {
    variables = {
      table = var.db_table_order
    }
  }
}

resource "aws_lambda_permission" "api_invoke_lambda" {
  statement_id  = "AllowApiGatewayInvokeLambda"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.function.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.rest_api_execution_arn}/*/${var.share_doc_http_method}${var.parent_resource_path}"
}
