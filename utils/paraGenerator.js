const paragraphs = {
  easy: "In the picturesque town of Everdale, there was a charming carnival that visited once a year. Children from all around eagerly awaited its arrival, as it brought with it thrilling rides, delectable cotton candy, and whimsical circus performances. The carnival's beloved magician, Mr. Enigma, had prepared a dazzling magic show for the young audience. However, just before the show was about to start, Mr. Enigma realized that he had misplaced his magic wand! With only 60 seconds on the clock, can you help him find his wand and ensure that the magic show goes on in all its enchanting glory? The children are filled with excitement, waiting to be amazed by the wonders of Mr. Enigma's magic, and you must make sure the show goes on flawlessly.",
  medium: "In a remote kingdom shrouded in mist, a legendary quest was passed down through generations. The quest involved solving a series of riddles hidden deep in the ancient ruins. These riddles would reveal the location of the fabled Sword of Destiny, which bestowed great power upon its wielder. The reigning king, seeking to prove his worth, decided to take on the challenge. As he approached the ruins, he found the first riddle inscribed on an ancient stone tablet. However, it seemed to be written in an ancient language. With only 60 seconds remaining, can you decipher the riddle and guide the king on his journey to claim the Sword of Destiny and fulfill his destiny as a true ruler? The fate of the entire kingdom rests on your shoulders, and you must display your wit and wisdom to overcome the challenges that lie ahead.",
  hard: "In the heart of the dense jungle, there existed an elusive tribe with a rich oral tradition. The tribe's elder, renowned for his wisdom, was the keeper of ancient stories and secrets. As the full moon approached, the tribe gathered around a bonfire, eager to hear a tale of epic proportions. The elder began recounting the tale of the Lost Amulet, a powerful artifact capable of granting its possessor eternal life. However, part of the tale was missing, and the elder needed help to recall it. With only 60 seconds on the clock, can you piece together the missing part of the story and reveal the location of the Lost Amulet, ensuring the tribe's legacy lives on forever? The destiny of the tribe depends on your ability to decipher the ancient clues and unlock the secrets of the past. Your journey will be filled with danger and mystery, but the rewards of success are immeasurable."
};

// Random paragraph generation based on difficulty. TODO: difficulty based para generation
function paraGenerator(difficulty) {
    const difficultyLevel = ["easy", "medium", "hard"];
    const selectedDifficulty = difficultyLevel[difficulty];
    const selectedParagraph = paragraphs[selectedDifficulty];

    // Split the paragraph into words
    const wordsArray = selectedParagraph.split(" ");
    
    // Shuffle the array of words randomly
    for (let i = wordsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordsArray[i], wordsArray[j]] = [wordsArray[j], wordsArray[i]];
    }

    // Combine the shuffled words back into a paragraph
    const randomParagraph = wordsArray.join(" ");
    //   console.log(randomParagraph);
    return randomParagraph;
}
// console.log(paraGenerator(0));
export default paraGenerator;