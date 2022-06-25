var assert = require('assert')
var axios = require('axios')

describe('StationAPI', function () {
  var dateValue = { at: '2022-06-25' }
  var kioskId = { kioskid: 3009, at: '2022-06-25' }
  it('Should be return true(getDataByDate)', async () => {
    var result = await axios.get(
      `http://localhost:8080/api/v1/stations/${dateValue.at}`,
    )
    assert.equal(result.data.success, true)
  })

  it('Should be return correct Date(getDataByDate)', async () => {
    var result = await axios.get(
      `http://localhost:8080/api/v1/stations/${dateValue.at}`,
    )
    assert.equal(result.data.data.at, dateValue.at)
  })

  it('Should be return true(getDataByKioskId)', async () => {
    var result = await axios.get(
      `http://localhost:8080/api/v1/stations/${kioskId.kioskid}/${kioskId.at}`,
    )
    assert.equal(result.data.success, true)
  })

  it('Should be return correct Date(getDataByKioskId)', async () => {
    var result = await axios.get(
      `http://localhost:8080/api/v1/stations/${kioskId.kioskid}/${kioskId.at}`,
    )
    assert.equal(result.data.data.data.at, kioskId.at)
  })
})
