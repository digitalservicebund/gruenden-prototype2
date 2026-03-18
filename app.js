import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";

const app = express();
const port = Number.parseInt(process.env.PORT ?? "7070", 10);
const host = process.env.HOST ?? "localhost";

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
    pageName: "Kombi-Antrag Steuer und Gewerbe",
    start: true,
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

app.post("/person/bundid", (req, res) => {
  res.redirect("/person/bundid");
});

app.get("/person/bundid", (req, res) => {
  res.render("person/bundid", {
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

// app.get("/person/geburtsname", (req, res) => {
//   res.render("person/geburtsname", { session: req.session });
// });
//
// app.post("/person/geburtsname", (req, res) => {
//   res.redirect("/person/geburtsname");
// });
//
// app.post("/person/geburtsname/eingabe", function (req, res) {
//   req.session.geburtsnamebool = req.body.geburtsnamebool;
//   var hasGeburtsname = req.session.geburtsnamebool;
//
//   if (hasGeburtsname == "ja") {
//     res.redirect("/person/geburtsname/eingabe");
//   } else {
//     res.redirect("/person/geburtstag");
//   }
// });
//
// app.get("/person/geburtsname/eingabe", (req, res) => {
//   res.render("person/geburtsname-eingabe", { session: req.session });
// });

app.post("/person/geburtstag", (req, res) => {
  req.session.vorname = req.body.vorname;
  req.session.nachname = req.body.nachname;
  req.session.geburtsname = req.body.geburtsname;

  req.session.personalStarted = true;
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

app.post("/person/adresse", (req, res) => {
  req.session.staatsangehoerigkeit = req.body.staatsangehoerigkeit;
  res.redirect("/person/adresse");
});

app.get("/person/adresse", (req, res) => {
  res.render("person/adresse", { session: req.session });
});

app.post("/person/steuer-id", (req, res) => {
  req.session.strasse = req.body.strasse;
  req.session.hausnummer = req.body.hausnummer;
  req.session.plz = req.body.plz;
  req.session.ort = req.body.ort;

  res.redirect("/person/steuer-id");
});

app.get("/person/steuer-id", (req, res) => {
  res.render("person/steuer-id", { session: req.session });
});

// app.post("/person/angaben", (req, res) => {
//   req.session.steuerid = req.body.steuerid;
//   req.session.personalDone = true;
//   res.redirect("/person/angaben");
// });
//
// app.get("/person/angaben", (req, res) => {
//   res.render("person/angaben", {
//     pageName: "Eingaben überprüfen",
//     session: req.session,
//   });
// });

app.post("/person/status", (req, res) => {
  req.session.steuerid = req.body.steuerid;
  req.session.personalDone = true;
  res.redirect("/person/status");
});

app.get("/person/status", (req, res) => {
  res.render("person/status", { session: req.session });
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

app.post("/unternehmen/ustid", (req, res) => {
  req.session.gewerbeart = req.body.gewerbeart;
  res.redirect("/unternehmen/ustid");
});

app.get("/unternehmen/ustid", (req, res) => {
  res.render("unternehmen/ustid", { session: req.session });
});

app.post("/unternehmen/ustid-abfrage", (req, res) => {
  req.session.ustidbool = req.body.ustidbool;
  var ustid = req.session.ustidbool;

  if (ustid == "ja") {
    res.redirect("/unternehmen/ustid-abfrage");
  } else {
    res.redirect("/unternehmen/status");
  }
});

app.get("/unternehmen/ustid-abfrage", (req, res) => {
  res.render("unternehmen/ustid-abfrage", { session: req.session });
});

app.post("/unternehmen/ustid-abfrage", (req, res) => {
  req.session.ustidbool = req.body.ustidbool;
  res.redirect("/unternehmen/ustid-abfrage");
});

app.get("/unternehmen/ustid-abfrage", (req, res) => {
  res.render("unternehmen/ustid-abfrage", { session: req.session });
});

app.post("/unternehmen/ustid-wiederverwenden", (req, res) => {
  req.session.ustidexistingbool = req.body.ustidexistingbool;
  var existingUstid = req.session.ustidexistingbool;

  if (existingUstid == "ja") {
    res.redirect("/unternehmen/ustid-wiederverwenden");
  } else {
    res.redirect("/unternehmen/ustid-antrag");
  }
});

app.get("/unternehmen/ustid-wiederverwenden", (req, res) => {
  res.render("unternehmen/ustid-wiederverwenden", { session: req.session });
});

app.post("/unternehmen/ustid-antrag", (req, res) => {
  req.session.ustidbool = req.body.ustidbool;
  res.redirect("/unternehmen/ustid-antrag");
});

app.get("/unternehmen/ustid-antrag", (req, res) => {
  res.render("unternehmen/ustid-antrag", { session: req.session });
});

// app.post("/unternehmen/angaben", (req, res) => {
//   req.session.ustid = req.body.ustid;
//   req.session.unternehmenDone = true;
//   res.redirect("/unternehmen/angaben");
// });
//
// app.get("/unternehmen/angaben", (req, res) => {
//   res.render("unternehmen/angaben", {
//     pageName: "Eingaben überprüfen",
//     session: req.session,
//   });
// });

app.post("/unternehmen/status", (req, res) => {
  req.session.ustid = req.body.ustid;
  req.session.unternehmenDone = true;
  res.redirect("/unternehmen/status");
});

app.get("/unternehmen/status", (req, res) => {
  res.render("unternehmen/status", {
    pageName: "Status Antrag",
    session: req.session,
  });
});

app.post("/umsatz/start", (req, res) => {
  res.redirect("/umsatz/start");
});

app.get("/umsatz/start", (req, res) => {
  res.render("umsatz/start", { session: req.session });
});

app.post("/umsatz/eingabe", (req, res) => {
  req.session.umsatzStarted = true;
  res.redirect("/umsatz/eingabe");
});

app.get("/umsatz/eingabe", (req, res) => {
  res.render("umsatz/eingabe", { session: req.session });
});

app.post("/umsatz/kleinunternehmerregelung-moeglich", (req, res) => {
  req.session.umsatzDiesesJahr = req.body.umsatzDiesesJahr;
  req.session.umsatzNaechstesJahr = req.body.umsatzNaechstesJahr;

  var kleinunternehmerMoeglich =
    req.session.umsatzDiesesJahr &&
    Number(req.session.umsatzDiesesJahr) <= 25000;

  if (kleinunternehmerMoeglich) {
    res.redirect("/umsatz/kleinunternehmerregelung-moeglich");
  } else {
    res.redirect("/umsatz/umsatzsteuer");
  }
});

app.get("/umsatz/kleinunternehmerregelung-moeglich", (req, res) => {
  res.render("umsatz/kleinunternehmerregelung-moeglich", {
    session: req.session,
  });
});

app.post("/umsatz/kleinunternehmerregelung-nicht-moeglich", (req, res) => {
  res.redirect("/umsatz/kleinunternehmerregelung-nicht-moeglich");
});

app.get("/umsatz/kleinunternehmerregelung-nicht-moeglich", (req, res) => {
  res.render("umsatz/kleinunternehmerregelung-nicht-moeglich", {
    session: req.session,
  });
});

app.post("/umsatz/weitere-unternehmen", (req, res) => {
  res.redirect("/umsatz/weitere-unternehmen");
});

app.get("/umsatz/weitere-unternehmen", (req, res) => {
  res.render("umsatz/weitere-unternehmen", { session: req.session });
});

app.post("/umsatz/weitere-unternehmen-gesamt", (req, res) => {
  req.session.weitereunternehmenbool = req.body.weitereunternehmenbool;

  var weitereUnternehmen =
    req.session.weitereunternehmenbool &&
    req.session.weitereunternehmenbool == "ja";

  if (weitereUnternehmen) {
    res.redirect("/umsatz/weitere-unternehmen-gesamt");
  } else {
    res.redirect("/umsatz/kleinunternehmerregelung");
  }
});

app.get("/umsatz/weitere-unternehmen-gesamt", (req, res) => {
  res.render("umsatz/weitere-unternehmen-gesamt", { session: req.session });
});

app.post("/umsatz/kleinunternehmerregelung", (req, res) => {
  req.session.weitereUnternehmenGesamtBool =
    req.body.weitereUnternehmenGesamtBool;

  var umsatzGesamt =
    req.session.weitereUnternehmenGesamtBool &&
    req.session.weitereUnternehmenGesamtBool == "ja";

  if (umsatzGesamt) {
    res.redirect("/umsatz/kleinunternehmerregelung");
  } else {
    res.redirect("/umsatz/kleinunternehmerregelung-nicht-moeglich");
  }
});

app.get("/umsatz/kleinunternehmerregelung", (req, res) => {
  res.render("umsatz/kleinunternehmerregelung", { session: req.session });
});

app.post("/umsatz/umsatzsteuer", (req, res) => {
  req.session.kleinunternehmerBool = req.body.kleinunternehmerBool;

  var kleinunternehmerVerwenden = res.redirect("/umsatz/umsatzsteuer");
});

app.get("/umsatz/umsatzsteuer", (req, res) => {
  res.render("umsatz/umsatzsteuer", { session: req.session });
});

// app.post("/umsatz/angaben", (req, res) => {
//   req.session.ustDiesesJahr = req.body.ustDiesesJahr;
//   req.session.ustNaechstesJahr = req.body.NaechstesJahr;
//   req.session.umsatzDone = true;
//
//   res.redirect("/umsatz/angaben");
// });
//
// app.get("/umsatz/angaben", (req, res) => {
//   res.render("umsatz/angaben", { session: req.session });
// });

app.post("/umsatz/status", (req, res) => {
  req.session.ustDiesesJahr = req.body.ustDiesesJahr;
  req.session.ustNaechstesJahr = req.body.NaechstesJahr;
  req.session.umsatzDone = true;

  res.redirect("/umsatz/status");
});

app.get("/umsatz/status", (req, res) => {
  res.render("umsatz/status", { session: req.session });
});

app.post("/gewinn/start", (req, res) => {
  res.redirect("/gewinn/start");
});

app.get("/gewinn/start", (req, res) => {
  res.render("gewinn/start", { session: req.session });
});

app.post("/gewinn/eingabe", (req, res) => {
  res.redirect("/gewinn/eingabe");
});

app.get("/gewinn/eingabe", (req, res) => {
  res.render("gewinn/eingabe", { session: req.session });
});

app.post("/einkuenfte/start", (req, res) => {
  res.redirect("/einkuenfte/start");
});

app.get("/einkuenfte/start", (req, res) => {
  res.render("einkuenfte/start", { session: req.session });
});

app.post("/einkuenfte/auswahl", (req, res) => {
  req.session.gewinnDiesesJahr = req.body.gewinnDiesesJahr;
  req.session.gewinnNaechstesJahr = req.body.gewinnNaechstesJahr;
  req.session.gewinnStarted = true;
  res.redirect("/einkuenfte/auswahl");
});

app.get("/einkuenfte/auswahl", (req, res) => {
  res.render("einkuenfte/auswahl", { session: req.session });
});

// app.post("/gewinn/angaben", (req, res) => {
//   req.session.gewinnDone = true;
//   req.session.einkuenfte = req.body.einkuenfte;
//   res.redirect("/gewinn/angaben");
// });
//
// app.get("/gewinn/angaben", (req, res) => {
//   res.render("gewinn/angaben", { session: req.session });
// });

app.post("/gewinn/status", (req, res) => {
  req.session.gewinnDone = true;
  req.session.einkuenfte = req.body.einkuenfte;
  res.redirect("/gewinn/status");
});

app.get("/gewinn/status", (req, res) => {
  res.render("gewinn/status", { session: req.session });
});

app.post("/kontakt/start", (req, res) => {
  res.redirect("/kontakt/start");
});

app.get("/kontakt/start", (req, res) => {
  res.render("kontakt/start", { session: req.session });
});

app.post("/kontakt/telefon", (req, res) => {
  res.redirect("/kontakt/telefon");
});

app.get("/kontakt/telefon", (req, res) => {
  res.render("kontakt/telefon", { session: req.session });
});

app.post("/kontakt/email", (req, res) => {
  req.session.kontaktStarted = true;
  res.redirect("/kontakt/email");
});

app.get("/kontakt/email", (req, res) => {
  res.render("kontakt/email", { session: req.session });
});

app.post("/kontakt/status", (req, res) => {
  res.redirect("/kontakt/status");
});

app.get("/kontakt/status", (req, res) => {
  res.render("kontakt/status", { session: req.session });
});

app.post("/antrag-ueberpruefen", (req, res) => {
  req.session.kontaktDone = true;
  res.redirect("/antrag-ueberpruefen");
});

app.get("/antrag-ueberpruefen", (req, res) => {
  res.render("antrag-ueberpruefen", {
    pageName: "Antrag überprüfen",
    session: req.session,
  });
});

app.post("/antrag-absenden", (req, res) => {
  res.redirect("/antrag-absenden");
});

app.get("/antrag-absenden", (req, res) => {
  res.render("antrag-absenden", {
    pageName: "Antrag absenden",
    session: req.session,
  });
});

app.get("/antrag-gesendet", (req, res) => {
  res.render("antrag-gesendet", {
    pageName: "Antrag gesendet",
    session: req.session,
  });
});

app.listen(port, host, () => {
  console.log("Server is running at http://" + host + ":" + port);
});

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    process.exit(0);
  });
});
