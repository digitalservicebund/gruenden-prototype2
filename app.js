import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";

const app = express();
const port = 7000;

app.locals.serviceName = "Schneller Gründen";
app.locals.serviceUrl = "/";

app.use(express.static("public"));

app.engine(".html", engine({ extname: ".html" }));
app.set("view engine", ".html");
app.set("views", "./views");

app.use(
  session({
    secret: "secretsecret",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(bodyParser.urlencoded());

app.get("/", (req, res) => {
  res.render("index", {
    layout: "single",
    pageName: "Kombi-Antrag Steuer und Gewerbe",
    session: req.session,
  });
});

app.post("/person/start", (req, res) => {
  res.redirect("/person/start");
});

app.get("/person/start", (req, res) => {
  res.render("person/start", {
    pageName: "Persönliche Daten",
    session: req.session,
  });
});

app.post("/person/name", (req, res) => {
  res.redirect("/person/name");
});

app.get("/person/name", (req, res) => {
  res.render("person/name", {
    pageName: "Wie heißen Sie?",
    session: req.session,
  });
});

app.post("/person/geburtsname", (req, res) => {
  req.session.vorname = req.body.vorname;
  req.session.nachname = req.body.nachname;

  req.session.personalStarted = true;
  res.redirect("/person/geburtsname");
});

app.get("/person/geburtsname", (req, res) => {
  res.render("person/geburtsname", { session: req.session });
});

app.post("/person/geburtsname", (req, res) => {
  res.redirect("/person/geburtsname");
});

app.post("/person/geburtsname/eingabe", function (req, res) {
  req.session.geburtsnamebool = req.body.geburtsnamebool;
  var hasGeburtsname = req.session.geburtsnamebool;

  if (hasGeburtsname == "ja") {
    res.redirect("/person/geburtsname/eingabe");
  } else {
    res.redirect("/person/geburtstag");
  }
});

app.get("/person/geburtsname/eingabe", (req, res) => {
  res.render("person/geburtsname-eingabe", { session: req.session });
});

app.post("/person/geburtstag", (req, res) => {
  req.session.geburtsname = req.body.geburtsname;
  res.redirect("/person/geburtstag");
});

app.get("/person/geburtstag", (req, res) => {
  res.render("person/geburtstag", { session: req.session });
});

app.post("/person/geburtsort", (req, res) => {
  req.session.tag = req.body.tag;
  req.session.monat = req.body.monat;
  req.session.jahr = req.body.jahr;
  res.redirect("/person/geburtsort");
});

app.get("/person/geburtsort", (req, res) => {
  res.render("person/geburtsort", { session: req.session });
});

app.post("/person/staatsangehoerigkeit", (req, res) => {
  req.session.geburtsort = req.body.geburtsort;
  req.session.geburtsland = req.body.geburtsland;
  res.redirect("/person/staatsangehoerigkeit");
});

app.get("/person/staatsangehoerigkeit", (req, res) => {
  res.render("person/staatsangehoerigkeit", { session: req.session });
});

app.post("/person/plz", (req, res) => {
  req.session.staatsangehoerigkeit = req.body.staatsangehoerigkeit;
  res.redirect("/person/plz");
});

app.get("/person/plz", (req, res) => {
  res.render("person/plz", { session: req.session });
});

app.post("/person/adresse", (req, res) => {
  req.session.plz = req.body.plz;
  res.redirect("/person/adresse");
});

app.get("/person/adresse", (req, res) => {
  res.render("person/adresse", { session: req.session });
});

app.post("/person/angaben", (req, res) => {
  req.session.strasse = req.body.strasse;
  req.session.hausnummer = req.body.hausnummer;
  req.session.ort = req.body.ort;

  req.session.personalDone = true;
  res.redirect("/person/angaben");
});

app.get("/person/angaben", (req, res) => {
  res.render("person/angaben", {
    pageName: "Eingaben überprüfen",
    session: req.session,
  });
});

app.post("/unternehmen/start", (req, res) => {
  res.redirect("/unternehmen/start");
});

app.get("/unternehmen/start", (req, res) => {
  res.render("unternehmen/start", { session: req.session });
});

app.post("/unternehmen/adresse-abweichend", (req, res) => {
  res.redirect("/unternehmen/adresse-abweichend");
});

app.get("/unternehmen/adresse-abweichend", (req, res) => {
  res.render("unternehmen/adresse-abweichend", { session: req.session });
});

app.post("/unternehmen/adresse-eingabe", function (req, res) {
  req.session.adresseAbweichend = req.body.adresseAbweichend;
  req.session.unternehmenStarted = true;
  var adresseAbweichend = req.session.adresseAbweichend;

  if (adresseAbweichend == "ja") {
    res.redirect("/unternehmen/taetigkeit");
    // res.redirect("/unternehmen/adresse-eingabe");
  } else {
    res.redirect("/unternehmen/taetigkeit");
  }
});

app.get("/unternehmen/adresse-eingabe", (req, res) => {
  res.render("unternehmen/adresse-eingabe", { session: req.session });
});

app.post("/unternehmen/taetigkeit", (req, res) => {
  res.redirect("/unternehmen/taetigkeit");
});

app.get("/unternehmen/taetigkeit", (req, res) => {
  res.render("unternehmen/taetigkeit", { session: req.session });
});

app.post("/unternehmen/taetigkeit-begonnen", (req, res) => {
  req.session.taetigkeit = req.body.taetigkeit;
  res.redirect("/unternehmen/taetigkeit-begonnen");
});

app.get("/unternehmen/taetigkeit-begonnen", (req, res) => {
  res.render("unternehmen/taetigkeit-begonnen", { session: req.session });
});

app.post("/unternehmen/taetigkeit-beginn", function (req, res) {
  req.session.taetigkeitBegonnen = req.body.taetigkeitBegonnen;
  res.redirect("/unternehmen/taetigkeit-beginn");
});

app.get("/unternehmen/taetigkeit-beginn", (req, res) => {
  var taetigkeitBegonnen = req.session.taetigkeitBegonnen == "ja";

  res.render("unternehmen/taetigkeit-beginn", {
    session: req.session,
    taetigkeitBegonnen: taetigkeitBegonnen,
  });
});

app.post("/unternehmen/gewerbeart", (req, res) => {
  req.session.taetigkeitBeginnTag = req.body.taetigkeitBeginnTag;
  req.session.taetigkeitBeginnMonat = req.body.taetigkeitBeginnMonat;
  req.session.taetigkeitBeginnJahr = req.body.taetigkeitBeginnJahr;
  res.redirect("/unternehmen/gewerbeart");
});

app.get("/unternehmen/gewerbeart", (req, res) => {
  res.render("unternehmen/gewerbeart", { session: req.session });
});

app.post("/unternehmen/angaben", (req, res) => {
  req.session.gewerbeart = req.body.gewerbeart;

  req.session.unternehmenDone = true;
  res.redirect("/unternehmen/angaben");
});

app.get("/unternehmen/angaben", (req, res) => {
  res.render("unternehmen/angaben", {
    pageName: "Eingaben überprüfen",
    session: req.session,
  });
});

app.listen(port);
console.log("Server is running at http://localhost:" + port);
