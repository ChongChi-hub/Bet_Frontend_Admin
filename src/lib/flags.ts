export const WORLD_CUP_TEAMS = [
  "Mexico", "Nam Phi", "Hàn Quốc", "Cộng hòa Séc",
  "Canada", "Bosnia và Herzegovina", "Qatar", "Thụy Sĩ",
  "Brazil", "Maroc", "Haiti", "Scotland",
  "Mỹ", "Paraguay", "Australia", "Thổ Nhĩ Kỳ",
  "Đức", "Curaçao", "Bờ Biển Ngà (Côte d'Ivoire)", "Ecuador",
  "Hà Lan", "Nhật Bản", "Thụy Điển", "Tunisia",
  "Bỉ", "Ai Cập", "Iran", "New Zealand",
  "Tây Ban Nha", "Cape Verde", "Saudi Arabia", "Uruguay",
  "Pháp", "Senegal", "Iraq", "Na Uy",
  "Argentina", "Algeria", "Áo", "Jordan",
  "Bồ Đào Nha", "CHDC Congo", "Uzbekistan", "Colombia",
  "Anh", "Croatia", "Ghana", "Panama"
];

export const COUNTRY_CODES: Record<string, string> = {
  // Bảng A
  'Mexico': 'mx', 'Nam Phi': 'za', 'Hàn Quốc': 'kr', 'Cộng hòa Séc': 'cz',
  // Bảng B
  'Canada': 'ca', 'Bosnia và Herzegovina': 'ba', 'Qatar': 'qa', 'Thụy Sĩ': 'ch',
  // Bảng C
  'Brazil': 'br', 'Maroc': 'ma', 'Haiti': 'ht', 'Scotland': 'gb-sct',
  // Bảng D
  'Mỹ': 'us', 'Paraguay': 'py', 'Australia': 'au', 'Thổ Nhĩ Kỳ': 'tr',
  // Bảng E
  'Đức': 'de', 'Curaçao': 'cw', 'Bờ Biển Ngà (Côte d\'Ivoire)': 'ci', 'Ecuador': 'ec',
  // Bảng F
  'Hà Lan': 'nl', 'Nhật Bản': 'jp', 'Thụy Điển': 'se', 'Tunisia': 'tn',
  // Bảng G
  'Bỉ': 'be', 'Ai Cập': 'eg', 'Iran': 'ir', 'New Zealand': 'nz',
  // Bảng H
  'Tây Ban Nha': 'es', 'Cape Verde': 'cv', 'Saudi Arabia': 'sa', 'Uruguay': 'uy',
  // Bảng I
  'Pháp': 'fr', 'Senegal': 'sn', 'Iraq': 'iq', 'Na Uy': 'no',
  // Bảng J
  'Argentina': 'ar', 'Algeria': 'dz', 'Áo': 'at', 'Jordan': 'jo',
  // Bảng K
  'Bồ Đào Nha': 'pt', 'CHDC Congo': 'cd', 'Uzbekistan': 'uz', 'Colombia': 'co',
  // Bảng L
  'Anh': 'gb-eng', 'Croatia': 'hr', 'Ghana': 'gh', 'Panama': 'pa'
};

export const getFlagUrl = (countryName: string) => {
  const code = COUNTRY_CODES[countryName];
  if (code) {
    return `https://flagcdn.com/w80/${code}.png`;
  }
  return 'https://cdn-icons-png.flaticon.com/128/8750/8750696.png';
};
