export interface Ward {
  name: string;
}

export interface SubCounty {
  name: string;
  wards: string[];
}

export interface County {
  name: string;
  subCounties: SubCounty[];
}

export const KENYA_LOCATIONS: County[] = [
  {
    name: "Nairobi",
    subCounties: [
      { name: "Westlands", wards: ["Kitisuru", "Parklands", "Karura", "Kangemi", "Mountain View"] },
      { name: "Dagoretti North", wards: ["Kilimani", "Kawangware", "Gatina", "Kileleshwa", "Kabiro"] },
      { name: "Kasarani", wards: ["Clay City", "Mwiki", "Kasarani", "Njiru", "Ruai"] },
      { name: "Lang'ata", wards: ["Karen", "Nairobi West", "Mugumo-ini", "South C", "Nyayo Highrise"] }
    ]
  },
  {
    name: "Nakuru",
    subCounties: [
      { name: "Nakuru Town East", wards: ["Biashara", "Kivumbini", "Flamingo", "Menengai", "Nakuru East"] },
      { name: "Naivasha", wards: ["Biashara", "Hell's Gate", "Lake View", "Mai Mahiu", "Maeilla", "Olkaria", "Naivasha East", "Viwandani"] },
      { name: "Molo", wards: ["Mariashoni", "Elburgon", "Turi", "Molo"] },
      { name: "Gilgil", wards: ["Gilgil", "Elementaita", "Mbaruk/Eburu", "Malewa West", "Murindat"] }
    ]
  },
  {
    name: "Uasin Gishu",
    subCounties: [
      { name: "Ainabkoi", wards: ["Kapsoya", "Kaptagat", "Ainabkoi/Olare"] },
      { name: "Kapseret", wards: ["Simat/Kapseret", "Kipkenyo", "Ngeria", "Megun", "Langas"] },
      { name: "Turbo", wards: ["Ngenyilel", "Tapsagoi", "Kamagut", "Kiplombe", "Kapsaos", "Huruma"] }
    ]
  },
  {
    name: "Narok",
    subCounties: [
      { name: "Narok North", wards: ["Olpusimoru", "Olokurto", "Narok Town", "Nkareta", "Olorropil", "Melili"] },
      { name: "Narok South", wards: ["Majimoto/Naroosura", "Ololulung'a", "Melelo", "Loita", "Sagamian"] },
      { name: "Kilgoris", wards: ["Kilgoris Central", "Keyian", "Angata Barikoi", "Shankoe", "Kimintet", "Lolgorian"] }
    ]
  },
  {
    name: "Kiambu",
    subCounties: [
      { name: "Thika Town", wards: ["Township", "Hospital", "Gatuanyaga", "Ngoliba", "Kamenu"] },
      { name: "Ruiru", wards: ["Gitothua", "Biashara", "Gatongora", "Kahawa Sukari", "Kahawa Wendani", "Kiuu", "Mwiki", "Mwihoko"] },
      { name: "Limuru", wards: ["Bibi Titi", "Limuru Central", "Limuru East", "Ndeiya", "Ngecha Tigoni"] }
    ]
  }
];
