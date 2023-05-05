const btn = document.getElementById('get-data');
const hostname = document.getElementById('hostname');
const pincodeContainer = document.querySelector('.pincode-container');
const postOfficeContainer = document.querySelector('.post-container');
const dateTime = document.getElementById('date-time');
const long = document.getElementById('long');
const infoContainer = document.querySelector('.info-container');
const lat = document.getElementById('lat');
const region = document.getElementById('region');
const organisation = document.getElementById('organisation');
const geoLocation = document.getElementById('geoLocation');
const city = document.getElementById('city');
const timeZone = document.getElementById('time-zone');
const pincode = document.getElementById('pincode');
const message = document.getElementById('message');
const search = document.getElementById('search');


var IP;
var latitude;
var longitude;
var dataJson;
var pin;
var postOfficeArr = [];

fetch('https://api.ipify.org?format=json')
    .then((response) => response.json())
    .then((data) => {
        console.log(data.ip);
        IP = data.ip;
        document.getElementById('ipAddress').innerText = data.ip;
    }).catch((e) => {
        console.log("Error while fetching your Ip address", e);
    })

btn.addEventListener('click', () => {
    console.log('helloo');

    setTimeout(() => {
        fetch(`https://ipinfo.io/${IP}/geo?token=b34bee81575506`)
            .then((response) => response.json())
            .then((data) => {
                dataJson = data;
                console.log("data", dataJson);
                let location = dataJson.loc;
                latitude = location.split(',')[0];
                longitude = location.split(',')[1];
                lat.innerHTML = `<strong>Lat: </strong>${latitude}`;
                long.innerHTML = `<strong>Long: </strong>${longitude}`;
                city.innerHTML = `<strong>City: </strong>${dataJson.city}`;
                region.innerHTML = `<strong>Region: </strong>${dataJson.region}`;
                organisation.innerHTML = `<strong>Organisation: </strong>${dataJson.org}`;
                hostname.innerHTML = `<strong>Hostname: </strong>${dataJson.hostname}`;

                geoLocation.setAttribute('src', `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&amp&output=embed`);

                let datetime_str = new Date().toLocaleString("en-US", { timeZone: `${dataJson.timezone}` });
                timeZone.innerHTML = `<strong>Time Zone: </strong>${dataJson.timezone}`;
                dateTime.innerHTML = `<strong>Date And Time: </strong>${datetime_str}`;
                pin = dataJson.postal;
                pincode.innerHTML = `<strong>Pincode: </strong>${dataJson.postal}`;
                postOffice(pin);

            })
            .catch((e) => console.log('Error', e))



    }, 1000);


    btn.style.display = 'none';
    infoContainer.style.display = 'flex';
    pincodeContainer.style.display = 'block';
})

function postOffice(pin) {
    console.log(pin);
    fetch(`https://api.postalpincode.in/pincode/${pin}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data[0]);
            message.innerHTML = `<strong>Message: </strong>${data[0].Message}`;
            console.log(data[0].PostOffice);
            postOfficeArr = data[0].PostOffice;
            search.style.display = 'block';

            showPostOffice(postOfficeArr);
        })
        .catch((e) => {
            console.log("Error", e);
        })

}

function showPostOffice(Arr) {
    postOfficeContainer.innerHTML = '';
    let myHtml = '';
    Arr.forEach((ele) => {
        myHtml += `
        <div class="post-content">
         <div><strong>Name:</Strong> ${ele.Name}</div>
         <div><strong>Branch Type:</Strong> ${ele.BranchType}</div>
         <div><strong>Delivery Status:</Strong> ${ele.DeliveryStatus}</div>
         <div><strong>District:</Strong> ${ele.District}</div>
         <div><strong>Division:</Strong> ${ele.Division}</div>
        </div>
        `
    })
    postOfficeContainer.innerHTML = myHtml;
}


search.addEventListener('input', () => {
    var filterArr = postOfficeArr.filter((ele) => {

        if (ele.Name.toLowerCase().includes(search.value.trim().toLowerCase())) {
            return ele;
        }
    })
    showPostOffice(filterArr);
})




