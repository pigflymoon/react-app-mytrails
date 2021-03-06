import React from 'react';
import Search from '../Search/Search.jsx';
import Map from '../Map/Map.jsx';
import CurrentLocation from '../CurrentLocation/CurrentLocation.jsx';
import LocationList from '../LocationList/LocationList.jsx';


export default class App extends React.Component {

    constructor(props) {
        super(props);
        // Extract the favorite locations from local storage
        this.searchForAddress = this.searchForAddress.bind(this);

        this.isAddressInFavorites = this.isAddressInFavorites.bind(this);
        this.toggleFavorite = this.toggleFavorite.bind(this);
        // this.addToFavorites = this.addToFavorites.bind(this);
        // this.removeFromFavorites = this.removeFromFavorites.bind(this);

        var favorites = [];

        if (localStorage.favorites) {
            favorites = JSON.parse(localStorage.favorites);
        }

        // Nobody would get mad if we center it on Paris by default
        this.state = {
            favorites: favorites,
            currentAddress: 'Paris,France',
            mapCoordinates: {
                lat: 48.856614,
                lng: 2.3522219
            }
        };


    }

    toggleFavorite(address) {

        if (this.isAddressInFavorites(address)) {
            this.removeFromFavorites(address);
        }
        else {
            this.addToFavorites(address);
        }

    }


    addToFavorites(address) {

        var favorites = this.state.favorites;

        favorites.push({
            address: address,
            timestamp: Date.now()
        });

        this.setState({
            favorites: favorites
        });

        localStorage.favorites = JSON.stringify(favorites);
    }


    removeFromFavorites(address) {

        var favorites = this.state.favorites;
        var index = -1;

        for (var i = 0; i < favorites.length; i++) {

            if (favorites[i].address == address) {
                index = i;
                break;
            }

        }

        // If it was found, remove it from the favorites array

        if (index !== -1) {

            favorites.splice(index, 1);

            this.setState({
                favorites: favorites
            });

            localStorage.favorites = JSON.stringify(favorites);
        }

    }


    isAddressInFavorites(address) {
        console.log(address);

        var favorites = this.state.favorites;

        for (var i = 0; i < favorites.length; i++) {

            if (favorites[i].address == address) {
                return true;
            }

        }

        return false;
    }


    searchForAddress(address) {

        var self = this;
        // this.setState = this.setState.bind(this);
        // We will use GMaps' geocode functionality,
        // which is built on top of the Google Maps API

        GMaps.geocode({
            address: address,
            callback: function (results, status) {

                if (status !== 'OK') return;

                var latlng = results[0].geometry.location;
                console.log('latlan' +latlng);

                self.setState({
                    currentAddress: results[0].formatted_address,
                    mapCoordinates: {
                        lat: latlng.lat(),
                        lng: latlng.lng()
                    }
                });

            }
        });

    }

    render() {
        return (
            <div>
                <h1>Your Google Maps Locations</h1>

                <Search onSearch={this.searchForAddress}/>

                <Map lat={this.state.mapCoordinates.lat} lng={this.state.mapCoordinates.lng}/>

                <CurrentLocation address={this.state.currentAddress}
                                 favorite={this.isAddressInFavorites(this.state.currentAddress)}
                                 onFavoriteToggle={this.toggleFavorite}/>

                <LocationList locations={this.state.favorites} activeLocationAddress={this.state.currentAddress}
                              onClick={this.searchForAddress}/>

            </div>

        )
    }




}

