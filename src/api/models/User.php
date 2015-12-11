<?php

require_once 'Db.php';

class User
{

  private $_select = "SELECT * FROM secondsense_users ";
  private $_insert = "INSERT INTO secondsense_users(name, score) VALUES(:name , :score)";
  private $_update = "UPDATE secondsense_users SET name = :name, score = :score WHERE id = :id";
  private $_delete = "DELETE FROM secondsense_users WHERE id = :id";

  public function __construct()
  {
    $db = Db::getInstance();
    $this->_dbh = $db->getConnection();

  }

  public function getAll()
  {
    $sql = $this->_select . " ORDER BY name";

    try {
      $stmt = $this->_dbh->query($sql);
      $result = $stmt->fetchAll(PDO::FETCH_OBJ);
      echo json_encode($result);

    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';

    }
  }

  public function getById($id)
  {
    $sql = $this->_select . " WHERE id = :id ORDER BY name";

    try {
      $stmt = $this->_dbh->prepare($sql);
      $stmt->bindParam("id", $id);
      $stmt->execute();
      $result = $stmt->fetchObject();
      echo json_encode($result);

    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';

    }
  }

  public function getByName($name)
  {
    $sql = $this->_select . " WHERE UPPER(name) LIKE UPPER(:name) ORDER BY name";

    try {
      $stmt = $this->_dbh->prepare($sql);
      $name = "%".$name."%";
      $stmt->bindParam("name", $name);
      $stmt->execute();
      $result = $stmt->fetchAll(PDO::FETCH_OBJ);
      echo json_encode($result);

    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';

    }
  }

  public function insert($vo)
  {

    try {
      $stmt = $this->_dbh->prepare($this->_insert);
      $stmt->bindParam("name", $vo->name);
      $stmt->bindParam("score", $vo->score);
      $stmt->execute();
      $vo->id = $db->lastInsertId();
      echo json_encode($vo);

    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';

    }
  }

  public function update($vo)
  {
    try {
      $stmt = $this->_dbh->prepare($this->_update);
      $stmt->bindParam("name", $vo->name);
      $stmt->bindParam("score", $vo->score);
      $stmt->bindParam("id", $vo->id);
      $stmt->execute();
      echo json_encode($vo);

    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';

    }
  }

  public function delete($id)
  {
    try {
      $stmt = $this->_dbh->prepare($this->_delete);
      $stmt->bindParam("id", $id);
      $stmt->execute();
      echo 'ok';

    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';

    }
  }

}
