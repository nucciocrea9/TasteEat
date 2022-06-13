output "table_name" {
  value = aws_dynamodb_table.us-east-1.name
}

output "table_name_order" {
  value = aws_dynamodb_table.order.name
}