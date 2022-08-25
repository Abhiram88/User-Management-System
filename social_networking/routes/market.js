var request = require('request');

const API_KEY = '0CNNWDBPAIHOBJU6';


exports.getNiftyData = (req, res) =>{
    var url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey={API_KEY}`;

    request.get({
        url: url,
        json: true,
        headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
        if (err) {
        console.log('Error:', err);
        } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
        } else {
        // data is successfully parsed as a JSON object:
        console.log(data);
        console.log("hello");
        return data;
        }
});
}