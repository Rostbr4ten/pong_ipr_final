<?php include ('Datenbank/config/db.php')?>
<?php include ('Datenbank/config/config.php')?>
<?php
if(isset($_GET['name']) && isset($_GET['punkte'])) {
    $stmt = $pdo->prepare("INSERT INTO users (name, punkte)VALUES (:name, :punkte)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':punkte', $punkte);
    $name = $_GET["name"];
    $punkte = $_GET["punkte"];
  try {
    $stmt->execute();
  } catch (PDOException $e) {
    $e->getMessage();
  }
}
?>

<html>
<head>
  <title>DB Insert</title>
  <link rel="stylesheet" type="text/css" href="Datenbank/css/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="Datenbank/css/index.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
</head>
<body>
<script>
  window.location.href = 'https://pong-ipr.herokuapp.com/';
</script>
</body>
</html>
