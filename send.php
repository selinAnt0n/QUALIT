<?php
require_once __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/Models/Feedback.php';

use App\Models\Feedback;
use Swift_SmtpTransport as Transport;
use Swift_Mailer as Mailer;
use Swift_Message as Email;
use Illuminate\Database\Capsule\Manager as Eloquent;
use Rakit\Validation\Validator;

if (strtoupper($_SERVER['REQUEST_METHOD']) != "POST") {
    http_response_code(405);
    throw new \Exception('Unavailable HTTP Method', 405);
}

try {
    header('Accept: application/x-www-form-urlencoded');
    $request = json_decode(file_get_contents('php://input'), true);
    $validationErrors = validateRequest($request, Feedback::$rules);
    if (count($validationErrors) > 0) {
        return jsonResponse($validationErrors, 422);
    }
    $config = require __DIR__ . '/config/config.php';
    bootEloquent($config);
    date_default_timezone_set($config['app']['timezone']);

    $feedbackData = [
        'name'    => $request['name'],
        'email'   => $request['email'],
        'message' => $request['message'],
    ];
    $feedback = Feedback::create($feedbackData);

    $transport = new Transport();
    $mailer    = new Mailer($transport);
    $email     = new Email();
    $email->setSubject('Test Subject');
    $email->setFrom(['test@localhost' => 'John Doe']);
    $email->setTo([$config['app']['admin_email']]);
    $email->setBody(json_encode($feedback), null, 'UTF-8');

    $mailer->send($email);
    return jsonResponse($feedback, 201);
} catch (\Throwable $e) {
    return jsonResponse($e, 500);
}

function jsonResponse($data, $statusCode = 200)
{
    header('Content-Type: application/json');
    http_response_code($statusCode);


    if ($statusCode >= 400) {
        $response['status'] = 'error';
        $response['errors'] = $data;
        $response['data'] = [];
    } else {
        $response['status'] = 'success';
        $response['data'] = $data;
        $response['errors'] = [];
    }

    echo json_encode($response);

    return;
}

function validateRequest(array $data, array $rules)
{
    $errors = [];
    $validator = new Validator();
    $validation = $validator->validate($data, $rules);
    if ($validation->fails()) {
        $errors = $validation->errors->toArray();
    }

    return $errors;
}

/**
 * Boot Eloquent ORM
 * @return void
 */
function bootEloquent(array $config)
{
    $eloquent = new Eloquent();
    $eloquent->addConnection([
        'driver'    => 'mysql',
        'charset'   => 'utf8',
        'collation' => 'utf8_general_ci',
        'prefix'    => '',
        'host'      => $config['db']['host'],
        'database'  => $config['db']['database'],
        'username'  => $config['db']['user'],
        'password'  => $config['db']['password'],
    ]);
    $eloquent->setAsGlobal();
    $eloquent->bootEloquent();
}