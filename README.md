# Chamilo LMS docker-compose

A simple docker-compose setup for [Chamilo](https://chamilo.org/) LMS.

Official Docker Hub images used:
* [php](https://hub.docker.com/_/php/) (7.x-apache)
* [mariadb](https://hub.docker.com/_/mariadb/) (latest)

Chamilo LMS on Github: https://github.com/chamilo/chamilo-lms

This setup doesn't directly install/configure Chamilo. You have to use the Chamilo installation wizard once the docker containers are up.

*This setup works with Chamilo version 1.11.x

# Optional: Host system config

On the Host system you need to add a `/etc/hosts` entry for the domain name configured in the apache vhost:

```bash
sudo echo "127.0.0.1 docker.chamilo.net" >> /etc/hosts
```

##### `.../etc/hosts` on Windows:
* Open a text editor as administrator (with administrator privileges)
* Open hosts file: `C:\Windows\System32\Drivers\etc\hosts`
* Add entry `127.0.0.1 docker.chamilo.net` at the end of the file and **save**.

# ENV Variables

## `environment` variables for MYSQL
You can define mysql username, password and database name in the docker-compose config:

```yaml
    environment:
      - MYSQL_ROOT_PASSWORD=pass
      - MYSQL_USER=chamilo
      - MYSQL_PASSWORD=chamilo
      - MYSQL_DATABASE=chamilo
```

## `args` variables for building Chamilo
You can define the Version for Chamilo with `CHAMILO_VERSION`.
And you have to set the `CHAMILO_TAR` filename due to incosistent naming.
Check for `.tar.gz` filenames here: https://github.com/chamilo/chamilo-lms/releases

Example in `docker-compose.yml`:
```yaml
      args:
        - CHAMILO_VERSION=1.11.10
        - CHAMILO_TAR=chamilo-1.11.10-php7.3.tar.gz
```

The `args` settings in `docker-compose.yml` will override the `ARG` settings in the `Dockerfile`.
If you remove the `args` in `docker-compose.yml`, the "fallback" values from the `Dockerfile` will be used.

## PHP 7.x

##### Build:
Build chamilo docker image
```bash
docker-compose -f docker-compose.yml build
```

##### Run:
```bash
docker-compose -f docker-compose.yml up
```

# Database connection step in web installation wizard
The "Database Host" in step 4 of the mysql connections settings has to be the name of the docker image defined in the appropriate docker-compose yaml.

### PHP 7.x
Database Host: `mariadb`

# Access Chamilo Website
Access Chamilo URL with `/etc/hosts` entry:

```
http://docker.chamilo.net:8080/
```

Without `/etc/hosts` entry: 
```
http://localhost:8080
```
