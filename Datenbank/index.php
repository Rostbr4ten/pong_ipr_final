<?php include ('config/db.php')?>
<?php include ('config/config.php')?>
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
  <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="css/index.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
</head>
<body>
<script>
  window.location.href = 'https://powerful-retreat-12345.herokuapp.com/';
</script>
</body>
</html>
