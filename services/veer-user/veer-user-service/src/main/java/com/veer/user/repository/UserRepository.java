package com.veer.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.veer.user.model.User;

public interface UserRepository extends JpaRepository<User, String> {

}
