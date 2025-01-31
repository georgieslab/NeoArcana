const zodiacMessages = {
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
      "Your optimism is the compass guiding you to new discoveries, Sagittarius.",
      "The stars are aligning for a journey of mind, body, and spirit, archer of the zodiac.",
      "Your philosophical nature is about to uncover a universal truth, Sagittarius."
    ],
    Capricorn: [
      "Your ambition is about to move mountains, determined Capricorn.",
      "The stars are solidifying your path to success, earth sign.",
      "Your patience and perseverance are about to pay off, goat of the zodiac.",
      "The cosmos whisper of recognition and achievement in your future, Capricorn.",
      "Your practical wisdom is the foundation of great things to come, Capricorn."
    ],
    Aquarius: [
      "Your innovative ideas are about to spark a revolution, visionary Aquarius.",
      "The cosmos are amplifying your unique frequency, air sign.",
      "Your humanitarian spirit is about to create waves of positive change, Aquarius.",
      "The stars are aligning to support your most eccentric dreams, water-bearer of the zodiac.",
      "Your forward-thinking mind is the key to solving a global issue, Aquarius."
    ],
    Pisces: [
      "Your intuition is about to reveal hidden truths, empathetic Pisces.",
      "The cosmic currents are flowing in your favor, water sign.",
      "Your creative spirit is about to manifest a beautiful reality, Pisces.",
      "The stars whisper of deep emotional connections forming, fish of the zodiac.",
      "Your compassionate nature is about to heal wounds, both yours and others', Pisces."
    ]
  };
  
  const getPersonalMessage = (zodiacSign) => {
    const messages = zodiacMessages[zodiacSign];
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  window.getPersonalMessage = getPersonalMessage;