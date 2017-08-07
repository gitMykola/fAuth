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
    FB.init({
        appId      : '1454282237994850',
        cookie     : true,  // enable cookies to allow the server to access
                            // the session
        xfbml      : false,  // parse social plugins on this page
        version    : 'v2.8', // use graph api version 2.8
    });

    FB.getLoginStatus(function(response) {

        console.log('getLoginStatus');
        console.dir(response);
        let btnText = '';
        if (response.status === 'connected')btnText = 'Continue with Facebook';
        else btnText = 'Log in with Facebook';
        document.querySelector('#btnFaceBook').innerHTML = btnText;
    });

    document.querySelector('#btnFaceBook').addEventListener('click',function(e){apiFriends(e);});
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
    FB.api('/1917942968417437/friends', function(response) {
        console.log('Successful login for: ' + response.name);
        //document.getElementById('status').innerHTML = 'Thanks for logging. Welcome ' + response.name + '!';
        console.dir(response);
    });
}

function apiFriends(e)
{
    e.preventDefault();
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            console.log('Logged in.');
            FB.api('/me', {fields:'name,email,friends'},function(res){console.dir(res)});
            //window.location.href = '/';
        }
        else {
            FB.login(function(res){
                FB.api('/me', {fields:'name,email,friends'},function(res){console.dir(res)});
                if (response.status === 'connected') window.location.href = '/';
            });
        }
    });
}