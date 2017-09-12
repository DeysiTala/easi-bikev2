const app = {
    item: {
      map: undefined,
      latitud: undefined,
      longitud: undefined
    },
    init: function(){
      app.map = new google.maps.Map($("#map")[0], {
        zoom: 10,
        center: {lat: -33.4724728, lng: -70.9100251},
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl:false
    });

    var inputOrigen = $('#origen');
    var autocompleteOrigen = new google.maps.places.Autocomplete(inputOrigen);
    autocompleteOrigen.bindTo('bounds', map);
    var detalleUbicacionOrigen = new google.maps.InfoWindow();
    var markerOrigen = createMarker(map);

    crearListener(autocompleteOrigen, detalleUbicacionOrigen, markerOrigen);

    var inputDestino = $('#destino');
    var autocompleteDestino = new google.maps.places.Autocomplete(inputDestino);
    autocompleteDestino.bindTo('bounds', map);
    var detalleUbicacionDestino = new google.maps.InfoWindow();
    var markerDestino = createMarker(map);

    crearListener(autocompleteDestino, detalleUbicacionDestino, markerDestino);

    /* Mi ubicación actual */
    $('#encuentrame').click(app.buscarMiUbicacion);
    
    /* Ruta */
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    $('#ruta').click(function(){dibujarRuta(directionsService, directionsDisplay)});

    directionsDisplay.setMap(map);

    function crearListener(autocomplete, detalleUbicacion, marker) {
        autocomplete.on('place_changed', function() {
            app.detalleUbicacion.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            marcarUbicacion(app.place, app.detalleUbicacion, app.marker);
        });
    }

    
    buscarMiUbicacion : function() {
        if(app.navigator.geolocation){
            app.navigator.geolocation.getCurrentPosition(app.marcarUbicacionAutomatica,app.funcionError);
        }
    }

    var funcionError = function(error) {
        alert("Tenemos un problema para encontrar tu ubicación");
    }

    var marcarUbicacionAutomatica = function(posicion) {
        var latitud,longitud;
        latitud = posicion.coords.latitude;
        longitud = posicion.coords.longitude;

        markerOrigen.setPosition(new google.maps.LatLng(latitud,longitud));
        map.setCenter({lat:latitud,lng:longitud});
        map.setZoom(17);

        //inputOrigen.value = new google.maps.LatLng(latitud,longitud); //CON ESTO LOGRO QUE EN EL INPUT ORIGEN SALGA LAS COORDENADAS DE MI UBICACION

        app.markerOrigen.setVisible(true);

        app.detalleUbicacionOrigen.setContent('<div><strong>Mi ubicación actual</strong><br>');
        app.detalleUbicacionOrigen.open(app.map,app.markerOrigen);
    }

    var marcarUbicacion = function(place, detalleUbicacion, marker) {
        if (!place.geometry) {
            // Error si no encuentra el lugar indicado
            window.alert("No encontramos el lugar que indicaste: '" + place.name + "'");
            return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        detalleUbicacion.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        detalleUbicacion.open(map, marker);
    }

    function createMarker(map) {
        var icono = {
            url: 'http://icons.iconarchive.com/icons/sonya/swarm/128/Bike-icon.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        };

        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            icon: icono,
            anchorPoint: new google.maps.Point(0, -29)
        });

        return marker;
    }

    function dibujarRuta(directionsService, directionsDisplay) {
        var origin = $('#origen').val;
        var destination = $('#destino').val;

        if(destination != "" && destination != "") {
            directionsService.route({
                origin: origin,
                destination: destination,
                travelMode: "DRIVING"
            },
            function(response, status) {
                if (status === "OK") {
                    directionsDisplay.setDirections(response);
                } else {
                    funcionError();
                }
            });
        }
    }

    $(document).ready(function(){
        $("p").click(function(){
            alert("Tenemos un problema para encontrar tu ubicación.");
        });

}
}