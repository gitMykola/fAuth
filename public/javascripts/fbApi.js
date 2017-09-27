
/**
 * Created by Nick on 31.07.2017.
 */
// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
    } else {
        // The person is not logged into your app or we are unable to tell.
        //document.getElementById('status').innerHTML = 'Please log into this app.';
    }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function(response) {

        console.log('checkLoginState getLoginStatus');
        console.dir(response);

        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    let atoken = '';
    FB.init({
        appId      : '146771535914435',//'1454282237994850',
        cookie     : true,  // enable cookies to allow the server to access
                            // the session
        xfbml      : false,  // parse social plugins on this page
        version    : 'v2.10', // use graph api version 2.8
    });

    FB.getLoginStatus(function(response) {

        console.log('getLoginStatus');
        console.dir(response);
        atoken = response.authResponse?response.authResponse.accessToken:'';
        let btnText = '';
        if (response.status === 'connected')btnText = 'Continue with Facebook';
        else btnText = 'Log in with Facebook';
        document.querySelector('#btnFaceBook').innerHTML = btnText;
    });

    document.querySelector('#btnFaceBook').addEventListener('click',function(e){apiFriends(e, atoken)/*testGraph(e, atoken)*/;});
    document.querySelector('#btnETH').addEventListener('click',function(e){testETH(e)});
};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me?fields=name,email,friends', function(response) {
        console.log('Successful login for: ' + response.name);
        //document.getElementById('status').innerHTML = 'Thanks for logging. Welcome ' + response.name + '!';
        console.dir(response);
    });
}

function apiFriends(e, at)
{
    e.preventDefault();
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            console.log('Logged in.');
            console.log(at);
            //at = 'EAACFfOlC5cMBABuDbGPH9e7DHRaiNLBWXiORiG7iNEQbYdl8Td36zfaJ8bXlc35MYv7GdyrCLTdRXEK14uks5kpt3laPZAtezZAns0b2hH6jVabBApMPMfpdC8GVRe70yw36AeANHr53JlTnxOE4RevTXXgyWjAmCnn7vFX9E2Pawr98UrP8TQ9k9DiUYpWMj2rPnB9PCdB8K46SNtLFMO8A1tIPQZD';
            FB.api('/106421600092706?access_token='+at+ '&fields=name,email,friends', {fields:'name,email,friends'},function(res){console.dir(res)});
            //window.location.href = '/';

            var host = 'https://graph.facebook.com';
            //host += '/v2.8/106421600092706?access_token=' + at + '&fields=name,email,friends';
            host += '/v2.8/me?access_token=' + at + '&fields=name,email,friends';
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    console.dir(JSON.parse(this.responseText));
                }
            };
            xhttp.open("GET", host, true);/*
             xhttp.setRequestHeader('Authorization', 'Basic ' + data['email'] + ':' + data['pwd'])
             xhttp.setRequestHeader('Content-Type', 'application/json');*/
            xhttp.send();
        }
        else {
            FB.login(function(res){
                FB.api('/me', {fields:'name,email,friends'},function(res){console.dir(res)});
                if (response.status === 'connected') window.location.href = '/';
            });
        }
    });
}
function testETH(e)
{
    e.preventDefault();
    let host = 'http://btc.blockr.io/api/v1/coin/info';
    let xhttp = new XMLHttpRequest();
    let data = null;
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //console.dir(this.responseText);
            data = JSON.parse(this.responseText);
            console.dir(data);
            let lastBlock = data.data.last_block.nb;
            console.dir(lastBlock);

            let blocks = (new Array(8).fill(0).map((item, index) => lastBlock - index));
            let host2 = 'http://btc.blockr.io/api/v1/block/txs/' + blocks.join(',');
            let xhttp2 = new XMLHttpRequest();
            let data2 = null;
            xhttp2.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    //console.dir(this.responseText);
                    data2 = JSON.parse(this.responseText);
                    console.dir(data2);
                    document.querySelector('#ethInfo').innerHTML += data2.toString();
                }
            };
            xhttp2.open("GET", host2, true);
            xhttp2.send();



        }
    };
    xhttp.open("GET", host, true);
    xhttp.send();
}
!(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.10";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));