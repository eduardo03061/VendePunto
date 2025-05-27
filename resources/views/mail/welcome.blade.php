<?php
$mail_template_title = 'VendePunto';
$mail_template_url_domain = 'www.vendepunto.com';
$mail_template_url   = '//www.vendepunto.com/';
$path_logo = 'https://vendepunto.com/assets/img-welcome.png';
$mail_template_color_bg = '#5d9d29';
$mail_template_color_font = '#505050';

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a VendePunto</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f9f9f9;
            color: #505050;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header img {
            width: 100%;
            max-width: 600px;
        }
        .content h1 {
            font-size: 24px;
            font-weight: 600;
            color: #333;
        }
        .content p {
            font-size: 16px;
            font-weight: 300;
            line-height: 1.5;
        }
        .social-icons {
            margin-top: 20px;
        }
        .social-icons img {
            width: 30px;
            margin: 0 10px;
        }
        .footer {
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://vendepunto.com/assets/mail/mail-hd.png" alt="VendePunto Header">
        </div>
        <div class="content">
            <h1>Bienvenido a VendePunto</h1>
            <h2>¡Hola {{$data['name']}}!</h2>
            <p>Bienvenid@ a VendePunto, tu herramienta aliada para gestionar ventas, inventario y mucho más de forma sencilla y eficiente.</br>Estás a un paso de optimizar tu negocio. </br> Inicia sesión y explora todas las funcionalidades que hemos diseñado para ti.</p>
            <p><strong>¡Que tus ventas crezcan sin límites!</strong></p>
            <p>Equipo VendePunto</p>
        </div>
        <div class="social-icons flex">
            <a href="#"><img src="https://vendepunto.com/assets/mail/fb.png" alt="Facebook"></a>
            <a href="#"><img src="https://vendepunto.com/assets/mail/ig.png" alt="Instagram"></a>
            <a href="#"><img src="https://vendepunto.com/assets/mail/in.png" alt="LinkedIn"></a>
            <a href="#"><img src="https://vendepunto.com/assets/mail/tiktok.png" alt="TikTok"></a>
            <a href="#"><img src="https://vendepunto.com/assets/mail/wp.png" alt="WhatsApp"></a>
        </div>
        <div class="footer">
            <p>Consulta los <a href="#">Términos de tu Suscripción</a> para más información. <br>Consulta nuestras <a href="#">Políticas de Seguridad y Privacidad</a>.</p>
        </div>
    </div>
</body>
</html>
