<?php
session_start();
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: registro.html');
    exit;
}

$nombre   = trim($_POST['nombre'] ?? '');
$apellido = trim($_POST['apellido'] ?? '');
$numero   = trim($_POST['numero'] ?? '');
$email    = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

// Validaciones básicas del lado del servidor
if (empty($nombre) || empty($apellido) || empty($numero) || empty($email) || empty($password)) {
    die("Todos los campos son obligatorios. <a href='registro.html'>Volver</a>");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("El correo electrónico no tiene un formato válido. <a href='registro.html'>Volver</a>");
}

if (strlen($password) < 8) {
    die("La contraseña debe tener al menos 8 caracteres. <a href='registro.html'>Volver</a>");
}

try {
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = :email LIMIT 1");
    $stmt->execute(['email' => $email]);

    if ($stmt->fetch()) {
        die("Ese correo electrónico ya está registrado. <a href='login.html'>Inicia sesión</a>");
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios (nombre, apellido, numero, email, password_hash)
            VALUES (:nombre, :apellido, :numero, :email, :password_hash)";
    $insert = $pdo->prepare($sql);
    $insert->execute([
        'nombre'        => $nombre,
        'apellido'      => $apellido,
        'numero'        => $numero,
        'email'         => $email,
        'password_hash' => $passwordHash
    ]);

    header('Location: ../HTML/login.html?registro=exitoso');
    exit;

} catch (PDOException $e) {
    die("Error al registrar el usuario: " . $e->getMessage());
}