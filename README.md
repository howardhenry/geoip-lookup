# Geo-IP Lookup &middot; [![Build Status](https://travis-ci.org/howardhenry/geoip-lookup.svg?branch=master)](https://travis-ci.org/howardhenry/geoip-lookup)

Node.js microservice providing geoip lookup via Maxmind's GeoLite2-City db.

Maxmind provides a [free](http://dev.maxmind.com/geoip/geoip2/geolite2/), less accurate version of their GeoIP database, which can be used to determine the geo-coordinates (latitude, longitude) of an IP address to a certain degree of accuracy.

This **Geo-IP Lookup** microservice downloads and queries this _GeoLite2 City_ database to provide the related geo-ip data for the specified IP address.

## Running
Install dependencies
```
$ npm install
```

## IP Lookup

GET geolocation data for IP in English (default)

#### Query params

**ip**
Valid IPv4 or IPv6 address to query geolocation data

Type: String
Required: YES

**verbose**
Show _geoname_id_ property on each location field

Type: Boolean
Required: NO

**lang**
Return location names in the specified locales (if available) for the _city_, _continent_, _country_ and _registered_country_ properties of the data object. If the specified language is not available for a property, the location name for that property will be returned in English.

Type: String
Accepted values: `de`, `en`, `es`, `fr`, `ja`, `pt-BR`, `ru`, `zh-CN`
Required: NO

#### Example

```
$ curl -i 'http://<hostname>:<port>/lookup?ip=69.89.31.226'
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 425
X-Response-Time: 72.588ms
Date: Fri, 10 Mar 2017 07:56:51 GMT
Connection: keep-alive

{
    "city": {
        "name": "Provo"
    },
    "continent": {
        "code": "NA",
        "name": "North America"
    },
    "country": {
        "iso_code": "US",
        "name": "United States"
    },
    "location": {
        "accuracy_radius": 1000,
        "latitude": 40.2338,
        "longitude": -111.6585,
        "metro_code": 770,
        "time_zone": "America/Denver"
    },
    "postal": {
        "code": "84606"
    },
    "registered_country": {
        "iso_code": "US",
        "name": "United States"
    },
    "subdivisions": [
        {
            "iso_code": "UT",
            "name": "Utah"
        }
    ]
}
```
