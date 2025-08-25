export const scenarios = [
  // Market scenario (index 0)
  {
    id: 1,
    role: "market",
    title: "दोकानमा जान्छौं (Going to Shop)",
    scenes: [
      {
        image: "🏪",
        situation: "You want to buy an apple",
        nepali: "तपाईं स्याउ किन्न चाहनुहुन्छ",
        question: "How do you greet?",
        options: [
          { text: "नमस्ते दाजु", correct: true, response: "Perfect! 🙏" },
          { text: "Hey!", correct: false, response: "Try 'Namaste' 😊" }
        ]
      },
      {
        image: "🍎",
        situation: "The shopkeeper asks what you want",
        nepali: "दोकानदारले सोध्छन्: तपाईंलाई के चाहियो?",
        question: "What do you say?",
        options: [
          { text: "मलाई स्याउ चाहिन्छ", correct: true, response: "Great! 🍎" },
          { text: "मलाई केरा चाहिन्छ", correct: false, response: "Oops, that's banana! 🍌" }
        ]
      },
      {
        image: "💰",
        situation: "You got your apple",
        nepali: "अब तपाईंले पैसा तिर्नु पर्छ",
        question: "What do you say while paying?",
        options: [
          { text: "धन्यवाद", correct: true, response: "Perfect! You're so polite! 🎉" },
          { text: "Bye!", correct: false, response: "Try saying 'Dhanyabaad' 🙏" }
        ]
      }
    ]
  },
  // Festival scenario (index 1)
  {
    id: 2,
    role: "festival",
    title: "दशैं मनाउने (Celebrating Dashain)",
    scenes: [
      {
        image: "🏠",
        situation: "You visit your grandparents for Dashain",
        nepali: "तपाईं दशैंमा हजुरबुवाहजुरआमालाई भेट्न जानुहुन्छ",
        question: "How do you greet your elders during Dashain?",
        options: [
          { text: "नमस्कार हजुरबुवा, दशैंको शुभकामना", correct: true, response: "Perfect respect! 🙏" },
          { text: "Hi grandpa!", correct: false, response: "Try traditional Dashain greeting 😊" }
        ]
      },
      {
        image: "🎁",
        situation: "Your grandmother gives you dakshina",
        nepali: "हजुरआमाले तपाईंलाई दक्षिणा दिनुहुन्छ",
        question: "How do you respond?",
        options: [
          { text: "धन्यवाद हजुरआमा", correct: true, response: "So polite! 💕" },
          { text: "Thanks!", correct: false, response: "Try saying it in Nepali 😊" }
        ]
      },
      {
        image: "🍖",
        situation: "Time for traditional Dashain feast",
        nepali: "दशैंको खाना खाने बेला भयो",
        question: "What do you say before eating?",
        options: [
          { text: "खाना मिठो छ", correct: true, response: "Great compliment! 😋" },
          { text: "I'm hungry", correct: false, response: "Compliment the food in Nepali! 🍽️" }
        ]
      }
    ]
  },
  // Greeting scenario (index 2)
  {
    id: 3,
    role: "greeting",
    title: "अभिवादन (Greetings)",
    scenes: [
      {
        image: "👨‍👩‍👧‍👦",
        situation: "You wake up in the morning",
        nepali: "तपाईं बिहान उठ्नुहुन्छ",
        question: "How do you greet your parents?",
        options: [
          { text: "नमस्कार आमा बुवा", correct: true, response: "Respectful greeting! 🌅" },
          { text: "Good morning", correct: false, response: "Try greeting in Nepali! 🗣️" }
        ]
      },
      {
        image: "👴",
        situation: "You meet an elderly neighbor",
        nepali: "तपाईं एक बुढा छिमेकीलाई भेट्नुहुन्छ",
        question: "How do you show respect?",
        options: [
          { text: "नमस्कार हजुर", correct: true, response: "Perfect respect! 🙏" },
          { text: "Hello sir", correct: false, response: "Use 'Hajur' to show respect! 😊" }
        ]
      },
      {
        image: "👫",
        situation: "You meet your friend at school",
        nepali: "तपाईं स्कूलमा साथीलाई भेट्नुहुन्छ",
        question: "How do you greet your friend?",
        options: [
          { text: "नमस्ते साथी", correct: true, response: "Friendly greeting! 👋" },
          { text: "What's up?", correct: false, response: "Try 'Namaste saathi'! 😊" }
        ]
      }
    ]
  }
];