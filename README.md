# DealApp

## Description
.

## init project

- npm i
- composer install
NOTE: after the step composer install probably you will get an error, usually
this error is because probably you are gonna need discomment some lines in the file
inside xampp in the folder php called php.ini, and uncomment the line
extension=gd and extension=zip and save the file, then run again compser install, if you
get an error again, check the errors and look what other lines you may need to uncomment
and save the file again.
- create DB with name “dealApp”
- php artisan migrate
- make a registration in the frontend
- on the db create a company, company_user, rol, rol_user and a registration of each table
- to run de entire project, run php artisan serve and npm run dev



## Mac install
- Xampp
- Composer

### Edit .zshrc

```
export XAMPP_HOME=/Applications/XAMPP
export PATH=${XAMPP_HOME}/bin:${PATH}
export PATH
```

### install
```
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
```

### Move composer.phar
```
sudo mv composer.phar /usr/local/bin/composer

```
https://www.youtube.com/watch?v=PM_zCpLVMV4


https://www.youtube.com/watch?v=TPplLs0vdLE



## Migrations and Seeders to database

```
php artisan migrate:refresh --seed
```
