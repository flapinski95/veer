package com.veer.route.service;

import org.springframework.stereotype.Service;
import com.veer.route.repository.RouteRepository;
import com.veer.route.model.exception.RouteAlreadyExistsException;
import com.veer.route.model.exception.RouteNotFoundException;
import com.veer.route.RouteMapper;
import com.veer.route.model.Route;
import com.veer.route.model.dto.CreateRouteDto;
import com.veer.route.model.dto.ResponseRouteDto;
import com.veer.route.model.dto.UpdateRouteDto;

@Service
public class RouteServiceImpl implements RouteService {

    RouteRepository repository;

    public RouteServiceImpl(RouteRepository repository) {
        this.repository = repository;
    }

    @Override
    public ResponseRouteDto createRoute(CreateRouteDto createRouteDto) {
        if (repository.findById(createRouteDto.getId()).isPresent()) {
            throw new RouteAlreadyExistsException(
                "Route " + createRouteDto.getId() + " already exists"
            );
        }
        Route route = RouteMapper.toEntity(createRouteDto);
        Route savedRoute = repository.save(route);
        return RouteMapper.toResponseRouteDto(savedRoute);
    }

    @Override
    public ResponseRouteDto getRouteById(String routeId) {
        Route route = repository.findById(routeId)
            .orElseThrow(() -> new RouteNotFoundException(
                "Route " + routeId + " not found"
            ));
        return RouteMapper.toResponseRouteDto(route);
    }

    @Override
    public void deleteRouteById(String routeId) {
        Route route = repository.findById(routeId)
            .orElseThrow(() -> new RouteNotFoundException(
                "Route " + routeId + " not found"
            ));
        repository.delete(route);
    }

    @Override
    public ResponseRouteDto updateRoute(UpdateRouteDto updateRouteDto) {
        Route route = repository.findById(updateRouteDto.getId())
            .orElseThrow(() -> new RouteNotFoundException(
                "Route " + updateRouteDto.getId() + " not found"
            ));

        Route updatedRoute = updateRouteEntity(route, updateRouteDto);

        Route savedRoute = repository.save(updatedRoute);
        
        return RouteMapper.toResponseRouteDto(savedRoute);
    }

    private Route updateRouteEntity(Route route, UpdateRouteDto updateRouteDto) {
        if (updateRouteDto.getPoints() != null) 
            route.setPoints(updateRouteDto.getPoints());
        if (updateRouteDto.getName() != null) 
            route.setName(updateRouteDto.getName());
        if (updateRouteDto.getDescription() != null) 
            route.setDescription(updateRouteDto.getDescription());
        if (updateRouteDto.getIsPublic() != null)
            route.setIsPublic(updateRouteDto.getIsPublic());
        if (updateRouteDto.getRating() != null)
            route.setRating(updateRouteDto.getRating());

        return route;
    }
}

