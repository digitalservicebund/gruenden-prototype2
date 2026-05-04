import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";
import * as helpers from "./helpers.js";

const app = express();
const port = Number.parseInt(process.env.PORT ?? "7070", 10);
const host = process.env.HOST ?? "localhost";

app.locals.serviceName = "Schneller Gründen";
app.locals.serviceUrl = "/";

app.use(express.static("public"));

app.engine(".html", engine({ extname: ".html", helpers: helpers }));
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

function treeForCurrentState(session, current) {
  return [
    {
      name: "Persönliche Daten",
      href: "/person/start",
      active: current.startsWith("/person"),
      started: session.vorname || session.jahr,
      done: session.vorname && session.tag,
      items: [
        {
          name: "Name",
          href: "/person/name",
          active: current === "/person/name",
          done: session.vorname,
        },
        {
          name: "Geburtstag",
          href: "/person/geburtstag",
          active: current === "/person/geburtstag",
          done: session.tag && session.monat && session.jahr,
        },
        {
          name: "Geburtsort",
          href: "/person/geburtsort",
          active: current === "/person/geburtsort",
          started: session.geburtsort || session.geburtsland,
          done: session.geburtsort && session.geburtsland,
        },
        {
          name: "Staatsangehörigkeit",
          href: "/person/staatsangehoerigkeit",
          active: current === "/person/staatsangehoerigkeit",
          done: session.staatsangehoerigkeitbool,
        },
        {
          name: "Adresse",
          href: "/person/adresse",
          active: current === "/person/adresse",
          started: session.strasse || session.plz || session.ort,
          done: session.strasse && session.plz && session.ort,
        },
        {
          name: "Steuer-Identifikationsnummer",
          href: "/person/steuer-id",
          active: current === "/person/steuer-id",
          done: session.steuerid,
        },
      ],
    },
    {
      name: "Unternehmen und Tätigkeit",
      href: "/unternehmen/start",
      active: current.startsWith("/unternehmen"),
      started: session.adresseAbweichend || session.taetigkeitsbereich,
      done: session.gewerbeart,

      items: [
        {
          name: "Adresse",
          href: "/unternehmen/adresse-abweichend",
          active:
            current === "/unternehmen/adresse-abweichend" ||
            current === "/unternehmen/adresse-eingabe",
          started:
            session.unternehmenStrasse ||
            session.unternehmenPlz ||
            session.unternehmenOrt,
          done:
            session.unternehmenStrasse &&
            session.unternehmenPlz &&
            session.unternehmenOrt,
        },
        {
          name: "Tätigkeit",
          href: "/unternehmen/taetigkeit",
          active: current === "/unternehmen/taetigkeit",
          done: session.taetigkeit,
        },
        {
          name: "Beginn",
          href: "/unternehmen/taetigkeit-begonnen",
          active: current === "/unternehmen/taetigkeit-begonnen",
          started:
            session.taetigkeitBeginnTag ||
            session.taetigkeitBeginnMonat ||
            session.taetigkeitBeginnJahr,
          done:
            session.taetigkeitBeginnTag &&
            session.taetigkeitBeginnMonat &&
            session.taetigkeitBeginnJahr,
        },
        {
          name: "Art der Gründung",
          href: "/unternehmen/gewerbeart",
          active: current === "/unternehmen/gewerbeart",
          done: session.gewerbeart,
        },
        {
          name: "Umsatzsteuer-Identifikationsnummer",
          href: "/unternehmen/ustid-abfrage",
          active: current === "/unternehmen/ustid-abfrage",
          started: session.ustidexistingbool,
          done: session.ustidexistingbool === "ja" || session.ustidbool,
        },
      ],
    },
    {
      name: "Umsätze",
      href: "/umsatz/start",
      active: current.startsWith("/umsatz"),
      started: session.umsatzDiesesJahr,
      done: session.umsatzDiesesJahr && session.umsatzNaechstesJahr,
      items: [
        {
          name: "Vorraussichtliche Umsätze",
          href: "/umsatz/eingabe",
          active: current === "/umsatz/eingabe",
          started: session.umsatzDiesesJahr,
          done: session.umsatzDiesesJahr && session.umsatzNaechstesJahr,
        },
        {
          name: "Kleinunternehmerregelung",
          href: "/umsatz/kleinunternehmerregelung-moeglich",
          active:
            current.startsWith("/umsatz/kleinunternehmerregelung") ||
            current.startsWith("/umsatz/weitere-unternehmen"),
          done:
            session.umsatzDiesesJahr > 25000 ||
            session.verzichtBool === "ja" ||
            session.weitereUnternehmenGesamtBool === "nein" ||
            session.kleinunternehmenBool,
        },
        {
          name: "Umsatzsteuer",
          href: "/umsatz/umsatzsteuer",
          active: current === "/umsatz/umsatzsteuer",
          started: session.ustDiesesJahr || session.ustNaechstesJahr,
          done: session.ustDiesesJahr && session.ustNaechstesJahr,
        },
      ],
    },
    {
      name: "Gewinn",
      href: "/gewinn/start",
      active:
        current.startsWith("/gewinn") || current.startsWith("/einkuenfte"),
      started: session.gewinnDiesesJahr || session.einkuenfte,
      done: session.gewinnDiesesJahr,
      items: [
        {
          name: "Gewinn",
          href: "/gewinn/eingabe",
          active: current === "/gewinn/eingabe",
          started: session.gewinnDiesesJahr || session.gewinnNaechstesJahr,
          done: session.gewinnDiesesJahr && session.gewinnNaechstesJahr,
        },
        {
          name: "Sonstige Einkünfte",
          href: "/einkuenfte/auswahl",
          active: current === "/einkuenfte/auswahl",
          done: session.einkuenfte,
        },
      ],
    },
    {
      name: "Kontaktdaten",
      href: "/kontakt/start",
      active: current.startsWith("/kontakt"),
      started: session.kontaktTelefon || session.kontaktEmail,
      done: session.kontaktTelefon && session.kontaktEmail,
      items: [
        {
          name: "Telefon",
          href: "/kontakt/telefon",
          active: current === "/kontakt/telefon",
          done: session.kontaktTelefon,
        },
        {
          name: "Email",
          href: "/kontakt/email",
          active: current === "/kontakt/email",
          done: session.kontaktEmail,
        },
      ],
    },
  ];
}

app.get("/", (req, res) => {
  res.render("index", {
    pageName: "Kombi-Antrag Steuer und Gewerbe",
    start: true,
    pageTree: treeForCurrentState(req.session, "/"),
    session: req.session,
  });
});

app.get("/vorab-check", (req, res) => {
  res.render("vorab-check/index", {
    pageName: "Vorab-Check für Kombi-Antrag",
    start: true,
    pageTree: treeForCurrentState(req.session, "/vorab-check/index"),
    session: req.session,
    currentSection: "quick",
  });
});

app.post("/vorab-check/neugruendung", (req, res) => {
  req.session.neugruendungbool = req.body.neugruendungbool;
  var neugruendung = req.session.neugruendungbool;

  if (neugruendung == "ja") {
    res.redirect("/vorab-check/rechtsform");
  } else {
    res.redirect("/vorab-check/antrag-nicht-moeglich");
  }
});

app.get("/vorab-check/neugruendung", (req, res) => {
  res.render("vorab-check/neugruendung", {
    pageName: "Gründen Sie das Unternehmen neu?",
    pageTree: treeForCurrentState(req.session, "/vorab-check/neugruendung"),
    session: req.session,
    currentSection: "quick",
  });
});

app.post("/vorab-check/rechtsform", (req, res) => {
  req.session.rechtsform = req.body.rechtsform;
  var rechtsform = req.session.rechtsform;

  if (rechtsform == "einzelunternehmen") {
    res.redirect("/vorab-check/antrag-moeglich");
  } else {
    res.redirect("/vorab-check/antrag-nicht-moeglich");
  }
});

app.get("/vorab-check/rechtsform", (req, res) => {
  res.render("vorab-check/rechtsform", {
    pageName: "Rechtsform",
    pageTree: treeForCurrentState(req.session, "/vorab-check/rechtsform"),
    session: req.session,
    currentSection: "quick",
  });
});

app.get("/vorab-check/antrag-moeglich", (req, res) => {
  res.render("vorab-check/antrag-moeglich", {
    pageName: "Vorab-Check für Kombi-Antrag",
    pageTree: treeForCurrentState(req.session, "/vorab-check/antrag-moeglich"),
    session: req.session,
    currentSection: "quick",
  });
});

app.get("/vorab-check/antrag-nicht-moeglich", (req, res) => {
  res.render("vorab-check/antrag-nicht-moeglich", {
    pageName: "Vorab-Check für Kombi-Antrag",
    pageTree: treeForCurrentState(
      req.session,
      "/vorab-check/antrag-nicht-moeglich",
    ),
    session: req.session,
    currentSection: "quick",
  });
});

app.get("/antrag", (req, res) => {
  res.render("antrag", {
    pageName: "Kombi-Antrag Steuer und Gewerbe",
    start: true,
    pageTree: treeForCurrentState(req.session, "/antrag"),
    session: req.session,
    currentSection: "kombi",
  });
});

app.get("/person/start", (req, res) => {
  res.render("person/start", {
    pageName: "Persönliche Daten",
    pageTree: treeForCurrentState(req.session, "/person/start"),
    session: req.session,
    currentSection: "kombi",
  });
});

app.post("/person/bundid", (req, res) => {
  res.redirect("/person/name");
});

app.get("/person/bundid", (req, res) => {
  res.render("person/bundid", {
    pageName: "Mit BundID anmelden",
    start: true,
    session: req.session,
    currentSection: "kombi",
  });
});

app.post("/person/name", (req, res) => {
  req.session.vorname = req.body.vorname;
  req.session.nachname = req.body.nachname;
  req.session.geburtsname = req.body.geburtsname;

  if (req.query.edit) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect("/person/geburtstag");
  }
});

app.get("/person/name", (req, res) => {
  res.render("person/name", {
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageName: "Wie heißen Sie?",
    pageTree: treeForCurrentState(req.session, "/person/name"),
    session: req.session,
    currentSection: "kombi",
  });
});

app.post("/person/geburtstag", (req, res) => {
  req.session.tag = req.body.tag;
  req.session.monat = req.body.monat;
  req.session.jahr = req.body.jahr;

  if (req.query.edit) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect("/person/geburtsort");
  }
});

app.get("/person/geburtstag", (req, res) => {
  res.render("person/geburtstag", {
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageName: "Wann wurden Sie geboren?",
    pageTree: treeForCurrentState(req.session, "/person/geburtstag"),
    session: req.session,
    currentSection: "kombi",
  });
});

app.post("/person/geburtsort", (req, res) => {
  req.session.geburtsort = req.body.geburtsort;
  req.session.geburtsland = req.body.geburtsland;

  if (req.query.edit) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect("/person/adresse");
  }
});

app.get("/person/geburtsort", (req, res) => {
  res.render("person/geburtsort", {
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageName: "Wo wurden Sie geboren?",
    pageTree: treeForCurrentState(req.session, "/person/geburtsort"),
    session: req.session,
    currentSection: "kombi",
  });
});

// app.post("/person/staatsangehoerigkeit", (req, res) => {
//   req.session.staatsangehoerigkeitbool = req.body.staatsangehoerigkeitbool;
//
//   if (req.query.edit) {
//     res.redirect(req.query.redirect);
//   } else {
//     res.redirect("/person/adresse");
//   }
// });
//
// app.get("/person/staatsangehoerigkeit", (req, res) => {
//   res.render("person/staatsangehoerigkeit", {
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//     pageName: "Haben Sie eine deutsche Staatsangehörigkeit?",
//     pageTree: treeForCurrentState(req.session, "/person/staatsangehoerigkeit"),
//     session: req.session,
//     currentSection: "kombi",
//   });
// });

app.post("/person/adresse", (req, res) => {
  req.session.strasse = req.body.strasse;
  req.session.plz = req.body.plz;
  req.session.ort = req.body.ort;

  if (req.query.edit) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect("/person/status");
  }
});

app.get("/person/adresse", (req, res) => {
  res.render("person/adresse", {
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageName: "Wo wohnen Sie?",
    pageTree: treeForCurrentState(req.session, "/person/adresse"),
    session: req.session,
    currentSection: "kombi",
  });
});

// app.post("/person/steuer-id", (req, res) => {
//   req.session.steuerid = req.body.steuerid;
//   if (req.query.edit) {
//     res.redirect(req.query.redirect);
//   } else {
//     res.redirect("/person/status");
//   }
// });
//
// app.get("/person/steuer-id", (req, res) => {
//   res.render("person/steuer-id", {
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//     pageName: "Wie lautet Ihre Steuer-Identifikationsnummer?",
//     pageTree: treeForCurrentState(req.session, "/person/steuer-id"),
//     session: req.session,
//     currentSection: "kombi",
//   });
// });

app.get("/person/status", (req, res) => {
  res.render("person/status", {
    session: req.session,
    currentSection: "kombi",
    pageTree: treeForCurrentState(req.session, "/person/status"),
    pageName: "Ihr Kombi-Antrag Status",
  });
});

app.post("/unternehmen/start", (req, res) => {
  res.redirect("/unternehmen/start");
});

app.get("/unternehmen/start", (req, res) => {
  res.render("unternehmen/start", {
    pageTree: treeForCurrentState(req.session, "/unternehmen/start"),
    session: req.session,
    currentSection: "kombi",
  });
});

app.post("/unternehmen/adresse-abweichend", (req, res) => {
  req.session.adresseAbweichend = req.body.adresseAbweichend;
  req.session.unternehmenStarted = true;
  var adresseAbweichend = req.session.adresseAbweichend == "ja";

  if (req.query.edit) {
    if (adresseAbweichend) {
      res.redirect(
        "/unternehmen/adresse-eingabe?edit=true&redirect=" + req.query.redirect,
      );
    } else {
      res.redirect(req.query.redirect);
    }
  } else {
    if (adresseAbweichend) {
      res.redirect("/unternehmen/adresse-eingabe");
    } else {
      res.redirect("/unternehmen/taetigkeitsbereich");
    }
  }
});

app.get("/unternehmen/adresse-abweichend", (req, res) => {
  res.render("unternehmen/adresse-abweichend", {
    adresseAbweichend: req.session.adresseAbweichend == "ja",
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(
      req.session,
      "/unternehmen/adresse-abweichend",
    ),
    session: req.session,
    currentSection: "kombi",
  });
});

app.post("/unternehmen/adresse-eingabe", function (req, res) {
  req.session.unternehmenStrasse = req.body.unternehmenStrasse;
  req.session.unternehmenPlz = req.body.unternehmenPlz;
  req.session.unternehmenOrt = req.body.unternehmenOrt;

  if (req.query.edit) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect("/unternehmen/taetigkeitsbereich");
  }
});

app.get("/unternehmen/adresse-eingabe", (req, res) => {
  res.render("unternehmen/adresse-eingabe", {
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(req.session, "/unternehmen/adresse-eingabe"),
    session: req.session,
    currentSection: "kombi",
  });
});

// app.post("/unternehmen/taetigkeit", (req, res) => {
//   req.session.taetigkeit = req.body.taetigkeit;
//   if (req.query.edit) {
//     res.redirect(req.query.redirect);
//   } else {
//     res.redirect("/unternehmen/taetigkeit-begonnen");
//   }
// });
//
// app.get("/unternehmen/taetigkeit", (req, res) => {
//   res.render("unternehmen/taetigkeit", {
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//     pageTree: treeForCurrentState(req.session, "/unternehmen/taetigkeit"),
//     session: req.session,
//     currentSection: "kombi",
//   });
// });

app.post("/unternehmen/taetigkeitsbereich", (req, res) => {
  req.session.taetigkeitsbereich = req.body.taetigkeitsbereich;
  if (req.query.edit) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect("/unternehmen/gewerbeart");
  }
});

app.get("/unternehmen/taetigkeitsbereich", (req, res) => {
  res.render("unternehmen/taetigkeitsbereich", {
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(
      req.session,
      "/unternehmen/taetigkeitsbereich",
    ),
    session: req.session,
    currentSection: "kombi",
  });
});

// app.post("/unternehmen/taetigkeit-begonnen", (req, res) => {
//   req.session.taetigkeitBegonnen = req.body.taetigkeitBegonnen;
//   if (req.query.edit) {
//     res.redirect(
//       "/unternehmen/taetigkeit-beginn?edit=true&redirect=" + req.query.redirect,
//     );
//   } else {
//     res.redirect("/unternehmen/taetigkeit-beginn");
//   }
// });
//
// app.get("/unternehmen/taetigkeit-begonnen", (req, res) => {
//   var taetigkeitBegonnen = req.session.taetigkeitBegonnen == "ja";
//   res.render("unternehmen/taetigkeit-begonnen", {
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//     pageTree: treeForCurrentState(
//       req.session,
//       "/unternehmen/taetigkeit-begonnen",
//     ),
//     session: req.session,
//     currentSection: "kombi",
//     taetigkeitBegonnen: taetigkeitBegonnen,
//   });
// });
//
// app.post("/unternehmen/taetigkeit-beginn", function (req, res) {
//   req.session.taetigkeitBeginnTag = req.body.taetigkeitBeginnTag;
//   req.session.taetigkeitBeginnMonat = req.body.taetigkeitBeginnMonat;
//   req.session.taetigkeitBeginnJahr = req.body.taetigkeitBeginnJahr;
//
//   if (req.query.edit) {
//     res.redirect(req.query.redirect);
//   } else {
//     res.redirect("/unternehmen/gewerbeart");
//   }
// });
//
// app.get("/unternehmen/taetigkeit-beginn", (req, res) => {
//   var taetigkeitBegonnen = req.session.taetigkeitBegonnen == "ja";
//
//   res.render("unternehmen/taetigkeit-beginn", {
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//     pageTree: treeForCurrentState(
//       req.session,
//       "/unternehmen/taetigkeit-begonnen",
//     ),
//     session: req.session,
//     currentSection: "kombi",
//     taetigkeitBegonnen: taetigkeitBegonnen,
//   });
// });

app.post("/unternehmen/gewerbeart", (req, res) => {
  req.session.gewerbeart = req.body.gewerbeart;

  if (req.query.edit) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect("/unternehmen/status");
  }
});

app.get("/unternehmen/gewerbeart", (req, res) => {
  res.render("unternehmen/gewerbeart", {
    edit: req.query.edit,
    answers: req.query.answers,
    pageTree: treeForCurrentState(req.session, "/unternehmen/gewerbeart"),
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    session: req.session,
    currentSection: "kombi",
  });
});

// app.post("/unternehmen/ustid-abfrage", (req, res) => {
//   req.session.ustidexistingbool = req.body.ustidexistingbool;
//   var existingUstid = req.session.ustidexistingbool;
//
//   if (req.query.edit) {
//     if (existingUstid == "ja") {
//       res.redirect(req.query.redirect);
//     } else {
//       res.redirect(
//         "/unternehmen/ustid?edit=true&redirect=" + req.query.redirect,
//       );
//     }
//   } else {
//     if (existingUstid == "ja") {
//       res.redirect("/unternehmen/status");
//     } else {
//       res.redirect("/unternehmen/ustid");
//     }
//   }
// });
//
// app.get("/unternehmen/ustid-abfrage", (req, res) => {
//   res.render("unternehmen/ustid-abfrage", {
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//     session: req.session,
//     currentSection: "kombi",
//     pageTree: treeForCurrentState(req.session, "/unternehmen/ustid-abfrage"),
//   });
// });
//
// app.post("/unternehmen/ustid", (req, res) => {
//   req.session.ustidbool = req.body.ustidbool;
//   if (req.query.edit) {
//     res.redirect(req.query.redirect);
//   } else {
//     res.redirect("/unternehmen/status");
//   }
// });
//
// app.get("/unternehmen/ustid", (req, res) => {
//   res.render("unternehmen/ustid", {
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//     pageTree: treeForCurrentState(req.session, "/unternehmen/ustid-abfrage"),
//     session: req.session,
//     currentSection: "kombi",
//   });
// });

app.get("/unternehmen/status", (req, res) => {
  res.render("unternehmen/status", {
    pageName: "Ihr Kombi-Antrag Status",
    pageTree: treeForCurrentState(req.session, "/unternehmen/status"),
    session: req.session,
    currentSection: "kombi",
  });
});

app.get("/umsatz/start", (req, res) => {
  res.render("umsatz/start", {
    session: req.session,
    currentSection: "kombi",
    pageTree: treeForCurrentState(req.session, "/umsatz/start"),
  });
});

app.post("/umsatz/eingabe", (req, res) => {
  const kleinunternehmerNachBearbeiten =
    Number(req.session.umsatzDiesesJahr) >= 25000 &&
    Number(req.body.umsatzDiesesJahr) <= 25000;

  const kleinunternehmerVorUndNachBearbeiten =
    Number(req.session.umsatzDiesesJahr) <= 25000 &&
    Number(req.body.umsatzDiesesJahr) <= 25000;

  req.session.umsatzDiesesJahr = req.body.umsatzDiesesJahr;
  req.session.umsatzNaechstesJahr = req.body.umsatzNaechstesJahr;

  var kleinunternehmerMoeglich =
    req.session.umsatzDiesesJahr &&
    Number(req.session.umsatzDiesesJahr) <= 25000;

  if (req.query.edit) {
    if (kleinunternehmerVorUndNachBearbeiten) {
      res.redirect(req.query.redirect);
    } else if (kleinunternehmerNachBearbeiten) {
      res.redirect(
        "/umsatz/kleinunternehmerregelung-moeglich?edit=true&redirect=" +
          req.query.redirect,
      );
    } else if (kleinunternehmerMoeglich) {
      res.redirect(
        "/umsatz/kleinunternehmerregelung-moeglich?edit=true&redirect=" +
          req.query.redirect,
      );
    } else {
      res.redirect(
        "/umsatz/kleinunternehmerregelung-nicht-moeglich?edit=true&redirect=" +
          req.query.redirect,
      );
    }
  } else {
    if (kleinunternehmerMoeglich) {
      res.redirect("/umsatz/kleinunternehmerregelung-moeglich");
    } else {
      res.redirect("/umsatz/kleinunternehmerregelung-nicht-moeglich");
    }
  }
});

app.get("/umsatz/eingabe", (req, res) => {
  res.render("umsatz/eingabe", {
    session: req.session,
    currentSection: "kombi",
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(req.session, "/umsatz/eingabe"),
  });
});

app.post("/umsatz/kleinunternehmerregelung-moeglich", (req, res) => {
  req.session.kleinunternehmerMoeglich = req.body.kleinunternehmerMoeglich;

  if (req.query.edit) {
    res.redirect(
      "/umsatz/kleinunternehmerregelung-verzicht?edit=true&redirect=" +
        req.query.redirect,
    );
  } else {
    res.redirect("/umsatz/kleinunternehmerregelung-verzicht");
  }
});

app.get("/umsatz/kleinunternehmerregelung-moeglich", (req, res) => {
  res.render("umsatz/kleinunternehmerregelung-moeglich", {
    session: req.session,
    currentSection: "kombi",
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(
      req.session,
      "/umsatz/kleinunternehmerregelung-moeglich",
    ),
  });
});

app.post("/umsatz/kleinunternehmerregelung-nicht-moeglich", (req, res) => {
  req.session.kleinunternehmerMoeglich = req.body.kleinunternehmerMoeglich;

  if (req.query.edit) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect("/umsatz/status");
  }
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
    currentSection: "kombi",
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(
      req.session,
      "/umsatz/kleinunternehmerregelung-nicht-moeglich",
    ),
    hintUmsatz: hintUmsatz,
    hintVerzicht: hintVerzicht,
    hintGesamt: hintGesamt,
  });
});

app.post("/umsatz/kleinunternehmerregelung-verzicht", (req, res) => {
  req.session.verzichtBool = req.body.verzichtBool;

  var verzicht = req.session.verzichtBool && req.session.verzichtBool == "ja";

  if (req.query.edit) {
    if (verzicht) {
      res.redirect(
        "/umsatz/kleinunternehmerregelung-nicht-moeglich?edit=true&redirect=" +
          req.query.redirect,
      );
    } else {
      res.redirect(
        "/umsatz/weitere-unternehmen?edit=true&redirect=" + req.query.redirect,
      );
    }
  } else {
    if (verzicht) {
      res.redirect("/umsatz/kleinunternehmerregelung-nicht-moeglich");
    } else {
      res.redirect("/umsatz/weitere-unternehmen");
    }
  }
});

app.get("/umsatz/kleinunternehmerregelung-verzicht", (req, res) => {
  res.render("umsatz/kleinunternehmerregelung-verzicht", {
    session: req.session,
    currentSection: "kombi",
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(
      req.session,
      "/umsatz/kleinunternehmerregelung-verzicht",
    ),
  });
});

app.post("/umsatz/weitere-unternehmen", (req, res) => {
  req.session.weitereunternehmenbool = req.body.weitereunternehmenbool;

  var weitereUnternehmen =
    req.session.weitereunternehmenbool &&
    req.session.weitereunternehmenbool == "ja";

  if (req.query.edit) {
    if (weitereUnternehmen) {
      res.redirect(
        "/umsatz/weitere-unternehmen-gesamt?edit=true&redirect=" +
          req.query.redirect,
      );
    } else {
      res.redirect(
        "/umsatz/kleinunternehmerregelung?edit=true&redirect=" +
          req.query.redirect,
      );
    }
  } else {
    if (weitereUnternehmen) {
      res.redirect("/umsatz/weitere-unternehmen-gesamt");
    } else {
      res.redirect("/umsatz/kleinunternehmerregelung");
    }
  }
});

app.get("/umsatz/weitere-unternehmen", (req, res) => {
  res.render("umsatz/weitere-unternehmen", {
    session: req.session,
    currentSection: "kombi",
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(req.session, "/umsatz/weitere-unternehmen"),
  });
});

app.post("/umsatz/weitere-unternehmen-gesamt", (req, res) => {
  req.session.weitereUnternehmenGesamtBool =
    req.body.weitereUnternehmenGesamtBool;

  var umsatzGesamt =
    req.session.weitereUnternehmenGesamtBool &&
    req.session.weitereUnternehmenGesamtBool == "ja";

  if (req.query.edit) {
    if (umsatzGesamt) {
      res.redirect(
        "/umsatz/kleinunternehmerregelung?edit=true&redirect=" +
          req.query.redirect,
      );
    } else {
      res.redirect(
        "/umsatz/kleinunternehmerregelung-nicht-moeglich?edit=true&redirect=" +
          req.query.redirect,
      );
    }
  } else {
    if (umsatzGesamt) {
      res.redirect("/umsatz/kleinunternehmerregelung");
    } else {
      res.redirect("/umsatz/kleinunternehmerregelung-nicht-moeglich");
    }
  }
});

app.get("/umsatz/weitere-unternehmen-gesamt", (req, res) => {
  res.render("umsatz/weitere-unternehmen-gesamt", {
    session: req.session,
    currentSection: "kombi",
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(
      req.session,
      "/umsatz/weitere-unternehmen-gesamt",
    ),
  });
});

app.post("/umsatz/kleinunternehmerregelung", (req, res) => {
  req.session.kleinunternehmerMoeglich = req.body.kleinunternehmerMoeglich;
  req.session.kleinunternehmenBool = req.body.kleinunternehmenBool;

  if (req.query.edit) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect("/umsatz/status");
  }
});

app.get("/umsatz/kleinunternehmerregelung", (req, res) => {
  res.render("umsatz/kleinunternehmerregelung", {
    session: req.session,
    currentSection: "kombi",
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(
      req.session,
      "/umsatz/kleinunternehmerregelung",
    ),
  });
});

// app.post("/umsatz/umsatzsteuer", (req, res) => {
//   req.session.ustDiesesJahr = req.body.ustDiesesJahr;
//   req.session.ustNaechstesJahr = req.body.NaechstesJahr;
//   res.redirect("/umsatz/status");
// });
//
// app.get("/umsatz/umsatzsteuer", (req, res) => {
//   res.render("umsatz/umsatzsteuer", {
//     session: req.session,
//     currentSection: "kombi",
//     pageTree: treeForCurrentState(req.session, "/umsatz/umsatzsteuer"),
//   });
// });

app.get("/umsatz/status", (req, res) => {
  res.render("umsatz/status", {
    pageName: "Ihr Kombi-Antrag Status",
    session: req.session,
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    currentSection: "kombi",
    pageTree: treeForCurrentState(req.session, "/umsatz/status"),
  });
});

app.get("/gewinn/start", (req, res) => {
  res.render("gewinn/start", {
    session: req.session,
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    currentSection: "kombi",
    pageTree: treeForCurrentState(req.session, "/gewinn/start"),
  });
});

app.post("/gewinn/eingabe", (req, res) => {
  req.session.gewinnDiesesJahr = req.body.gewinnDiesesJahr;
  req.session.gewinnNaechstesJahr = req.body.gewinnNaechstesJahr;
  req.session.gewinnStarted = true;

  if (req.query.edit) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect("/gewinn/status");
  }
});

app.get("/gewinn/eingabe", (req, res) => {
  res.render("gewinn/eingabe", {
    session: req.session,
    currentSection: "kombi",
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(req.session, "/gewinn/eingabe"),
  });
});

// app.get("/einkuenfte/start", (req, res) => {
//   res.render("einkuenfte/start", {
//     session: req.session,
//     currentSection: "kombi",
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//   });
// });
//
// app.post("/einkuenfte/auswahl", (req, res) => {
//   req.session.einkuenfte = req.body.einkuenfte;
//
//   var einkuenfte = req.session.einkuenfte;
//
//   if (einkuenfte) {
//     if (einkuenfte.includes("landwirtschaft")) {
//       res.redirect("/einkuenfte/landwirtschaft");
//     } else if (einkuenfte.includes("vermietung")) {
//       res.redirect("/einkuenfte/vermietung");
//     } else if (einkuenfte.includes("selbststaendig")) {
//       res.redirect("/einkuenfte/selbststaendig");
//     } else if (einkuenfte.includes("nichtselbst")) {
//       res.redirect("/einkuenfte/nicht-selbststaendig");
//     } else if (einkuenfte.includes("kapital")) {
//       res.redirect("/einkuenfte/kapital");
//     } else if (einkuenfte.includes("sonstige")) {
//       res.redirect("/einkuenfte/sonstige");
//     } else {
//       res.redirect("/gewinn/status");
//     }
//   } else {
//     res.redirect("/gewinn/status");
//   }
// });
//
// app.get("/einkuenfte/auswahl", (req, res) => {
//   res.render("einkuenfte/auswahl", {
//     pageName: "Weitere Einkünfte",
//     pageTree: treeForCurrentState(req.session, "/einkuenfte/auswahl"),
//     session: req.session,
//     currentSection: "kombi",
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//   });
// });
//
// app.post("/einkuenfte/landwirtschaft", (req, res) => {
//   req.session.landwirtschaftDiesesJahr = req.body.landwirtschaftDiesesJahr;
//   req.session.landwirtschaftNaechstesJahr =
//     req.body.landwirtschaftNaechstesJahr;
//
//   var einkuenfte = req.session.einkuenfte;
//
//   if (einkuenfte.includes("vermietung")) {
//     res.redirect("/einkuenfte/vermietung");
//   } else if (einkuenfte.includes("selbststaendig")) {
//     res.redirect("/einkuenfte/selbststaendig");
//   } else if (einkuenfte.includes("nichtselbst")) {
//     res.redirect("/einkuenfte/nicht-selbststaendig");
//   } else if (einkuenfte.includes("kapital")) {
//     res.redirect("/einkuenfte/kapital");
//   } else if (einkuenfte.includes("sonstige")) {
//     res.redirect("/einkuenfte/sonstige");
//   } else {
//     res.redirect("/gewinn/status");
//   }
// });
//
// app.get("/einkuenfte/landwirtschaft", (req, res) => {
//   res.render("einkuenfte/landwirtschaft", {
//     session: req.session,
//     currentSection: "kombi",
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//     pageTree: treeForCurrentState(req.session, "/einkuenfte/auswahl"),
//   });
// });
//
// app.post("/einkuenfte/vermietung", (req, res) => {
//   req.session.vermietungDiesesJahr = req.body.vermietungDiesesJahr;
//   req.session.vermietungNaechstesJahr = req.body.vermietungNaechstesJahr;
//
//   var einkuenfte = req.session.einkuenfte;
//
//   if (einkuenfte.includes("selbststaendig")) {
//     res.redirect("/einkuenfte/selbststaendig");
//   } else if (einkuenfte.includes("nichtselbst")) {
//     res.redirect("/einkuenfte/nicht-selbststaendig");
//   } else if (einkuenfte.includes("kapital")) {
//     res.redirect("/einkuenfte/kapital");
//   } else if (einkuenfte.includes("sonstige")) {
//     res.redirect("/einkuenfte/sonstige");
//   } else {
//     res.redirect("/gewinn/status");
//   }
// });
//
// app.get("/einkuenfte/vermietung", (req, res) => {
//   res.render("einkuenfte/vermietung", {
//     session: req.session,
//     currentSection: "kombi",
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//     pageTree: treeForCurrentState(req.session, "/einkuenfte/auswahl"),
//   });
// });
//
// app.post("/einkuenfte/selbststaendig", (req, res) => {
//   req.session.selbststaendigDiesesJahr = req.body.selbststaendigDiesesJahr;
//   req.session.selbststaendigNaechstesJahr =
//     req.body.selbststaendigNaechstesJahr;
//
//   var einkuenfte = req.session.einkuenfte;
//
//   if (einkuenfte.includes("nichtselbst")) {
//     res.redirect("/einkuenfte/nicht-selbststaendig");
//   } else if (einkuenfte.includes("kapital")) {
//     res.redirect("/einkuenfte/kapital");
//   } else if (einkuenfte.includes("sonstige")) {
//     res.redirect("/einkuenfte/sonstige");
//   } else {
//     res.redirect("/gewinn/status");
//   }
// });
//
// app.get("/einkuenfte/selbststaendig", (req, res) => {
//   res.render("einkuenfte/selbststaendig", {
//     session: req.session,
//     currentSection: "kombi",
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//     pageTree: treeForCurrentState(req.session, "/einkuenfte/auswahl"),
//   });
// });
//
// app.post("/einkuenfte/nicht-selbststaendig", (req, res) => {
//   req.session.nichtSelbststaendigDiesesJahr =
//     req.body.nichtSelbststaendigDiesesJahr;
//   req.session.nichtSelbststaendigNaechstesJahr =
//     req.body.nichtSelbststaendigNaechstesJahr;
//
//   var einkuenfte = req.session.einkuenfte;
//
//   if (einkuenfte.includes("kapital")) {
//     res.redirect("/einkuenfte/kapital");
//   } else if (einkuenfte.includes("sonstige")) {
//     res.redirect("/einkuenfte/sonstige");
//   } else {
//     res.redirect("/gewinn/status");
//   }
// });
//
// app.get("/einkuenfte/nicht-selbststaendig", (req, res) => {
//   res.render("einkuenfte/nicht-selbststaendig", {
//     session: req.session,
//     currentSection: "kombi",
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//     pageTree: treeForCurrentState(req.session, "/einkuenfte/auswahl"),
//   });
// });
//
// app.post("/einkuenfte/kapital", (req, res) => {
//   req.session.kapitalDiesesJahr = req.body.sonstigeDiesesJahr;
//   req.session.kapitalNaechstesJahr = req.body.sonstigeNaechstesJahr;
//
//   var einkuenfte = req.session.einkuenfte;
//
//   if (einkuenfte.includes("sonstige")) {
//     res.redirect("/einkuenfte/sonstige");
//   } else {
//     req.session.gewinnDone = true;
//     res.redirect("/gewinn/status");
//   }
// });
//
// app.get("/einkuenfte/kapital", (req, res) => {
//   res.render("einkuenfte/kapital", {
//     session: req.session,
//     currentSection: "kombi",
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//     pageTree: treeForCurrentState(req.session, "/einkuenfte/auswahl"),
//   });
// });
//
// app.post("/einkuenfte/sonstige", (req, res) => {
//   req.session.sonstigeDiesesJahr = req.body.sonstigeDiesesJahr;
//   req.session.sonstigeNaechstesJahr = req.body.sonstigeNaechstesJahr;
//   res.redirect("/gewinn/status");
// });
//
// app.get("/einkuenfte/sonstige", (req, res) => {
//   res.render("einkuenfte/sonstige", {
//     session: req.session,
//     currentSection: "kombi",
//     edit: req.query.edit,answers: req.query.answers,
//     redirect: req.query.redirect,
//     redirectPath: req.baseUrl + req.path + "?answers=true",
//     pageTree: treeForCurrentState(req.session, "/einkuenfte/auswahl"),
//   });
// });

app.get("/gewinn/status", (req, res) => {
  res.render("gewinn/status", {
    pageName: "Ihr Kombi-Antrag Status",
    pageTree: treeForCurrentState(req.session, "/gewinn/status"),
    session: req.session,
    currentSection: "kombi",
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
  });
});

app.post("/kontakt/start", (req, res) => {
  res.redirect("/kontakt/start");
});

app.get("/kontakt/start", (req, res) => {
  res.render("kontakt/start", {
    session: req.session,
    currentSection: "kombi",
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(req.session, "/kontakt/start"),
  });
});

app.post("/kontakt/telefon", (req, res) => {
  req.session.kontaktTelefon = req.body.kontaktTelefon;
  if (req.query.edit) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect("/kontakt/email");
  }
});

app.get("/kontakt/telefon", (req, res) => {
  res.render("kontakt/telefon", {
    session: req.session,
    currentSection: "kombi",
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(req.session, "/kontakt/telefon"),
  });
});

app.post("/kontakt/email", (req, res) => {
  req.session.kontaktEmail = req.body.kontaktEmail;
  if (req.query.edit) {
    res.redirect(req.query.redirect);
  } else {
    res.redirect("/kontakt/status");
  }
});

app.get("/kontakt/email", (req, res) => {
  res.render("kontakt/email", {
    session: req.session,
    currentSection: "kombi",
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(req.session, "/kontakt/email"),
  });
});

app.get("/kontakt/status", (req, res) => {
  res.render("kontakt/status", {
    pageName: "Ihr Kombi-Antrag Status",
    session: req.session,
    edit: req.query.edit,
    answers: req.query.answers,
    redirect: req.query.redirect,
    redirectPath: req.baseUrl + req.path + "?answers=true",
    currentSection: "kombi",
    pageTree: treeForCurrentState(req.session, "/kontakt/status"),
  });
});

app.get("/antrag-ueberpruefen", (req, res) => {
  var adresseAbweichend = req.session.adresseAbweichend == "ja";
  var kleinunternehmenVerwenden = req.session.kleinunternehmenBool == "ja";
  var existingUstid = req.session.ustidexistingbool === "ja";
  var newUstid = req.session.ustidbool === "ja";

  res.render("antrag-ueberpruefen", {
    adresseAbweichend: adresseAbweichend,
    existingUstid: existingUstid,
    kleinunternehmenVerwenden: kleinunternehmenVerwenden,
    newUstid: newUstid,
    pageName: "Antrag überprüfen",
    redirectPath: req.baseUrl + req.path + "?answers=true",
    pageTree: treeForCurrentState(req.session, "/antrag-ueberpruefen"),
    session: req.session,
    currentSection: "kombi",
  });
});

app.get("/antrag-senden", (req, res) => {
  res.render("antrag-senden", {
    pageName: "Antrag absenden",
    session: req.session,
    currentSection: "absenden",
  });
});

app.get("/antrag-gesendet", (req, res) => {
  const event = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "+02:00",
  };

  res.render("antrag-gesendet", {
    pageName: "Antrag gesendet",
    start: true,
    session: req.session,
    date: event.toLocaleDateString("de-DE", options),
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
