export interface Environment {
  mysql_db: string;
  mysql_username: string;
  mysql_password: string;
  mysql_domain: string;
  mysql_port: number;

  backend_domain: string;
  backend_port: number;
  jwt_shared_secret: string;

  mysql_query_logging: boolean;
}