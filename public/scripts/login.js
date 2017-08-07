/**
 * Created by Nick on 01.08.2017.
 */
document.getElementById('signForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {name:"non"};
    var inputs = this.getElementsByTagName('input');
    for(var i = 0; i < inputs.length; i++){
        data[inputs[i].name] = inputs[i].value;
        console.log(inputs[i].name + ' ' +inputs[i].value + ' ' +data[inputs[i].name]);
    }
    if(!verify(data)) return false;
    if(data.cpwd)data.cpwd = null;
        var href, host = 'http://localhost:3032';
        host += (inputs.length > 2) ? '/auth/register' : '/auth/login';
        href = (inputs.length > 2) ? '/auth/login' : '/';
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.dir(this.responseText);
                //if(this.responseText.err){
                var response = JSON.parse(this.responseText);
                if (response.err !== null) document.querySelector('#alarm').innerHTML = response.err;//}
                else window.location.href = href;
            }
        };
        xhttp.open("POST", host, true);
        xhttp.setRequestHeader('Authorization', 'Basic ' + data['email'] + ':' + data['pwd'])
        xhttp.setRequestHeader('Content-Type', 'application/json');
        console.log(JSON.stringify(data));
        xhttp.send(JSON.stringify(data));
    function verify(data){
        var err = null;
        for(i in data)
        {
            if(data[i].length < 3) {err="Please check " + ((i == "pwd")?'password':i) + ". It should be more 2 symbols.";break}
            if(data[i].length > 50) {err="Please check " + ((i == "pwd")?'password':i) + ". It should be less 50 symbols.";break}
            if(!data[i].match( /[a-zA-Z0-9@_.]/ )){err="Please check " + ((i == "pwd")?'password':i)
                + ". It should consist of digits 0-9, characters a-z A-Z, may be symbols @_.";break}
        }
        if(!data.email.match( /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ ))
        err="Please check email.";
        if(data.pwd.length < 6) errr="Password should be more 6 symbols.";
        if(inputs.length > 2)
            if(data.pwd !== data.cpwd)err = "Password not equal to confirm password.";
        if(err) {document.querySelector('#alarm').innerHTML = err; return false}
        return true;
    }
});