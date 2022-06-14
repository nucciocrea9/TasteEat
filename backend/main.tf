terraform {
  backend "s3" {
    bucket = "terraform-state-bucket12"
    key = "state/terraform.tfstate"
    region = "us-east-1"
  }
}
provider "aws" {
  version = "~> 3.0"
  region  = "us-east-1"
}

provider "aws" {
  alias  = "us-west-1"
  region = "us-west-1"
}
provider "aws" {
  alias  = "eu-west-1"
  region = "eu-west-1"
}

module "website" {
  source = "./website"

  s3_origin_id  = "s3OriginId"
  bucket_prefix = "taste-eat-website-"

  providers = {
    aws = "aws"
  }
}



module "authorization-west" {
  source               = "./authorization"
  authenticated_role   = module.iam.authenticated_role
  unauthenticated_role = module.iam.unauthenticated_role
  region               = var.region
  website              = "https://${module.website.domain_name}/"
  user_pool_domain     = "taste-user-pool-${random_string.id-west.result}"
  providers = {
    aws = "aws"
  }
}

module "iam" {
  source                = "./iam"
  //identity_pool_id      = module.authorization.identity_pool
  identity_pool_id_west = module.authorization-west.identity_pool
}
module "storage" {
  source      = "./storage"
  cognitoRole = module.iam.authenticated_role
  providers = {
    aws = "aws"
  }

}

module "storage_west" {
  source      = "./storage"
  cognitoRole = module.iam.authenticated_role
  providers = {
    aws = "aws.us-west-1"
  }

}
module "api" {
  source        = "./api"
  user_pool_arn = module.authorization-west.user_pool_arn
  db_table      = module.database.table_name
  db_table_order=module.database.table_name_order
  lambda_role= module.iam.lambda_role
  providers = {
    aws = "aws"
  }
}

module "api-west" {
  source        = "./api"
  user_pool_arn = module.authorization-west.user_pool_arn
  db_table      = module.database-west.table_name
  db_table_order=module.database-west.table_name_order
  lambda_role= module.iam.lambda_role
  providers = {
    aws = "aws.us-west-1"
  }
}

module "database" {
  source = "./database"
  providers = {
    aws = "aws"
  }
}
module "database-west" {
  source = "./database"
  providers = {
    aws = "aws.us-west-1"
  }
}
resource "random_string" "id-west" {
  length  = 6
  special = false
  upper   = false

}

resource "random_string" "id" {
  length  = 6
  special = false
  upper   = false

}
