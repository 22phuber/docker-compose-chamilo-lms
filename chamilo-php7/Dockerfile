#

FROM php:7-apache

ARG CHAMILO_VERSION=1.11.10
ARG CHAMILO_TAR="chamilo-${CHAMILO_VERSION}-php7.tar.gz"

# install packages
RUN apt update && apt install -y \
    ssmtp \
    curl \
    git \
    wget \
    libzip-dev \
    zlib1g-dev \
    libpng-dev \
    libicu-dev \
    libxslt-dev \
    libjpeg-dev \
    libgd3 \
    libgd-dev \
    libfreetype6-dev \
    libmemcached-dev \
    libwebp-dev \
    libxpm-dev \
    libjpeg62-turbo-dev \
    g++ \
    && apt autoclean \
    && apt autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Install APCu
RUN pecl install apcu && \
    pecl install memcached

# install and configure extensions
RUN docker-php-ext-install -j$(nproc) opcache pdo_mysql zip xsl
RUN docker-php-ext-configure intl && \
    docker-php-ext-install -j$(nproc) intl
RUN docker-php-ext-configure gd \
    --with-jpeg-dir=/usr/include/ --with-png-dir=/usr/include/ \
    --with-freetype-dir=/usr/include/ --with-gd && \
    docker-php-ext-install -j$(nproc) gd
RUN docker-php-ext-enable memcached apcu

WORKDIR /var/www

# download and install chamilo
ADD https://github.com/chamilo/chamilo-lms/releases/download/v${CHAMILO_VERSION}/${CHAMILO_TAR} /var/www/chamilo.tar.gz
# unpack, delete archive, rename folders
RUN tar -zxf chamilo.tar.gz \
    && rm chamilo.tar.gz \ 
    && mv chamilo* chamilo
# delete unneeded files
RUN find . -iname ".git" | xargs rm -rf \
    && find . -iname ".git*" | xargs rm -rf \
    && rm -rf chamilo/tests chamilo/.htac*

WORKDIR /var/www/chamilo

RUN chown -R www-data:www-data \
    app \
    main/default_course_document/images \
    main/lang \
    vendor \
    web

# Configure and start Apache
RUN a2dissite 000-default; rm -rf /etc/apache2/sites-enabled/000-default.conf
COPY files/security.conf /etc/apache2/conf-available/
COPY files/chamilo.conf /etc/apache2/sites-available/chamilo.conf
RUN a2ensite chamilo; a2enmod remoteip rewrite headers
RUN service apache2 restart

# configure /etc/hosts
RUN echo "127.0.0.1 docker.chamilo.net" >> /etc/hosts

EXPOSE 80