export const WORLD_CUP_TEAMS = [
  { name: "Canada", namePt: "Canadá", flag: "🇨🇦", confederation: "Concacaf", group: "B", isHost: true },
  { name: "Mexico", namePt: "México", flag: "🇲🇽", confederation: "Concacaf", group: "A", isHost: true },
  { name: "USA", namePt: "Estados Unidos", flag: "🇺🇸", confederation: "Concacaf", group: "D", isHost: true },
  { name: "Algeria", namePt: "Argélia", flag: "🇩🇿", confederation: "CAF", group: "J" },
  { name: "Argentina", namePt: "Argentina", flag: "🇦🇷", confederation: "CONMEBOL", group: "J" },
  { name: "Australia", namePt: "Austrália", flag: "🇦🇺", confederation: "AFC", group: "D" },
  { name: "Austria", namePt: "Áustria", flag: "🇦🇹", confederation: "UEFA", group: "J" },
  { name: "Belgium", namePt: "Bélgica", flag: "🇧🇪", confederation: "UEFA", group: "G" },
  { name: "Bosnia and Herzegovina", namePt: "Bósnia e Herzegovina", flag: "🇧🇦", confederation: "UEFA", group: "B" },
  { name: "Brazil", namePt: "Brasil", flag: "🇧🇷", confederation: "CONMEBOL", group: "C" },
  { name: "Cabo Verde", namePt: "Cabo Verde", flag: "🇨🇻", confederation: "CAF", group: "H" },
  { name: "Colombia", namePt: "Colômbia", flag: "🇨🇴", confederation: "CONMEBOL", group: "K" },
  { name: "Congo DR", namePt: "RD Congo", flag: "🇨🇩", confederation: "CAF", group: "K" },
  { name: "Croatia", namePt: "Croácia", flag: "🇭🇷", confederation: "UEFA", group: "L" },
  { name: "Curaçao", namePt: "Curaçao", flag: "🇨🇼", confederation: "Concacaf", group: "E" },
  { name: "Czechia", namePt: "Tchéquia", flag: "🇨🇿", confederation: "UEFA", group: "A" },
  { name: "Côte d'Ivoire", namePt: "Costa do Marfim", flag: "🇨🇮", confederation: "CAF", group: "E" },
  { name: "Ecuador", namePt: "Equador", flag: "🇪🇨", confederation: "CONMEBOL", group: "E" },
  { name: "Egypt", namePt: "Egito", flag: "🇪🇬", confederation: "CAF", group: "G" },
  { name: "England", namePt: "Inglaterra", flag: "🏴", confederation: "UEFA", group: "L" },
  { name: "France", namePt: "França", flag: "🇫🇷", confederation: "UEFA", group: "I" },
  { name: "Germany", namePt: "Alemanha", flag: "🇩🇪", confederation: "UEFA", group: "E" },
  { name: "Ghana", namePt: "Gana", flag: "🇬🇭", confederation: "CAF", group: "L" },
  { name: "Haiti", namePt: "Haiti", flag: "🇭🇹", confederation: "Concacaf", group: "C" },
  { name: "IR Iran", namePt: "Irã", flag: "🇮🇷", confederation: "AFC", group: "G" },
  { name: "Iraq", namePt: "Iraque", flag: "🇮🇶", confederation: "AFC", group: "I" },
  { name: "Japan", namePt: "Japão", flag: "🇯🇵", confederation: "AFC", group: "F" },
  { name: "Jordan", namePt: "Jordânia", flag: "🇯🇴", confederation: "AFC", group: "J" },
  { name: "Korea Republic", namePt: "Coreia do Sul", flag: "🇰🇷", confederation: "AFC", group: "A" },
  { name: "Morocco", namePt: "Marrocos", flag: "🇲🇦", confederation: "CAF", group: "C" },
  { name: "Netherlands", namePt: "Países Baixos", flag: "🇳🇱", confederation: "UEFA", group: "F" },
  { name: "New Zealand", namePt: "Nova Zelândia", flag: "🇳🇿", confederation: "OFC", group: "G" },
  { name: "Norway", namePt: "Noruega", flag: "🇳🇴", confederation: "UEFA", group: "I" },
  { name: "Panama", namePt: "Panamá", flag: "🇵🇦", confederation: "Concacaf", group: "L" },
  { name: "Paraguay", namePt: "Paraguai", flag: "🇵🇾", confederation: "CONMEBOL", group: "D" },
  { name: "Portugal", namePt: "Portugal", flag: "🇵🇹", confederation: "UEFA", group: "K" },
  { name: "Qatar", namePt: "Catar", flag: "🇶🇦", confederation: "AFC", group: "B" },
  { name: "Saudi Arabia", namePt: "Arábia Saudita", flag: "🇸🇦", confederation: "AFC", group: "H" },
  { name: "Scotland", namePt: "Escócia", flag: "🏴", confederation: "UEFA", group: "C" },
  { name: "Senegal", namePt: "Senegal", flag: "🇸🇳", confederation: "CAF", group: "I" },
  { name: "South Africa", namePt: "África do Sul", flag: "🇿🇦", confederation: "CAF", group: "A" },
  { name: "Spain", namePt: "Espanha", flag: "🇪🇸", confederation: "UEFA", group: "H" },
  { name: "Sweden", namePt: "Suécia", flag: "🇸🇪", confederation: "UEFA", group: "F" },
  { name: "Switzerland", namePt: "Suíça", flag: "🇨🇭", confederation: "UEFA", group: "B" },
  { name: "Tunisia", namePt: "Tunísia", flag: "🇹🇳", confederation: "CAF", group: "F" },
  { name: "Türkiye", namePt: "Turquia", flag: "🇹🇷", confederation: "UEFA", group: "D" },
  { name: "Uruguay", namePt: "Uruguai", flag: "🇺🇾", confederation: "CONMEBOL", group: "H" },
  { name: "Uzbekistan", namePt: "Uzbequistão", flag: "🇺🇿", confederation: "AFC", group: "K" },
] as const;

export type WorldCupTeam = (typeof WORLD_CUP_TEAMS)[number];

export function findWorldCupTeam(name: string) {
  return WORLD_CUP_TEAMS.find((team) => team.name === name);
}

export function getTeamDisplayName(name: string) {
  const team = findWorldCupTeam(name);
  return team ? `${team.flag} ${team.namePt}` : name;
}

export function getTeamOptionLabel(team: WorldCupTeam) {
  return `Grupo ${team.group} - ${team.flag} ${team.namePt}`;
}

export function toPrismaTeamInput(team: WorldCupTeam) {
  return {
    name: team.name,
    confederation: team.confederation,
    group: team.group,
    isHost: Boolean("isHost" in team && team.isHost),
  };
}
