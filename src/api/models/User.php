<?php

require_once "Db.php";

class User
{

  private $_select = "SELECT * FROM secondsense_users";
  private $_insert = "INSERT INTO secondsense_users(facebook_user_id, facebook_user_name) VALUES (:facebook_id, :facebook_name)";
  private $_update = "UPDATE secondsense_users SET facebook_user_name = :facebook_name WHERE facebook_user_id = :facebook_id";
  private $_delete = "DELETE FROM secondsense_users WHERE facebook_user_id = :facebook_id";
  private $_dbh;

  public function __construct()
  {
    $db = Db::getInstance();
    $this->_dbh = $db->getConnection();

  }

  public function getAll()
  {
    $sql = $this->_select . " ORDER BY facebook_user_name";

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
    $sql = $this->_select . " WHERE facebook_user_id = :facebook_id ORDER BY facebook_user_name";

    try {
      $stmt = $this->_dbh->prepare($sql);
      $stmt->bindParam("facebook_id", $id);
      $stmt->execute();
      $result = $stmt->fetchObject();
      echo json_encode($result);

    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';

    }
  }

  public function getByName($name)
  {
    $sql = $this->_select . " WHERE UPPER(facebook_user_name) LIKE UPPER(:facebook_name) ORDER BY facebook_user_name";

    try {
      $stmt = $this->_dbh->prepare($sql);
      $name = "%".$name."%";
      $stmt->bindParam("facebook_name", $name);
      $stmt->execute();
      $result = $stmt->fetchAll(PDO::FETCH_OBJ);
      echo json_encode($result);

    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';

    }
  }

  public function getFriends($id)
  {
    $sql = "SELECT user_friends.* FROM secondsense_users AS user_friends
				    INNER JOIN secondsense_friends ON user_friends.facebook_user_id = secondsense_friends.facebook_user_id_friend
            INNER JOIN secondsense_users AS me ON secondsense_friends.facebook_user_id = me.facebook_user_id
            WHERE me.facebook_user_id = :facebook_id";

    try {
      $stmt = $this->_dbh->prepare($sql);
      $stmt->bindParam("facebook_id", $id);
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
        $stmt->bindParam("facebook_id", $vo->facebook_user_id);
        $stmt->bindParam("facebook_name", $vo->facebook_user_name);
        $stmt->execute();
        echo json_encode($vo);

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }

  public function update($vo)
  {
    try {
      $stmt = $this->_dbh->prepare($this->_update);
      $stmt->bindParam("facebook_id", $vo->facebook_user_id);
      $stmt->bindParam("facebook_name", $vo->facebook_user_name);
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
      $stmt->bindParam("facebook_id", $id);
      $stmt->execute();
      echo '{"success":{"text":"user deleted"}}';

    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';

    }
  }

}
