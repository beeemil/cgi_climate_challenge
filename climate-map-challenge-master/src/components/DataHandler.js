const Avg = (temps) => {
    // Filter NaNs
    const filTemps = temps.filter(x => x)
    return filTemps.reduce((a,b) => (a+b)) / filTemps.length
  }
  
  
  const DailySum = (data) => {
    data.map(time => {
      // Since it's weekly data, we can group the data by day
      time.time = new Date(time.time).toString().split(" ")[2]
      return time})
  
    const sums = data.reduce(function(acc,obj) {
      var date = obj.time
      var value = obj.value
      // check if the object for the date exists, if not: create a new object
      if (!acc[date]) {
        acc[date] = {sum:0}
      }
      //filter out NaN temperatures
      if (isNaN(value)) {
        return acc
      } else {
        acc[date].sum += value
        return acc
        }
    }, Object.create(null))
    //return an object
    return Object.keys(sums).map(function(date){
      return {[date]:sums[date].sum}
    })
  }
  
  
  const DailyAvg = (data) => {
    data.map(time => {
      // Since it's weekly data, we can group the data by day
      time.time = new Date(time.time).toString().split(" ")[2]
      return time})
  
    const sums = data.reduce(function(acc,obj) {
      var date = obj.time
      var value = obj.value
      // check if the object for the date exists, if not: create a new object
      if (!acc[date]) {
        acc[date] = {sum:0, count: 0}
      }
      //filter out NaN temperatures
      if (isNaN(value)) {
        return acc
      } else {
        acc[date].sum += value
        acc[date].count++
        return acc
        }
    }, Object.create(null))
    //return an object, count averages
    return Object.keys(sums).map(function(date){
      return {[date]:sums[date].sum/sums[date].count}
    })
  }
  
  const DataZipper = (dailyTemps,dailyRain) => {
    dailyTemps = dailyTemps.map(item => {
                      const [date,avgtemp] = Object.entries(item)[0]
                      return {date, avgtemp}})
    dailyRain = dailyRain.map(item => {
                      const [date,accrain] = Object.entries(item)[0]
                      return {date, accrain}})
    const dailyWeather =  dailyTemps.map((item, i) => Object.assign({}, item, dailyRain[i]))
    
    return dailyWeather
  }

  export {Avg, DailySum, DailyAvg, DataZipper}