//SECȚIUNEA 1
//window.addEventListener("load", informatii);

function informatii() {
    //obiect Date -> preia data și ora prin medota toString()
    var date = new Date();
    //se actualizeză conținutul HTML cu id-ul timpCurent
    var timpCurent = document.getElementById("timpCurent");
    timpCurent.innerHTML = date.toString();

    //preia adresa URL prin proprietatea window.location.href
    //se actualizeză conținutul HTML cu id-ul adresaURL
    var adresaMea = document.getElementById("adresaURL");
    adresaMea.innerHTML = window.location.href;

    //preia locația curentă prin proprietatea navigator.geolocation.getCurrentPosition
    //funcția actualizează conținutul HTML cu id-ul locatiaCurenta
    var locatiaCurenta = document.getElementById("locatiaCurenta");
    navigator.geolocation.getCurrentPosition(function (position) {
        locatiaCurenta.innerHTML = "Latitudine: " + position.coords.latitude + " și longitudine: " + position.coords.longitude;
    });

    //preia browser-ul utilizând proprietatea window.navigator.userAgent
    //se actualizeză conținutul HTML cu id-ul browser
    var browser = document.getElementById("browser");
    browser.innerHTML = window.navigator.userAgent;

}

//SECȚIUNEA 2
//window.addEventListener("load", deseneaza);

function deseneaza(){
    var canvas = document.getElementById("canva1");
    var umplere = document.getElementById("umplere");
    var contur = document.getElementById("contur");
    var context = canvas.getContext("2d");
    canvas.height = innerHeight; //înălțimea canvasului
    canvas.width = innerWidth; //lățimea canvasului

    //adaug un eveniment dblclick pe canvas
    canvas.addEventListener("dblclick", function(e){
        context.beginPath(); //începe o cale nouă
        context.lineWidth = "5"; //grosimea liniei conturului
        context.strokeStyle = contur.value; //culoarea conturului
        context.fillStyle = umplere.value; //culoarea umplerii
        context.fillRect(e.offsetX - 40, e.offsetY - 20, 80, 40);
        context.strokeRect(e.offsetX - 40, e.offsetY - 20, 80, 40);
        context.closePath(); //închide calea
    })
}

//SECȚIUNEA 3
function ButonColoana() {
    //valoarea pentru indexul coloanei e preluat cu id-ul liniaColoana
    var index = document.getElementById("liniaColoana"); 
    //valoarea pentru culoarea coloanei e preluat cu id-ul coloana
    var color = document.getElementById("coloana");
    //adaugă celulă nouă în tabelul cu id-ul tabelInvat
    let trs = document.querySelectorAll('#tabelInvat tr');

    //buclă pentru a itera prin fiecare rând 
    for (let tr of trs) {
        //inserează o nouă celulă la index și setează culoarea
        tr.insertCell(index.value).style.backgroundColor = color.value
    }
}

function ButonLinie() {
    //adaugă rând nou în tabelul cu id-ul tabelInvat
    var tabel = document.getElementById("tabelInvat");
    //valoarea pentru indexul liniei e preluat cu id-ul liniaColoana
    var index = document.getElementById("liniaColoana");
    //valoarea pentru culoarea liniei e preluat cu id-ul linie
    var color = document.getElementById("linie");
    var coloane = tabel.rows[0].cells.length //numarul de coloane

    //inserează o nouă celulă la index și se setează culoarea de fundal la celulă
    var tr = tabel.insertRow(index.value);
    for (var i = 0; i < coloane; ++i) {
        var td = tr.insertCell(i);
        td.style.backgroundColor = color.value;
        //text care indică numărul rândului și numărul celulei
        var tdText = document.createTextNode('row ' + index.value + ', cell ' + i);
        td.appendChild(tdText);
    }
}

function schimbaContinut(resursa, jsFisier, jsFunctie) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            document.getElementById("continut").innerHTML = xhttp.responseText;
            if (resursa == 'invat')
                {
                    informatii();
                }
                else if (resursa == 'inregistreaza')
                {
                    submitForm();
                    processForm();
                }
        }
    };
    xhttp.open("GET", resursa + ".html", true);
    xhttp.send();

    if (jsFisier) {
        var elementScript = document.createElement('script');
        elementScript.onload = function () {
            console.log("hello");
            if (jsFunctie) {
                window[jsFunctie]();
            }
        };
        elementScript.src = jsFisier;
        document.head.appendChild(elementScript);
    } else {
        if (jsFunctie) {
            window[jsFunctie]();
        }
    }
}

function verificaUtilizator() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var utilizatori = JSON.parse(this.responseText);
            var gasit = false;
            for (var i = 0; i < utilizatori.length; i++) {
                if (utilizatori[i].utilizator == username && utilizatori[i].parola == password) {
                    gasit = true;
                    break;
                }
            }
            if (gasit) {
                document.getElementById("rezultat").innerHTML = "Autentificare validă!";
            } else {
                document.getElementById("rezultat").innerHTML = "Autentificare invalidă!";
            }
        }
    };
    xhttp.open("GET", "resurse/utilizatori.json", true);
    xhttp.send();
}

function submitForm() {
    const checkbox = document.getElementById('acord');
    const submitButton = document.getElementById('submit');
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    });
}

function processForm() {
    var form = document.getElementById('inregistrare');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        //preiau datele din formular utilizând metoda getElementById()
        var utilizator = document.getElementById('utilizator').value;
        var parola = document.getElementById('parola').value;
        var nume = document.getElementById('nume').value;
        var prenume = document.getElementById('prenume').value;
        var email = document.getElementById('email').value;
        var telefon = document.getElementById('telefon').value;
        var sex = document.getElementById('sex').value;
        var gen_preferat = document.getElementById('gen_preferat').value;
        var culoare = document.getElementById('culoare').value;
        var data_nasterii = document.getElementById('data_nasterii').value;
        var ora_nasterii = document.getElementById('ora_nasterii').value;
        var varsta = document.getElementById('varsta').value;
        var pagina_personala = document.getElementById('pagina_personala').value;
        var descriere = document.getElementById('descriere').value;
        console.log(descriere);

        //apel la metoda fetch -> trimite datele către API
        fetch('api/utilizatori', {
            method: 'POST',
            body: JSON.stringify({
                utilizator: utilizator,
                parola: parola,
                nume: nume,
                prenume: prenume,
                email: email,
                telefon: telefon,
                sex: sex,
                gen_preferat: gen_preferat,
                culoare: culoare,
                data_nasterii: data_nasterii,
                ora_nasterii: ora_nasterii,
                varsta: varsta,
                pagina_personala: pagina_personala,
                descrire: descriere
                
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (data) {
            console.log(data)
        }).catch(error => console.error('Error:', error));
        //window.location.reload(); //actualizează pagina după ce s-au trimis datele
    });
}
