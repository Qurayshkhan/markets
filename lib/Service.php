<?php

class Service
{
    private $db;
    public function __construct()
    {
        $this->db = new Conexion;
    }

    public function import_users($data)
    {
        $checkSql = "SELECT id FROM cdb_users WHERE email = :email";
        $this->db->cdp_query($checkSql);
        $this->db->bind(':email', $data['email']);
        $existing = $this->db->cdp_fetch_assoc();

        if ($existing) {
            return false;
        }
        $sql = "INSERT INTO cdb_users (username,fname, lname, locker, email, phone, country, password, userlevel, is_old) VALUES (:username, :fname, :lname, :locker, :email, :phone, :country, :password, :userlevel, :is_old)";
        $this->db->cdp_query($sql);
        $this->db->bind(':username', $data['user_name']);
        $this->db->bind(':fname', $data['fname']);
        $this->db->bind(':lname', $data['lname']);
        $this->db->bind(':locker', $data['locker']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':phone', $data['phone']);
        $this->db->bind(':country', $data['country']);
        $this->db->bind(':password', $data['password']);
        $this->db->bind(':userlevel', $data['userlevel']);
        $this->db->bind(':is_old', $data['is_old']);
        return $this->db->cdp_execute();
    }
}