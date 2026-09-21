// Les données de la carte : valeurs communes, fiche vCard, lecture de l'adresse.

window.Contact = (function () {
  'use strict';

  // Valeurs communes à toute l'équipe. Une fiche ne renseigne que ce qui lui
  // est propre ; le reste vient d'ici.
  var DEFAULTS = {
    firstName: 'Jérôme',
    lastName: 'Goumard',
    role: 'Directeur',
    department: '',
    phone: '06 42 97 36 94',
    email: 'jerome@graffeuille.com',
    email2: '',
    website: 'www.graffeuille.com',
    linkedin: 'https://fr.linkedin.com/company/ets-graffeuille-sas',
    company: 'GRAFFEUILLE',
    street: '120, route de Saint-Jean d’Angély',
    postalCode: '16170',
    city: 'Rouillac',
    country: 'France',
    tagline: 'Reconditionnement moteurs,\nboîtes de vitesses et ponts.',
    showBaseline: true,
    accent: '#e63329',
    photo: '',
    en: { tagline: 'Engine, Gearbox & Axle Remanufacturing' }
  };

  var BOOLEANS = ['showBaseline'];

  // Complète une fiche avec les valeurs communes.
  function normalise(d) {
    var out = Object.assign({}, DEFAULTS, d || {});
    out.en = Object.assign({}, DEFAULTS.en, (d && d.en) || {});
    BOOLEANS.forEach(function (k) { out[k] = !!out[k]; });
    return out;
  }

  // La fiche dans une langue. Un champ non traduit reste en français.
  function localise(d, lang) {
    return lang === 'en' ? Object.assign({}, d, d.en) : d;
  }

  // Prénom et NOM.
  function fullName(d) {
    return [d.firstName, (d.lastName || '').toUpperCase()].filter(Boolean).join(' ');
  }

  // Nom de fichier sans accent ni espace.
  function slugify(str) {
    return String(str || '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Code postal, ville et pays.
  function cityLine(d) {
    var line = [d.postalCode, d.city].filter(Boolean).join(' ');
    return (line + (d.country ? ' - ' + d.country : '')).trim();
  }

  // L'adresse sur une ligne, pour l'itinéraire.
  function addressQuery(d) {
    return [d.street, d.postalCode, d.city, d.country].filter(Boolean).join(', ');
  }

  // Le lien du site.
  function websiteUrl(d) {
    if (!d.website) return '';
    return /^https?:\/\//i.test(d.website) ? d.website : 'https://' + d.website;
  }

  // Le lien LinkedIn.
  function linkedinUrl(d) {
    var v = String(d.linkedin || '').trim().replace(/\/+$/, '');
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    if (/^(www\.)?linkedin\.com\//i.test(v)) return 'https://www.' + v.replace(/^www\./i, '');
    return 'https://www.linkedin.com/in/' + v.replace(/^\/+/, '');
  }

  // Les courriels renseignés.
  function emails(d) {
    return [d.email, d.email2].filter(Boolean);
  }

  // Le numéro au format international.
  function e164(phone) {
    var raw = String(phone || '').replace(/[\s.\-() ]/g, '');
    if (raw.charAt(0) === '+') return raw;
    if (raw.slice(0, 2) === '00') return '+' + raw.slice(2);
    if (/^0\d{9}$/.test(raw)) return '+33' + raw.slice(1);
    return raw;
  }

  // Mobile ou fixe.
  function telType(phone) {
    return /^\+33[67]/.test(e164(phone)) ? 'CELL,WORK' : 'WORK,VOICE';
  }

  // La fiche à ajouter aux contacts.
  function vcard(d) {
    var lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:' + (d.lastName || '') + ';' + (d.firstName || '') + ';;;',
      'FN:' + [d.firstName, d.lastName].filter(Boolean).join(' ')
    ];
    if (d.company) lines.push('ORG:' + d.company);
    var title = [d.role, d.department].filter(Boolean).join(' - ').split('\n').join(' ');
    if (title) lines.push('TITLE:' + title);
    if (d.phone) lines.push('TEL;TYPE=' + telType(d.phone) + ':' + e164(d.phone));
    if (d.street || d.city) {
      lines.push('ADR;TYPE=WORK:;;' + (d.street || '') + ';' + (d.city || '') + ';;'
                 + (d.postalCode || '') + ';' + (d.country || ''));
    }
    if (d.email) lines.push('EMAIL;TYPE=WORK,INTERNET:' + d.email);
    if (d.email2) lines.push('EMAIL;TYPE=WORK,INTERNET:' + d.email2);
    if (d.website) lines.push('URL:' + websiteUrl(d));
    if (d.linkedin) lines.push('X-SOCIALPROFILE;TYPE=linkedin:' + linkedinUrl(d));
    lines.push('END:VCARD');
    return lines.join('\r\n');
  }

  // L'identifiant écrit après le #. Vide si absent, null s'il est invalide.
  // Seul un identifiant de dossier est accepté : la page ne peut donc afficher
  // que des fiches versionnées dans le dépôt.
  function readSlug(hash) {
    var frag = String(hash || '').replace(/^#/, '');
    if (!frag) return '';
    return /^[a-z0-9-]{1,64}$/i.test(frag) ? frag.toLowerCase() : null;
  }

  return {
    DEFAULTS: DEFAULTS,
    normalise: normalise, localise: localise,
    fullName: fullName, slugify: slugify,
    cityLine: cityLine, addressQuery: addressQuery,
    websiteUrl: websiteUrl, linkedinUrl: linkedinUrl,
    emails: emails, e164: e164, vcard: vcard,
    readSlug: readSlug
  };
}());
