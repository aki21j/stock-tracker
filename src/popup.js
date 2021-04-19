const AVAILABLE_CRYPTOS = {
  'Bitcoin': 'bitcoin',
  'Dogecoin':'dogecoin',
  'XRP': 'ripple'
}

const DEFAULT_INTERVAL = 30 * 1000

let apiTimeout = setTimeout(getAllCryptoData, DEFAULT_INTERVAL)
let currency = 'inr'
createTable()
getAllCryptoData()

function createTable(){
  let html = document.querySelector(".data-back").innerHTML
  for(const cryptoName of Object.keys(AVAILABLE_CRYPTOS)){
    html += ` <tr id=${AVAILABLE_CRYPTOS[cryptoName]}><td><img width="30" height="30"></td>
    <td>${cryptoName}</td>
    <td>-</td>
    <td>-</td>
    <td>-</td></tr>`
  }
  document.querySelector(".data-back").innerHTML = html;
}

function getAllCryptoData(){
  for(const crypto of Object.values(AVAILABLE_CRYPTOS)){
    fetchData(crypto)
  }
  // apiTimeout = setTimeout(getAllCryptoData, DEFAULT_INTERVAL);
}

function fetchData(crypto){
    fetch(`https://api.coingecko.com/api/v3/coins/${crypto}?tickers=true`)
    .then(response => response.json())
    .then(data => {
      renderData(data, crypto)
    })
    .catch(function(){
         clearTimeout(apiTimeout);
    });
}

const renderData = (responseData, crypto) => {
  const marketData = responseData['market_data']
  const img = responseData['image']['thumb']
  const name= responseData['name']
  const price= marketData['current_price'][currency]
  const lowDay= marketData['low_24h'][currency]
  const highDay= marketData['high_24h'][currency]
  const changePercent = marketData['market_cap_change_percentage_24h']

  let output = `
    <tr id=${crypto}><td><img src=${img} width="30" height="30"></td>
    <td>${name}</td>
    <td>${price}</td>
    <td>${changePercent}%</td>
    <td>${highDay}</td>
    <td>${lowDay}</td></tr>`
  document.getElementById(crypto).innerHTML = output;
  console.log(name, price)
}

function updateCurrency(){
  const currencySelector = document.getElementById("currencySelector")
  currency = currencySelector.options[currencySelector.selectedIndex].value
}