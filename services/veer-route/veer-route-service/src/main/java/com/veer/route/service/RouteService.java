package com.veer.route.service;

import com.veer.route.model.dto.CreateRouteDto;
import com.veer.route.model.dto.ResponseRouteDto;
import com.veer.route.model.dto.UpdateRouteDto;

public interface RouteService {

    public abstract ResponseRouteDto createRoute(CreateRouteDto createRouteDto);

    public abstract ResponseRouteDto getRouteById(String routeId);

    public abstract void deleteRouteById(String routeId);

    public abstract ResponseRouteDto updateRoute(UpdateRouteDto updateRouteDto);

}

