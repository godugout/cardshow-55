

export interface TeamColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

export const PRO_SPORTS_TEAM_COLORS: TeamColorScheme[] = [
  // Navy/Silver/White - Most iconic: Yankees
  { id: 'navy-silver-white', name: 'New York Yankees Style', primary: '#132448', secondary: '#C4CED4', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Red/Navy/White - Most popular: Red Sox
  { id: 'red-navy-white', name: 'Boston Red Sox Style', primary: '#BD3039', secondary: '#0C2340', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Blue/White/Red - Most iconic: Dodgers
  { id: 'blue-white-red', name: 'Los Angeles Dodgers Style', primary: '#005A9C', secondary: '#FFFFFF', accent: '#EF3E42', text: '#FFFFFF' },
  
  // Orange/Black/Cream - Most recognizable: Giants
  { id: 'orange-black-cream', name: 'San Francisco Giants Style', primary: '#FD5A1E', secondary: '#27251F', accent: '#AE8F6F', text: '#FFFFFF' },
  
  // Blue/Red/White - Most historic: Cubs
  { id: 'blue-red-white', name: 'Chicago Cubs Style', primary: '#0E3386', secondary: '#CC3433', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Red/Yellow/Navy - Most classic: Cardinals  
  { id: 'red-yellow-navy', name: 'St. Louis Cardinals Style', primary: '#C41E3A', secondary: '#FEDB00', accent: '#0C2340', text: '#FFFFFF' },
  
  // Purple/Gold/White - NBA Championship: Lakers
  { id: 'purple-gold-white', name: 'Los Angeles Lakers Style', primary: '#552583', secondary: '#FDB927', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Green/Gold/White - Historic franchise: Celtics
  { id: 'green-gold-white', name: 'Boston Celtics Style', primary: '#007A33', secondary: '#BA9653', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Navy/Gold/White - Championship dynasty: Warriors
  { id: 'navy-gold-white', name: 'Golden State Warriors Style', primary: '#1D428A', secondary: '#FFC72C', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Red/Black/White - Iconic sports franchise: Bulls/Blackhawks
  { id: 'red-black-white', name: 'Chicago Bulls Style', primary: '#CE1141', secondary: '#000000', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Green/Black/Yellow - Most recognizable: Packers
  { id: 'green-black-yellow', name: 'Green Bay Packers Style', primary: '#203731', secondary: '#000000', accent: '#FFB612', text: '#FFFFFF' },
  
  // Yellow/Black/Red - Most iconic: Steelers
  { id: 'yellow-black-red', name: 'Pittsburgh Steelers Style', primary: '#FFB612', secondary: '#101820', accent: '#C60C30', text: '#000000' },

  // Additional MLB Teams
  { id: 'astros-navy-orange', name: 'Houston Astros Style', primary: '#002D62', secondary: '#EB6E1F', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'braves-navy-red', name: 'Atlanta Braves Style', primary: '#CE1141', secondary: '#13274F', accent: '#EAAA00', text: '#FFFFFF' },
  { id: 'mets-blue-orange', name: 'New York Mets Style', primary: '#002D72', secondary: '#FF5910', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'phillies-red-blue', name: 'Philadelphia Phillies Style', primary: '#E81828', secondary: '#002D72', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'mariners-navy-teal', name: 'Seattle Mariners Style', primary: '#0C2C56', secondary: '#005C5C', accent: '#C4CED4', text: '#FFFFFF' },
  { id: 'angels-red-navy', name: 'Los Angeles Angels Style', primary: '#BA0021', secondary: '#003263', accent: '#C4CED4', text: '#FFFFFF' },

  // Additional NFL Teams
  { id: 'eagles-green-black', name: 'Philadelphia Eagles Style', primary: '#004C54', secondary: '#000000', accent: '#A5ACAF', text: '#FFFFFF' },
  { id: 'ravens-purple-black', name: 'Baltimore Ravens Style', primary: '#241773', secondary: '#000000', accent: '#9E7C0C', text: '#FFFFFF' },
  { id: 'broncos-orange-navy', name: 'Denver Broncos Style', primary: '#FB4F14', secondary: '#002244', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'seahawks-navy-green', name: 'Seattle Seahawks Style', primary: '#002244', secondary: '#69BE28', accent: '#A5ACAF', text: '#FFFFFF' },
  { id: 'chiefs-red-gold', name: 'Kansas City Chiefs Style', primary: '#E31837', secondary: '#FFB81C', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'raiders-silver-black', name: 'Las Vegas Raiders Style', primary: '#000000', secondary: '#A5ACAF', accent: '#FFFFFF', text: '#FFFFFF' },

  // Additional NBA Teams
  { id: 'heat-red-black', name: 'Miami Heat Style', primary: '#98002E', secondary: '#000000', accent: '#F9A01B', text: '#FFFFFF' },
  { id: 'spurs-black-silver', name: 'San Antonio Spurs Style', primary: '#000000', secondary: '#C4CED4', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'mavs-blue-navy', name: 'Dallas Mavericks Style', primary: '#00538C', secondary: '#002B5E', accent: '#B8C4CA', text: '#FFFFFF' },
  { id: 'suns-orange-purple', name: 'Phoenix Suns Style', primary: '#E56020', secondary: '#1D1160', accent: '#F9AD1B', text: '#FFFFFF' },
  { id: 'raptors-red-black', name: 'Toronto Raptors Style', primary: '#CE1141', secondary: '#000000', accent: '#A1A1A4', text: '#FFFFFF' },

  // Additional NHL Teams
  { id: 'redwings-red-white', name: 'Detroit Red Wings Style', primary: '#CE1126', secondary: '#FFFFFF', accent: '#000000', text: '#FFFFFF' },
  { id: 'penguins-black-gold', name: 'Pittsburgh Penguins Style', primary: '#000000', secondary: '#FCB514', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'canadiens-red-blue', name: 'Montreal Canadiens Style', primary: '#AF1E2D', secondary: '#192168', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'oilers-orange-blue', name: 'Edmonton Oilers Style', primary: '#FF4C00', secondary: '#041E42', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'lightning-blue-black', name: 'Tampa Bay Lightning Style', primary: '#002868', secondary: '#000000', accent: '#FFFFFF', text: '#FFFFFF' },

  // International/Soccer
  { id: 'barca-blue-red', name: 'FC Barcelona Style', primary: '#A50044', secondary: '#004D98', accent: '#EDBB00', text: '#FFFFFF' },
  { id: 'real-madrid-white', name: 'Real Madrid Style', primary: '#FFFFFF', secondary: '#FFC72C', accent: '#00529F', text: '#000000' },
  { id: 'manchester-red-white', name: 'Manchester United Style', primary: '#DA020E', secondary: '#FFE500', accent: '#000000', text: '#FFFFFF' },

  // Default/Generic Options
  { id: 'classic', name: 'Classic Blue & Red', primary: '#1f2937', secondary: '#3b82f6', accent: '#ef4444', text: '#FFFFFF' },
  { id: 'modern', name: 'Modern Teal & Orange', primary: '#0f172a', secondary: '#06b6d4', accent: '#f59e0b', text: '#FFFFFF' },
  { id: 'vintage', name: 'Vintage Brown & Gold', primary: '#7c2d12', secondary: '#dc2626', accent: '#fbbf24', text: '#FFFFFF' }
];

export const getTeamColors = (colorSchemeId: string): TeamColorScheme => {
  return PRO_SPORTS_TEAM_COLORS.find(scheme => scheme.id === colorSchemeId) || PRO_SPORTS_TEAM_COLORS[0];
};

