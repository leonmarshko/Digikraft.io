const request = require('request')
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'indego_test',
})

connection.connect(function (err) {
  if (err) throw err
  console.log('Database Connected!')
})

let bike_api_url = 'https://kiosks.bicycletransit.workers.dev/phl'
let weather_api_url =
  'https://api.openweathermap.org/data/2.5/weather?q=Philadelphia&appid=13be0f7aca0320609d51e5780afe053f'

function insertBikesData(url, callback) {
  return request(
    {
      method: 'GET',
      url: url,
    },
    function (error, response, body) {
      if (error) {
        return callback({
          errorResponse: error,
          propertiesToInsert: false,
          bikesToInsert: false,
        })
      } else {
        let jsonRes = JSON.parse(body)
        const readyPropertiesData = jsonRes.features.map((data) => {
          let id = data.properties.id
          let name = data.properties.name
          let totalDocks = data.properties.totalDocks
          let docksAvailable = data.properties.docksAvailable
          let bikesAvailable = data.properties.bikesAvailable
          let classicBikesAvailable = data.properties.classicBikesAvailable
          let smartBikesAvailable = data.properties.smartBikesAvailable
          let electricBikesAvailable = data.properties.electricBikesAvailable
          let rewardBikesAvailable = data.properties.rewardBikesAvailable
          let rewardDocksAvailable = data.properties.rewardDocksAvailable
          let kioskStatus = data.properties.kioskStatus
          let kioskPublicStatus = data.properties.kioskPublicStatus
          let kioskConnectionStatus = data.properties.kioskConnectionStatus
          let kioskType = data.properties.kioskType
          let addressStreet = data.properties.addressStreet
          let addressCity = data.properties.addressCity
          let addressState = data.properties.addressState
          let addressZipCode = data.properties.addressZipCode
          let closeTime = data.properties.closeTime
          let eventEnd = data.properties.eventEnd
          let eventStart = data.properties.eventStart
          let isEventBased = data.properties.isEventBased
          let isVirtual = data.properties.isVirtual
          let kioskId = data.properties.kioskId
          let notes = data.properties.notes
          let openTime = data.properties.openTime
          let publicText = data.properties.publicText
          let timeZone = data.properties.timeZone
          let trikesAvailable = data.properties.trikesAvailable
          let latitude = data.properties.latitude
          let longitude = data.properties.longitude

          return [
            id,
            name,
            totalDocks,
            docksAvailable,
            bikesAvailable,
            classicBikesAvailable,
            smartBikesAvailable,
            electricBikesAvailable,
            rewardBikesAvailable,
            rewardDocksAvailable,
            kioskStatus,
            kioskPublicStatus,
            kioskConnectionStatus,
            kioskType,
            addressStreet,
            addressCity,
            addressState,
            addressZipCode,
            closeTime,
            eventEnd,
            eventStart,
            isEventBased,
            isVirtual,
            kioskId,
            notes,
            openTime,
            publicText,
            timeZone,
            trikesAvailable,
            latitude,
            longitude,
          ]
        })

        const readyBikesData = jsonRes.features.map((data) => {
          let result = []
          let id
          let dockNumber
          let isElectric
          let isAvailable
          let battery

          for (let i = 0; i < data.properties.bikes.length; i++) {
            id = data.properties.id
            dockNumber = data.properties.bikes[i].dockNumber
            isElectric = data.properties.bikes[i].isElectric
            isAvailable = data.properties.bikes[i].isAvailable
            battery = data.properties.bikes[i].battery
            const returnValue = [
              id,
              dockNumber,
              isElectric,
              isAvailable,
              battery,
            ]
            result.push(returnValue)
          }
          return result
        })
        return callback({
          errorResponse: false,
          propertiesToInsert: readyPropertiesData,
          bikesToInsert: readyBikesData,
        })
      }
    },
  )
}

function insertWeatherData(url, callback) {
  return request(
    {
      method: 'GET',
      url: url,
    },
    function (error, body) {
      if (error) {
        return callback({
          errorResponse: error,
          weathersToInsert: false,
        })
      } else {
        let now = new Date(Date.now())

        let jsonRes = JSON.parse(body.body)
        let lon = jsonRes.coord.lon
        let lat = jsonRes.coord.lat
        let temp = jsonRes.main.temp
        let feels_like = jsonRes.main.feels_like
        let temp_min = jsonRes.main.temp_min
        let temp_max = jsonRes.main.temp_max
        let pressure = jsonRes.main.pressure
        let humidity = jsonRes.main.humidity
        let visibility = jsonRes.visibility
        let wind_speed = jsonRes.wind.speed
        let wind_deg = jsonRes.wind.deg
        let wind_gust = jsonRes.wind.gust
        let clouds = jsonRes.clouds.all
        let dt = jsonRes.dt
        let sys_type = jsonRes.sys.type
        let sys_id = jsonRes.sys.id
        let sys_country = jsonRes.sys.country
        let sys_sunrise = jsonRes.sys.sunrise
        let sys_sunset = jsonRes.sys.sunset
        let timeZone = jsonRes.timezone
        let id = jsonRes.id
        let name = jsonRes.name
        let cod = jsonRes.cod
        let date = now

        return callback({
          errorResponse: false,
          weathersToInsert: [
            lon,
            lat,
            temp,
            feels_like,
            temp_min,
            temp_max,
            pressure,
            humidity,
            visibility,
            wind_speed,
            wind_deg,
            wind_gust,
            clouds,
            dt,
            sys_type,
            sys_id,
            sys_country,
            sys_sunrise,
            sys_sunset,
            timeZone,
            id,
            name,
            cod,
            date,
          ],
        })
      }
    },
  )
}

setInterval(() => {
  insertBikesData(
    bike_api_url,
    ({ errorResponse, propertiesToInsert, bikesToInsert }) => {
      if (errorResponse) {
        throw callback.errorResponse
      }
      //below is where I might make an insert statement to insert my values into a mysql table
      var createPropertiesTable =
        'CREATE TABLE properties (id INT(4), name VARCHAR(255), totalDocks  INT(4), docksAvailable INT(4), bikesAvailable INT(4), classicBikesAvailable INT(4), smartBikesAvailable INT(4), electricBikesAvailable INT(4), rewardBikesAvailable INT(4), rewardDocksAvailable INT(4), kioskStatus VARCHAR(100), kioskPublicStatus VARCHAR(100), kioskConnectionStatus VARCHAR(100), kioskType INT(4), addressStreet VARCHAR(100), addressCity VARCHAR(100), addressState VARCHAR(100), addressZipCode VARCHAR(100), closeTime VARCHAR(100), evenEnd VARCHAR(100), evenStart VARCHAR(100), isEventBased TINYINT, isVirtual TINYINT, kioskId INT(4), notes VARCHAR(100), openTime VARCHAR(100), publicText VARCHAR(100), timeZone VARCHAR(100), trikesAvailable INT(4), latitude FLOAT(10), longitude FLOAT(10))'

      var insertPropertiesTable =
        'INSERT INTO properties (id, name, totalDocks, docksAvailable, bikesAvailable, classicBikesAvailable, smartBikesAvailable, electricBikesAvailable, rewardBikesAvailable, rewardDocksAvailable, kioskStatus, kioskPublicStatus, kioskConnectionStatus, kioskType, addressStreet, addressCity, addressState, addressZipCode, closeTime, evenEnd, evenStart, isEventBased, isVirtual, kioskId, notes, openTime, publicText, timeZone, trikesAvailable, latitude, longitude) VALUES ?'

      var deletePropertiesTableData = 'DELETE FROM properties'

      var createBikesTable =
        'CREATE TABLE bikes (id INT(4), dockNumber INT(4), isElectric TINYINT, isAvailable TINYINT, battery FLOAT(10))'

      var insertBikesTable =
        'INSERT INTO bikes (id, dockNumber, isElectric, isAvailable, battery) VALUES ?'

      var deleteBikesTableData = 'DELETE FROM bikes'

      let bikesData = []
      for (let i = 0; i < bikesToInsert.length; i++) {
        for (let j = 0; j < bikesToInsert[i].length; j++) {
          bikesData.push(bikesToInsert[i][j])
        }
      }

      connection.query('SHOW TABLES LIKE "properties"', (error, results) => {
        if (error) return console.log(error)

        if (results.length) {
          connection.query(deletePropertiesTableData, function (err, result) {
            if (err) throw err

            connection.query(
              insertPropertiesTable,
              [propertiesToInsert],
              function (err, result) {
                if (err) throw err
                console.log(result.affectedRows + ' rows inserted')
              },
            )
          })

          // console.log('bikes to insert', bikesToInsert)

          connection.query(deleteBikesTableData, function (err, result) {
            if (err) throw err

            connection.query(insertBikesTable, [bikesData], function (
              err,
              result,
            ) {
              if (err) throw err
              console.log(result.affectedRows + ' rows inserted(bikes table)')
            })
          })
        } else {
          connection.query(createPropertiesTable, function (err, result) {
            if (err) throw err
            connection.query(
              insertPropertiesTable,
              [propertiesToInsert],
              function (err, result) {
                if (err) throw err
                console.log(
                  result.affectedRows + ' rows inserted(properties table)',
                )
              },
            )
          })

          connection.query(createBikesTable, function (err, result) {
            if (err) throw err

            connection.query(insertBikesTable, [bikesData], function (
              err,
              result,
            ) {
              if (err) throw err
              console.log(result.affectedRows + ' rows inserted(bikes table)')
            })
          })
        }
      })
    },
  )
}, `${1000 * 60 * 60}`)

return setInterval(() => {
  insertWeatherData(weather_api_url, ({ errorResponse, weathersToInsert }) => {
    if (errorResponse) {
      throw callback.errorResponse
    }

    //below is where I might make an insert statement to insert my values into a mysql table
    var createWeatherTable =
      'CREATE TABLE weathers (lon FLOAT(10), lat FLOAT(10), temp FLOAT(10), feels_like FLOAT(10), temp_min FLOAT(10), temp_max FLOAT(10), pressure FLOAT(10), humidity FLOAT(10), visibility INT(10), wind_speed FLOAT(10), wind_deg FLOAT(10), wind_gust FLOAT(10), clouds INT(10), dt INT(10), sys_type INT(10), sys_id INT(10), sys_country VARCHAR(100), sys_sunrise INT(10), sys_sunset INT(10), timeZone INT(10), id INT(10), name VARCHAR(100), cod INT(10), date VARCHAR(10))'

    var insertWeatherTable =
      'INSERT INTO weathers (lon , lat , temp , feels_like , temp_min , temp_max , pressure, humidity, visibility, wind_speed, wind_deg, wind_gust, clouds, dt , sys_type , sys_id , sys_country, sys_sunrise, sys_sunset, timeZone, id, name, cod, date) VALUES (?)'

    connection.query('SHOW TABLES LIKE "weathers"', (error, results) => {
      if (error) return console.log('error ===>', error)

      if (results.length) {
        connection.query(insertWeatherTable, [weathersToInsert], function (
          err,
          result,
        ) {
          if (err) throw err
          console.log(result.affectedRows + ' rows inserted(weathers table)')
        })
      } else {
        connection.query(createWeatherTable, function (err, result) {
          if (err) throw err
          connection.query(insertWeatherTable, [weathersToInsert], function (
            err,
            result,
          ) {
            if (err) throw err
            console.log(result.affectedRows + ' rows inserted(weathers table)')
          })
        })
      }
    })
  })
}, `${1000 * 60 * 60 * 24}`)
