// contact.js - modèle de données de la page publique : valeurs par défaut,
// fiche vCard, et lecture des coordonnées glissées dans l'adresse.

window.Contact = (function () {
  'use strict';

  // Coordonnées communes à toute l'entreprise : une fiche carte.json ne
  // renseigne que ce qui lui est propre, le reste vient d'ici.
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
    photo: ''
  };

  var BOOLEANS = ['showBaseline'];

  // Ordre des champs dans la charge compacte des anciennes adresses « #c= ».
  // Cet ordre est un format de données : ne jamais le modifier, sous peine de
  // rendre illisibles les QR codes déjà imprimés.
  var PACKED = ['firstName', 'lastName', 'role', 'phone', 'email', 'website',
                'company', 'street', 'postalCode', 'city', 'country',
                'tagline', 'accent',
                'email2', 'department', 'linkedin'];

  function normalise(d) {
    var out = Object.assign({}, DEFAULTS, d || {});
    BOOLEANS.forEach(function (k) { out[k] = !!out[k]; });
    return out;
  }

  function fullName(d) {
    return [d.firstName, (d.lastName || '').toUpperCase()].filter(Boolean).join(' ');
  }

  function slugify(str) {
    return String(str || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
    return /^\+33[67]/.test(e164(phone)) ? 'CELL,WORK' : 'WORK,VOICE';
  }

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

  /* ------------------------------------------- coordonnées dans l'adresse */

  function b64decode(str) {
    var b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin = atob(b64), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    // « fatal » : un lien tronqué doit échouer franchement plutôt que de
    // produire des caractères de remplacement et une carte de charabia.
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }

  // Décode la charge compacte des anciens QR codes « #c=… ».
  function unpack(str) {
    if (!/^[A-Za-z0-9_-]+$/.test(str)) return null;
    var parts;
    try {
      parts = b64decode(str).split('~');
    } catch (e) { return null; }
    // Une charge valide commence toujours par une identité.
    if (!parts[0] && !parts[1]) return null;
    var d = {};
    PACKED.forEach(function (k, i) {
      if (parts[i]) d[k] = parts[i];
    });
    return normalise(d);
  }

  // Lit le fragment d'adresse : identifiant de personne, ou coordonnées.
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
    DEFAULTS: DEFAULTS,
    normalise: normalise, fullName: fullName, slugify: slugify,
    cityLine: cityLine, addressQuery: addressQuery,
    websiteUrl: websiteUrl, linkedinUrl: linkedinUrl,
    emails: emails, e164: e164, telType: telType, vcard: vcard,
    unpack: unpack, readFragment: readFragment
  };
}());
