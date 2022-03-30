import classes from './LegalNotice.module.css';

export const LegalNotice = () => (
  <div class={classes.legalNotice}>
    <h1>Impressum</h1>
    <p>
      Unsere Kontaktdaten finden sie{' '}
      <a href="https://www.tngtech.com/kontakt-und-impressum.html">hier</a>.
    </p>
    <h1>Datenschutzerklärung</h1>
    <h2>Allgemeiner Hinweis und Pflichtinformationen</h2>
    <h2>Benennung der verantwortlichen Stelle</h2>
    <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
    <p>
      <span id="s3-t-firma">TNG Technology Consulting GmbH</span>
      <br />
      <span id="s3-t-strasse">Beta-Straße 13a</span>
      <br />
      <span id="s3-t-plz">85774</span> <span id="s3-t-ort">Unterföhring</span>
    </p>
    <p>
      Die verantwortliche Stelle entscheidet allein oder gemeinsam mit anderen über die Zwecke und
      Mittel der Verarbeitung von personenbezogenen Daten (z.B. Namen, Kontaktdaten o. Ä.).
    </p>

    <h2>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h2>
    <p>
      Nur mit Ihrer ausdrücklichen Einwilligung sind einige Vorgänge der Datenverarbeitung möglich.
      Ein Widerruf Ihrer bereits erteilten Einwilligung ist jederzeit möglich. Für den Widerruf
      genügt eine formlose Mitteilung per E-Mail. Die Rechtmäßigkeit der bis zum Widerruf erfolgten
      Datenverarbeitung bleibt vom Widerruf unberührt.
    </p>

    <h2>Recht auf Beschwerde bei der zuständigen Aufsichtsbehörde</h2>
    <p>
      Als Betroffener steht Ihnen im Falle eines datenschutzrechtlichen Verstoßes ein
      Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Zuständige Aufsichtsbehörde bezüglich
      datenschutzrechtlicher Fragen ist das Bayerisches Landesamt für Datenschutzaufsicht:{' '}
      <a href="https://www.lda.bayern.de/de/kontakt.html" target="_blank">
        https://www.lda.bayern.de/de/kontakt.html
      </a>
      .
    </p>

    <h2>Recht auf Datenübertragbarkeit</h2>
    <p>
      Ihnen steht das Recht zu, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung
      eines Vertrags automatisiert verarbeiten, an sich oder an Dritte aushändigen zu lassen. Die
      Bereitstellung erfolgt in einem maschinenlesbaren Format. Sofern Sie die direkte Übertragung
      der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch
      machbar ist.
    </p>

    <h2>Recht auf Auskunft, Berichtigung, Sperrung, Löschung</h2>
    <p>
      Sie haben jederzeit im Rahmen der geltenden gesetzlichen Bestimmungen das Recht auf
      unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, Herkunft der Daten,
      deren Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung,
      Sperrung oder Löschung dieser Daten. Diesbezüglich und auch zu weiteren Fragen zum Thema
      personenbezogene Daten können Sie sich jederzeit über die im Impressum aufgeführten
      Kontaktmöglichkeiten an uns wenden.
    </p>

    <h2>SSL- bzw. TLS-Verschlüsselung</h2>
    <p>
      Aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, die Sie an uns
      als Seitenbetreiber senden, nutzt unsere Website eine SSL-bzw. TLS-Verschlüsselung. Damit sind
      Daten, die Sie über diese Website übermitteln, für Dritte nicht mitlesbar. Sie erkennen eine
      verschlüsselte Verbindung an der „https://“ Adresszeile Ihres Browsers und am Schloss-Symbol
      in der Browserzeile.
    </p>

    <h2>Datenschutzbeauftragter</h2>
    <p>Wir haben einen Datenschutzbeauftragten bestellt.</p>
    <p>
      E-Mail: <a href="mailto:datenschutz@tngtech.com">datenschutz@tngtech.com</a>
    </p>

    <h2>Server-Log-Dateien</h2>
    <p>
      In Server-Log-Dateien erhebt und speichert der Provider der Website automatisch Informationen,
      die Ihr Browser automatisch an uns übermittelt. Dies sind:
    </p>
    <ul>
      <li>Besuchte Seite auf unserer Domain</li>
      <li>Datum und Uhrzeit der Serveranfrage</li>
      <li>Browsertyp und Browserversion</li>
      <li>Verwendetes Betriebssystem</li>
      <li>Referrer URL</li>
      <li>Hostname des zugreifenden Rechners</li>
      <li>IP-Adresse</li>
    </ul>
    <p>Es findet keine Zusammenführung dieser Daten mit anderen Datenquellen statt.</p>
    <h3>Vorhaltezeit</h3>
    <p>
      Wir halten keine Logs für Startseite vor. Alle anderen Logs werden nach spätestens 7 Tagen
      gelöscht.
    </p>
    <h2>Session Daten</h2>
    <p>
      Sessions sind öffentlich. Jeder der Ihre SessionId kennt kann daran teilnehmen, behandeln sie
      diese mit Vorsicht. Es ist jedoch nicht möglich Informationen über die Session zu bekommen
      ohne daran teilzunehmen.
    </p>
    <h3>Vorhaltezeit</h3>
    <p>Session-Daten werden maximal 16h gespeichert.</p>
    <h2>AWS Services</h2>
    <p>
      Wir nutzen Amazon Web Services um Ihnen diesen Service anbieten zu können. Mit Ausnahme der
      Startseite (via CDN), welche in den USA gehosted wird und die statischen Inhalte dieser Seite
      ausliefert, laufen alle anderen Dienste in der EU. Die AWS Datenschutzhinweise finden Sie{' '}
      <a href="https://aws.amazon.com/de/privacy/" target="_blank">
        hier
      </a>
    </p>
  </div>
);
