<?php
session_start();
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: login.html');
    exit;
}

$email    = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    die("Por favor ingresa tu correo y contraseña. <a href='login.html'>Volver</a>");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Correo electrónico inválido. <a href='login.html'>Volver</a>");
}

try {
    $stmt = $pdo->prepare("SELECT id, nombre, apellido, email, password_hash FROM usuarios WHERE email = :email LIMIT 1");
    $stmt->execute(['email' => $email]);
    $usuario = $stmt->fetch();

    if ($usuario && password_verify($password, $usuario['password_hash'])) {
        session_regenerate_id(true);

        $_SESSION['usuario_id']     = $usuario['id'];
        $_SESSION['usuario_nombre'] = $usuario['nombre'];
        $_SESSION['usuario_email']  = $usuario['email'];

        header('Location: ../HTML/home.html');
        exit;
    } else {
        die("Correo o contraseña incorrectos. <a href='../HTML/login.html'>Intentar de nuevo</a>");
    }

} catch (PDOException $e) {
    die("Error al iniciar sesión: " . $e->getMessage());
}