resource "aws_security_group" "web" {
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "app" {
  ami                    = "ami-12345678"
  instance_type          = "t3.micro"
  vpc_security_group_ids = [aws_security_group.web.id]
  iam_instance_profile   = aws_iam_instance_profile.app.name
}

resource "aws_iam_instance_profile" "app" {
  role = aws_iam_role.app.name
}

resource "aws_iam_role" "app" {
  assume_role_policy = jsonencode({ Statement = [{ Action = "sts:AssumeRole",
    Effect = "Allow", Principal = { Service = "ec2.amazonaws.com" } }] })
}

resource "aws_iam_role_policy" "app" {
  role   = aws_iam_role.app.id
  policy = jsonencode({ Statement = [{
    Effect = "Allow", Action = "s3:*", Resource = "*"
  }] })
}

resource "aws_s3_bucket" "records" {
  bucket = "app-records"
}
