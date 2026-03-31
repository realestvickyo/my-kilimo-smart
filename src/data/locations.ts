export interface Ward {
  name: string;
}

export interface SubCounty {
  name: string;
  wards: string[];
}

export interface County {
  code: number;
  name: string;
  capital: string;
  areaKm2?: number;
  mainEconomicActivities?: string;
  subCounties: SubCounty[];
}

export const KENYA_LOCATIONS: County[] = [
  {
    code: 1,
    name: "Mombasa",
    capital: "Mombasa City",
    areaKm2: 212.5,
    mainEconomicActivities: "Tourism, Port services, Fishing, Trade, Industry",
    subCounties: [
      { name: "Mvita", wards: ["Mji wa Kale/Makadara", "Tudor", "Tononoka", "Majengo", "Ganjoni/Shimanzi"] },
      { name: "Nyali", wards: ["Frere Town", "Ziwa la Ng'ombe", "Mkomani", "Kongowea", "Kadzandani"] },
      { name: "Kisauni", wards: ["Mjambere", "Junda", "Bamburi", "Mwakirunge", "Mtopanga", "Magogoni", "Shanzu"] },
      { name: "Changamwe", wards: ["Port Reitz", "Kipevu", "Airport", "Changamwe", "Chaani"] },
      { name: "Jomvu", wards: ["Jomvu Kuu", "Miritini", "Mikindani"] },
      { name: "Likoni", wards: ["Mtongwe", "Shika Adabu", "Bofu", "Likoni", "Timbwani"] }
    ]
  },
  {
    code: 2,
    name: "Kwale",
    capital: "Kwale",
    areaKm2: 8270,
    mainEconomicActivities: "Agriculture, Tourism, Fishing, Mining",
    subCounties: [
      { name: "Matuga", wards: ["Waa", "Tiwi", "Kubo South", "Mkongani"] },
      { name: "Kinango", wards: ["Pengo", "Ndavaya", "Mackinon Road", "Kinango"] },
      { name: "Lunga Lunga", wards: ["Vanga", "Mwereni", "Pongwe/Kidimu"] },
      { name: "Msambweni", wards: ["Ukunda", "Ramisi", "Kinondo"] }
    ]
  },
  {
    code: 3,
    name: "Kilifi",
    capital: "Kilifi",
    areaKm2: 12246,
    mainEconomicActivities: "Agriculture, Tourism, Fishing, Cashew nuts, Coconut",
    subCounties: [
      { name: "Kilifi North", wards: ["Tezo", "Sokoni", "Kibarani", "Matsangoni"] },
      { name: "Kilifi South", wards: ["Mwarakaya", "Chasimba", "Mtepe"] },
      { name: "Malindi", wards: ["Malindi Town", "Kakuyuni", "Ganda", "Watamu"] },
      { name: "Magarini", wards: ["Magarini", "Gongoni", "Adu", "Marafa"] },
      { name: "Kaloleni", wards: ["Kaloleni", "Mariakani"] }
    ]
  },
  {
    code: 4,
    name: "Tana River",
    capital: "Hola",
    areaKm2: 35375,
    mainEconomicActivities: "Livestock, Agriculture (irrigation), Fishing",
    subCounties: [
      { name: "Garsen", wards: ["Garsen", "Kipini", "Witu"] },
      { name: "Galole", wards: ["Galole", "Bura"] },
      { name: "Bura", wards: ["Madogo", "Salama"] }
    ]
  },
  {
    code: 5,
    name: "Lamu",
    capital: "Lamu",
    areaKm2: 6497,
    mainEconomicActivities: "Tourism, Fishing, Mangrove, Agriculture",
    subCounties: [
      { name: "Lamu East", wards: ["Faza", "Basuba"] },
      { name: "Lamu West", wards: ["Shella", "Mkomani", "Hindi", "Mkunumbi", "Hongwe", "Witu"] }
    ]
  },
  {
    code: 6,
    name: "Taita Taveta",
    capital: "Wundanyi",
    areaKm2: 17083,
    mainEconomicActivities: "Agriculture, Mining, Tourism (Tsavo Parks)",
    subCounties: [
      { name: "Mwatate", wards: ["Mwatate", "Chawia", "Bura"] },
      { name: "Wundanyi", wards: ["Wundanyi", "Werugha", "Mwanda"] },
      { name: "Taveta", wards: ["Taveta", "Chala"] },
      { name: "Voi", wards: ["Voi", "Mbololo", "Sagalla"] }
    ]
  },
  {
    code: 7,
    name: "Garissa",
    capital: "Garissa",
    areaKm2: 45720,
    mainEconomicActivities: "Livestock, Agriculture (irrigation), Trade",
    subCounties: [
      { name: "Garissa", wards: ["Garissa Township", "Balambala", "Dadaab"] },
      { name: "Fafi", wards: ["Fafi", "Bura"] },
      { name: "Ijara", wards: ["Ijara", "Masalani"] },
      { name: "Lagdera", wards: ["Lagdera"] }
    ]
  },
  {
    code: 8,
    name: "Wajir",
    capital: "Wajir",
    areaKm2: 56785,
    mainEconomicActivities: "Livestock, Trade, Pastoralism",
    subCounties: [
      { name: "Wajir East", wards: ["Wajir Township"] },
      { name: "Wajir West", wards: ["Eldas", "Wajir South"] },
      { name: "Tarbaj", wards: ["Tarbaj"] }
    ]
  },
  {
    code: 9,
    name: "Mandera",
    capital: "Mandera",
    areaKm2: 25970,
    mainEconomicActivities: "Livestock, Trade, Agriculture",
    subCounties: [
      { name: "Mandera East", wards: ["Mandera Township"] },
      { name: "Mandera West", wards: ["Takaba", "Kutulo"] },
      { name: "Lafey", wards: ["Lafey"] }
    ]
  },
  {
    code: 10,
    name: "Marsabit",
    capital: "Marsabit",
    areaKm2: 70961,
    mainEconomicActivities: "Livestock, Tourism (Marsabit Park)",
    subCounties: [
      { name: "Marsabit Central", wards: ["Marsabit Central"] },
      { name: "Moyale", wards: ["Moyale"] },
      { name: "North Horr", wards: ["North Horr"] }
    ]
  },
  {
    code: 11,
    name: "Isiolo",
    capital: "Isiolo",
    areaKm2: 25336,
    mainEconomicActivities: "Livestock, Tourism, Trade",
    subCounties: [
      { name: "Isiolo", wards: ["Isiolo Township"] },
      { name: "Garbatulla", wards: ["Garbatulla"] }
    ]
  },
  {
    code: 12,
    name: "Meru",
    capital: "Meru",
    areaKm2: 6936,
    mainEconomicActivities: "Agriculture (Tea, Coffee, Miraa), Dairy",
    subCounties: [
      { name: "Meru Central", wards: ["Imenti Central"] },
      { name: "Imenti North", wards: ["Meru Township"] },
      { name: "Imenti South", wards: ["Nithi"] }
    ]
  },
  {
    code: 13,
    name: "Tharaka Nithi",
    capital: "Chuka",
    areaKm2: 2564,
    mainEconomicActivities: "Agriculture (Tea, Coffee, Bananas)",
    subCounties: [
      { name: "Chuka", wards: ["Chuka"] },
      { name: "Tharaka", wards: ["Tharaka"] }
    ]
  },
  {
    code: 14,
    name: "Embu",
    capital: "Embu",
    areaKm2: 2818,
    mainEconomicActivities: "Agriculture (Tea, Coffee, Horticulture)",
    subCounties: [
      { name: "Embu West", wards: ["Embu Town"] },
      { name: "Embu East", wards: ["Manyatta"] },
      { name: "Mbeere North", wards: ["Mbeere"] }
    ]
  },
  {
    code: 15,
    name: "Kitui",
    capital: "Kitui",
    areaKm2: 30596,
    mainEconomicActivities: "Agriculture, Livestock, Mining (Coal)",
    subCounties: [
      { name: "Kitui Central", wards: ["Kitui Central"] },
      { name: "Mwingi", wards: ["Mwingi"] }
    ]
  },
  {
    code: 16,
    name: "Machakos",
    capital: "Machakos",
    areaKm2: 6208,
    mainEconomicActivities: "Agriculture, Industry, Trade",
    subCounties: [
      { name: "Machakos", wards: ["Machakos Town"] },
      { name: "Mwala", wards: ["Mwala"] }
    ]
  },
  {
    code: 17,
    name: "Makueni",
    capital: "Wote",
    areaKm2: 8034,
    mainEconomicActivities: "Agriculture (Mangoes, Horticulture)",
    subCounties: [
      { name: "Makueni", wards: ["Makueni"] },
      { name: "Kibwezi", wards: ["Kibwezi"] }
    ]
  },
  {
    code: 18,
    name: "Nyandarua",
    capital: "Ol Kalou",
    areaKm2: 3245,
    mainEconomicActivities: "Agriculture (Potatoes, Dairy, Horticulture)",
    subCounties: [
      { name: "Ol Kalou", wards: ["Ol Kalou"] },
      { name: "Kinangop", wards: ["Kinangop"] }
    ]
  },
  {
    code: 19,
    name: "Nyeri",
    capital: "Nyeri",
    areaKm2: 3266,
    mainEconomicActivities: "Agriculture (Tea, Coffee, Dairy)",
    subCounties: [
      { name: "Nyeri Central", wards: ["Nyeri Town"] },
      { name: "Mukurweini", wards: ["Mukurweini"] }
    ]
  },
  {
    code: 20,
    name: "Kirinyaga",
    capital: "Kerugoya",
    areaKm2: 1478,
    mainEconomicActivities: "Agriculture (Rice, Tea, Coffee)",
    subCounties: [
      { name: "Kirinyaga Central", wards: ["Kerugoya"] }
    ]
  },
  {
    code: 21,
    name: "Murang'a",
    capital: "Murang'a",
    areaKm2: 2526,
    mainEconomicActivities: "Agriculture (Tea, Coffee, Dairy)",
    subCounties: [
      { name: "Murang'a South", wards: ["Murang'a"] },
      { name: "Kiharu", wards: ["Kiharu"] }
    ]
  },
  {
    code: 22,
    name: "Kiambu",
    capital: "Kiambu",
    areaKm2: 2543,
    mainEconomicActivities: "Agriculture, Dairy, Horticulture, Industry",
    subCounties: [
      { name: "Thika Town", wards: ["Township", "Hospital", "Gatuanyaga"] },
      { name: "Ruiru", wards: ["Gitothua", "Biashara", "Gatongora"] },
      { name: "Limuru", wards: ["Limuru Central", "Ngecha Tigoni"] },
      { name: "Kiambu", wards: ["Kiambu Town", "Ndenderu"] }
    ]
  },
  {
    code: 23,
    name: "Turkana",
    capital: "Lodwar",
    areaKm2: 68580,
    mainEconomicActivities: "Livestock, Oil (exploration), Fishing (Lake Turkana)",
    subCounties: [
      { name: "Turkana Central", wards: ["Lodwar"] },
      { name: "Turkana South", wards: ["Lokichar"] }
    ]
  },
  {
    code: 24,
    name: "West Pokot",
    capital: "Kapenguria",
    areaKm2: 9169,
    mainEconomicActivities: "Livestock, Agriculture, Mining",
    subCounties: [
      { name: "West Pokot", wards: ["Kapenguria"] }
    ]
  },
  {
    code: 25,
    name: "Samburu",
    capital: "Maralal",
    areaKm2: 20182,
    mainEconomicActivities: "Livestock, Tourism",
    subCounties: [
      { name: "Samburu Central", wards: ["Maralal"] }
    ]
  },
  {
    code: 26,
    name: "Trans Nzoia",
    capital: "Kitale",
    areaKm2: 2495,
    mainEconomicActivities: "Agriculture (Maize, Wheat, Dairy)",
    subCounties: [
      { name: "Trans Nzoia East", wards: ["Kitale"] },
      { name: "Trans Nzoia West", wards: ["Endebess"] }
    ]
  },
  {
    code: 27,
    name: "Uasin Gishu",
    capital: "Eldoret",
    areaKm2: 2955,
    mainEconomicActivities: "Agriculture, Industry, Education, Dairy",
    subCounties: [
      { name: "Ainabkoi", wards: ["Kapsoya", "Kaptagat"] },
      { name: "Kapseret", wards: ["Langas", "Ngeria"] },
      { name: "Turbo", wards: ["Huruma", "Kiplombe"] }
    ]
  },
  {
    code: 28,
    name: "Elgeyo Marakwet",
    capital: "Iten",
    areaKm2: 3030,
    mainEconomicActivities: "Agriculture, Dairy, Tourism (Kerio Valley)",
    subCounties: [
      { name: "Keiyo North", wards: ["Iten"] },
      { name: "Marakwet East", wards: ["Marakwet"] }
    ]
  },
  {
    code: 29,
    name: "Nandi",
    capital: "Kapsabet",
    areaKm2: 2884,
    mainEconomicActivities: "Agriculture (Tea, Maize, Dairy)",
    subCounties: [
      { name: "Nandi Central", wards: ["Kapsabet"] }
    ]
  },
  {
    code: 30,
    name: "Baringo",
    capital: "Kabarnet",
    areaKm2: 11015,
    mainEconomicActivities: "Livestock, Agriculture, Tourism (Lake Baringo)",
    subCounties: [
      { name: "Baringo Central", wards: ["Kabarnet"] },
      { name: "Baringo North", wards: ["Kabarnet North"] },
      { name: "Eldama Ravine", wards: ["Eldama Ravine"] }
    ]
  },
  {
    code: 31,
    name: "Laikipia",
    capital: "Nanyuki",
    areaKm2: 8696,
    mainEconomicActivities: "Livestock, Tourism, Horticulture",
    subCounties: [
      { name: "Laikipia East", wards: ["Nanyuki"] }
    ]
  },
  {
    code: 32,
    name: "Nakuru",
    capital: "Nakuru Town",
    areaKm2: 2325,
    mainEconomicActivities: "Agriculture, Tourism (Lakes), Industry",
    subCounties: [
      { name: "Nakuru Town East", wards: ["Biashara", "Flamingo", "Menengai"] },
      { name: "Nakuru Town West", wards: ["Barut", "Lanet"] },
      { name: "Naivasha", wards: ["Hell's Gate", "Lake View", "Mai Mahiu"] },
      { name: "Gilgil", wards: ["Gilgil", "Elementaita"] },
      { name: "Molo", wards: ["Molo", "Elburgon"] },
      { name: "Njoro", wards: ["Njoro", "Mau Narok"] }
    ]
  },
  {
    code: 33,
    name: "Narok",
    capital: "Narok",
    areaKm2: 17921,
    mainEconomicActivities: "Livestock, Tourism (Maasai Mara), Agriculture",
    subCounties: [
      { name: "Narok North", wards: ["Narok Town"] },
      { name: "Narok South", wards: ["Ololulung'a"] },
      { name: "Kilgoris", wards: ["Kilgoris"] }
    ]
  },
  {
    code: 34,
    name: "Kajiado",
    capital: "Kajiado",
    areaKm2: 21292,
    mainEconomicActivities: "Livestock, Tourism, Horticulture",
    subCounties: [
      { name: "Kajiado North", wards: ["Ngong"] },
      { name: "Kajiado Central", wards: ["Kajiado"] }
    ]
  },
  {
    code: 35,
    name: "Kericho",
    capital: "Kericho",
    areaKm2: 2454,
    mainEconomicActivities: "Tea, Agriculture, Dairy",
    subCounties: [
      { name: "Kericho", wards: ["Kericho Town"] }
    ]
  },
  {
    code: 36,
    name: "Bomet",
    capital: "Bomet",
    areaKm2: 2792,
    mainEconomicActivities: "Tea, Agriculture, Dairy",
    subCounties: [
      { name: "Bomet Central", wards: ["Bomet"] }
    ]
  },
  {
    code: 37,
    name: "Kakamega",
    capital: "Kakamega",
    areaKm2: 3051,
    mainEconomicActivities: "Agriculture, Sugarcane, Dairy",
    subCounties: [
      { name: "Kakamega Central", wards: ["Kakamega Town"] }
    ]
  },
  {
    code: 38,
    name: "Vihiga",
    capital: "Vihiga",
    areaKm2: 563,
    mainEconomicActivities: "Agriculture, Trade",
    subCounties: [
      { name: "Vihiga", wards: ["Vihiga"] }
    ]
  },
  {
    code: 39,
    name: "Bungoma",
    capital: "Bungoma",
    areaKm2: 3032,
    mainEconomicActivities: "Agriculture, Sugarcane, Maize",
    subCounties: [
      { name: "Bungoma Central", wards: ["Bungoma Town"] },
      { name: "Kimilili", wards: ["Kimilili"] }
    ]
  },
  {
    code: 40,
    name: "Busia",
    capital: "Busia",
    areaKm2: 1695,
    mainEconomicActivities: "Agriculture, Fishing (Lake Victoria), Trade",
    subCounties: [
      { name: "Busia", wards: ["Busia Town"] }
    ]
  },
  {
    code: 41,
    name: "Siaya",
    capital: "Siaya",
    areaKm2: 2530,
    mainEconomicActivities: "Agriculture, Fishing, Sugarcane",
    subCounties: [
      { name: "Siaya", wards: ["Siaya"] }
    ]
  },
  {
    code: 42,
    name: "Kisumu",
    capital: "Kisumu City",
    areaKm2: 2085,
    mainEconomicActivities: "Fishing, Trade, Industry, Agriculture",
    subCounties: [
      { name: "Kisumu Central", wards: ["Kisumu Town"] }
    ]
  },
  {
    code: 43,
    name: "Homa Bay",
    capital: "Homa Bay",
    areaKm2: 3158,
    mainEconomicActivities: "Fishing, Agriculture",
    subCounties: [
      { name: "Homa Bay", wards: ["Homa Bay Town"] }
    ]
  },
  {
    code: 44,
    name: "Migori",
    capital: "Migori",
    areaKm2: 2586,
    mainEconomicActivities: "Agriculture, Fishing, Mining",
    subCounties: [
      { name: "Migori", wards: ["Migori Town"] }
    ]
  },
  {
    code: 45,
    name: "Kisii",
    capital: "Kisii",
    areaKm2: 1317,
    mainEconomicActivities: "Agriculture (Tea, Bananas, Avocado)",
    subCounties: [
      { name: "Kisii Central", wards: ["Kisii Town"] }
    ]
  },
  {
    code: 46,
    name: "Nyamira",
    capital: "Nyamira",
    areaKm2: 912,
    mainEconomicActivities: "Agriculture (Tea, Coffee)",
    subCounties: [
      { name: "Nyamira", wards: ["Nyamira Town"] }
    ]
  },
  {
    code: 47,
    name: "Nairobi",
    capital: "Nairobi City",
    areaKm2: 696,
    mainEconomicActivities: "Finance, Commerce, Technology, Services, Industry",
    subCounties: [
      { name: "Westlands", wards: ["Kitisuru", "Parklands", "Karura", "Kangemi", "Mountain View"] },
      { name: "Dagoretti North", wards: ["Kilimani", "Kawangware", "Gatina", "Kileleshwa"] },
      { name: "Dagoretti South", wards: ["Waithaka", "Riruta", "Ngando"] },
      { name: "Lang'ata", wards: ["Karen", "Nairobi West", "South C", "Nyayo Highrise"] },
      { name: "Kibra", wards: ["Kibra", "Sarang'ombe", "Laini Saba"] },
      { name: "Kasarani", wards: ["Kasarani", "Njiru", "Ruai", "Mwiki"] },
      { name: "Embakasi Central", wards: ["Kayole Central", "Komarock"] },
      { name: "Embakasi East", wards: ["Embakasi", "Upper Savanna"] }
    ]
  }
];