export const navigation = [
  { href: "/map", label: "Explore Map" },
  { href: "/artists", label: "Artists" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/magazine", label: "Magazine" },
];

export const featuredArtists = [
  { rank: "01", tag: "AERO", city: "Hamilton", score: 931, piece: "King William Burner" },
  { rank: "02", tag: "NOVA", city: "Toronto", score: 774, piece: "Junction Mural" },
  { rank: "03", tag: "BRICK", city: "Niagara", score: 712, piece: "Canal Throwup" },
];

export const monthlyFeatures = [
  {
    id: "2026-08",
    label: "August 2026",
    stories: [
      { rank: 1, tag: "AERO", title: "Control at full scale", copy: "AERO leads August with a run of high-impact Hamilton pieces that balance clean structure with the speed and energy of the wall." },
      { rank: 2, tag: "NOVA", title: "Colour that carries", copy: "NOVA’s Junction work turns layered colour and sharp movement into an unmistakable signature that keeps pulling community ratings." },
      { rank: 3, tag: "BRICK", title: "Built for the surface", copy: "BRICK’s canal work brings weight, rhythm, and a deep respect for location—proof that a strong piece can feel native to its wall." },
    ],
  },
  {
    id: "2026-07",
    label: "July 2026",
    stories: [
      { rank: 1, tag: "NOVA", title: "A month in motion", copy: "NOVA topped July by pairing technical detail with compositions that read from the sidewalk and reward a closer look." },
      { rank: 2, tag: "AERO", title: "Hamilton pressure", copy: "AERO stayed near the top through consistency, strong wall choices, and a style the community recognized immediately." },
      { rank: 3, tag: "BRICK", title: "Texture first", copy: "BRICK found new ways to let weathered masonry become part of the work rather than simply its backdrop." },
    ],
  },
  {
    id: "2026-06",
    label: "June 2026",
    stories: [
      { rank: 1, tag: "BRICK", title: "Raw material", copy: "BRICK’s early-summer walls pushed texture and letter weight to the front, earning the strongest response of June." },
      { rank: 2, tag: "NOVA", title: "Light after dark", copy: "NOVA’s colour studies gave night-wall energy to daylight locations and built momentum across the region." },
      { rank: 3, tag: "AERO", title: "The long line", copy: "AERO’s disciplined forms and repeated motifs made June feel like one connected body of work." },
    ],
  },
  {
    id: "2026-05",
    label: "May 2026",
    stories: [
      { rank: 1, tag: "AERO", title: "Opening the season", copy: "AERO opened the season with confident scale and crisp forms that established the pace for WallRank’s first archive." },
      { rank: 2, tag: "BRICK", title: "Wall memory", copy: "BRICK worked with chipped paint and old masonry, letting previous layers remain visible inside the new piece." },
      { rank: 3, tag: "NOVA", title: "New frequency", copy: "NOVA introduced the colour language that would become one of the season’s most recognizable visual signatures." },
    ],
  },
];

export const latestSpots = [
  { title: "King William Burner", city: "Hamilton", rating: 4.6, status: "Featured" },
  { title: "Junction Mural", city: "Toronto", rating: 4.2, status: "Fresh" },
  { title: "Canal Throwup", city: "Niagara", rating: 4.0, status: "Tracked" },
  { title: "Market Alley Roll", city: "Hamilton", rating: 4.8, status: "Historic" },
];

export const supporters = [
  { name: "MayaSpray", points: 148, summary: "42 ratings, 11 comments" },
  { name: "JoelNorth", points: 121, summary: "30 ratings, 5 uploads" },
  { name: "WallScout", points: 109, summary: "18 comments, 7 shares" },
];

export const cities = ["Hamilton", "Toronto", "Niagara"];
