// Words shown to people for each fixed value, in every UI language.
// Every value in enums.ts must have a label here in every language;
// TypeScript reports an error if one is missing.
//
// Use: LABELS.hu.smellKind.pig_manure  ->  "Sertéstrágya"

import type {
  Duration,
  Language,
  SmellKind,
  SmellStrength,
  SourceKind,
} from './enums.js';

export type Labels = {
  smellKind: Record<SmellKind, string>;
  smellStrength: Record<SmellStrength, string>;
  duration: Record<Duration, string>;
  sourceKind: Record<SourceKind, string>;
};

/** Serbian, Latin script. */
const sr: Labels = {
  smellKind: {
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
  smellStrength: {
    1: 'Jedva primetan',
    2: 'Slab',
    3: 'Jasan',
    4: 'Jak',
    5: 'Nepodnošljiv',
  },
  duration: {
    not_set: 'Nije navedeno',
    under_15_min: 'Manje od 15 min',
    '15_to_60_min': '15 do 60 min',
    '1_to_3_hours': '1 do 3 sata',
    over_3_hours: 'Više od 3 sata',
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
  smellKind: {
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
  smellStrength: {
    1: 'Alig érezhető',
    2: 'Gyenge',
    3: 'Határozott',
    4: 'Erős',
    5: 'Elviselhetetlen',
  },
  duration: {
    not_set: 'Nincs megadva',
    under_15_min: '15 percnél rövidebb',
    '15_to_60_min': '15–60 perc',
    '1_to_3_hours': '1–3 óra',
    over_3_hours: '3 óránál hosszabb',
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
