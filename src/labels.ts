// Words shown to people for each fixed value, in every UI language.
// Every value in enums.ts must have a label here in every language;
// TypeScript reports an error if one is missing.
//
// Use: LABELS.hu.odorKind.pig_manure  ->  "Sertéstrágya"

import type {
  Language,
  OdorKind,
  OdorStrength,
  SourceKind,
} from './enums.js';

export type Labels = {
  odorKind: Record<OdorKind, string>;
  odorStrength: Record<OdorStrength, string>;
  sourceKind: Record<SourceKind, string>;
};

/** Serbian, Latin script. */
const sr: Labels = {
  odorKind: {
    not_set: 'Nije navedeno',
    garbage: 'Smeće',
    rotten_meat: 'Trulo meso',
    pig_manure: 'Svinjski stajnjak',
    poultry: 'Živina',
    cattle_manure: 'Goveđi stajnjak',
    field_spreading: 'Đubrenje njiva',
    smoke: 'Dim, paljevina',
    chemical: 'Hemikalije',
    sewage: 'Kanalizacija',
    other: 'Drugo',
  },
  odorStrength: {
    1: 'Jedva primetan',
    2: 'Slab',
    3: 'Jasan',
    4: 'Jak',
    5: 'Nepodnošljiv',
  },
  sourceKind: {
    landfill: 'Deponija',
    rendering_plant: 'Kafilerija',
    pig_farm: 'Svinjogojska farma',
    poultry_farm: 'Živinarska farma',
    cattle_farm: 'Govedarska farma',
    wastewater: 'Prečistač otpadnih voda',
    industrial: 'Industrija',
    other: 'Drugo',
  },
};

/** Hungarian. */
const hu: Labels = {
  odorKind: {
    not_set: 'Nincs megadva',
    garbage: 'Szemét',
    rotten_meat: 'Rothadó hús',
    pig_manure: 'Sertéstrágya',
    poultry: 'Baromfi',
    cattle_manure: 'Marhatrágya',
    field_spreading: 'Trágyázás a földeken',
    smoke: 'Füst, égetés',
    chemical: 'Vegyszer',
    sewage: 'Szennyvíz',
    other: 'Egyéb',
  },
  odorStrength: {
    1: 'Alig érezhető',
    2: 'Gyenge',
    3: 'Határozott',
    4: 'Erős',
    5: 'Elviselhetetlen',
  },
  sourceKind: {
    landfill: 'Hulladéklerakó',
    rendering_plant: 'Állati hulladékfeldolgozó',
    pig_farm: 'Sertéstelep',
    poultry_farm: 'Baromfitelep',
    cattle_farm: 'Szarvasmarhatelep',
    wastewater: 'Szennyvíztisztító',
    industrial: 'Ipar',
    other: 'Egyéb',
  },
};

export const LABELS: Record<Language, Labels> = { sr, hu };
