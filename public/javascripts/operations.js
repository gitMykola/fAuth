$('#createAccount').on('click',(e)=>{createAccount(e)});

function createAccount(e){
    e.preventDefault();
    document.querySelector('#request').innerHTML = 'Wait ...';
    let host = 'http://localhost:3000/api/v1.0/createAccount';
    let xhttp = new XMLHttpRequest();
    let data = {passfrase:'123456',
                currency:'ETH'};
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //console.dir(this.responseText);
            data = JSON.parse(this.responseText);
            console.dir(data);
            document.querySelector('#request').innerHTML += data.toString();
        }
    };
    xhttp.open("POST", host, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
}