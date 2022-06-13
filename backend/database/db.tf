
resource "aws_dynamodb_table" "us-east-1" {
  name           = "recipes"
  hash_key       = "recipe_id"
  range_key      = "recipe_name"
  read_capacity  = 1
  write_capacity = 1
  //billing_mode   = "PROVISIONED"
  attribute {
    name = "recipe_id"
    type = "N"
  }
  attribute {
    name = "recipe_name"
    type = "S"
  }
  lifecycle {
    ignore_changes = [write_capacity, read_capacity]
  }

}

resource "aws_dynamodb_table" "order" {

  name           = "orders"
  hash_key       = "order_id"
  range_key      = "user"
  read_capacity  = 1
  write_capacity = 1
  //billing_mode   = "PROVISIONED"
  attribute {
    name = "order_id"
    type = "S"
  }
  attribute {
    name = "user"
    type = "S"
  }
  lifecycle {
    ignore_changes = [write_capacity, read_capacity]
  }
}
/*
module "table_autoscaling" {
  source  = "snowplow-devops/dynamodb-autoscaling/aws"

  table_name = aws_dynamodb_table.us-east-1.id
}

module "table_autoscaling1" {
  source  = "snowplow-devops/dynamodb-autoscaling/aws"

  table_name = aws_dynamodb_table.order.id
}

*/