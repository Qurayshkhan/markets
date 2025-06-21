<?php
namespace App\Http\Controllers;
use Service;


require_once("../../../loader.php");

$user = new Service();
$filePath = '../../../files/users.csv';
var_dump($filePath);
if (!file_exists($filePath)) {
    echo "File not found.";
    return;
}
$file = fopen($filePath, "r");
if ($file !== false) {
    fgetcsv($file);
    $import = 0;
    while (($row = fgetcsv($file, 1000, ",")) !== false) {
        if (count($row) < 7)
            continue;

        $userData = [
            'fname' => trim($row[0]),
            'lname' => trim($row[1]),
            'user_name' => trim($row[0]) . '_' . $row[1] . '_' . uniqid("old"),
            'locker' => trim($row[2]),
            'email' => trim($row[3]),
            'phone' => trim($row[4]),
            'country' => trim($row[5]),
            'password' => password_hash("demo12345", PASSWORD_DEFAULT),
            'userlevel' => 1,
            'is_old' => true,
        ];

        $is_import = $user->import_users($userData);

        if ($is_import) {
            $import++;
        }
    }

    fclose($file);
    echo "$import users imported successfully.";
} else {
    echo "Could not open file.";
}
