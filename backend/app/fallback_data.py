"""
Rich Fallback Question Bank for Quiz and Roleplay
These questions are used when the Gemini API is unavailable or rate-limited.
Questions rotate randomly to provide variety.
"""

import random
from typing import Dict, List, Any

# ============================================================
# QUIZ FALLBACK QUESTIONS (50+ unique questions)
# ============================================================

QUIZ_QUESTIONS: List[Dict[str, Any]] = [
    # Greetings Category
    {
        "question": "What does 'Namaste' literally mean?",
        "1": "Hello friend",
        "2": "I bow to the divine in you",
        "3": "Good morning",
        "4": "How are you",
        "right_answer": "I bow to the divine in you",
        "category": "greetings"
    },
    {
        "question": "How do you say 'Thank you' in Nepali?",
        "1": "Shukriya",
        "2": "Dhanyabad",
        "3": "Namaste",
        "4": "Subha ratri",
        "right_answer": "Dhanyabad",
        "category": "greetings"
    },
    {
        "question": "What is the appropriate response when someone says 'Namaste' to you?",
        "1": "Say 'Hello' back",
        "2": "Wave your hand",
        "3": "Say 'Namaste' with folded hands",
        "4": "Bow your head silently",
        "right_answer": "Say 'Namaste' with folded hands",
        "category": "greetings"
    },
    {
        "question": "How do you say 'Good morning' in Nepali?",
        "1": "Subha ratri",
        "2": "Subha prabhat",
        "3": "Subha sandhya",
        "4": "Subha din",
        "right_answer": "Subha prabhat",
        "category": "greetings"
    },
    {
        "question": "What does 'Namaskar' mean and when is it used?",
        "1": "Casual hello among friends",
        "2": "A more formal/respectful greeting",
        "3": "Goodbye only",
        "4": "Good night",
        "right_answer": "A more formal/respectful greeting",
        "category": "greetings"
    },
    
    # Food Category
    {
        "question": "What is 'Dal Bhat', the national dish of Nepal?",
        "1": "Fried noodles",
        "2": "Lentil soup with rice",
        "3": "Meat curry",
        "4": "Sweet dessert",
        "right_answer": "Lentil soup with rice",
        "category": "food"
    },
    {
        "question": "What are 'Momos'?",
        "1": "A type of bread",
        "2": "Traditional Nepali dumplings",
        "3": "Rice pudding",
        "4": "Spicy pickles",
        "right_answer": "Traditional Nepali dumplings",
        "category": "food"
    },
    {
        "question": "What is 'Sel Roti'?",
        "1": "A meat dish",
        "2": "A ring-shaped sweet rice bread",
        "3": "A vegetable curry",
        "4": "A type of tea",
        "right_answer": "A ring-shaped sweet rice bread",
        "category": "food"
    },
    {
        "question": "What is 'Gundruk'?",
        "1": "Fermented leafy green vegetables",
        "2": "A type of cheese",
        "3": "Fried fish",
        "4": "Sweet candy",
        "right_answer": "Fermented leafy green vegetables",
        "category": "food"
    },
    {
        "question": "What is 'Chiya' in Nepal?",
        "1": "Cold drink",
        "2": "Spiced milk tea",
        "3": "Alcoholic beverage",
        "4": "Fruit juice",
        "right_answer": "Spiced milk tea",
        "category": "food"
    },
    {
        "question": "Which hand should you use when eating traditional Nepali food?",
        "1": "Left hand only",
        "2": "Right hand only",
        "3": "Both hands",
        "4": "It doesn't matter",
        "right_answer": "Right hand only",
        "category": "food"
    },
    {
        "question": "What is 'Thukpa'?",
        "1": "A dessert",
        "2": "Tibetan-style noodle soup",
        "3": "Fried rice",
        "4": "Grilled meat",
        "right_answer": "Tibetan-style noodle soup",
        "category": "food"
    },
    
    # Festivals Category
    {
        "question": "What is the biggest festival in Nepal?",
        "1": "Tihar",
        "2": "Holi",
        "3": "Dashain",
        "4": "Teej",
        "right_answer": "Dashain",
        "category": "festivals"
    },
    {
        "question": "What is 'Tihar' also known as?",
        "1": "Festival of Colors",
        "2": "Festival of Lights",
        "3": "Festival of Water",
        "4": "Festival of Harvest",
        "right_answer": "Festival of Lights",
        "category": "festivals"
    },
    {
        "question": "During which festival do Nepalis worship dogs?",
        "1": "Dashain",
        "2": "Tihar (Kukur Tihar)",
        "3": "Holi",
        "4": "Teej",
        "right_answer": "Tihar (Kukur Tihar)",
        "category": "festivals"
    },
    {
        "question": "What is 'Tika' in Dashain?",
        "1": "A special food",
        "2": "Colored rice paste blessing on forehead",
        "3": "Traditional dance",
        "4": "A type of flower",
        "right_answer": "Colored rice paste blessing on forehead",
        "category": "festivals"
    },
    {
        "question": "What do people fly during Dashain?",
        "1": "Balloons",
        "2": "Kites",
        "3": "Paper planes",
        "4": "Lanterns",
        "right_answer": "Kites",
        "category": "festivals"
    },
    {
        "question": "What is 'Bhai Tika' celebrated for?",
        "1": "Mother's love",
        "2": "Brother-sister bond",
        "3": "Married couples",
        "4": "Friendship",
        "right_answer": "Brother-sister bond",
        "category": "festivals"
    },
    {
        "question": "Which festival involves playing with colors?",
        "1": "Dashain",
        "2": "Holi (Fagu Purnima)",
        "3": "Tihar",
        "4": "Chhath",
        "right_answer": "Holi (Fagu Purnima)",
        "category": "festivals"
    },
    {
        "question": "What is 'Teej' primarily celebrated by?",
        "1": "Men only",
        "2": "Married women for husband's longevity",
        "3": "Children only",
        "4": "Elderly people",
        "right_answer": "Married women for husband's longevity",
        "category": "festivals"
    },
    
    # Clothing Category
    {
        "question": "What is a 'Topi'?",
        "1": "Traditional shoe",
        "2": "Traditional Nepali cap for men",
        "3": "A type of scarf",
        "4": "A cooking pot",
        "right_answer": "Traditional Nepali cap for men",
        "category": "clothing"
    },
    {
        "question": "What is a 'Daura Suruwal'?",
        "1": "Women's dress",
        "2": "Traditional men's formal wear",
        "3": "Children's costume",
        "4": "Winter jacket",
        "right_answer": "Traditional men's formal wear",
        "category": "clothing"
    },
    {
        "question": "What is a 'Gunyu Cholo'?",
        "1": "Men's traditional wear",
        "2": "Women's traditional dress",
        "3": "Baby clothes",
        "4": "Wedding costume only",
        "right_answer": "Women's traditional dress",
        "category": "clothing"
    },
    {
        "question": "What color is considered auspicious in Nepali weddings?",
        "1": "White",
        "2": "Red",
        "3": "Blue",
        "4": "Green",
        "right_answer": "Red",
        "category": "clothing"
    },
    
    # Family & Relationships
    {
        "question": "How do you say 'Mother' in Nepali?",
        "1": "Baba",
        "2": "Ama",
        "3": "Didi",
        "4": "Bahini",
        "right_answer": "Ama",
        "category": "family"
    },
    {
        "question": "How do you say 'Father' in Nepali?",
        "1": "Ama",
        "2": "Buwa/Baba",
        "3": "Dai",
        "4": "Kaka",
        "right_answer": "Buwa/Baba",
        "category": "family"
    },
    {
        "question": "What does 'Dai' mean?",
        "1": "Younger brother",
        "2": "Elder brother",
        "3": "Father",
        "4": "Uncle",
        "right_answer": "Elder brother",
        "category": "family"
    },
    {
        "question": "What does 'Didi' mean?",
        "1": "Younger sister",
        "2": "Elder sister",
        "3": "Mother",
        "4": "Aunt",
        "right_answer": "Elder sister",
        "category": "family"
    },
    {
        "question": "What does 'Bhai' mean?",
        "1": "Elder brother",
        "2": "Younger brother",
        "3": "Cousin",
        "4": "Friend",
        "right_answer": "Younger brother",
        "category": "family"
    },
    
    # Places & Geography
    {
        "question": "What is the capital city of Nepal?",
        "1": "Pokhara",
        "2": "Kathmandu",
        "3": "Biratnagar",
        "4": "Lalitpur",
        "right_answer": "Kathmandu",
        "category": "geography"
    },
    {
        "question": "Which is the highest mountain in the world, located in Nepal?",
        "1": "K2",
        "2": "Mount Everest (Sagarmatha)",
        "3": "Kanchenjunga",
        "4": "Annapurna",
        "right_answer": "Mount Everest (Sagarmatha)",
        "category": "geography"
    },
    {
        "question": "What is 'Lumbini' famous for?",
        "1": "Highest waterfall",
        "2": "Birthplace of Buddha",
        "3": "Ancient fort",
        "4": "Wildlife sanctuary",
        "right_answer": "Birthplace of Buddha",
        "category": "geography"
    },
    {
        "question": "What is 'Pashupatinath'?",
        "1": "A mountain",
        "2": "A famous Hindu temple in Kathmandu",
        "3": "A lake",
        "4": "A marketplace",
        "right_answer": "A famous Hindu temple in Kathmandu",
        "category": "geography"
    },
    
    # Daily Expressions
    {
        "question": "How do you ask 'How are you?' in Nepali?",
        "1": "Kasto cha?",
        "2": "Kati ho?",
        "3": "Kun ho?",
        "4": "Kaha ho?",
        "right_answer": "Kasto cha?",
        "category": "expressions"
    },
    {
        "question": "How do you say 'I am fine' in Nepali?",
        "1": "Ma thik chu",
        "2": "Ma ramro chu",
        "3": "Ma sanchai chu",
        "4": "All of the above are correct",
        "right_answer": "All of the above are correct",
        "category": "expressions"
    },
    {
        "question": "What does 'Kati ho?' mean?",
        "1": "Where is it?",
        "2": "How much? (asking price)",
        "3": "What time?",
        "4": "Who is it?",
        "right_answer": "How much? (asking price)",
        "category": "expressions"
    },
    {
        "question": "How do you say 'Yes' in Nepali?",
        "1": "Hoina",
        "2": "Ho",
        "3": "Chhaina",
        "4": "Kina",
        "right_answer": "Ho",
        "category": "expressions"
    },
    {
        "question": "How do you say 'No' in Nepali?",
        "1": "Ho",
        "2": "Hoina",
        "3": "Cha",
        "4": "Huncha",
        "right_answer": "Hoina",
        "category": "expressions"
    },
    {
        "question": "What does 'Mitho cha' mean?",
        "1": "It's cold",
        "2": "It's delicious",
        "3": "It's expensive",
        "4": "It's beautiful",
        "right_answer": "It's delicious",
        "category": "expressions"
    },
    
    # Numbers
    {
        "question": "What is 'Ek' in English?",
        "1": "Two",
        "2": "One",
        "3": "Three",
        "4": "Zero",
        "right_answer": "One",
        "category": "numbers"
    },
    {
        "question": "What is 'Das' in English?",
        "1": "Five",
        "2": "Ten",
        "3": "Twenty",
        "4": "Hundred",
        "right_answer": "Ten",
        "category": "numbers"
    },
    
    # Culture & Customs
    {
        "question": "What should you do before entering a Nepali home?",
        "1": "Clap your hands",
        "2": "Remove your shoes",
        "3": "Ring a bell",
        "4": "Nothing special",
        "right_answer": "Remove your shoes",
        "category": "customs"
    },
    {
        "question": "What is considered disrespectful to point with in Nepal?",
        "1": "Your hand",
        "2": "Your feet",
        "3": "Your eyes",
        "4": "A stick",
        "right_answer": "Your feet",
        "category": "customs"
    },
    {
        "question": "When receiving something from an elder, you should use:",
        "1": "Left hand only",
        "2": "Both hands or right hand",
        "3": "No hands, let them place it",
        "4": "Any hand is fine",
        "right_answer": "Both hands or right hand",
        "category": "customs"
    },
    {
        "question": "What does touching someone's feet signify in Nepal?",
        "1": "Insult",
        "2": "Respect to elders",
        "3": "Asking for money",
        "4": "Saying goodbye",
        "right_answer": "Respect to elders",
        "category": "customs"
    },
    {
        "question": "What is 'Jutho' in Nepali culture?",
        "1": "Clean food",
        "2": "Food/items touched by saliva (polluted)",
        "3": "Holy water",
        "4": "Festive decoration",
        "right_answer": "Food/items touched by saliva (polluted)",
        "category": "customs"
    },
    
    # Music & Arts
    {
        "question": "What is a 'Madal'?",
        "1": "A string instrument",
        "2": "A traditional Nepali drum",
        "3": "A wind instrument",
        "4": "A dance form",
        "right_answer": "A traditional Nepali drum",
        "category": "music"
    },
    {
        "question": "What is 'Deusi Bhailo'?",
        "1": "A type of food",
        "2": "Traditional songs sung during Tihar",
        "3": "A wedding ritual",
        "4": "A funeral custom",
        "right_answer": "Traditional songs sung during Tihar",
        "category": "music"
    },
    
    # Religion
    {
        "question": "What are the two main religions in Nepal?",
        "1": "Christianity and Islam",
        "2": "Hinduism and Buddhism",
        "3": "Judaism and Sikhism",
        "4": "Jainism and Zoroastrianism",
        "right_answer": "Hinduism and Buddhism",
        "category": "religion"
    },
    {
        "question": "What is a 'Stupa'?",
        "1": "A Hindu temple",
        "2": "A Buddhist dome-shaped monument",
        "3": "A mosque",
        "4": "A marketplace",
        "right_answer": "A Buddhist dome-shaped monument",
        "category": "religion"
    },
    {
        "question": "What does 'Om Mani Padme Hum' represent?",
        "1": "A Hindu prayer",
        "2": "A famous Buddhist mantra",
        "3": "A Nepali song",
        "4": "A greeting",
        "right_answer": "A famous Buddhist mantra",
        "category": "religion"
    },
]

# ============================================================
# ROLEPLAY FALLBACK SCENARIOS (30+ unique scenarios)
# ============================================================

ROLEPLAY_SCENARIOS: List[Dict[str, Any]] = [
    # Greetings & Social
    {
        "context": "You are walking through the narrow streets of Thamel in Kathmandu. An elderly shopkeeper sitting outside her store smiles at you warmly.",
        "question": "What is the most culturally appropriate way to greet her?",
        "1": "Wave and say 'Hey!'",
        "2": "Join your palms together, bow slightly, and say 'Namaste'",
        "3": "Just nod and walk past",
        "4": "Shake her hand firmly",
        "right_answer": "2",
        "category": "greetings"
    },
    {
        "context": "You're meeting your Nepali friend's parents for the first time at their home in Patan. They are both in their 60s and wearing traditional attire.",
        "question": "How should you greet them respectfully?",
        "1": "Give them a casual 'Hi, nice to meet you'",
        "2": "Say 'Namaskar' with folded hands and a slight bow",
        "3": "Just smile and wave",
        "4": "Shake their hands immediately",
        "right_answer": "2",
        "category": "greetings"
    },
    
    # Dining & Food
    {
        "context": "You're invited to a Nepali home for dinner. The host serves you dal bhat on a traditional brass plate. You notice everyone is eating with their hands.",
        "question": "Which hand should you use to eat?",
        "1": "Left hand, it's closer to the plate",
        "2": "Both hands for convenience",
        "3": "Right hand only - left hand is considered impure for eating",
        "4": "Ask for a spoon instead",
        "right_answer": "3",
        "category": "food"
    },
    {
        "context": "Your Nepali host offers you a second serving of rice. You're already quite full but don't want to be rude.",
        "question": "What is the polite way to decline?",
        "1": "Say 'Pugyo, dhanyabad' (Enough, thank you) with a smile",
        "2": "Push the plate away",
        "3": "Ignore them completely",
        "4": "Make a face to show you're full",
        "right_answer": "1",
        "category": "food"
    },
    {
        "context": "You're at a local tea shop (chiya pasal) in Pokhara. The chai wallah serves you steaming hot milk tea.",
        "question": "How do you compliment the tea and thank the server?",
        "1": "Just drink silently",
        "2": "Say 'Mitho cha, dhanyabad!' (It's delicious, thank you!)",
        "3": "Give a thumbs up without speaking",
        "4": "Snap your fingers to show appreciation",
        "right_answer": "2",
        "category": "food"
    },
    {
        "context": "You're eating momos at a local restaurant. A friend offers you one from their plate using their chopsticks that they've been eating with.",
        "question": "What does accepting this food signify in Nepali culture?",
        "1": "Nothing special, it's normal everywhere",
        "2": "It shows close friendship/family bond - sharing 'jutho' is intimate",
        "3": "It's extremely rude",
        "4": "It's only done at weddings",
        "right_answer": "2",
        "category": "food"
    },
    
    # Temple & Religious Sites
    {
        "context": "You want to visit Pashupatinath Temple in Kathmandu. You're wearing shorts and carrying a leather bag.",
        "question": "What should you do before entering the temple complex?",
        "1": "Just walk in as you are",
        "2": "Cover your legs, remove leather items, and remove shoes at the entrance",
        "3": "Take photos of everything first",
        "4": "Eat something for energy",
        "right_answer": "2",
        "category": "temples"
    },
    {
        "context": "You're visiting Boudhanath Stupa. You notice devotees walking around it in circles.",
        "question": "In which direction should you walk around a Buddhist stupa?",
        "1": "Counter-clockwise",
        "2": "Clockwise (keeping the stupa on your right)",
        "3": "Any direction is fine",
        "4": "Zig-zag pattern",
        "right_answer": "2",
        "category": "temples"
    },
    {
        "context": "At a Hindu temple, a priest offers you 'prasad' (blessed food offering). You're not Hindu but want to be respectful.",
        "question": "What should you do?",
        "1": "Refuse it rudely",
        "2": "Accept it graciously with your right hand and eat it or keep it respectfully",
        "3": "Throw it away when he's not looking",
        "4": "Ask him to give it to someone else",
        "right_answer": "2",
        "category": "temples"
    },
    
    # Shopping & Bargaining
    {
        "context": "You're at Ason Bazaar buying souvenirs. The shopkeeper quotes you 2000 rupees for a pashmina shawl.",
        "question": "What is the culturally appropriate way to negotiate?",
        "1": "Pay the full price without questioning",
        "2": "Smile, politely offer a lower price like 'Ali kam, dai?' (A little less, brother?)",
        "3": "Shout angrily about the high price",
        "4": "Walk away without any negotiation",
        "right_answer": "2",
        "category": "shopping"
    },
    {
        "context": "You want to buy fruits from a street vendor. You're not sure about the price.",
        "question": "How do you politely ask 'How much?' in Nepali?",
        "1": "Shout 'PRICE!'",
        "2": "Say 'Kati ho?' with a friendly smile",
        "3": "Just hand over money randomly",
        "4": "Use hand gestures only",
        "right_answer": "2",
        "category": "shopping"
    },
    
    # Festivals
    {
        "context": "It's Dashain festival and you're visiting a Nepali family. An elder is about to give you 'tika' (blessing with colored rice paste).",
        "question": "How should you receive the tika?",
        "1": "Stand tall with hands on hips",
        "2": "Bow your head, receive it humbly, and touch their feet if appropriate",
        "3": "Take a selfie first",
        "4": "Turn away shyly",
        "right_answer": "2",
        "category": "festivals"
    },
    {
        "context": "During Tihar, you see groups of children and young people going door to door singing. They come to your host's house.",
        "question": "What is this tradition called and what should you do?",
        "1": "It's called 'Deusi Bhailo' - give them money, sweets, or food as blessing",
        "2": "It's called 'Halloween' - ignore them",
        "3": "It's begging - don't give anything",
        "4": "It's a protest - close the door",
        "right_answer": "1",
        "category": "festivals"
    },
    {
        "context": "Your Nepali friend invites you to celebrate Holi. They're throwing colored powder at each other.",
        "question": "What is the appropriate way to participate?",
        "1": "Get angry about your clothes getting dirty",
        "2": "Join in joyfully, say 'Happy Holi!' and play with colors respectfully",
        "3": "Stand in the corner and watch only",
        "4": "Leave immediately",
        "right_answer": "2",
        "category": "festivals"
    },
    
    # Home Visits
    {
        "context": "You're entering a Nepali friend's home for the first time. You notice shoes lined up outside the door.",
        "question": "What should you do?",
        "1": "Walk in with your shoes on",
        "2": "Remove your shoes before entering",
        "3": "Ask if you can keep them on",
        "4": "Put your shoes in your bag",
        "right_answer": "2",
        "category": "customs"
    },
    {
        "context": "You accidentally step on a book while visiting a Nepali home. Your host looks uncomfortable.",
        "question": "What should you do and why?",
        "1": "Ignore it - it's just a book",
        "2": "Apologize and touch the book, then touch your forehead - books are sacred in Nepal",
        "3": "Pick it up and throw it",
        "4": "Laugh it off",
        "right_answer": "2",
        "category": "customs"
    },
    {
        "context": "You want to give money as a gift to someone at a Nepali celebration. You have a 500 rupee note.",
        "question": "What is the cultural practice for giving money as gifts?",
        "1": "Give the exact round number (500)",
        "2": "Add 1 rupee to make it 501 - odd numbers are auspicious",
        "3": "Give only coins",
        "4": "Money gifts are offensive in Nepal",
        "right_answer": "2",
        "category": "customs"
    },
    
    # Travel & Transportation
    {
        "context": "You're in a local bus in Nepal and an elderly woman boards. All seats are taken, including yours.",
        "question": "What is the culturally respectful thing to do?",
        "1": "Pretend to be asleep",
        "2": "Offer your seat to the elderly woman immediately",
        "3": "Look out the window",
        "4": "Move to a more crowded area",
        "right_answer": "2",
        "category": "customs"
    },
    {
        "context": "You're trekking in the Himalayas and meet a local porter carrying heavy goods. He greets you warmly despite his load.",
        "question": "How should you respond?",
        "1": "Ignore him and continue walking",
        "2": "Return the greeting warmly with 'Namaste' and step aside to let him pass",
        "3": "Take his photo without asking",
        "4": "Ask him to carry your bag too",
        "right_answer": "2",
        "category": "customs"
    },
    
    # Language & Communication
    {
        "context": "You want to learn how to say 'Delicious!' after eating amazing Nepali food at a restaurant.",
        "question": "What phrase should you use?",
        "1": "Ramro cha! (It's good!)",
        "2": "Mitho cha! (It's delicious!)",
        "3": "Mahango cha! (It's expensive!)",
        "4": "Thulo cha! (It's big!)",
        "right_answer": "2",
        "category": "expressions"
    },
    {
        "context": "You want to politely say 'Excuse me' to pass through a crowded market in Kathmandu.",
        "question": "What should you say?",
        "1": "MOVE!",
        "2": "Hajur (Excuse me/Respectful address)",
        "3": "Just push through silently",
        "4": "Whistle loudly",
        "right_answer": "2",
        "category": "expressions"
    },
    {
        "context": "Someone asks you 'Kasto cha?' (How are you?). You want to respond that you're fine.",
        "question": "What is the appropriate response?",
        "1": "Thik cha, hajur (I'm fine, respectfully)",
        "2": "Not good at all",
        "3": "Mind your business",
        "4": "Stay silent",
        "right_answer": "1",
        "category": "expressions"
    },
    
    # Weddings & Celebrations  
    {
        "context": "You're attending a traditional Nepali wedding. The bride and groom are exchanging flower garlands.",
        "question": "What is this ceremony called?",
        "1": "Sindoor ceremony",
        "2": "Mala badalne (Garland exchange ceremony)",
        "3": "Tilak ceremony",
        "4": "Bidaai",
        "right_answer": "2",
        "category": "customs"
    },
    {
        "context": "At a Nepali wedding, you're offered 'raksi' (local alcohol). You don't drink alcohol.",
        "question": "How do you politely decline?",
        "1": "Make a disgusted face",
        "2": "Politely say 'Dhanyabad, tara ma khaa-dina' (Thank you, but I don't drink)",
        "3": "Accept it but throw it away",
        "4": "Leave the wedding",
        "right_answer": "2",
        "category": "customs"
    },
    
    # Mountain Culture
    {
        "context": "You're trekking to Everest Base Camp and pass a 'mani wall' (wall with carved prayer stones). Your guide walks on the left side.",
        "question": "Which side should you walk to pass mani walls and stupas?",
        "1": "Any side is fine",
        "2": "Keep them on your right (walk on the left side)",
        "3": "Climb over them",
        "4": "Touch every stone",
        "right_answer": "2",
        "category": "customs"
    },
    {
        "context": "A Sherpa family invites you for tea in their mountain home. They offer you 'butter tea' (po cha).",
        "question": "The tea tastes very salty and buttery. What should you do?",
        "1": "Spit it out",
        "2": "Accept it graciously - it's a traditional Himalayan hospitality offering",
        "3": "Demand regular tea instead",
        "4": "Pour it out secretly",
        "right_answer": "2",
        "category": "food"
    },
    
    # Respect & Hierarchy
    {
        "context": "You're meeting a senior government official in Nepal. He's much older than you.",
        "question": "How do you address him respectfully?",
        "1": "Call him by his first name",
        "2": "Use 'Hajur' or address with his title and 'ji' suffix",
        "3": "Just say 'Hey'",
        "4": "Avoid eye contact completely",
        "right_answer": "2",
        "category": "customs"
    },
    {
        "context": "You're sitting in a meeting room in Nepal. A senior person enters the room.",
        "question": "What is the respectful thing to do?",
        "1": "Continue sitting and wave",
        "2": "Stand up briefly as a sign of respect",
        "3": "Ignore them",
        "4": "Clap your hands",
        "right_answer": "2",
        "category": "customs"
    },
]


def get_random_quiz_question(exclude_ids: List[int] = None) -> Dict[str, Any]:
    """
    Get a random quiz question that hasn't been shown recently.
    
    Args:
        exclude_ids: List of question indices to exclude (recently shown)
    
    Returns:
        A random quiz question dictionary
    """
    if exclude_ids is None:
        exclude_ids = []
    
    available = [i for i in range(len(QUIZ_QUESTIONS)) if i not in exclude_ids]
    
    if not available:
        # If all questions have been shown, reset and pick any
        available = list(range(len(QUIZ_QUESTIONS)))
    
    idx = random.choice(available)
    return QUIZ_QUESTIONS[idx].copy()


def get_random_roleplay_scenario(exclude_ids: List[int] = None) -> Dict[str, Any]:
    """
    Get a random roleplay scenario that hasn't been shown recently.
    
    Args:
        exclude_ids: List of scenario indices to exclude (recently shown)
    
    Returns:
        A random roleplay scenario dictionary
    """
    if exclude_ids is None:
        exclude_ids = []
    
    available = [i for i in range(len(ROLEPLAY_SCENARIOS)) if i not in exclude_ids]
    
    if not available:
        # If all scenarios have been shown, reset and pick any
        available = list(range(len(ROLEPLAY_SCENARIOS)))
    
    idx = random.choice(available)
    return ROLEPLAY_SCENARIOS[idx].copy()


def get_quiz_questions_by_category(category: str) -> List[Dict[str, Any]]:
    """Get all quiz questions for a specific category."""
    return [q for q in QUIZ_QUESTIONS if q.get("category") == category]


def get_roleplay_by_category(category: str) -> List[Dict[str, Any]]:
    """Get all roleplay scenarios for a specific category."""
    return [s for s in ROLEPLAY_SCENARIOS if s.get("category") == category]


# Session tracking for variety (simple in-memory tracking)
_shown_quiz_indices = []
_shown_roleplay_indices = []
MAX_HISTORY = 10  # Remember last 10 shown items to avoid repetition


def get_next_quiz_question() -> Dict[str, Any]:
    """Get the next quiz question, avoiding recent repeats."""
    global _shown_quiz_indices
    
    question = get_random_quiz_question(_shown_quiz_indices[-MAX_HISTORY:] if _shown_quiz_indices else [])
    
    # Find and track the index
    for i, q in enumerate(QUIZ_QUESTIONS):
        if q["question"] == question["question"]:
            _shown_quiz_indices.append(i)
            break
    
    return question


def get_next_roleplay_scenario() -> Dict[str, Any]:
    """Get the next roleplay scenario, avoiding recent repeats."""
    global _shown_roleplay_indices
    
    scenario = get_random_roleplay_scenario(_shown_roleplay_indices[-MAX_HISTORY:] if _shown_roleplay_indices else [])
    
    # Find and track the index
    for i, s in enumerate(ROLEPLAY_SCENARIOS):
        if s["context"] == scenario["context"]:
            _shown_roleplay_indices.append(i)
            break
    
    return scenario
