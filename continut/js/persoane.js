function incarcaPersoane() {
    console.log("Incarca persoane...");
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            //preluare xml
            text = this.responseXML;
            //console.log(text)
            //extrage persoane
            persons = text.getElementsByTagName("persoana");
            //console.log(persons)
            //creare tabel
            var htmlTableContent =
                "<table>" +
                "<tr>" +
                "<th>Nume</th>" +
                "<th>Prenume</th>" +
                "<th>Varsta</th>" +
                "<th>Adresa</th>" +
                "<th>CV</th>" +
                "</tr>";

            //populare tabel
            for (var index = 0; index < persons.length; index++) {
                pers = persons[index];
                var adresa = pers.getElementsByTagName("adresa")[0];
                var CV = pers.getElementsByTagName("CV")[0];
                htmlTableContent +=
                    "<tr>" +
                    "<td>" + pers.getElementsByTagName("nume")[0].textContent + "</td>" +
                    "<td>" + pers.getElementsByTagName("prenume")[0].textContent + "</td>" +
                    "<td>" + pers.getElementsByTagName("varsta")[0].textContent + "</td>" +
                    "<td>" + adresa.getElementsByTagName("strada")[0].textContent + ", " + adresa.getElementsByTagName("numar")[0].textContent + ", " + adresa.getElementsByTagName("localitate")[0].textContent + ", " + adresa.getElementsByTagName("judet")[0].textContent + ", " + adresa.getElementsByTagName("tara")[0].textContent + "</td>" +
                    "<td>" + CV.getElementsByTagName("numartelefon")[0].textContent + ", " + CV.getElementsByTagName("email")[0].textContent + "</td>" +
                    "</tr>";
            }

            htmlTableContent += "</table>";
            document.getElementById("incarcaPersoane").innerHTML = htmlTableContent;
        }
    };

    //metoda open -> specifică cererea : metoda GET și locația XML-ului
    xhttp.open("GET", "resurse/persoane.xml", true);
    //metoda send -> trimite cererea la server
    xhttp.send();
}