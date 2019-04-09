<?php

$servername = "localhost";
$username = "root";
$password = "";
$db = "apib2";

$conn = new mysqli($servername, $username, $password, $db);

if($conn->connect_error){
    die("Connection Failed: " . $conn->connect->error);
}

$id = isset($_GET['id']) ? $_GET['id'] : null;
$name = isset($_GET['name']) ? $_GET['name'] : null;
$gender = isset($_GET['gender']) ? $_GET['gender'] : null;

if($id != null){
    $sql = "SELECT id, name, gender FROM mahasiswa WHERE id = " . $id;

    $result = $conn->query($sql);
}
elseif($name != null){
    $sql = "SELECT id, name, gender FROM mahasiswa WHERE name = " . $name;

    $result = $conn->query($sql);
}
elseif($gender != null){
    $sql = "SELECT id, name, gender FROM mahasiswa WHERE gender = " . $gender;

    $result = $conn->query($sql);
}
else{
    $sql = "SELECT id, name, gender FROM mahasiswa";

    $result = $conn->query($sql);
}

$res = [];
while($data = $result->fetch_assoc()){
    array_push($res, [
        'id'        => $data['id'],
        'name'      => $data['name'],
        'gender'    => $data['gender'],
    ]);
}


header("Content-type:application/json");
echo json_encode($res);