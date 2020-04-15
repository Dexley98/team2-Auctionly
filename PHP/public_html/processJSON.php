<?php

require 'vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header("Content-Type: text/plain");

// var_dump(http_response_code(200));
// echo $item["itemName"];
// $data = json_decode(file_get_contents('php://input'), true);


// \Stripe\Stripe::setApiKey('sk_test_3ylFfZ8lM7Yv36r1FUXZlsoG00pWujDn1A');

// Token is created using Stripe Checkout or Elements!
// Get the payment token ID submitted by the form:

// $charge = \Stripe\Charge::create([
//   'amount' => 999,
//   'currency' => 'usd',
//   'description' => 'Example charge',
//   'source' => $data,
// ]);

$item=file_get_contents('php://input');

$stringArray = explode("!", $item);

\Stripe\Stripe::setApiKey('sk_test_3ylFfZ8lM7Yv36r1FUXZlsoG00pWujDn1A');

// echo $item;


$ARR = [
    'success_url' => 'https://localhost:3006/home',
    'cancel_url' => 'https://localhost:3006/home',
    'payment_method_types' => ['card'],
    'line_items' => [
      [
        'name' => $stringArray[0],
        'description' =>  $stringArray[2],
        'amount' => ((int)$stringArray[1]) * 100,
        'currency' => 'usd',
        'quantity' => 1,
      ],
    ]
];


$a = \Stripe\Checkout\Session::create($ARR);

echo $a["id"];




?> 

