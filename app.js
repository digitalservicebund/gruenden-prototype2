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

const links = [
  {
    name: "Persönliche Angaben",
    href: "/person/start",
    started: true,
    items: [
      {
        name: "Name",
        href: "/person/name",
        done: true,
      },
      {
        name: "Geburtstag",
        href: "/person/geburtstag",
      },
      {
        name: "Geburtsort",
        href: "/person/geburtsort",
      },
      {
        name: "Staatsangehörigkeit",
        href: "/person/staatsangehoerigkeit",
      },
      {
        name: "Adresse",
        href: "/person/adresse",
      },
      {
        name: "Steuer-Identifikationsnummer",
        href: "/person/steuer-id",
      },
    ],
  },
  { name: "Unternehmen und Tätigkeit", href: "/unternehmen/start" },
  { name: "Umsätze", href: "/umsatz/start" },
  { name: "Gewinne und Einkünfte", href: "/gewinn/start" },
  { name: "Kontakt", href: "/kontakt/start" },
  { name: "Angaben überprüfen", href: "/antrag-ueberpruefen" },
];

app.get("/", (req, res) => {
  res.render("index", {
    pageName: "Kombi-Antrag Steuer und Gewerbe",
    start: true,
    session: req.session,
  });
});

app.get("/antrag", (req, res) => {
  res.render("antrag", {
    pageName: "Ihr Kombi-Antrag",
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
    start: true,
    session: req.session,
  });
});

app.post("/person/bundid", (req, res) => {
  res.redirect("/person/bundid");
});

app.get("/person/bundid", (req, res) => {
  res.render("person/bundid", {
    pageName: "Mit BundID anmelden",
    start: true,
    session: req.session,
  });
});

app.post("/person/name", (req, res) => {
  res.redirect("/person/name");
});

app.get("/person/name", (req, res) => {
  req.session.vorname = "Kim";
  req.session.nachname = "Beyer";

  const links = [
    {
      name: "Persönliche Angaben",
      href: "/person/start",
      active: true,
      items: [
        {
          name: "Name",
          href: "/person/name",
          active: true,
        },
        {
          name: "Geburtstag",
          href: "/person/geburtstag",
        },
        {
          name: "Geburtsort",
          href: "/person/geburtsort",
        },
        {
          name: "Staatsangehörigkeit",
          href: "/person/staatsangehoerigkeit",
        },
        {
          name: "Adresse",
          href: "/person/adresse",
        },
        {
          name: "Steuer-Identifikationsnummer",
          href: "/person/steuer-id",
        },
      ],
    },
    { name: "Unternehmen und Tätigkeit", href: "/unternehmen/start" },
    { name: "Umsätze", href: "/umsatz/start" },
    { name: "Gewinne und Einkünfte", href: "/gewinn/start" },
    { name: "Kontakt", href: "/kontakt/start" },
    { name: "Angaben überprüfen", href: "/antrag-ueberpruefen" },
  ];

  res.render("person/name", {
    pageName: "Wie heißen Sie?",
    links: links,
    session: req.session,
  });
});

app.post("/person/name/edit", (req, res) => {
  res.redirect("/person/name-edit");
});

app.get("/person/name/edit", (req, res) => {
  res.render("person/name-edit", {
    pageName: "Wie heißen Sie?",
    start: true,
    session: req.session,
  });
});

app.post("/person/geburtstag", (req, res) => {
  req.session.vorname = req.body.vorname;
  req.session.nachname = req.body.nachname;
  req.session.geburtsname = req.body.geburtsname;

  req.session.personalStarted = true;
  res.redirect("/person/geburtstag");
});

app.get("/person/geburtstag", (req, res) => {
  req.session.tag = 17;
  req.session.monat = 10;
  req.session.jahr = 1997;

  const links = [
    {
      name: "Persönliche Angaben",
      href: "/person/start",
      active: true,
      started: true,
      items: [
        {
          name: "Name",
          href: "/person/name",
          done: true,
        },
        {
          name: "Geburtstag",
          href: "/person/geburtstag",
          active: true,
        },
        {
          name: "Geburtsort",
          href: "/person/geburtsort",
        },
        {
          name: "Staatsangehörigkeit",
          href: "/person/staatsangehoerigkeit",
        },
        {
          name: "Adresse",
          href: "/person/adresse",
        },
        {
          name: "Steuer-Identifikationsnummer",
          href: "/person/steuer-id",
        },
      ],
    },
    { name: "Unternehmen und Tätigkeit", href: "/unternehmen/start" },
    { name: "Umsätze", href: "/umsatz/start" },
    { name: "Gewinne und Einkünfte", href: "/gewinn/start" },
    { name: "Kontakt", href: "/kontakt/start" },
    { name: "Angaben überprüfen", href: "/antrag-ueberpruefen" },
  ];

  res.render("person/geburtstag", {
    session: req.session,
    links: links,
    pageName: "Wann wurden Sie geboren?",
  });
});

app.post("/person/geburtsort", (req, res) => {
  req.session.tag = req.body.tag;
  req.session.monat = req.body.monat;
  req.session.jahr = req.body.jahr;
  res.redirect("/person/geburtsort");
});

app.get("/person/geburtsort", (req, res) => {
  req.session.geburtsort = "Hamburg";
  req.session.geburtsland = "Deutschland";

  const links = [
    {
      name: "Persönliche Angaben",
      href: "/person/start",
      active: true,
      started: true,
      items: [
        {
          name: "Name",
          href: "/person/name",
          done: true,
        },
        {
          name: "Geburtstag",
          href: "/person/geburtstag",
          done: true,
        },
        {
          name: "Geburtsort",
          href: "/person/geburtsort",
          active: true,
        },
        {
          name: "Staatsangehörigkeit",
          href: "/person/staatsangehoerigkeit",
        },
        {
          name: "Adresse",
          href: "/person/adresse",
        },
        {
          name: "Steuer-Identifikationsnummer",
          href: "/person/steuer-id",
        },
      ],
    },
    { name: "Unternehmen und Tätigkeit", href: "/unternehmen/start" },
    { name: "Umsätze", href: "/umsatz/start" },
    { name: "Gewinne und Einkünfte", href: "/gewinn/start" },
    { name: "Kontakt", href: "/kontakt/start" },
    { name: "Angaben überprüfen", href: "/antrag-ueberpruefen" },
  ];

  res.render("person/geburtsort", {
    links: links,
    session: req.session,
    pageName: "Wo wurden Sie geboren?",
  });
});

app.post("/person/staatsangehoerigkeit", (req, res) => {
  req.session.geburtsort = req.body.geburtsort;
  req.session.geburtsland = req.body.geburtsland;
  res.redirect("/person/staatsangehoerigkeit");
});

app.get("/person/staatsangehoerigkeit", (req, res) => {
  const links = [
    {
      name: "Persönliche Angaben",
      href: "/person/start",
      active: true,
      started: true,
      items: [
        {
          name: "Name",
          href: "/person/name",
          done: true,
        },
        {
          name: "Geburtstag",
          href: "/person/geburtstag",
          done: true,
        },
        {
          name: "Geburtsort",
          href: "/person/geburtsort",
          done: true,
        },
        {
          name: "Staatsangehörigkeit",
          href: "/person/staatsangehoerigkeit",
          active: true,
        },
        {
          name: "Adresse",
          href: "/person/adresse",
        },
        {
          name: "Steuer-Identifikationsnummer",
          href: "/person/steuer-id",
        },
      ],
    },
    { name: "Unternehmen und Tätigkeit", href: "/unternehmen/start" },
    { name: "Umsätze", href: "/umsatz/start" },
    { name: "Gewinne und Einkünfte", href: "/gewinn/start" },
    { name: "Kontakt", href: "/kontakt/start" },
    { name: "Angaben überprüfen", href: "/antrag-ueberpruefen" },
  ];

  res.render("person/staatsangehoerigkeit", {
    session: req.session,
    links: links,
    pageName: "Haben Sie eine deutsche Staatsangehörigkeit?",
  });
});

app.post("/person/adresse", (req, res) => {
  req.session.staatsangehoerigkeit = req.body.staatsangehoerigkeit;
  res.redirect("/person/adresse");
});

app.get("/person/adresse", (req, res) => {
  // req.session.strasse = "Prinzessinnenstraße 17";
  // req.session.plz = "10967";
  // req.session.ort = "Berlin";

  const links = [
    {
      name: "Persönliche Angaben",
      href: "/person/start",
      active: true,
      started: true,
      items: [
        {
          name: "Name",
          href: "/person/name",
          done: true,
        },
        {
          name: "Geburtstag",
          href: "/person/geburtstag",
          done: true,
        },
        {
          name: "Geburtsort",
          href: "/person/geburtsort",
          done: true,
        },
        {
          name: "Staatsangehörigkeit",
          href: "/person/staatsangehoerigkeit",
          done: true,
        },
        {
          name: "Adresse",
          href: "/person/adresse",
          active: true,
        },
        {
          name: "Steuer-Identifikationsnummer",
          href: "/person/steuer-id",
        },
      ],
    },
    { name: "Unternehmen und Tätigkeit", href: "/unternehmen/start" },
    { name: "Umsätze", href: "/umsatz/start" },
    { name: "Gewinne und Einkünfte", href: "/gewinn/start" },
    { name: "Kontakt", href: "/kontakt/start" },
    { name: "Angaben überprüfen", href: "/antrag-ueberpruefen" },
  ];

  res.render("person/adresse", {
    session: req.session,
    links: links,
    pageName: "Wo wohnen Sie?",
  });
});

app.post("/person/steuer-id", (req, res) => {
  req.session.strasse = req.body.strasse;
  // req.session.hausnummer = req.body.hausnummer;
  req.session.plz = req.body.plz;
  req.session.ort = req.body.ort;

  res.redirect("/person/steuer-id");
});

app.get("/person/steuer-id", (req, res) => {
  const links = [
    {
      name: "Persönliche Angaben",
      href: "/person/start",
      active: true,
      started: true,
      items: [
        {
          name: "Name",
          href: "/person/name",
          done: true,
        },
        {
          name: "Geburtstag",
          href: "/person/geburtstag",
          done: true,
        },
        {
          name: "Geburtsort",
          href: "/person/geburtsort",
          done: true,
        },
        {
          name: "Staatsangehörigkeit",
          href: "/person/staatsangehoerigkeit",
          done: true,
        },
        {
          name: "Adresse",
          href: "/person/adresse",
          done: true,
        },
        {
          name: "Steuer-Identifikationsnummer",
          href: "/person/steuer-id",
          active: true,
        },
      ],
    },
    { name: "Unternehmen und Tätigkeit", href: "/unternehmen/start" },
    { name: "Umsätze", href: "/umsatz/start" },
    { name: "Gewinne und Einkünfte", href: "/gewinn/start" },
    { name: "Kontakt", href: "/kontakt/start" },
    { name: "Angaben überprüfen", href: "/antrag-ueberpruefen" },
  ];

  res.render("person/steuer-id", {
    session: req.session,
    links: links,
    pageName: "Wie lautet Ihre Steuer-Identifikationsnummer?",
  });
});

app.post("/person/status", (req, res) => {
  req.session.steuerid = req.body.steuerid;
  req.session.personalDone = true;
  res.redirect("/person/status");
});

app.get("/person/status", (req, res) => {
  res.render("person/status", {
    session: req.session,
    pageName: "Ihr Kombi-Antrag Status",
  });
});

app.post("/unternehmen/start", (req, res) => {
  res.redirect("/unternehmen/start");
});

app.get("/unternehmen/start", (req, res) => {
  const links = [
    {
      name: "Persönliche Angaben",
      href: "/person/start",
      done: true,
    },
    {
      name: "Unternehmen und Tätigkeit",
      href: "/unternehmen/start",
      active: true,
      items: [
        {
          name: "Adresse",
          href: "/unternehmen/adresse-abweichend",
        },
        {
          name: "Tätigkeit",
          href: "/unternehmen/taetigkeit",
        },
        {
          name: "Beginn",
          href: "/unternehmen/taetigkeit-begonnen",
        },
        {
          name: "Art der Gründung",
          href: "/unternehmen/gewerbeart",
        },
        {
          name: "Umsatzsteuer-Identifikationsnummer",
          href: "/unternehmen/ustid-abfrage",
        },
      ],
    },
    { name: "Umsätze", href: "/umsatz/start" },
    { name: "Gewinne und Einkünfte", href: "/gewinn/start" },
    { name: "Kontakt", href: "/kontakt/start" },
    { name: "Angaben überprüfen", href: "/antrag-ueberpruefen" },
  ];
  res.render("unternehmen/start", { links: links, session: req.session });
});

app.post("/unternehmen/adresse-abweichend", (req, res) => {
  res.redirect("/unternehmen/adresse-abweichend");
});

app.get("/unternehmen/adresse-abweichend", (req, res) => {
  const links = [
    {
      name: "Persönliche Angaben",
      href: "/person/start",
      done: true,
    },
    {
      name: "Unternehmen und Tätigkeit",
      href: "/unternehmen/start",
      active: true,
      items: [
        {
          name: "Adresse",
          href: "/unternehmen/adresse-abweichend",
          active: true,
        },
        {
          name: "Tätigkeit",
          href: "/unternehmen/taetigkeit",
        },
        {
          name: "Beginn",
          href: "/unternehmen/taetigkeit-begonnen",
        },
        {
          name: "Art der Gründung",
          href: "/unternehmen/gewerbeart",
        },
        {
          name: "Umsatzsteuer-Identifikationsnummer",
          href: "/unternehmen/ustid-abfrage",
        },
      ],
    },
    { name: "Umsätze", href: "/umsatz/start" },
    { name: "Gewinne und Einkünfte", href: "/gewinn/start" },
    { name: "Kontakt", href: "/kontakt/start" },
    { name: "Angaben überprüfen", href: "/antrag-ueberpruefen" },
  ];
  res.render("unternehmen/adresse-abweichend", {
    links: links,
    session: req.session,
  });
});

app.post("/unternehmen/adresse-eingabe", function (req, res) {
  req.session.adresseAbweichend = req.body.adresseAbweichend;
  req.session.unternehmenStarted = true;
  var adresseAbweichend = req.session.adresseAbweichend == "ja";

  if (adresseAbweichend) {
    res.redirect("/unternehmen/adresse-eingabe");
  } else {
    res.redirect("/unternehmen/taetigkeit");
  }
});

app.get("/unternehmen/adresse-eingabe", (req, res) => {
  res.render("unternehmen/adresse-eingabe", { session: req.session });
});

app.post("/unternehmen/taetigkeit", (req, res) => {
  req.session.unternehmenStrasse = req.body.unternehmenStrasse;
  req.session.unternehmenHausnummer = req.body.unternehmenHausnummer;
  req.session.unternehmenPlz = req.body.unternehmenPlz;
  req.session.unternehmenOrt = req.body.unternehmenOrt;

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

app.post("/unternehmen/ustid-abfrage", (req, res) => {
  req.session.ustidbool = req.body.ustidbool;
  res.redirect("/unternehmen/ustid-abfrage");
});

app.get("/unternehmen/ustid-abfrage", (req, res) => {
  res.render("unternehmen/ustid-abfrage", { session: req.session });
});

app.post("/unternehmen/ustid", (req, res) => {
  req.session.ustidexistingbool = req.body.ustidexistingbool;
  var existingUstid = req.session.ustidexistingbool;

  if (existingUstid == "ja") {
    res.redirect("/unternehmen/status");
  } else {
    res.redirect("/unternehmen/ustid");
  }
});

app.get("/unternehmen/ustid", (req, res) => {
  res.render("unternehmen/ustid", { session: req.session });
});

app.post("/unternehmen/status", (req, res) => {
  req.session.ustid = req.body.ustid;
  req.session.unternehmenDone = true;
  res.redirect("/unternehmen/status");
});

app.get("/unternehmen/status", (req, res) => {
  res.render("unternehmen/status", {
    pageName: "Ihr Kombi-Antrag Status",
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
    res.redirect("/umsatz/kleinunternehmerregelung-nicht-moeglich");
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
  var hintUmsatz = Number(req.session.umsatzDiesesJahr) >= 25000;
  var hintVerzicht =
    req.session.verzichtBool && req.session.verzichtBool == "ja";

  var hintGesamt =
    req.session.weitereUnternehmenGesamtBool &&
    req.session.weitereUnternehmenGesamtBool == "nein";

  res.render("umsatz/kleinunternehmerregelung-nicht-moeglich", {
    session: req.session,
    hintUmsatz: hintUmsatz,
    hintVerzicht: hintVerzicht,
    hintGesamt: hintGesamt,
  });
});

app.post("/umsatz/kleinunternehmerregelung/verzicht", (req, res) => {
  res.redirect("/umsatz/kleinunternehmerregelung/verzicht");
});

app.get("/umsatz/kleinunternehmerregelung/verzicht", (req, res) => {
  res.render("umsatz/kleinunternehmerregelung/verzicht", {
    session: req.session,
  });
});

app.post("/umsatz/weitere-unternehmen", (req, res) => {
  req.session.verzichtBool = req.body.verzichtBool;

  var verzicht = req.session.verzichtBool && req.session.verzichtBool == "ja";

  if (verzicht) {
    res.redirect("/umsatz/kleinunternehmerregelung-nicht-moeglich");
  } else {
    res.redirect("/umsatz/weitere-unternehmen");
  }
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
  req.session.kleinunternehmenBool = req.body.kleinunternehmenBool;

  var kleinunternehmenVerwenden =
    req.session.kleinunternehmenBool &&
    req.session.kleinunternehmenBool == "ja";

  if (kleinunternehmenVerwenden) {
    req.session.umsatzDone = true;
  }

  if (kleinunternehmenVerwenden) {
    res.redirect("/umsatz/status");
  } else {
    res.redirect("/umsatz/umsatzsteuer");
  }
});

app.get("/umsatz/umsatzsteuer", (req, res) => {
  res.render("umsatz/umsatzsteuer", { session: req.session });
});

app.post("/umsatz/status", (req, res) => {
  req.session.ustDiesesJahr = req.body.ustDiesesJahr;
  req.session.ustNaechstesJahr = req.body.NaechstesJahr;
  req.session.umsatzDone = true;

  res.redirect("/umsatz/status");
});

app.get("/umsatz/status", (req, res) => {
  res.render("umsatz/status", {
    pageName: "Ihr Kombi-Antrag Status",
    session: req.session,
  });
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
  res.render("einkuenfte/start", {
    session: req.session,
  });
});

app.post("/einkuenfte/auswahl", (req, res) => {
  req.session.gewinnDiesesJahr = req.body.gewinnDiesesJahr;
  req.session.gewinnNaechstesJahr = req.body.gewinnNaechstesJahr;
  req.session.gewinnStarted = true;
  res.redirect("/einkuenfte/auswahl");
});

app.get("/einkuenfte/auswahl", (req, res) => {
  res.render("einkuenfte/auswahl", {
    pageName: "Weitere Einkünfte",
    session: req.session,
  });
});

app.post("/einkuenfte/landwirtschaft", (req, res) => {
  req.session.einkuenfte = req.body.einkuenfte;

  var einkuenfte = req.session.einkuenfte;

  if (einkuenfte) {
    if (einkuenfte.includes("landwirtschaft")) {
      res.redirect("/einkuenfte/landwirtschaft");
    } else if (einkuenfte.includes("vermietung")) {
      res.redirect("/einkuenfte/vermietung");
    } else if (einkuenfte.includes("selbststaendig")) {
      res.redirect("/einkuenfte/selbststaendig");
    } else if (einkuenfte.includes("nichtselbst")) {
      res.redirect("/einkuenfte/nicht-selbststaendig");
    } else if (einkuenfte.includes("kapital")) {
      res.redirect("/einkuenfte/kapital");
    } else if (einkuenfte.includes("sonstige")) {
      res.redirect("/einkuenfte/sonstige");
    } else {
      req.session.gewinnDone = true;
      res.redirect("/gewinn/status");
    }
  } else {
    req.session.gewinnDone = true;
    res.redirect("/gewinn/status");
  }
});

app.get("/einkuenfte/landwirtschaft", (req, res) => {
  res.render("einkuenfte/landwirtschaft", { session: req.session });
});

app.post("/einkuenfte/vermietung", (req, res) => {
  req.session.landwirtschaftDiesesJahr = req.body.landwirtschaftDiesesJahr;
  req.session.landwirtschaftNaechstesJahr =
    req.body.landwirtschaftNaechstesJahr;

  var einkuenfte = req.session.einkuenfte;

  if (einkuenfte.includes("vermietung")) {
    res.redirect("/einkuenfte/vermietung");
  } else if (einkuenfte.includes("selbststaendig")) {
    res.redirect("/einkuenfte/selbststaendig");
  } else if (einkuenfte.includes("nichtselbst")) {
    res.redirect("/einkuenfte/nicht-selbststaendig");
  } else if (einkuenfte.includes("kapital")) {
    res.redirect("/einkuenfte/kapital");
  } else if (einkuenfte.includes("sonstige")) {
    res.redirect("/einkuenfte/sonstige");
  } else {
    req.session.gewinnDone = true;
    res.redirect("/gewinn/status");
  }
});

app.get("/einkuenfte/vermietung", (req, res) => {
  res.render("einkuenfte/vermietung", { session: req.session });
});

app.post("/einkuenfte/selbststaendig", (req, res) => {
  req.session.vermietungDiesesJahr = req.body.vermietungDiesesJahr;
  req.session.vermietungNaechstesJahr = req.body.vermietungNaechstesJahr;

  var einkuenfte = req.session.einkuenfte;

  if (einkuenfte.includes("selbststaendig")) {
    res.redirect("/einkuenfte/selbststaendig");
  } else if (einkuenfte.includes("nichtselbst")) {
    res.redirect("/einkuenfte/nicht-selbststaendig");
  } else if (einkuenfte.includes("kapital")) {
    res.redirect("/einkuenfte/kapital");
  } else if (einkuenfte.includes("sonstige")) {
    res.redirect("/einkuenfte/sonstige");
  } else {
    req.session.gewinnDone = true;
    res.redirect("/gewinn/status");
  }
});

app.get("/einkuenfte/selbststaendig", (req, res) => {
  res.render("einkuenfte/selbststaendig", { session: req.session });
});

app.post("/einkuenfte/nicht-selbststaendig", (req, res) => {
  req.session.selbststaendigDiesesJahr = req.body.selbststaendigDiesesJahr;
  req.session.selbststaendigNaechstesJahr =
    req.body.selbststaendigNaechstesJahr;

  var einkuenfte = req.session.einkuenfte;

  if (einkuenfte.includes("nichtselbst")) {
    res.redirect("/einkuenfte/nicht-selbststaendig");
  } else if (einkuenfte.includes("kapital")) {
    res.redirect("/einkuenfte/kapital");
  } else if (einkuenfte.includes("sonstige")) {
    res.redirect("/einkuenfte/sonstige");
  } else {
    req.session.gewinnDone = true;
    res.redirect("/gewinn/status");
  }
});

app.get("/einkuenfte/nicht-selbststaendig", (req, res) => {
  res.render("einkuenfte/nicht-selbststaendig", { session: req.session });
});

app.post("/einkuenfte/kapital", (req, res) => {
  req.session.nichtSelbststaendigDiesesJahr =
    req.body.nichtSelbststaendigDiesesJahr;
  req.session.nichtSelbststaendigNaechstesJahr =
    req.body.nichtSelbststaendigNaechstesJahr;

  var einkuenfte = req.session.einkuenfte;

  if (einkuenfte.includes("kapital")) {
    res.redirect("/einkuenfte/kapital");
  } else if (einkuenfte.includes("sonstige")) {
    res.redirect("/einkuenfte/sonstige");
  } else {
    req.session.gewinnDone = true;
    res.redirect("/gewinn/status");
  }
});

app.get("/einkuenfte/kapital", (req, res) => {
  res.render("einkuenfte/kapital", { session: req.session });
});

app.post("/einkuenfte/sonstige", (req, res) => {
  req.session.kapitalDiesesJahr = req.body.sonstigeDiesesJahr;
  req.session.kapitalNaechstesJahr = req.body.sonstigeNaechstesJahr;

  var einkuenfte = req.session.einkuenfte;

  if (einkuenfte.includes("sonstige")) {
    res.redirect("/einkuenfte/sonstige");
  } else {
    req.session.gewinnDone = true;
    res.redirect("/gewinn/status");
  }
});

app.get("/einkuenfte/sonstige", (req, res) => {
  res.render("einkuenfte/sonstige", { session: req.session });
});

app.post("/gewinn/status", (req, res) => {
  req.session.sonstigeDiesesJahr = req.body.sonstigeDiesesJahr;
  req.session.sonstigeNaechstesJahr = req.body.sonstigeNaechstesJahr;
  req.session.gewinnDone = true;
  res.redirect("/gewinn/status");
});

app.get("/gewinn/status", (req, res) => {
  res.render("gewinn/status", {
    pageName: "Ihr Kombi-Antrag Status",
    session: req.session,
  });
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
  req.session.kontaktTelefon = req.body.kontaktTelefon;
  req.session.kontaktStarted = true;
  res.redirect("/kontakt/email");
});

app.get("/kontakt/email", (req, res) => {
  res.render("kontakt/email", { session: req.session });
});

app.post("/kontakt/status", (req, res) => {
  req.session.kontaktEmail = req.body.kontaktEmail;
  req.session.kontaktDone = true;
  res.redirect("/kontakt/status");
});

app.get("/kontakt/status", (req, res) => {
  res.render("kontakt/status", {
    pageName: "Ihr Kombi-Antrag Status",
    session: req.session,
  });
});

app.post("/antrag-ueberpruefen", (req, res) => {
  req.session.vorname = req.body.vorname;
  req.session.nachname = req.body.nachname;
  req.session.geburtsname = req.body.geburtsname;

  res.redirect("/antrag-ueberpruefen");
});

app.get("/antrag-ueberpruefen", (req, res) => {
  var adresseAbweichend = req.session.adresseAbweichend == "ja";
  var kleinunternehmenVerwenden = req.session.kleinunternehmenBool == "ja";

  const links = [
    {
      name: "Persönliche Angaben",
      href: "/person/start",
      started: true,
    },
    { name: "Unternehmen und Tätigkeit", href: "/unternehmen/start" },
    { name: "Umsätze", href: "/umsatz/start" },
    { name: "Gewinne und Einkünfte", href: "/gewinn/start" },
    { name: "Kontakt", href: "/kontakt/start" },
    { name: "Angaben überprüfen", href: "/antrag-ueberpruefen", active: true },
  ];

  res.render("antrag-ueberpruefen", {
    pageName: "Antrag überprüfen",
    links: links,
    adresseAbweichend: adresseAbweichend,
    kleinunternehmenVerwenden: kleinunternehmenVerwenden,
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
