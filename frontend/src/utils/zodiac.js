export const zodiacMessages = {
  Aries: [
    "Your fiery spirit is about to ignite a new adventure, Aries!",
    "The cosmos are aligning to fuel your passion, brave ram.",
    "Your boldness will be your guiding star today, Aries.",
    "The universe whispers of upcoming challenges that will test your courage.",
    "Your natural leadership is about to shine brighter than ever, Aries."
  ],
  Taurus: [
    "The stars are aligning to bring stability and growth, steadfast Taurus.",
    "Your patience is about to be rewarded in unexpected ways, earth sign.",
    "The cosmos hint at a sensory delight coming your way, bull of the zodiac.",
    "Your determination is your North Star, guiding you to success, Taurus.",
    "The universe is preparing a feast for your senses, enjoy it fully, Taurus."
  ],
  Gemini: [
    "Your quick wit is about to unlock a door of opportunity, curious Gemini.",
    "The stars are aligning to amplify your communication skills, air sign.",
    "A duality in your path will soon reveal its purpose, twin of the zodiac.",
    "Your adaptability will be your greatest asset in the coming days, Gemini.",
    "The cosmos are weaving a tapestry of connections just for you, Gemini."
  ],
  Cancer: [
    "The tides of emotion are turning in your favor, intuitive Cancer.",
    "Your nurturing spirit is about to bloom in unexpected ways, water sign.",
    "The moon whispers of home and heart connections strengthening, Cancer.",
    "Your protective shell holds the pearl of wisdom you seek, crab of the zodiac.",
    "The stars are aligning to bring emotional fulfillment, sensitive Cancer."
  ],
  Leo: [
    "Your inner light is about to shine brighter than ever, majestic Leo.",
    "The cosmos are setting the stage for your grand performance, fire sign.",
    "Your natural charisma is attracting exciting opportunities, lion of the zodiac.",
    "The universe is polishing your crown, preparing you for leadership, Leo.",
    "Your generous spirit is about to be rewarded tenfold, warm-hearted Leo."
  ],
  Virgo: [
    "Your attention to detail is about to uncover a hidden treasure, meticulous Virgo.",
    "The stars are aligning to bring order to chaos, earth sign.",
    "Your practical approach is the key to unlocking a mystery, Virgo.",
    "The cosmos whisper of a chance to perfect your craft, maiden of the zodiac.",
    "Your analytical mind is about to solve a long-standing puzzle, Virgo."
  ],
  Libra: [
    "The scales of justice are tipping in your favor, balanced Libra.",
    "Harmony and beauty are about to enter your life in new ways, air sign.",
    "Your diplomatic skills will soon be put to the test, scales of the zodiac.",
    "The stars are aligning to bring new partnerships into your orbit, Libra.",
    "Your sense of fairness is about to create positive change, peace-loving Libra."
  ],
  Scorpio: [
    "Your inner power is about to manifest in transformative ways, intense Scorpio.",
    "The cosmos are stirring the depths of your passion, water sign.",
    "A mystery is about to be revealed, thanks to your piercing intuition, Scorpio.",
    "The stars whisper of rebirth and renewal in your path, scorpion of the zodiac.",
    "Your magnetic personality is attracting powerful allies, Scorpio."
  ],
  Sagittarius: [
    "Your arrow of truth is about to hit its mark, adventurous Sagittarius.",
    "The cosmos are expanding your horizons in exciting ways, fire sign.",
    "Your optimism is a beacon of light in uncertain times, archer of the zodiac.",
    "The universe is inviting you to take a leap of faith, Sagittarius.",
    "Your philosophical nature is about to deepen, seeker of truth."
  ],
  Capricorn: [
    "Your steady climb is about to reach new heights, ambitious Capricorn.",
    "The stars are aligning to reward your discipline and hard work, earth sign.",
    "A structure in your life is about to solidify, mountain goat of the zodiac.",
    "Your perseverance is your greatest strength, keep moving forward, Capricorn.",
    "The universe is preparing a solid foundation for your dreams, Capricorn."
  ],
  Aquarius: [
    "Your visionary ideas are about to catch fire, innovative Aquarius.",
    "The cosmos are whispering of unconventional paths to success, air sign.",
    "Your individuality is your superpower, let it shine, water-bearer of the zodiac.",
    "The universe is aligning to bring sudden breakthroughs, quirky Aquarius.",
    "Your humanitarian spirit is about to make a significant impact, Aquarius."
  ],
  Pisces: [
    "The currents of intuition are carrying you towards your dreams, dreamy Pisces.",
    "Your artistic expression is about to touch hearts in deep ways, water sign.",
    "The cosmos are inviting you to dive deeper into spiritual realms, twin fish of the zodiac.",
    "Your empathy is a gift, use it wisely to heal and inspire, Pisces.",
    "The universe is weaving a tapestry of mystical wonders just for you, Pisces."
  ]
};

export const zodiacDetails = {
  Aries: { symbol: '♈', element: 'Fire', elementIcon: '🔥', ruler: 'Mars', trait: 'Brave & Passionate', color: '#ff6b6b' },
  Taurus: { symbol: '♉', element: 'Earth', elementIcon: '🌍', ruler: 'Venus', trait: 'Grounded & Abundant', color: '#51cf66' },
  Gemini: { symbol: '♊', element: 'Air', elementIcon: '💨', ruler: 'Mercury', trait: 'Curious & Expressive', color: '#fcc419' },
  Cancer: { symbol: '♋', element: 'Water', elementIcon: '🌊', ruler: 'Moon', trait: 'Intuitive & Nurturing', color: '#74c0fc' },
  Leo: { symbol: '♌', element: 'Fire', elementIcon: '🔥', ruler: 'Sun', trait: 'Radiant & Courageous', color: '#ff922b' },
  Virgo: { symbol: '♍', element: 'Earth', elementIcon: '🌍', ruler: 'Mercury', trait: 'Mindful & Analytical', color: '#a9e34b' },
  Libra: { symbol: '♎', element: 'Air', elementIcon: '💨', ruler: 'Venus', trait: 'Harmonious & Graceful', color: '#f06595' },
  Scorpio: { symbol: '♏', element: 'Water', elementIcon: '🌊', ruler: 'Pluto', trait: 'Transformative & Deep', color: '#cc5de8' },
  Sagittarius: { symbol: '♐', element: 'Fire', elementIcon: '🔥', ruler: 'Jupiter', trait: 'Visionary & Expansive', color: '#ff8787' },
  Capricorn: { symbol: '♑', element: 'Earth', elementIcon: '🌍', ruler: 'Saturn', trait: 'Disciplined & Wise', color: '#845ef7' },
  Aquarius: { symbol: '♒', element: 'Air', elementIcon: '💨', ruler: 'Uranus', trait: 'Innovative & Ethereal', color: '#3bc9db' },
  Pisces: { symbol: '♓', element: 'Water', elementIcon: '🌊', ruler: 'Neptune', trait: 'Mystical & Dreamy', color: '#4dabf7' },
};

export function getPersonalMessage(zodiacSign) {
  if (!zodiacSign || !zodiacMessages[zodiacSign]) {
    return "The stars hold infinite mysteries waiting for your discovery.";
  }
  const messages = zodiacMessages[zodiacSign];
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

export function calculateZodiacSign(dateString) {
  if (!dateString) return null;
  const parts = dateString.split('-');
  if (parts.length < 3) return null;
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  return null;
}
