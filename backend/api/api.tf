resource "aws_api_gateway_rest_api" "tasteApi" {
  name               = "tasteEat-api"
}

resource "aws_api_gateway_authorizer" "user_pool" {
  name          = "tasteApi-user_pool-authorizer"
  rest_api_id   = aws_api_gateway_rest_api.tasteApi.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = [var.user_pool_arn]

}
/*module "cors" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id          = aws_api_gateway_rest_api.tasteApi.id
  api_resource_id = aws_api_gateway_resource.getRecipes.id
}

module "cors1" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id          = aws_api_gateway_rest_api.tasteApi.id
  api_resource_id = aws_api_gateway_resource.getOrders.id
}

module "cors2" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id          = aws_api_gateway_rest_api.tasteApi.id
  api_resource_id = aws_api_gateway_resource.order.id
}
*/
resource "aws_api_gateway_resource" "getOrders" {
  rest_api_id = aws_api_gateway_rest_api.tasteApi.id
  parent_id   = aws_api_gateway_rest_api.tasteApi.root_resource_id
  path_part   = "getOrders"
}
resource "aws_api_gateway_resource" "getRecipes" {
  rest_api_id = aws_api_gateway_rest_api.tasteApi.id
  parent_id   = aws_api_gateway_rest_api.tasteApi.root_resource_id
  path_part   = "getRecipes"
}
resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_rest_api.tasteApi.id
  resource_id             = aws_api_gateway_resource.getRecipes.id
  http_method             = aws_api_gateway_method.getRecipes_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  timeout_milliseconds    = 29000
  passthrough_behavior    = "WHEN_NO_MATCH"
  uri                     = module.share_docs_method.invoke_arn
}

resource "aws_api_gateway_integration_response" "integration_response" {
  rest_api_id         = aws_api_gateway_rest_api.tasteApi.id
  resource_id         = aws_api_gateway_resource.getRecipes.id
  http_method         = aws_api_gateway_method.getRecipes_method.http_method
  status_code         = aws_api_gateway_method_response.getRecipes_200.status_code
  response_parameters = {}
  response_templates = {
    "application/json" = ""
  }
  depends_on = [aws_api_gateway_integration.integration]
}

resource "aws_api_gateway_method_response" "getRecipes_200" {
  rest_api_id = aws_api_gateway_rest_api.tasteApi.id
  resource_id = aws_api_gateway_resource.getRecipes.id
  http_method = aws_api_gateway_method.getRecipes_method.http_method
  status_code = 200
  response_parameters = {
    "method.response.header.Content-Type" = true
  }
  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration" "integration_getOrders" {
  rest_api_id             = aws_api_gateway_rest_api.tasteApi.id
  resource_id             = aws_api_gateway_resource.getOrders.id
  http_method             = aws_api_gateway_method.getOrders_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  timeout_milliseconds    = 29000
  passthrough_behavior    = "WHEN_NO_MATCH"
  uri                     = module.share_docs_method1.invoke_arn
}
resource "aws_api_gateway_integration_response" "integration_response_getOrders" {
  rest_api_id         = aws_api_gateway_rest_api.tasteApi.id
  resource_id         = aws_api_gateway_resource.getOrders.id
  http_method         = aws_api_gateway_method.getOrders_method.http_method
  status_code         = aws_api_gateway_method_response.getOrders_200.status_code
  response_parameters = {}
  response_templates = {
    "application/json" = ""
  }
  depends_on = [aws_api_gateway_integration.integration_getOrders]
}

resource "aws_api_gateway_method_response" "getOrders_200" {
  rest_api_id = aws_api_gateway_rest_api.tasteApi.id
  resource_id = aws_api_gateway_resource.getOrders.id
  http_method = aws_api_gateway_method.getOrders_method.http_method
  status_code = 200
  response_parameters = {
    "method.response.header.Content-Type" = true
  }
  response_models = {
    "application/json" = "Empty"
  }
}
resource "aws_api_gateway_integration" "integration_order" {
  rest_api_id             = aws_api_gateway_rest_api.tasteApi.id
  resource_id             = aws_api_gateway_resource.order.id
  http_method             = aws_api_gateway_method.order_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  timeout_milliseconds    = 29000
  passthrough_behavior    = "WHEN_NO_MATCH"
  uri                     = module.share_docs_method2.invoke_arn
}
resource "aws_api_gateway_integration_response" "integration_response_order" {
  rest_api_id         = aws_api_gateway_rest_api.tasteApi.id
  resource_id         = aws_api_gateway_resource.order.id
  http_method         = aws_api_gateway_method.order_method.http_method
  status_code         = aws_api_gateway_method_response.order_200.status_code
  response_parameters = {}
  response_templates = {
    "application/json" = ""
  }
  depends_on = [aws_api_gateway_integration.integration_order]
}

resource "aws_api_gateway_method_response" "order_200" {
  rest_api_id = aws_api_gateway_rest_api.tasteApi.id
  resource_id = aws_api_gateway_resource.order.id
  http_method = aws_api_gateway_method.order_method.http_method
  status_code = 200
  response_parameters = {
    "method.response.header.Content-Type" = true
  }
  response_models = {
    "application/json" = "Empty"
  }
}
resource "aws_api_gateway_method" "getOrders_method" {
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.user_pool.id
  http_method   = "GET"
  resource_id   = aws_api_gateway_resource.getOrders.id
  rest_api_id   = aws_api_gateway_rest_api.tasteApi.id
}



resource "aws_api_gateway_method" "getRecipes_method" {
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.user_pool.id
  http_method   = "GET"
  resource_id   = aws_api_gateway_resource.getRecipes.id
  rest_api_id   = aws_api_gateway_rest_api.tasteApi.id
}

resource "aws_api_gateway_resource" "order" {
  rest_api_id = aws_api_gateway_rest_api.tasteApi.id
  parent_id   = aws_api_gateway_rest_api.tasteApi.root_resource_id
  path_part   = "order"
}

resource "aws_api_gateway_method" "order_method" {
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.user_pool.id
  http_method   = "POST"
  resource_id   = aws_api_gateway_resource.order.id
  rest_api_id   = aws_api_gateway_rest_api.tasteApi.id
  request_parameters = {
    "method.request.querystring.name"  = true
    "method.request.querystring.price" = true
  }
}

resource "aws_api_gateway_deployment" "tasteApi" {
  rest_api_id       = aws_api_gateway_rest_api.tasteApi.id
  stage_description = "Deployed at ${timestamp()}"

 triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.tasteApi.body))
  }

  lifecycle {
    create_before_destroy = true
  }
  depends_on = [
    aws_api_gateway_integration.integration,
    aws_api_gateway_integration.integration_getOrders,
    aws_api_gateway_integration.integration_order,
    aws_api_gateway_method.getRecipes_method,
    aws_api_gateway_method.getOrders_method,
    aws_api_gateway_method.order_method,
    module.share_docs_method,
    module.share_docs_method1,
    module.share_docs_method2
  ]
  
}

module "share_docs_method" {
  source                 = "./getRecipes/"
  rest_api_execution_arn = aws_api_gateway_rest_api.tasteApi.execution_arn
  parent_resource_path   = aws_api_gateway_resource.getRecipes.path
  share_doc_http_method  = aws_api_gateway_method.getRecipes_method.http_method
  db_table               = var.db_table
  lambda_role            = var.lambda_role
}

module "share_docs_method1" {
  source                 = "./getOrders/"
  rest_api_execution_arn = aws_api_gateway_rest_api.tasteApi.execution_arn
  parent_resource_path   = aws_api_gateway_resource.getOrders.path
  share_doc_http_method  = aws_api_gateway_method.getOrders_method.http_method
  db_table_order         = var.db_table_order
  lambda_role            = var.lambda_role
}

module "share_docs_method2" {
  source                 = "./addOrder/"
  rest_api_execution_arn = aws_api_gateway_rest_api.tasteApi.execution_arn
  parent_resource_path   = aws_api_gateway_resource.order.path
  share_doc_http_method  = aws_api_gateway_method.order_method.http_method
  db_table_order         = var.db_table_order
  lambda_role            = var.lambda_role
}
resource "aws_api_gateway_stage" "dev" {
  deployment_id = aws_api_gateway_deployment.tasteApi.id
  rest_api_id   = aws_api_gateway_rest_api.tasteApi.id
  stage_name    = "dev"
}
