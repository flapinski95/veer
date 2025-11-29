package com.veer.route.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.veer.route.model.Route;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, String> {

    List<Route> findByCreatedBy(String createdBy);

}

