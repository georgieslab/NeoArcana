const CardManager = {
    cardMap: {
      "fool.jpg": { name: "The Fool", keywords: ["New beginnings", "Spontaneity"] },
      "magician.jpg": { name: "The Magician", keywords: ["Manifestation", "Skill"] },
      "high_priestess.jpg": { name: "The High Priestess", keywords: ["Intuition", "Mystery"] },
      "empress.jpg": { name: "The Empress", keywords: ["Abundance", "Fertility"] },
      "emperor.jpg": { name: "The Emperor", keywords: ["Authority", "Stability"] },
      "hierophant.jpg": { name: "The Hierophant", keywords: ["Tradition", "Spirituality"] },
      "lovers.jpg": { name: "The Lovers", keywords: ["Love", "Partnership"] },
      "chariot.jpg": { name: "The Chariot", keywords: ["Willpower", "Victory"] },
      "strength.jpg": { name: "Strength", keywords: ["Courage", "Compassion"] },
      "hermit.jpg": { name: "The Hermit", keywords: ["Reflection", "Inner wisdom"] },
      "wheel_of_fortune.jpg": { name: "The Wheel of Fortune", keywords: ["Change", "Cycles"] },
      "justice.jpg": { name: "Justice", keywords: ["Fairness", "Truth"] },
      "hanged_man.jpg": { name: "The Hanged Man", keywords: ["Sacrifice", "Perspective"] },
      "death.jpg": { name: "Death", keywords: ["Transformation", "Endings"] },
      "temperance.jpg": { name: "Temperance", keywords: ["Balance", "Moderation"] },
      "devil.jpg": { name: "The Devil", keywords: ["Attachment", "Temptation"] },
      "tower.jpg": { name: "The Tower", keywords: ["Upheaval", "Revelation"] },
      "star.jpg": { name: "The Star", keywords: ["Hope", "Inspiration"] },
      "moon.jpg": { name: "The Moon", keywords: ["Illusion", "Fear"] },
      "sun.jpg": { name: "The Sun", keywords: ["Success", "Joy"] },
      "judgment.jpg": { name: "Judgment", keywords: ["Awakening", "Redemption"] },
      "world.jpg": { name: "The World", keywords: ["Completion", "Achievement"] }
    },
  
    getCardInfo(imagePath) {
      // Extract filename from full path
      const filename = imagePath.split('/').pop();
      return this.cardMap[filename] || { name: "Unknown Card", keywords: [] };
    },
  
    getImagePath(cardName) {
      const filename = Object.entries(this.cardMap)
        .find(([_, info]) => info.name === cardName)?.[0];
      return filename ? `/static/images/cards/${filename}` : '/static/images/cards/default.jpg';
    },
  
    formatCardData(cardData) {
      const cardInfo = this.getCardInfo(cardData.image);
      return {
        name: cardInfo.name,
        image: cardData.image,
        keywords: cardInfo.keywords
      };
    }
  };

  window.CardManager = CardManager;