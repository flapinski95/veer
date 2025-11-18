package com.veer.route.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.veer.route.model.Route;

@Repository
public interface RouteRepository extends JpaRepository<Route, String> {

}

