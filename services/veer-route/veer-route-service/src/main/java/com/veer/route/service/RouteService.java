package com.veer.route.service;

import com.veer.route.model.dto.CreateRouteDto;
import com.veer.route.model.dto.ResponseRouteDto;
import com.veer.route.model.dto.UpdateRouteDto;

public interface RouteService {

    ResponseRouteDto createRoute(CreateRouteDto createRouteDto);

    ResponseRouteDto getRouteById(String routeId);

    void deleteRouteById(String routeId);

    ResponseRouteDto updateRoute(UpdateRouteDto updateRouteDto);

}

