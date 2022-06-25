var mysql = require('mysql')

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  // password: "yourpassword"
  database: 'indego_test',
})

con.connect(function (err) {
  if (err) throw err
  console.log('Database Connected!')
})

const getData = (sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, function (err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

exports.getDataByDate = async (req, res) => {
  try {
    console.log(req.params)
    const propertiesData = await getData(`SELECT * FROM properties`)

    const bikesData = await getData(`SELECT * FROM bikes`)

    const weather = await getData(
      `SELECT * FROM weathers WHERE date = '${req.params.at.slice(0, 10)}'`,
    )

    const data = {
      at: req.params.at,
      station: {
        propertiesData,
        bikesData,
      },
      weather: weather,
    }

    res.status(200).json({ success: true, data: data })
  } catch (err) {
    res.status(400).json('Failed')
  }
}

exports.getDataByKioskId = async (req, res) => {
  try {
    const propertiesData = await getData(
      `SELECT * FROM properties WHERE kioskId = ${req.params.kioskid}`,
    )

    const bikesData = await getData(
      `SELECT * FROM bikes WHERE id = ${req.params.kioskid}`,
    )

    const weather = await getData(
      `SELECT * FROM weathers WHERE date = '${req.params.at.slice(0, 10)}'`,
    )

    const data = {
      at: req.params.at,
      station: {
        propertiesData,
        bikesData,
      },
      weather: weather,
    }

    res.status(200).json({
      success: true,
      data: { success: true, data: data },
    })
  } catch (err) {
    res.status(400).json('Failed')
  }
}
