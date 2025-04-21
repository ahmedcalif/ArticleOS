# ArticleOS

*The Open Source Reddit Alternative for Linux Enthusiasts*

Empower Communities, Share Knowledge, Celebrate Open Source

![last commit](https://img.shields.io/badge/last%20commit-today-success) ![laravel](https://img.shields.io/badge/Laravel-10.0-red) ![languages](https://img.shields.io/badge/languages-4-orange)

Built with the tools and technologies:

![Linux](https://img.shields.io/badge/Linux-black?style=flat-square&logo=linux) ![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php) ![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=flat-square&logo=laravel) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql)

![Composer](https://img.shields.io/badge/Composer-885630?style=flat-square&logo=composer) ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=githubactions) ![PHPUnit](https://img.shields.io/badge/PHPUnit-3775A9?style=flat-square&logo=php) ![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss) ![Blade](https://img.shields.io/badge/Blade-FF2D20?style=flat-square&logo=laravel) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript)

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

ArticleOS is a powerful Reddit-like platform specifically designed for Linux enthusiasts. It provides a fully-featured community experience with Linux-focused content, distro-specific communities, and robust open-source principles.

### Why ArticleOS?

This project empowers Linux users to build communities around their favorite distributions, desktop environments, and open-source projects, leveraging modern PHP technologies and best practices. The core features include:

- 🐧 **Linux-Focused Content**: Communities dedicated to various Linux distributions, tools, and topics.

- 🔍 **Laravel Framework**: Built on the robust Laravel framework for security, performance, and maintainability.

- 🔒 **Dependency Management**: Composer for PHP package management ensures consistent behavior across environments.

- 🎨 **Component Architecture**: Blade templates and Tailwind CSS integration enhance design consistency and maintainability.

- 🔑 **User Authentication**: Laravel's built-in authentication system provides robust user management and security features.

- 📱 **Responsive Design**: The application adapts to various devices, ensuring a seamless user experience on laptops, desktops, and mobile devices.

- 🌐 **Distro-Specific Communities**: Dedicated spaces for Ubuntu, Arch, Fedora, Debian, and other major distributions.

---

## Getting Started

### Prerequisites

This project requires the following dependencies:

- **Operating System**: Any Linux distribution (ideal for development but can run on Windows/macOS)
- **Web Server**: Apache or Nginx
- **PHP**: 8.1 or higher
- **Database**: MySQL 5.7+ or MariaDB 10.3+
- **Composer**: Latest version
- **Node.js/NPM**: For frontend asset compilation

### Installation

Build ArticleOS from the source and install dependencies:

```bash
# Clone the repository
git clone https://github.com/ahmedcalif/ArticleOS.git

# Navigate to the project directory
cd ArticleOS

# Install PHP dependencies
composer install

# Install frontend dependencies
npm install

# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env file
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=ArticleOS
# DB_USERNAME=root
# DB_PASSWORD=

# Run database migrations 
php artisan migrate 

# Compile frontend assets
npm run build
```

### Usage

Start the development server:

```bash
npm run dev
php artisan serve
```


## Features

- **Subreddit-Style Communities**: Create communities centered around specific Linux topics
- **Dark/Light Themes**: Multiple themes with system integration
- **Post Content**: Share links, questions, or discussions with the community
- **Comment System**: Reply to posts and engage in conversations
- **User Settings**: Customize your profile and preferences
- **Simple UI**: Clean, distraction-free interface focused on content

