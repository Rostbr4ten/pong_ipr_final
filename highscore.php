<!DOCTYPE html>
<html>
<head> <title> Highscore </title>
<meta charset="UTF-8">
<html lang="de">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="styletwo.css">
</head>
<body bgcolor="#E6E6FA">
<?php include ('config/db.php')?>
<?php include ('config/config.php')?>
<center>
<br>
  <div><a href="index.html"><button type="button" class="btn btn-danger">Zurück zum Hauptmenü</button></a></div>
<br>
<?php
echo "<table style='border: solid 1px black;'>";
echo "<tr><th>Name</th></tr>";

class TableRows extends RecursiveIteratorIterator {
  function __construct($it) {
      parent::__construct($it, self::LEAVES_ONLY);
  }

  function current() {
      return "<td style='width:150px;border:1px solid black;'>" . parent::current(). "</td>";
  }

  function beginChildren() {
      echo "<tr>";
  }

  function endChildren() {
      echo "</tr>" . "\n";
  }
}

try {
  // $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $stmt = $pdo->prepare("SELECT name FROM users");
  $stmt->execute();

  // set the resulting array to associative
  $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
  foreach(new TableRows(new RecursiveArrayIterator($stmt->fetchAll())) as $k=>$v) {
      echo $v;
  }
}
catch(PDOException $e) {
  echo "Error: " . $e->getMessage();
}
echo "</table>";






/*echo '<div class="container"> <table class="table-bordered">'; // oder "table table-hover"?
echo "<thead> <tr> <th>Name</th><th>Highscore</th> </tr></thead>";
echo "<tbody>";
while ($zeile = mysqli_fetch_array( $db_erg, MYSQLI_ASSOC))
{
  echo "<tr>";
  echo "<td>". $zeile['Name'] . "</td>";
  echo "<td>". $zeile['Highscore'] . "</td>";
  echo "</tr>";
}
echo '</tbody> </table> </div>';*/
?>
</body>
</html>
