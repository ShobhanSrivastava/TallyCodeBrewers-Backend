const easy = [
    // Words of size 1
    "a", "i", "o", "u", "e",
    // Words of size 2
    "at", "be", "it", "an", "am", "up", "on", "go", "so", "if", "my", "do", "me", "of", "no", "by", "we",
    // Words of size 3
    "ace", "act", "add", "age", "any", "are", "ash", "ask", "bad", "ban", "bat", "bed", "bee", "big", "bit", "boy", "bra", "can", "cap", "car",
    // Words of size 4
    "area", "also", "away", "baby", "back", "ball", "band", "base", "bath", "bear", "been", "bell", "belt", "best", "bill", "bird", "blow", "blue"
  ];
  
  const medium = [
    // Words of size 1 to 5
    "a", "i", "o", "u", "e", "at", "be", "it", "an", "am", "up", "on", "go", "so", "if", "my", "do", "me", "of", "no", "by", "we", "us", "is", "up", "in", "or", "he", "up", "by",
    "ace", "act", "add", "age", "any", "are", "ash", "ask", "bad", "ban", "bat", "bed", "bee", "big", "bit", "boy", "bra", "can", "cap", "car", "fit", "fix", "fan", "fun", "gas", "hit", "hot", "hug", "inn", "ill", "gym", "hue", "joy", "job", "key", "lab", "law", "lip", "map", "mix", "now", "odd", "old", "par", "pen", "pod", "pot", "ram",
    "area", "also", "away", "baby", "back", "ball", "band", "base", "bath", "bear", "been", "bell", "belt", "best", "bill", "bird", "blow", "blue", "cake", "call", "deal", "deep", "draw", "duck", "edge", "even", "face", "fall", "gift", "game", "huge", "idea", "joke", "kiss", "lamp", "mall", "nice", "open",
    "above", "apple", "bacon", "badge", "beard", "bless", "bliss", "bloom", "bumpy", "cabin", "cable", "candy", "champ", "chase", "child", "daily", "daisy", "ditch", "doubt", "dream", "early", "elbow", "fable", "faint", "feast", "flame", "flour", "fruit", "giant", "gloom", "happy", "honor", "humor", "image", "jolly", "juicy", "kneel", "liver", "loose", "magic", "noble", "novel", "ocean", "panda", "peace", "pride", "quiet", "razor", "saint", "scent", "shirt", "skill", "tasty", "total", "unite", "video", "vivid", "wagon", "waste", "xenon", "yacht", "zebra"
  ];
  
  const hard = [
    // Words of size 1 to 8
    "a", "i", "o", "u", "e", "at", "be", "it", "an", "am", "up", "on", "go", "so", "if", "my", "do", "me", "of", "no", "by", "we", "us", "is", "up", "in", "or", "he", "up", "by",
    "ace", "act", "add", "age", "any", "are", "ash", "ask", "bad", "ban", "bat", "bed", "bee", "big", "bit", "boy", "bra", "can", "cap", "car", "fit", "fix", "fan", "fun", "gas", "hit", "hot", "hug", "inn", "ill", "gym", "hue", "joy", "job", "key", "lab", "law", "lip", "map", "mix", "now", "odd", "old", "par", "pen", "pod", "pot", "ram",
    "area", "also", "away", "baby", "back", "ball", "band", "base", "bath", "bear", "been", "bell", "belt", "best", "bill", "bird", "blow", "blue", "cake", "call", "deal", "deep", "draw", "duck", "edge", "even", "face", "fall", "gift", "game", "huge", "idea", "joke", "kiss", "lamp", "mall", "nice", "open",
    "above", "apple", "bacon", "badge", "beard", "bless", "bliss", "bloom", "bumpy", "cabin", "cable", "candy", "champ", "chase", "child", "daily", "daisy", "ditch", "doubt", "dream", "early", "elbow", "fable", "faint", "feast", "flame", "flour", "fruit", "giant", "gloom", "happy", "honor", "humor", "image", "jolly", "juicy", "kneel", "liver", "loose", "magic", "noble", "novel", "ocean", "panda", "peace", "pride", "quiet", "razor", "saint", "scent", "shirt", "skill", "tasty", "total", "unite", "video", "vivid", "wagon", "waste", "xenon", "yacht", "zebra",
    "above", "accept", "action", "animal", "answer", "basket", "battle", "beauty", "better", "breeze", "bright", "butter", "candle", "certain", "change", "charge", "circle", "common", "cotton", "create", "danger", "decide", "deeply", "detect", "device", "dinner", "dollar", "easily", "energy", "entire", "family", "famous", "farmer", "fellow", "fierce", "figure", "flower", "follow", "forest", "gather", "gentle", "gently", "globe", "golden", "grain", "greet", "guide", "hardly", "health", "hearing", "hidden", "hunger", "hunter", "indeed", "inside", "island", "jungle", "larger", "lately", "leader", "likely", "locate", "lovely", "mainly", "member", "merely", "mirror", "monkey", "mostly", "mountain", "muddy", "murder", "muscle", "mystery", "nation", "neither", "newly", "nobody", "ocean", "official", "orange", "over", "painful", "peace", "perhaps", "person", "plenty", "proud", "purely", "quick", "recent", "repeat", "roar", "roughly", "rubbed", "ruler", "safety", "sail", "satellite", "scared", "select", "shake", "sheep", "shine", "shinning", "shut", "silly", "simple", "sink", "slight", "slightly", "smooth", "soft", "soil", "solar", "solve", "song", "source", "space", "spark", "speak", "species", "spell", "spin", "split", "sport", "stiff", "stove", "straw", "struggle", "suit", "supper", "swim", "swing", "symbol", "tall", "taught", "tea", "teach", "themselves", "theory", "thread", "threw", "thumb", "tied", "tight", "tightly", "tool", "total", "touch", "toward", "tower", "track", "tried", "tropical", "trouble", "tune", "twice", "typical", "unhappy", "useful", "valley", "vapor", "vast", "vessels", "victory", "village", "visitor", "vowel", "walk", "warm", "warn", "warned", "waste", "weak", "week", "weigh", "welcome", "whale", "whether", "wheat", "while", "whistle", "wide", "wild", "wind", "wire", "wolf", "women", "wonder", "wonderful", "wood", "worker", "worried", "worse", "worst", "worth", "worthy", "wound", "wrap", "wrapped", "writer", "written", "wrong", "yard", "year", "yellow", "yourself", "zoo",
    "absolve", "accepts", "actress", "admired", "affixed", "aloofly", "analogy", "ancient", "anxiety", "applied", "arch"
  ];
  
  // Combine all difficulty levels into one object
  const meaningfulWords = {
    easy,
    medium,
    hard,
  };
  
  // Function to generate a random paragraph based on difficulty level
  function paraGenerator(difficultyLevel) {
    let words = [];
    if (difficultyLevel === 0) {
      words = [...easy];
    } else if (difficultyLevel === 1) {
      words = [...easy, ...medium];
    } else if (difficultyLevel === 2) {
      words = [...easy, ...medium, ...hard];
    }
  
    const paragraphLength = 150; 
    let paragraph = "";
    while (paragraph.split(' ').length < paragraphLength) {
      const randomIndex = Math.floor(Math.random() * words.length);
      paragraph += words[randomIndex] + " ";
    }
  
    // Trim the paragraph to remove the extra spaces
    paragraph = paragraph.trim();
  
    return paragraph;
  }
  
  export default paraGenerator;