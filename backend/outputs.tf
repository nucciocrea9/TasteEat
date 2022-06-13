/*output "UserPoolId" {
  //value = module.authorization.user_pool
}

output "USER_POOL_SUBDOMAIN" {
  value = "taste-user-pool-${random_string.id.result}"
}

output "ClientId" {
  //value = module.authorization.client_id
}

output "IdentityPoolId" {
  //value = module.authorization.identity_pool
}
*/
output "bucket" {
  value = module.storage.bucket.bucket
}

output "region" {
  value = var.region
}

output "RedirectUriSignIn" {
  value = "https://${module.website.domain_name}/"
}

output "RedirectUriSignOut" {
  value = "https://${module.website.domain_name}/"
}
###
output "WEBSITE_URL" {
  value = "https://${module.website.domain_name}/"
}

output "HOSTING_BUCKET" {
  value = module.website.hosting_bucket
}



output "USER_POOL_ID_west" {
  value = module.authorization-west.user_pool
}

output "USER_POOL_SUBDOMAIN_west" {
  value = "taste-user-pool-${random_string.id-west.result}"
}

output "CLIENT_ID_west" {
  value = module.authorization-west.client_id
}

output "IDENTITY_POOL_ID_west" {
  value = module.authorization-west.identity_pool
}

output "BUCKET_NAME_west" {
  value = module.storage_west.bucket.bucket
}

output "REGION_west" {
  value = var.region
}

/*output "SIGNIN_REDIRECT_URL_west" {
  //value = "https://${module.website-west.domain_name}/"
}

output "SIGNOUT_REDIRECT_URL_west" {
  //value = "https://${module.website-west.domain_name}/"
}
###
output "WEBSITE_URL_west" {
 // value = "https://${module.website-west.domain_name}/"
}

output "HOSTING_BUCKET_west" {
  //value = module.website-west.hosting_bucket
}
*/
output "apiUrl" {
  value= module.api.endpoint_url
}

output "apiUrl_west" {
  value= module.api-west.endpoint_url
}