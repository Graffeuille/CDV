// contact.js - modèle de données partagé par la page publique. valeurs par défaut, fiche vCard, et encodage compact pour l'URL du QR code.

window.Contact = (function () {
  'use strict';

  // Coordonnées de la carte d'origine, servant aussi de modèle de départ.
  
  var DEFAULTS = {
    firstName: 'Jérôme',
    lastName: 'Goumard',
    role: 'Directeur',
    department: '',
    phone: '06 42 97 36 94',
    email: 'jerome@graffeuille.com',
    email2: '',
    website: 'www.graffeuille.fr',
    websiteInContacts: false,
    linkedin: 'https://fr.linkedin.com/company/ets-graffeuille-sas',
    company: 'GRAFFEUILLE',
    street: '120, route de Saint-Jean d’Angély',
    postalCode: '16170',
    city: 'Rouillac',
    country: 'France',
    tagline: 'Reconditionnement de moteurs,\nde boîtes de vitesses et de ponts.',
    showBaseline: true,
    accent: '#e63329',
    qrLevel: 'M',
    watermark: true,
    bleed: false,
    slug: '',
    photo: ''
  };

  var FIELDS = Object.keys(DEFAULTS);
  var CHECKBOXES = ['websiteInContacts', 'showBaseline', 'watermark', 'bleed'];

  // Ordre des champs dans la charge compacte glissée dans l'URL. Cet ordre est un format de données : il ne doit pas changer, sous peine de rendre illisibles les QR codes déjà imprimés.
  
  var PACKED = ['firstName', 'lastName', 'role', 'phone', 'email', 'website',
                'company', 'street', 'postalCode', 'city', 'country',
                'tagline', 'accent',
                'email2', 'department', 'linkedin'];
  
  // Ajouts ultérieurs : toujours en fin de liste, pour que les QR déjà imprimés continuent de se lire.

  function normalise(d) {
    var out = Object.assign({}, DEFAULTS, d || {});
    CHECKBOXES.forEach(function (k) { out[k] = !!out[k]; });
    return out;
  }

  function fullName(d) {
    return [d.firstName, (d.lastName || '').toUpperCase()].filter(Boolean).join(' ');
  }

  function slugify(str) {
    return String(str || '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function cityLine(d) {
    var line = [d.postalCode, d.city].filter(Boolean).join(' ');
    return (line + (d.country ? ' - ' + d.country : '')).trim();
  }

  // Adresse sur une ligne, pour un lien vers une application de cartographie.
  function addressQuery(d) {
    return [d.street, d.postalCode, d.city, d.country].filter(Boolean).join(', ');
  }

  // Adresse du site.
  function websiteUrl(d) {
    if (!d.website) return '';
    return /^https?:\/\//i.test(d.website) ? d.website : 'https://' + d.website;
  }
  
// Adresse du profil LinkedIn.
  function linkedinUrl(d) {
  var v = String(d.linkedin || '').trim().replace(/\/+$/, '');
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  if (/^(www\.)?linkedin\.com\//i.test(v)) return 'https://www.' + v.replace(/^www\./i, '');
  return 'https://www.linkedin.com/in/' + v.replace(/^\/+/, '');
}

  function emails(d) {
    return [d.email, d.email2].filter(Boolean);
  }

  // Numéro au format international E.164.
  
  function e164(phone) {
    var raw = String(phone || '').replace(/[\s.\-()\u00a0]/g, '');
    if (raw.charAt(0) === '+') return raw;
    if (raw.slice(0, 2) === '00') return '+' + raw.slice(2);
    // Plan de numérotation français : un 0 suivi de neuf chiffres.
    if (/^0\d{9}$/.test(raw)) return '+33' + raw.slice(1);
    return raw;
  }

  function telType(phone) {
    var raw = e164(phone);
    return /^\+33[67]/.test(raw) ? 'CELL,WORK' : 'WORK,VOICE';
  }

  function vcard(d) {
    var lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:' + (d.lastName || '') + ';' + (d.firstName || '') + ';;;',
      'FN:' + [d.firstName, d.lastName].filter(Boolean).join(' ')
    ];
    if (d.company) lines.push('ORG:' + d.company);
    var title = [d.role, d.department].filter(Boolean).join(' — ').split('\n').join(' ');
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

  /* ------------------------------------------------- encodage pour l'URL */

  function b64encode(str) {
    var bytes = new TextEncoder().encode(str), bin = '';
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function b64decode(str) {
    var b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin = atob(b64), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  var SHARED = ['accent', 'linkedin'];

  // Charge compacte : Ce format tient dans un QR bien plus petit qu'un JSON, ce qui compte pour un code imprimé à 24 mm.
  
  function pack(d) {
    var parts = PACKED.map(function (k) {
      var v = d[k] == null ? '' : String(d[k]);
      if (SHARED.indexOf(k) >= 0
          && v.toLowerCase() === String(DEFAULTS[k]).toLowerCase()) return '';
      return v.replace(/~/g, '-');
    });
    while (parts.length && parts[parts.length - 1] === '') parts.pop();
    return b64encode(parts.join('~'));
  }

  function unpack(str) {
    try {
      var parts = b64decode(str).split('~');
      var d = {};
      PACKED.forEach(function (k, i) {
        if (parts[i]) d[k] = parts[i];
      });
      return normalise(d);
    } catch (e) { return null; }
  }

  // Adresse publique de la carte. Un identifiant court (« slug ») 
  
  function cardUrl(base, d) {
    var root = String(base || '').replace(/(editeur\.html)?(#.*)?$/, '');
    if (!/\/$/.test(root)) root += '/';
    return d.slug ? root + 'equipe/' + d.slug + '/' : root + '#c=' + pack(d);
  }

  // Lit le fragment d'URL d'une page publique : identifiant ou coordonnées.
  
  function readFragment(hash) {
    var frag = String(hash || '').replace(/^#/, '');
    if (!frag) return { kind: 'default' };
    if (frag.indexOf('c=') === 0) {
      var d = unpack(frag.slice(2));
      return d ? { kind: 'inline', data: d } : { kind: 'invalid' };
    }
    if (/^[a-z0-9-]{1,64}$/i.test(frag)) return { kind: 'slug', slug: frag };
    return { kind: 'invalid' };
  }

  return {
    DEFAULTS: DEFAULTS, FIELDS: FIELDS, CHECKBOXES: CHECKBOXES,
    normalise: normalise, fullName: fullName, slugify: slugify,
    cityLine: cityLine, addressQuery: addressQuery, websiteUrl: websiteUrl,
    linkedinUrl: linkedinUrl,
    vcard: vcard, emails: emails, e164: e164, telType: telType,
    pack: pack, unpack: unpack,
    cardUrl: cardUrl, readFragment: readFragment
  };
}());
