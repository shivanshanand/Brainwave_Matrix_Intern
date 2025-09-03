import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Comment from "./models/Comment.js";
import Category from "./models/Category.js";
import bcrypt from "bcrypt";

dotenv.config();

// 🏗️ HIERARCHICAL CATEGORIES DATA
const categories = [
  // TECHNOLOGY & SOFTWARE
  {
    name: "Technology",
    slug: "technology",
    description: "All tech and software topics",
    isParent: true,
  },
  {
    name: "development",
    slug: "development",
    description: "Software development and programming",
    parent: "technology",
  },
  {
    name: "ai",
    slug: "ai",
    description: "Artificial Intelligence and machine learning",
    parent: "technology",
  },
  {
    name: "web",
    slug: "web",
    description: "Web technologies and development",
    parent: "technology",
  },
  {
    name: "cloud",
    slug: "cloud",
    description: "Cloud computing and services",
    parent: "technology",
  },
  {
    name: "cybersecurity",
    slug: "cybersecurity",
    description: "Cybersecurity and data protection",
    parent: "technology",
  },
  {
    name: "mobile",
    slug: "mobile",
    description: "Mobile app development",
    parent: "technology",
  },

  // BUSINESS & CAREER
  {
    name: "Business",
    slug: "business",
    description: "Business, career and entrepreneurship",
    isParent: true,
  },
  {
    name: "startup",
    slug: "startup",
    description: "Startup and entrepreneurship",
    parent: "business",
  },
  {
    name: "marketing",
    slug: "marketing",
    description: "Digital marketing and advertising",
    parent: "business",
  },
  {
    name: "finance",
    slug: "finance",
    description: "Personal finance and investing",
    parent: "business",
  },
  {
    name: "career",
    slug: "career",
    description: "Career development and job advice",
    parent: "business",
  },
  {
    name: "leadership",
    slug: "leadership",
    description: "Leadership and management",
    parent: "business",
  },

  {
    name: "Productivity",
    slug: "productivity",
    description: "Productivity tips and tools for every professional.",
    isParent: true,
  },
  {
    name: "Remote Work",
    slug: "remote-work",
    description: "Remote and hybrid work best practices.",
    parent: "productivity",
  },
  {
    name: "Time Management",
    slug: "time-management",
    description: "Tips and strategies for better time management.",
    parent: "productivity",
  },
  {
    name: "Focus",
    slug: "focus",
    description: "Concentration, flow states, and focus hacks.",
    parent: "productivity",
  },

  // LIFESTYLE
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Lifestyle, health and personal topics",
    isParent: true,
  },
  {
    name: "health",
    slug: "health",
    description: "Health and wellness advice",
    parent: "lifestyle",
  },
  {
    name: "fitness",
    slug: "fitness",
    description: "Fitness routines and exercise",
    parent: "lifestyle",
  },
  {
    name: "mental-health",
    slug: "mental-health",
    description: "Mental health and mindfulness",
    parent: "lifestyle",
  },
  {
    name: "personal-development",
    slug: "personal-development",
    description: "Self-improvement and growth",
    parent: "lifestyle",
  },
  {
    name: "relationships",
    slug: "relationships",
    description: "Dating and relationship advice",
    parent: "lifestyle",
  },
  {
    name: "parenting",
    slug: "parenting",
    description: "Parenting tips and family life",
    parent: "lifestyle",
  },

  // ENTERTAINMENT & MEDIA
  {
    name: "Entertainment",
    slug: "entertainment",
    description: "Entertainment, media and creative content",
    isParent: true,
  },
  {
    name: "gaming",
    slug: "gaming",
    description: "Video games and gaming culture",
    parent: "entertainment",
  },
  {
    name: "music",
    slug: "music",
    description: "Music reviews and industry insights",
    parent: "entertainment",
  },
  {
    name: "movies",
    slug: "movies",
    description: "Movies, TV, and entertainment",
    parent: "entertainment",
  },
  {
    name: "books",
    slug: "books",
    description: "Book reviews and literature",
    parent: "entertainment",
  },
  {
    name: "art",
    slug: "art",
    description: "Art, creativity, and visual arts",
    parent: "entertainment",
  },
  {
    name: "photography",
    slug: "photography",
    description: "Photography tips and techniques",
    parent: "entertainment",
  },

  // TRAVEL & CULTURE
  {
    name: "Travel",
    slug: "travel",
    description: "Travel, culture and experiences",
    isParent: true,
  },
  {
    name: "destinations",
    slug: "destinations",
    description: "Travel guides and experiences",
    parent: "travel",
  },
  {
    name: "culture",
    slug: "culture",
    description: "Cultural topics and social issues",
    parent: "travel",
  },
  {
    name: "food",
    slug: "food",
    description: "Recipes, cooking, and food culture",
    parent: "travel",
  },

  // FASHION & BEAUTY
  {
    name: "Fashion",
    slug: "fashion",
    description: "Fashion, beauty and style",
    isParent: true,
  },
  {
    name: "style",
    slug: "style",
    description: "Fashion trends and style advice",
    parent: "fashion",
  },
  {
    name: "beauty",
    slug: "beauty",
    description: "Beauty tips and skincare",
    parent: "fashion",
  },

  // HOME & DIY
  {
    name: "Home",
    slug: "home",
    description: "Home, DIY and living spaces",
    isParent: true,
  },
  {
    name: "diy",
    slug: "diy",
    description: "DIY projects and crafts",
    parent: "home",
  },
  {
    name: "gardening",
    slug: "gardening",
    description: "Gardening and plant care",
    parent: "home",
  },
  {
    name: "real-estate",
    slug: "real-estate",
    description: "Real estate and property investment",
    parent: "home",
  },

  // EDUCATION & SCIENCE
  {
    name: "Education",
    slug: "education",
    description: "Education, science and learning",
    isParent: true,
  },
  {
    name: "science",
    slug: "science",
    description: "Science and research",
    parent: "education",
  },
  {
    name: "history",
    slug: "history",
    description: "Historical content and analysis",
    parent: "education",
  },
  {
    name: "language",
    slug: "language",
    description: "Language learning and linguistics",
    parent: "education",
  },

  // SPORTS & OUTDOOR
  {
    name: "Sports",
    slug: "sports",
    description: "Sports and outdoor activities",
    isParent: true,
  },
  {
    name: "outdoor",
    slug: "outdoor",
    description: "Outdoor activities and adventure",
    parent: "sports",
  },
  {
    name: "automotive",
    slug: "automotive",
    description: "Cars and automotive industry",
    parent: "sports",
  },
];

// 👥 USERS DATA
const users = [
  {
    username: "johndoe",
    email: "john@example.com",
    password: "Password123",
    firstName: "John",
    lastName: "Doe",
    bio: "Full-stack developer passionate about React and Node.js. Love sharing knowledge about web development.",
    role: "admin",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "lucytech",
    email: "lucy@example.com",
    password: "Password123",
    firstName: "Lucy",
    lastName: "Campbell",
    bio: "DevOps engineer passionate about cloud infrastructure and automation.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "danieldata",
    email: "daniel@example.com",
    password: "Password123",
    firstName: "Daniel",
    lastName: "Martinez",
    bio: "Data scientist exploring predictive analytics and machine learning.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "emilyarts",
    email: "emily@example.com",
    password: "Password123",
    firstName: "Emily",
    lastName: "Watson",
    bio: "Digital artist and illustrator creating NFT collections.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "ryanfit",
    email: "ryan@example.com",
    password: "Password123",
    firstName: "Ryan",
    lastName: "Clark",
    bio: "Personal trainer and nutrition coach helping people achieve fitness goals.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1555952494-efd681c7e3f9?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "jessicapsy",
    email: "jessica@example.com",
    password: "Password123",
    firstName: "Jessica",
    lastName: "Foster",
    bio: "Clinical psychologist and mental health advocate.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1554727242-741c14fa561c?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "brandonui",
    email: "brandon@example.com",
    password: "Password123",
    firstName: "Brandon",
    lastName: "Chang",
    bio: "Product designer focused on mobile apps and user research.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "ameliacook",
    email: "amelia@example.com",
    password: "Password123",
    firstName: "Amelia",
    lastName: "Parker",
    bio: "Food blogger and chef sharing healthy recipe inspiration.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1549351512-c5e12b11e283?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "jacobgame",
    email: "jacob@example.com",
    password: "Password123",
    firstName: "Jacob",
    lastName: "Turner",
    bio: "Game developer and indie game studio founder.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1557862921-37829c790f19?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "zoephoto",
    email: "zoe@example.com",
    password: "Password123",
    firstName: "Zoe",
    lastName: "Morris",
    bio: "Travel photographer capturing stories from around the world.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "liamcrypto",
    email: "liam@example.com",
    password: "Password123",
    firstName: "Liam",
    lastName: "Rodriguez",
    bio: "Cryptocurrency trader and DeFi protocol researcher.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "avayoga",
    email: "ava@example.com",
    password: "Password123",
    firstName: "Ava",
    lastName: "Thompson",
    bio: "Yoga instructor and mindfulness meditation teacher.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "noahseo",
    email: "noah@example.com",
    password: "Password123",
    firstName: "Noah",
    lastName: "Kim",
    bio: "SEO specialist and digital marketing consultant.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "islabooks",
    email: "isla@example.com",
    password: "Password123",
    firstName: "Isla",
    lastName: "Bennett",
    bio: "Book reviewer and aspiring novelist.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1554780336-390462301acb?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "ethangreen",
    email: "ethangreen@example.com",
    password: "Password123",
    firstName: "Ethan",
    lastName: "Green",
    bio: "Environmental scientist advocating for climate action.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "mayafilms",
    email: "maya@example.com",
    password: "Password123",
    firstName: "Maya",
    lastName: "Patel",
    bio: "Independent filmmaker and video content creator.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1594736797933-d0c32c286c33?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "calebcode",
    email: "caleb@example.com",
    password: "Password123",
    firstName: "Caleb",
    lastName: "Wright",
    bio: "iOS developer building accessibility-focused apps.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "rubydesign",
    email: "ruby@example.com",
    password: "Password123",
    firstName: "Ruby",
    lastName: "Cooper",
    bio: "Brand designer helping startups create visual identities.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "finnmusic",
    email: "finn@example.com",
    password: "Password123",
    firstName: "Finn",
    lastName: "Mitchell",
    bio: "Music producer and sound engineer for indie artists.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "hannahlaw",
    email: "hannah@example.com",
    password: "Password123",
    firstName: "Hannah",
    lastName: "Phillips",
    bio: "Corporate lawyer specializing in tech startups and IP law.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "luketravel",
    email: "luke@example.com",
    password: "Password123",
    firstName: "Luke",
    lastName: "Adams",
    bio: "Adventure traveler and outdoor gear reviewer.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "bellahealth",
    email: "bella@example.com",
    password: "Password123",
    firstName: "Bella",
    lastName: "Stone",
    bio: "Registered nurse and healthcare technology advocate.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "jaxonai",
    email: "jaxon@example.com",
    password: "Password123",
    firstName: "Jaxon",
    lastName: "Rivera",
    bio: "AI researcher working on computer vision and robotics.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "auroraskills",
    email: "aurora@example.com",
    password: "Password123",
    firstName: "Aurora",
    lastName: "Wood",
    bio: "Skills development coach and online course creator.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "bentechwriter",
    email: "ben@example.com",
    password: "Password123",
    firstName: "Ben",
    lastName: "Scott",
    bio: "Technical writer creating documentation for developer tools.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "lunasocial",
    email: "luna@example.com",
    password: "Password123",
    firstName: "Luna",
    lastName: "Hayes",
    bio: "Community manager and social impact strategist.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "asherdata",
    email: "asher@example.com",
    password: "Password123",
    firstName: "Asher",
    lastName: "Morgan",
    bio: "Database architect and big data analytics expert.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "violetsales",
    email: "violet@example.com",
    password: "Password123",
    firstName: "Violet",
    lastName: "Reed",
    bio: "Sales strategist helping SaaS companies scale revenue.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b332c0cc?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "reidgrowth",
    email: "reid@example.com",
    password: "Password123",
    firstName: "Reid",
    lastName: "Bell",
    bio: "Growth hacker and conversion optimization specialist.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "hazelcode",
    email: "hazel@example.com",
    password: "Password123",
    firstName: "Hazel",
    lastName: "Price",
    bio: "Full-stack developer specializing in Python and Django.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "sarahtech",
    email: "sarah@example.com",
    password: "Password123",
    firstName: "Sarah",
    lastName: "Johnson",
    bio: "AI researcher and machine learning enthusiast. Currently working on NLP applications.",
    role: "user",
    avatar:
      "https://plus.unsplash.com/premium_photo-1669704098876-2a38eb10e56a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FyYWh8ZW58MHx8MHx8fDA%3D",
  },
  {
    username: "mikebiz",
    email: "mike@example.com",
    password: "Password123",
    firstName: "Mike",
    lastName: "Wilson",
    bio: "Serial entrepreneur and startup advisor. Love helping founders build successful businesses.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "emmalife",
    email: "emma@example.com",
    password: "Password123",
    firstName: "Emma",
    lastName: "Davis",
    bio: "Wellness coach and lifestyle blogger. Passionate about mental health and personal growth.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "alexcode",
    email: "alex@example.com",
    password: "Password123",
    firstName: "Alex",
    lastName: "Martinez",
    bio: "Backend engineer focused on scalable APIs and cloud infrastructure.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "lindadesign",
    email: "linda@example.com",
    password: "Password123",
    firstName: "Linda",
    lastName: "Brown",
    bio: "UI/UX designer passionate about creating intuitive digital experiences.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "rajdeep",
    email: "raj@example.com",
    password: "Password123",
    firstName: "Raj",
    lastName: "Singh",
    bio: "Blockchain enthusiast and smart contract developer.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "natalieblog",
    email: "natalie@example.com",
    password: "Password123",
    firstName: "Natalie",
    lastName: "Green",
    bio: "Travel blogger documenting hidden gems across the world.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "davidai",
    email: "david@example.com",
    password: "Password123",
    firstName: "David",
    lastName: "Lee",
    bio: "Computer vision engineer working on autonomous systems.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "mariateach",
    email: "maria@example.com",
    password: "Password123",
    firstName: "Maria",
    lastName: "Lopez",
    bio: "Educator creating online courses about data science and statistics.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "kevinwrites",
    email: "kevin@example.com",
    password: "Password123",
    firstName: "Kevin",
    lastName: "Anderson",
    bio: "Content creator and copywriter focused on tech startups.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "anitasocial",
    email: "anita@example.com",
    password: "Password123",
    firstName: "Anita",
    lastName: "Patel",
    bio: "Social media strategist helping brands build communities.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "tomfinance",
    email: "tom@example.com",
    password: "Password123",
    firstName: "Tom",
    lastName: "Baker",
    bio: "Financial analyst with a passion for fintech innovations.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "sophiaart",
    email: "sophia@example.com",
    password: "Password123",
    firstName: "Sophia",
    lastName: "Taylor",
    bio: "Digital artist exploring generative art and NFTs.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "ethansports",
    email: "ethan@example.com",
    password: "Password123",
    firstName: "Ethan",
    lastName: "Roberts",
    bio: "Sports analyst and podcaster covering football and basketball.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "gracehealth",
    email: "grace@example.com",
    password: "Password123",
    firstName: "Grace",
    lastName: "White",
    bio: "Nutritionist advocating for balanced diets and sustainable living.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "omarbuilds",
    email: "omar@example.com",
    password: "Password123",
    firstName: "Omar",
    lastName: "Hassan",
    bio: "Civil engineer working on sustainable urban infrastructure.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "chloemusic",
    email: "chloe@example.com",
    password: "Password123",
    firstName: "Chloe",
    lastName: "King",
    bio: "Musician and songwriter blending acoustic and electronic sounds.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "yukitech",
    email: "yuki@example.com",
    password: "Password123",
    firstName: "Yuki",
    lastName: "Tanaka",
    bio: "Frontend developer specializing in Vue and TailwindCSS.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  },
  {
    username: "carolbiz",
    email: "carol@example.com",
    password: "Password123",
    firstName: "Carol",
    lastName: "Evans",
    bio: "Startup founder building SaaS solutions for small businesses.",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  },
];

// FOLLOWER/FOLLOWING
const followRelationships = [
  // Tech people following each other
  { follower: "sarahtech", following: "johndoe" },
  { follower: "alexcode", following: "johndoe" },
  { follower: "yukitech", following: "johndoe" },
  { follower: "lindadesign", following: "johndoe" },
  { follower: "davidai", following: "johndoe" },

  // John (admin) following key users
  { follower: "johndoe", following: "sarahtech" },
  { follower: "johndoe", following: "mikebiz" },
  { follower: "johndoe", following: "emmalife" },
  { follower: "johndoe", following: "kevinwrites" },

  // Sarah (AI) - tech connections
  { follower: "sarahtech", following: "alexcode" },
  { follower: "sarahtech", following: "davidai" },
  { follower: "sarahtech", following: "mariateach" },
  { follower: "alexcode", following: "sarahtech" },
  { follower: "davidai", following: "sarahtech" },

  // Mike (business) - business connections
  { follower: "mikebiz", following: "carolbiz" },
  { follower: "mikebiz", following: "anitasocial" },
  { follower: "mikebiz", following: "tomfinance" },
  { follower: "carolbiz", following: "mikebiz" },
  { follower: "anitasocial", following: "mikebiz" },

  // Emma (lifestyle) - lifestyle connections
  { follower: "emmalife", following: "gracehealth" },
  { follower: "emmalife", following: "natalieblog" },
  { follower: "gracehealth", following: "emmalife" },
  { follower: "natalieblog", following: "emmalife" },

  // Design connections
  { follower: "lindadesign", following: "sophiaart" },
  { follower: "sophiaart", following: "lindadesign" },
  { follower: "chloemusic", following: "sophiaart" },

  // Content creators following each other
  { follower: "kevinwrites", following: "natalieblog" },
  { follower: "kevinwrites", following: "ethansports" },
  { follower: "natalieblog", following: "kevinwrites" },

  // Cross-category follows (realistic interactions)
  { follower: "rajdeep", following: "tomfinance" },
  { follower: "mariateach", following: "davidai" },
  { follower: "omarbuilds", following: "rajdeep" },
  { follower: "yukitech", following: "lindadesign" },
  { follower: "ethansports", following: "chloemusic" },

  // Some users follow popular creators
  { follower: "tomfinance", following: "johndoe" },
  { follower: "sophiaart", following: "johndoe" },
  { follower: "mariateach", following: "sarahtech" },
  { follower: "omarbuilds", following: "mikebiz" },
  { follower: "rajdeep", following: "alexcode" },

  // Additional realistic connections
  { follower: "anitasocial", following: "kevinwrites" },
  { follower: "chloemusic", following: "natalieblog" },
  { follower: "gracehealth", following: "mariateach" },
  { follower: "ethansports", following: "anitasocial" },
  { follower: "carolbiz", following: "tomfinance" },

  { follower: "lucytech", following: "johndoe" },
  { follower: "lucytech", following: "sarahtech" },
  { follower: "lucytech", following: "alexcode" },
  { follower: "danieldata", following: "sarahtech" },
  { follower: "danieldata", following: "davidai" },
  { follower: "danieldata", following: "mariateach" },
  { follower: "calebcode", following: "johndoe" },
  { follower: "calebcode", following: "yukitech" },
  { follower: "jaxonai", following: "sarahtech" },
  { follower: "jaxonai", following: "danieldata" },
  { follower: "asherdata", following: "danieldata" },
  { follower: "hazelcode", following: "alexcode" },

  // Design/Creative cluster
  { follower: "emilyarts", following: "lindadesign" },
  { follower: "emilyarts", following: "sophiaart" },
  { follower: "brandonui", following: "lindadesign" },
  { follower: "rubydesign", following: "sophiaart" },
  { follower: "mayafilms", following: "emilyarts" },
  { follower: "zoephoto", following: "natalieblog" },
  { follower: "finnmusic", following: "chloemusic" },

  // Business/Finance cluster
  { follower: "violetsales", following: "mikebiz" },
  { follower: "violetsales", following: "carolbiz" },
  { follower: "reidgrowth", following: "anitasocial" },
  { follower: "reidgrowth", following: "noahseo" },
  { follower: "hannahlaw", following: "tomfinance" },
  { follower: "liamcrypto", following: "rajdeep" },
  { follower: "liamcrypto", following: "tomfinance" },

  // Health/Lifestyle cluster
  { follower: "ryanfit", following: "emmalife" },
  { follower: "ryanfit", following: "gracehealth" },
  { follower: "jessicapsy", following: "emmalife" },
  { follower: "ameliacook", following: "gracehealth" },
  { follower: "avayoga", following: "ryanfit" },
  { follower: "bellahealth", following: "jessicapsy" },

  // Content/Writing cluster
  { follower: "bentechwriter", following: "kevinwrites" },
  { follower: "islabooks", following: "natalieblog" },
  { follower: "islabooks", following: "kevinwrites" },
  { follower: "luketravel", following: "natalieblog" },
  { follower: "luketravel", following: "zoephoto" },

  // Cross-category connections (realistic networking)
  { follower: "jacobgame", following: "johndoe" },
  { follower: "ethangreen", following: "mariateach" },
  { follower: "auroraskills", following: "emmalife" },
  { follower: "lunasocial", following: "anitasocial" },
  { follower: "noahseo", following: "kevinwrites" },

  // Popular users get more followers
  { follower: "lucytech", following: "johndoe" },
  { follower: "emilyarts", following: "johndoe" },
  { follower: "ryanfit", following: "johndoe" },
  { follower: "jessicapsy", following: "johndoe" },
  { follower: "brandonui", following: "johndoe" },
  { follower: "ameliacook", following: "johndoe" },
  { follower: "jacobgame", following: "sarahtech" },
  { follower: "zoephoto", following: "sarahtech" },
  { follower: "liamcrypto", following: "mikebiz" },
  { follower: "avayoga", following: "emmalife" },

  // Mutual follows within clusters
  { follower: "sarahtech", following: "danieldata" },
  { follower: "alexcode", following: "lucytech" },
  { follower: "lindadesign", following: "brandonui" },
  { follower: "sophiaart", following: "emilyarts" },
  { follower: "mikebiz", following: "violetsales" },
  { follower: "emmalife", following: "ryanfit" },
  { follower: "gracehealth", following: "ameliacook" },
  { follower: "kevinwrites", following: "bentechwriter" },
  { follower: "natalieblog", following: "islabooks" },

  // Additional realistic connections
  { follower: "chloemusic", following: "finnmusic" },
  { follower: "ethansports", following: "ryanfit" },
  { follower: "tomfinance", following: "hannahlaw" },
  { follower: "omarbuilds", following: "ethangreen" },
  { follower: "mariateach", following: "auroraskills" },
  { follower: "yukitech", following: "calebcode" },
  { follower: "carolbiz", following: "reidgrowth" },
  { follower: "anitasocial", following: "lunasocial" },
  { follower: "davidai", following: "jaxonai" },
  { follower: "rajdeep", following: "asherdata" },
];

// 📝 POSTS DATA
const postsData = [
  {
    title: "Building Modern Web Applications with React and TypeScript",
    excerpt:
      "Learn how to create scalable and maintainable web apps with React and TypeScript. This guide covers best practices, setup, and patterns.",
    content: `
# Building Modern Web Applications with React and TypeScript

In this guide, we walk through setup, component best-practices, and tips for both beginners and advanced devs. You'll learn to create complex, yet robust, web apps faster than ever. Featuring:
- Creating a new project
- Prop types and interfaces
- Common error handling

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

## Why TS?  
Because catching bugs at compile time > at runtime.

## Final thoughts  
Type safety and DX FTW!
    `,
    authorUsername: "johndoe",
    categorySlug: "web",
    tags: ["react", "typescript", "web-development", "frontend", "javascript"],
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    featured: true,
    views: 5900,
    publishedDays: 2,
  },
  {
    title: "The Future of Artificial Intelligence in Healthcare",
    excerpt:
      "Exploring how AI is revolutionizing healthcare through diagnostics, personalization, and analytics.",
    content: `
# The Future of AI in Healthcare

AI is revolutionizing modern medicine—from image recognition in diagnostics to predictive analytics for patient care.

- **Faster, better diagnostics:** AI finds tumors, predicts risks, and assists in radiology.
- **Personalized medicine:** ML models recommend tailored treatments.
- **Challenges:** Data privacy, ethics, and global accessibility.

\`\`\`
AI holds the promise to make healthcare more precise, affordable, and effective for everyone.
\`\`\`
    `,
    authorUsername: "sarahtech",
    categorySlug: "ai",
    tags: ["artificial-intelligence", "healthcare", "machine-learning"],
    coverImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
    featured: true,
    views: 3100,
    publishedDays: 5,
  },
  {
    title: "From Idea to IPO: A Startup Journey Guide",
    excerpt:
      "Essential strategies for taking your startup from initial concept to IPO.",
    content: `
# From Idea to IPO: A Startup's Roadmap

Launching a startup is hard. Going public? Even harder.  
- **Ideation:** Validate real user pain
- **Growth:** Keep customers FIRST
- **Scaling:** Build a purpose-driven team
- **IPO:** It's a milestone, not the finish line

Don't chase valuation—chase value. Real success is sustainable, customer-focused growth.
    `,
    authorUsername: "mikebiz",
    categorySlug: "startup",
    tags: ["startup", "entrepreneurship", "ipo", "business-strategy"],
    coverImage:
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop",
    featured: false,
    views: 2300,
    publishedDays: 1,
  },
  {
    title: "How to Market Yourself as a Developer",
    excerpt:
      "A guide on building a personal brand and landing better jobs using online presence.",
    content: `
# How to Market Yourself as a Developer

Want better job offers? Start here:
- Build a strong online portfolio (Github, personal site)
- Share knowledge through writing and talks
- Contribute to open source
- Network: Twitter & LinkedIn

Consistency > virality. Brand is trust!
    `,
    authorUsername: "johndoe",
    categorySlug: "marketing",
    tags: ["marketing", "personal-branding", "career"],
    coverImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop",
    featured: false,
    views: 870,
    publishedDays: 10,
  },
  {
    title: "10 CSS Tricks Every Frontend Developer Should Know",
    excerpt:
      "These CSS hacks will up your UI game—flexbox, gradients, animations, and more.",
    content: `# 10 CSS Tricks
Learn about grid layouts, text effects, glassmorphism, and scroll snap for modern web design.`,
    authorUsername: "lucytech",
    categorySlug: "frontend",
    tags: ["css", "frontend", "web-design", "ux"],
    coverImage: "https://picsum.photos/seed/css1/800/400",
    featured: false,
    views: 890,
    publishedDays: 9,
  },
  {
    title: "The Science of Focus: How to Beat Procrastination",
    excerpt:
      "Productivity tips backed by cognitive science to help you do deep work.",
    content: `# The Science of Focus
Tactics from psychology: Pomodoro, timeboxing, digital detox, and willpower boosts.`,
    authorUsername: "jessicapsy",
    categorySlug: "productivity",
    tags: ["psychology", "productivity", "focus", "habits"],
    coverImage: "https://picsum.photos/seed/focus1/800/400",
    featured: true,
    views: 650,
    publishedDays: 6,
  },
  {
    title: "Why Creativity Matters in Data Science",
    excerpt:
      "It’s not all math! Storytelling and creative thinking are keys to great data solutions.",
    content: `# Why Creativity Matters in Data Science
Blend art with science to create more meaningful data insights.`,
    authorUsername: "danieldata",
    categorySlug: "data-science",
    tags: ["data-science", "creativity", "machine-learning"],
    coverImage: "https://picsum.photos/seed/dataart/800/400",
    featured: false,
    views: 330,
    publishedDays: 13,
  },
  {
    title: "Bootstrap Your SaaS: Launch in 30 Days",
    excerpt: "Proven steps to validate, build, and launch a SaaS on a budget.",
    content: `# Bootstrap Your SaaS
MVP mindset, rapid iteration, feedback loops, and marketing from day one.`,
    authorUsername: "carolbiz",
    categorySlug: "startup",
    tags: ["saas", "startup", "business", "founders", "bootstrap"],
    coverImage: "https://picsum.photos/seed/saas/800/400",
    featured: false,
    views: 450,
    publishedDays: 12,
  },
  {
    title: "Exploring the World of NFTs for Artists",
    excerpt:
      "NFTs are redefining value for creators. Should you mint your art?",
    content: `# NFTs for Artists
Learn the pros, cons, risks and rewards of the NFT art market in 2025.`,
    authorUsername: "emilyarts",
    categorySlug: "art",
    tags: ["nft", "blockchain", "digital-art", "crypto"],
    coverImage: "https://picsum.photos/seed/nft/800/400",
    featured: true,
    views: 1400,
    publishedDays: 2,
  },
  {
    title: "Investing Basics for Gen Z",
    excerpt: "Stocks, crypto, and building wealth—without all the jargon.",
    content: `# Investing Basics for Gen Z
Smart ways to invest early: index funds, dollar-cost averaging, and financial literacy tips for 2025.`,
    authorUsername: "liamcrypto",
    categorySlug: "finance",
    tags: ["investing", "finance", "genz", "personal-finance"],
    coverImage: "https://picsum.photos/seed/invest1/800/400",
    featured: false,
    views: 760,
    publishedDays: 8,
  },
  {
    title: "Remote Team Building Activities That Actually Work",
    excerpt: "The best ways to bond, even when you never meet face to face.",
    content: `# Virtual Team Building
Quick games, challenges, and quirky activities to create real team spirit in distributed workplaces.`,
    authorUsername: "lucytech",
    categorySlug: "management",
    tags: ["remote-work", "team", "hr", "culture"],
    coverImage: "https://picsum.photos/seed/remote1/800/400",
    featured: true,
    views: 1200,
    publishedDays: 14,
  },
  {
    title: "Introduction to Mindfulness Meditation for Beginners",
    excerpt:
      "Start a meditation habit today—get calmer in just 5 minutes per day.",
    content: `# Mindfulness Basics
Easy breathing, body scan, and acceptance exercises for busy brains.`,
    authorUsername: "avayoga",
    categorySlug: "mental-health",
    tags: ["mindfulness", "well-being", "meditation", "habits"],
    coverImage: "https://picsum.photos/seed/mind1/800/400",
    featured: false,
    views: 510,
    publishedDays: 16,
  },
  {
    title: "How to Land Your First Remote Developer Job",
    excerpt:
      "What to prep, where to apply, and how to ace remote tech interviews.",
    content: `# Land Your Remote Dev Job
Portfolio, test projects, async skills, and what startups really care about in 2025.`,
    authorUsername: "hazelcode",
    categorySlug: "web",
    tags: ["remote-jobs", "career", "webdev", "hiring"],
    coverImage: "https://picsum.photos/seed/remote2/800/400",
    featured: false,
    views: 1340,
    publishedDays: 10,
  },
  {
    title: "Photography with Your Smartphone: Tips & Tricks",
    excerpt: "How to take professional photos with just your phone.",
    content: `# Phone Photography Guide
Camera settings, framing, editing, and lighting hacks for Instagram-worthy images.`,
    authorUsername: "zoephoto",
    categorySlug: "photography",
    tags: ["photography", "smartphone", "guide", "art"],
    coverImage: "https://picsum.photos/seed/photo1/800/400",
    featured: false,
    views: 712,
    publishedDays: 11,
  },
  {
    title: "Self-Taught Programming: Can Anyone Learn to Code?",
    excerpt: "Motivation, resources, and roadblocks for self-taught devs.",
    content: `# Self-Taught Programming
Common struggles, learning platforms, and when to ask for help.`,
    authorUsername: "lucytech",
    categorySlug: "coding",
    tags: ["programming", "learning", "self-taught", "career"],
    coverImage: "https://picsum.photos/seed/code1/800/400",
    featured: true,
    views: 890,
    publishedDays: 7,
  },
  {
    title: "Podcasting for Beginners: Start Your Show",
    excerpt: "Everything you need to launch a podcast from scratch.",
    content: `# How to Start a Podcast
Mics, recording, software, and how to build an audience from zero.`,
    authorUsername: "finnmusic",
    categorySlug: "music",
    tags: ["podcasting", "music", "audio", "voice"],
    coverImage: "https://picsum.photos/seed/podcast/800/400",
    featured: false,
    views: 340,
    publishedDays: 19,
  },
  {
    title: "Essential Tips for Remote Work Productivity",
    excerpt: "The best science-backed tips for working remotely in 2025.",
    content: `
# Essential Tips for Remote Work

- Use time blocking for focus
- Design a distraction-free workspace
- Communicate proactively with your team
- Take real breaks (not Twitter breaks!)

🏡 Remote work is here to stay—so build a system that works for YOU.
    `,
    authorUsername: "emmalife",
    categorySlug: "productivity",
    tags: ["productivity", "remote-work", "lifestyle"],
    coverImage:
      "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=800&h=400&fit=crop",
    featured: true,
    views: 3985,
    publishedDays: 3,
  },
  {
    title: "Top Cloud Computing Certifications in 2025",
    excerpt:
      "Which certifications are worth your time and help get you top tech jobs?",
    content: `
# Top Cloud Certs for 2025

- AWS Certified Solutions Architect
- Azure Fundamentals
- Google Professional Cloud Architect

Certs boost your profile, especially for career switchers.  
Pick one platform and go DEEP.
    `,
    authorUsername: "sarahtech",
    categorySlug: "cloud",
    tags: ["aws", "azure", "cloud", "certifications"],
    coverImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
    featured: false,
    views: 1840,
    publishedDays: 7,
  },
  {
    title: "React vs Vue vs Angular: Choosing the Right Frontend Framework",
    excerpt:
      "Compare the strengths and weaknesses of these three popular JavaScript frameworks.",
    content: `
# React vs Vue vs Angular

- **React:** Massive ecosystem, flexible, requires tooling
- **Vue:** Simpler learning curve, great docs, smaller apps
- **Angular:** All-in-one, enterprise-scale, steeper initial learning

My pick? Learn React first, but try all three on real projects!
    `,
    authorUsername: "johndoe",
    categorySlug: "frontend",
    tags: ["react", "vue", "angular", "frontend"],
    coverImage:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&h=400&fit=crop",
    featured: true,
    views: 4220,
    publishedDays: 5,
  },
  {
    title: "How AI is Changing Content Creation",
    excerpt:
      "AI writers and tools are evolving rapidly. What does this mean for creators and readers?",
    content: `
# How AI is Changing Content Creation

AI-powered tools draft, edit, and even design. Journalists, marketers, and bloggers save time, but authenticity and curation are even MORE important in the world of machine-generated text.
    `,
    authorUsername: "mikebiz",
    categorySlug: "ai",
    tags: ["ai", "content-creation", "writing"],
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    featured: false,
    views: 1690,
    publishedDays: 8,
  },
  {
    title: "Best Workouts for Mental Health in 2025",
    excerpt: "Move your body to improve your mind. Expert tips.",
    content: `
# Best Workouts for Mental Health (2025)

- Daily walks in nature
- HIIT for endorphins
- Yoga and breathwork

Remember: Fitness is for brains too!
    `,
    authorUsername: "emmalife",
    categorySlug: "mental-health",
    tags: ["mental-health", "exercise", "well-being"],
    coverImage:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=400&fit=crop",
    featured: false,
    views: 1100,
    publishedDays: 6,
  },
  {
    title: "7 Habits of Highly Effective Entrepreneurs",
    excerpt: "What separates great founders from the rest? These core habits.",
    content: `
# 7 Habits of Highly Effective Entrepreneurs

- Obsess over customers
- Learn from failure fast
- Stay lean, iterate often
- Build strong teams
- Control cash burn
- Network relentlessly
- Never stop learning!
    `,
    authorUsername: "mikebiz",
    categorySlug: "leadership",
    tags: ["entrepreneurship", "leadership", "business"],
    coverImage:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=400&fit=crop",
    featured: false,
    views: 2440,
    publishedDays: 13,
  },
  // ----------- 11 More Sample Posts - Each has unique real content below ----------
  {
    title: "Gaming as a Career: How to Get Started",
    excerpt:
      "Is professional gaming a dream or a viable career path? Here's what you need to know.",
    content: `
# Gaming as a Career

Streaming, esports, QA, game development—all valid paths if you love games. But remember: only a tiny fraction become pro players. Most succeed behind the scenes!
    `,
    authorUsername: "sarahtech",
    categorySlug: "gaming",
    tags: ["gaming", "career", "esports", "streaming", "tag0"],
    coverImage: "https://picsum.photos/seed/sample0/800/400",
    featured: true,
    views: 2200,
    publishedDays: 8,
  },
  {
    title: "The Power of Music for Productivity",
    excerpt: "Unlock higher focus and creativity with the right playlist.",
    content: `
# The Power of Music for Productivity

Classical, ambient, or lo-fi beats? Noise can help you enter "flow." Test different genres during deep work—one size doesn't fit all!
    `,
    authorUsername: "johndoe",
    categorySlug: "music",
    tags: ["music", "productivity", "focus", "work", "tag1"],
    coverImage: "https://picsum.photos/seed/sample1/800/400",
    featured: false,
    views: 870,
    publishedDays: 5,
  },
  {
    title: "Urban Gardening: Grow Green in Small Spaces",
    excerpt: "No backyard? No problem. How to start your own home garden.",
    content: `
# Urban Gardening for Beginners

Learn to grow herbs, leafy greens, and flowers—even on your apartment balcony! Hydroponics and vertical gardens are easier than you think.
    `,
    authorUsername: "mikebiz",
    categorySlug: "gardening",
    tags: ["gardening", "urban", "plants", "diy", "tag2"],
    coverImage: "https://picsum.photos/seed/sample2/800/400",
    featured: false,
    views: 1110,
    publishedDays: 20,
  },
  {
    title: "How Travel Changed My Life",
    excerpt:
      "Traveling the world built my resilience, perspective, and empathy.",
    content: `
# How Travel Changed My Life

Travel isn't just about places—it's about people and transformation. My best lessons came from challenges far from home.
    `,
    authorUsername: "emmalife",
    categorySlug: "travel",
    tags: ["travel", "life", "personal-growth", "culture", "tag3"],
    coverImage: "https://picsum.photos/seed/sample3/800/400",
    featured: false,
    views: 2300,
    publishedDays: 17,
  },
  {
    title: "The Art of Personal Development",
    excerpt: "What does it really mean to work on yourself in 2025?",
    content: `
# The Art of Personal Development

Self-improvement isn't about hacks—it's mindset. Set goals, learn new things, and step out of your comfort zone often.
    `,
    authorUsername: "sarahtech",
    categorySlug: "personal-development",
    tags: ["self-improvement", "lifelong-learning", "habits", "tag4"],
    coverImage: "https://picsum.photos/seed/sample4/800/400",
    featured: true,
    views: 4100,
    publishedDays: 6,
  },
  {
    title: "DIY Home Decor Makeover on a Budget",
    excerpt: "Get a Pinterest-worthy home with these affordable decor hacks.",
    content: `
# DIY Home Decor: Affordable Makeover

Thrift stores, paint, and creativity = massive home upgrade. Transform any room for under $100!
    `,
    authorUsername: "johndoe",
    categorySlug: "home",
    tags: ["diy", "home", "decor", "budget", "tag5"],
    coverImage: "https://picsum.photos/seed/sample5/800/400",
    featured: false,
    views: 750,
    publishedDays: 4,
  },
  {
    title: "Rise of Serverless in Cloud Architectures",
    excerpt:
      "Are serverless platforms the future of scalable apps? Explore the benefits and tradeoffs.",
    content: `
# Serverless: Pros and Cons

Pay for what you use, scale automatically, deploy faster. But: debugging and vendor lock-in can sting.
    `,
    authorUsername: "mikebiz",
    categorySlug: "cloud",
    tags: ["cloud", "serverless", "lambda", "devops", "tag6"],
    coverImage: "https://picsum.photos/seed/sample6/800/400",
    featured: false,
    views: 1925,
    publishedDays: 7,
  },
  {
    title: "Startup Branding: From Zero to Hero",
    excerpt:
      "Lessons from fastest-growing companies on building buzz and loyalty.",
    content: `
# Startup Branding

Clear mission, crisp visuals, and relentless user empathy. Brands are built on trust—every tweet and support email matters!
    `,
    authorUsername: "emmalife",
    categorySlug: "startup",
    tags: ["branding", "startup", "marketing", "product", "tag7"],
    coverImage: "https://picsum.photos/seed/sample7/800/400",
    featured: false,
    views: 1180,
    publishedDays: 11,
  },
  {
    title: "Music Production for Beginners",
    excerpt: "Get started with the basics of digital music creation.",
    content: `
# Intro to Music Production

All you need: a laptop, a DAW, and the confidence to experiment. Share your sounds, no matter your skill!
    `,
    authorUsername: "sarahtech",
    categorySlug: "music",
    tags: ["music-production", "beginner", "audio", "creativity", "tag8"],
    coverImage: "https://picsum.photos/seed/sample8/800/400",
    featured: true,
    views: 2475,
    publishedDays: 9,
  },
  {
    title: "Intro to Leadership for New Managers",
    excerpt: "First-time manager? Here’s what you REALLY need to know.",
    content: `
# Intro to Leadership

Empower your team, ask questions, admit mistakes openly. Lead with curiosity, not ego.
    `,
    authorUsername: "mikebiz",
    categorySlug: "leadership",
    tags: ["leadership", "new-manager", "career", "work", "tag9"],
    coverImage: "https://picsum.photos/seed/sample9/800/400",
    featured: false,
    views: 970,
    publishedDays: 16,
  },
  {
    title: "Travel Photography: Capture the World",
    excerpt: "Simple techniques for stunning vacation photos.",
    content: `
# Travel Photography

Use sunrise/sunset light, focus on people and details, pack light, and shoot with intention.
    `,
    authorUsername: "emmalife",
    categorySlug: "travel",
    tags: ["travel", "photography", "adventure", "creativity", "tag10"],
    coverImage: "https://picsum.photos/seed/sample10/800/400",
    featured: false,
    views: 1230,
    publishedDays: 18,
  },
];

// 💬 COMMENTS DATA
const commentsData = [
  {
    content:
      "Great article! The TypeScript examples are really helpful. I've been hesitant to switch from plain React, but this convinced me to give it a try.",
    authorUsername: "sarahtech",
    postTitle: "Building Modern Web Applications with React and TypeScript",
  },
  {
    content:
      "As someone working in healthcare tech, this article perfectly captures the current state and potential of AI in medicine. The diagnostic imaging section is particularly insightful.",
    authorUsername: "johndoe",
    postTitle: "The Future of Artificial Intelligence in Healthcare",
  },
  {
    content:
      "The IPO journey is definitely not for everyone, but this guide provides a realistic roadmap. The emphasis on customer obsession really resonates with me.",
    authorUsername: "emmalife",
    postTitle: "From Idea to IPO: A Startup Journey Guide",
  },
  {
    content:
      "I've been struggling with digital overwhelm lately. The 5-4-3-2-1 grounding exercise sounds really practical. Going to try this today!",
    authorUsername: "mikebiz",
    postTitle: "Mindfulness in the Digital Age: Finding Balance",
  },
  {
    content:
      "Great article! The TypeScript examples are really helpful. I've been hesitant to switch from plain React, but this convinced me to give it a try.",
    authorUsername: "sarahtech",
    postTitle: "Building Modern Web Applications with React and TypeScript",
  },
  {
    content:
      "As someone working in healthcare tech, this article perfectly captures the current state and potential of AI in medicine. The diagnostic imaging section is particularly insightful.",
    authorUsername: "johndoe",
    postTitle: "The Future of Artificial Intelligence in Healthcare",
  },
  {
    content:
      "The IPO journey is definitely not for everyone, but this guide provides a realistic roadmap. The emphasis on customer obsession really resonates with me.",
    authorUsername: "emmalife",
    postTitle: "From Idea to IPO: A Startup Journey Guide",
  },
  {
    content:
      "I've been struggling with digital overwhelm lately. The 5-4-3-2-1 grounding exercise sounds really practical. Going to try this today!",
    authorUsername: "mikebiz",
    postTitle: "Essential Tips for Remote Work Productivity",
  },

  // NEW COMMENTS - Tech/Programming
  {
    content:
      "This is exactly what I needed! Just started learning React and the TypeScript integration was confusing me. The step-by-step examples make it so much clearer. Bookmarking this for reference!",
    authorUsername: "lucytech",
    postTitle: "Building Modern Web Applications with React and TypeScript",
  },
  {
    content:
      "Been using Angular for years and always wondered about React. Your comparison is spot on - React's ecosystem is indeed massive but the flexibility is worth the learning curve.",
    authorUsername: "danieldata",
    postTitle: "React vs Vue vs Angular: Choosing the Right Frontend Framework",
  },
  {
    content:
      "The AWS certification really did change my career trajectory. Great breakdown of which certs to prioritize. I'd add that hands-on practice is just as important as studying.",
    authorUsername: "calebcode",
    postTitle: "Top Cloud Computing Certifications in 2025",
  },
  {
    content:
      "As a backend dev, I sometimes forget about these CSS tricks. The grid layout examples are game-changers for responsive design. Thanks for the refresher!",
    authorUsername: "hazelcode",
    postTitle: "10 CSS Tricks Every Frontend Developer Should Know",
  },
  {
    content:
      "Self-taught programmer here! This article hit home. The struggle is real but so rewarding. Community support makes all the difference - thanks for the encouragement.",
    authorUsername: "jaxonai",
    postTitle: "Self-Taught Programming: Can Anyone Learn to Code?",
  },

  // Business/Startup Comments
  {
    content:
      "Wow, this brings back memories of our Series A. The part about product-market fit is crucial - we pivoted twice before getting it right. Patience and persistence are key!",
    authorUsername: "carolbiz",
    postTitle: "From Idea to IPO: A Startup Journey Guide",
  },
  {
    content:
      "Currently bootstrapping my SaaS and this validation framework is gold! The 30-day timeline seems aggressive but your MVP approach makes it doable. Starting week 1 today.",
    authorUsername: "violetsales",
    postTitle: "Bootstrap Your SaaS: Launch in 30 Days",
  },
  {
    content:
      "The 7 habits list is solid, especially 'network relentlessly.' I'd add: document everything and automate repetitive tasks. Time is your most precious resource as a founder.",
    authorUsername: "reidgrowth",
    postTitle: "7 Habits of Highly Effective Entrepreneurs",
  },
  {
    content:
      "Brand building from day one is so underrated. We spent our first year just on product and had to play catch-up on marketing. Wish I'd read this earlier!",
    authorUsername: "hannahlaw",
    postTitle: "Startup Branding: From Zero to Hero",
  },
  {
    content:
      "The IPO statistics are eye-opening. Less than 1% make it that far? Makes me appreciate the journey even more. Thanks for keeping it real about the challenges.",
    authorUsername: "lunasocial",
    postTitle: "From Idea to IPO: A Startup Journey Guide",
  },

  // AI/Tech Innovation Comments
  {
    content:
      "Working in medical imaging, I can confirm AI is already transforming diagnostics. The accuracy improvements are remarkable, but human oversight remains critical. Great balanced take!",
    authorUsername: "bellahealth",
    postTitle: "The Future of Artificial Intelligence in Healthcare",
  },
  {
    content:
      "The ethics discussion around AI in content creation is so important. As creators, we need to find the balance between efficiency and authenticity. Thanks for addressing this!",
    authorUsername: "bentechwriter",
    postTitle: "How AI is Changing Content Creation",
  },
  {
    content:
      "Data scientist here - the creativity angle is everything! The best insights come from asking the right questions, not just crunching numbers. Storytelling skills are just as important as Python skills.",
    authorUsername: "asherdata",
    postTitle: "Why Creativity Matters in Data Science",
  },
  {
    content:
      "Machine learning models are only as good as the data we feed them. Your point about bias in training data is crucial - we need more diverse datasets and inclusive teams.",
    authorUsername: "sarahtech",
    postTitle: "The Future of Artificial Intelligence in Healthcare",
  },

  // Lifestyle/Wellness Comments
  {
    content:
      "The remote work tips are life-changing! I've been working from home for 2 years and still struggle with boundaries. The dedicated workspace idea is game-changing.",
    authorUsername: "avayoga",
    postTitle: "Essential Tips for Remote Work Productivity",
  },
  {
    content:
      "As a fitness coach, I can't stress enough how true this is. Exercise isn't just for physical health - it's medication for the mind. The HIIT recommendation is spot on!",
    authorUsername: "ryanfit",
    postTitle: "Best Workouts for Mental Health in 2025",
  },
  {
    content:
      "Mindfulness changed my life completely. Started with just 5 minutes a day and now it's a non-negotiable part of my routine. The apps mentioned are fantastic for beginners!",
    authorUsername: "jessicapsy",
    postTitle: "Introduction to Mindfulness Meditation for Beginners",
  },
  {
    content:
      "The travel photography tips are amazing! Just got back from Iceland and wish I'd read this before. The golden hour advice alone would have improved half my shots.",
    authorUsername: "zoephoto",
    postTitle: "Travel Photography: Capture the World",
  },
  {
    content:
      "Mental health in the workplace is finally getting the attention it deserves. The statistics are alarming but initiatives like these give me hope. Thanks for sharing!",
    authorUsername: "auroraskills",
    postTitle: "Best Workouts for Mental Health in 2025",
  },

  // Creative/Design Comments
  {
    content:
      "The NFT space is so polarizing but your balanced approach is refreshing. As a digital artist, I appreciate the honest discussion about pros and cons. Market volatility is real!",
    authorUsername: "emilyarts",
    postTitle: "Exploring the World of NFTs for Artists",
  },
  {
    content:
      "UI/UX designer here - these design principles are timeless! The user-centered approach should be every designer's north star. Saving this for my team meeting.",
    authorUsername: "brandonui",
    postTitle: "10 CSS Tricks Every Frontend Developer Should Know",
  },
  {
    content:
      "Music production has become so accessible! Logic Pro and these techniques transformed my bedroom into a studio. The creative process you describe is exactly how I work.",
    authorUsername: "finnmusic",
    postTitle: "Music Production for Beginners",
  },
  {
    content:
      "Brand identity is everything! Working with startups, I see too many skip this step. Your checklist is comprehensive - every founder should read this before launch.",
    authorUsername: "rubydesign",
    postTitle: "Startup Branding: From Zero to Hero",
  },

  // Finance/Career Comments
  {
    content:
      "Gen Z investor here! This guide breaks down investing without the intimidation factor. Dollar-cost averaging has been a game-changer for my portfolio. Keep it simple!",
    authorUsername: "liamcrypto",
    postTitle: "Investing Basics for Gen Z",
  },
  {
    content:
      "Crypto volatility is intense but DeFi protocols are fascinating. Your risk management advice is solid - never invest what you can't afford to lose. HODL responsibly!",
    authorUsername: "tomfinance",
    postTitle: "Investing Basics for Gen Z",
  },
  {
    content:
      "Remote job hunting is tough but your portfolio advice is gold. Finally landed my dream job following similar strategies. The async communication skills section is underrated!",
    authorUsername: "yukitech",
    postTitle: "How to Land Your First Remote Developer Job",
  },
  {
    content:
      "Leadership transition from IC to manager is brutal! Your advice about admitting mistakes openly resonates. Vulnerability builds trust faster than perfection ever will.",
    authorUsername: "noahseo",
    postTitle: "Intro to Leadership for New Managers",
  },

  // Travel/Photography Comments
  {
    content:
      "Travel changed everything for me too! The perspective shift is real. Backpacked through Southeast Asia last year and came back a completely different person. Wanderlust is calling again!",
    authorUsername: "luketravel",
    postTitle: "How Travel Changed My Life",
  },
  {
    content:
      "Smartphone photography has come so far! These iPhone 15 Pro shots rival my DSLR. The editing app recommendations are perfect - Lightroom Mobile is incredibly powerful.",
    authorUsername: "mayafilms",
    postTitle: "Photography with Your Smartphone: Tips & Tricks",
  },
  {
    content:
      "Urban gardening saved my sanity during lockdown! Balcony herbs turned into a full vertical garden. The hydroponic setup you mentioned is next on my list. Green thumb goals!",
    authorUsername: "ameliacook",
    postTitle: "Urban Gardening: Grow Green in Small Spaces",
  },

  // Productivity/Skills Comments
  {
    content:
      "The psychology behind procrastination is fascinating! As a therapist, I see how cognitive behavioral techniques really work. The timeboxing method changed my practice completely.",
    authorUsername: "jessicapsy",
    postTitle: "The Science of Focus: How to Beat Procrastination",
  },
  {
    content:
      "Team building in remote settings is challenging but these activities work! We tried the virtual escape room and it was a hit. Building authentic connections digitally is an art.",
    authorUsername: "lunasocial",
    postTitle: "Remote Team Building Activities That Actually Work",
  },
  {
    content:
      "Personal development isn't about hacks - exactly! Consistency beats intensity every time. The growth mindset shift you mention is the foundation for everything else.",
    authorUsername: "auroraskills",
    postTitle: "The Art of Personal Development",
  },
  {
    content:
      "DIY home makeover for $100? Challenge accepted! The thrift store finds you mentioned are treasure hunting gold. Pinterest aesthetic on a budget is totally doable.",
    authorUsername: "ameliacook",
    postTitle: "DIY Home Decor Makeover on a Budget",
  },

  // Tech/Industry Comments
  {
    content:
      "Serverless architecture is the future but the debugging challenges are real! Lambda cold starts still frustrate me. Great breakdown of the tradeoffs - helps with architecture decisions.",
    authorUsername: "alexcode",
    postTitle: "Rise of Serverless in Cloud Architectures",
  },
  {
    content:
      "Gaming industry insights are valuable! The behind-the-scenes career paths often get overlooked. QA testing might not be glamorous but it's essential and a great entry point.",
    authorUsername: "jacobgame",
    postTitle: "Gaming as a Career: How to Get Started",
  },
  {
    content:
      "Podcasting equipment has gotten so affordable! Started with a Blue Yeti and free editing software. Six months later, hit 1K downloads. Your audience-building tips are pure gold.",
    authorUsername: "finnmusic",
    postTitle: "Podcasting for Beginners: Start Your Show",
  },

  // Short Appreciation Comments
  {
    content:
      "Bookmarked! This is exactly what I needed for my project. Thanks for sharing!",
    authorUsername: "yukitech",
    postTitle: "Building Modern Web Applications with React and TypeScript",
  },
  {
    content:
      "Mind = blown 🤯 Never thought about it this way. Going to implement these ideas immediately.",
    authorUsername: "brandonui",
    postTitle: "10 CSS Tricks Every Frontend Developer Should Know",
  },
  {
    content:
      "So practical! Finally, advice that actually works in the real world. Much appreciated.",
    authorUsername: "reidgrowth",
    postTitle: "Essential Tips for Remote Work Productivity",
  },
  {
    content:
      "This article is pure gold! Sharing with my entire team. Thank you for the insights!",
    authorUsername: "violetsales",
    postTitle: "7 Habits of Highly Effective Entrepreneurs",
  },
  {
    content:
      "Game changer! Can't wait to try these techniques. Your examples are super clear.",
    authorUsername: "danieldata",
    postTitle: "The Science of Focus: How to Beat Procrastination",
  },

  // Detailed Technical Comments
  {
    content:
      "The TypeScript interface examples are perfect! One suggestion: you might want to add a section on generic types and utility types like Partial<T> and Pick<T>. They're incredibly useful for complex React props.",
    authorUsername: "calebcode",
    postTitle: "Building Modern Web Applications with React and TypeScript",
  },
  {
    content:
      "Love the serverless architecture breakdown! We recently migrated our API to AWS Lambda and saw 60% cost reduction. The cold start issue you mention is real though - we solved it with provisioned concurrency for critical functions.",
    authorUsername: "asherdata",
    postTitle: "Rise of Serverless in Cloud Architectures",
  },
  {
    content:
      "The healthcare AI applications are expanding rapidly. In radiology, we're seeing 95%+ accuracy in tumor detection. The key is having radiologists in the loop for validation - AI augments, doesn't replace human expertise.",
    authorUsername: "bellahealth",
    postTitle: "The Future of Artificial Intelligence in Healthcare",
  },

  // Discussion/Question Comments
  {
    content:
      "Great post! Quick question: have you tried Svelte as an alternative to React? Curious about your thoughts on the compile-time optimizations vs runtime virtual DOM.",
    authorUsername: "hazelcode",
    postTitle: "React vs Vue vs Angular: Choosing the Right Frontend Framework",
  },
  {
    content:
      "Interesting perspective on NFTs! What's your take on the environmental impact concerns? Some blockchains are moving to proof-of-stake but adoption seems slow.",
    authorUsername: "ethangreen",
    postTitle: "Exploring the World of NFTs for Artists",
  },
  {
    content:
      "The remote work productivity tips are solid. Do you have recommendations for managing timezone differences? My team spans 4 continents and async communication is challenging.",
    authorUsername: "lunasocial",
    postTitle: "Essential Tips for Remote Work Productivity",
  },

  // Personal Story Comments
  {
    content:
      "This hits close to home. Started my startup journey 3 years ago, went through 2 pivots, and finally found product-market fit last month. The roller coaster is real but worth every sleepless night!",
    authorUsername: "carolbiz",
    postTitle: "From Idea to IPO: A Startup Journey Guide",
  },
  {
    content:
      "Travel photography saved my creativity! Was stuck in a design rut until I took a solo trip to Japan. The different perspectives and compositions completely refreshed my artistic vision. Now I travel specifically to shoot.",
    authorUsername: "rubydesign",
    postTitle: "Photography with Your Smartphone: Tips & Tricks",
  },
  {
    content:
      "Mindfulness meditation literally changed my life. Started after a burnout episode 2 years ago. Now I'm a certified instructor helping other tech workers manage stress. The ripple effects are incredible.",
    authorUsername: "avayoga",
    postTitle: "Introduction to Mindfulness Meditation for Beginners",
  },

  // Expert Opinion Comments
  {
    content:
      "As someone who's led engineering teams for 15+ years, the leadership advice here is spot-on. The transition from individual contributor to manager is the hardest career move. Emotional intelligence becomes more important than technical skills.",
    authorUsername: "johndoe",
    postTitle: "Intro to Leadership for New Managers",
  },
  {
    content:
      "Fintech professional here. The DeFi revolution is real but regulation is coming. Smart contracts are powerful but code audits are crucial. One bug can cost millions - we've seen it happen repeatedly.",
    authorUsername: "hannahlaw",
    postTitle: "Investing Basics for Gen Z",
  },
  {
    content:
      "Fitness industry veteran - 20 years experience. The mental health benefits of exercise are scientifically proven but still undervalued. Movement is medicine, and consistency beats intensity every single time.",
    authorUsername: "ryanfit",
    postTitle: "Best Workouts for Mental Health in 2025",
  },

  // Constructive Criticism/Additional Insights
  {
    content:
      "Great article overall! One addition: you might want to mention React Native for mobile development. The shared codebase benefits are huge for startups with limited resources. Just deployed our first RN app last month.",
    authorUsername: "jacobgame",
    postTitle: "Building Modern Web Applications with React and TypeScript",
  },
  {
    content:
      "Solid business advice but I'd add emphasis on cash flow management. Revenue is vanity, profit is sanity, but cash flow is reality. Too many startups fail despite being profitable on paper.",
    authorUsername: "tomfinance",
    postTitle: "7 Habits of Highly Effective Entrepreneurs",
  },
  {
    content:
      "The AI healthcare applications are exciting but we need to address the bias issue. Training data often underrepresents minority populations, leading to worse outcomes for those groups. Equity must be built in from day one.",
    authorUsername: "mariateach",
    postTitle: "The Future of Artificial Intelligence in Healthcare",
  },

  // International Perspective Comments
  {
    content:
      "Writing from Germany - the startup ecosystem here is quite different! Government support for innovation is strong but the risk-taking culture is still developing. Your IPO timeline might be 2-3x longer in Europe.",
    authorUsername: "omarbuilds",
    postTitle: "From Idea to IPO: A Startup Journey Guide",
  },
  {
    content:
      "Perspective from Asia: remote work adoption varies wildly by country. Japan and Korea still heavily favor in-person, while Singapore and Australia are fully remote-friendly. Cultural context matters!",
    authorUsername: "yukitech",
    postTitle: "Essential Tips for Remote Work Productivity",
  },

  // Beginner Questions
  {
    content:
      "Complete beginner here - is TypeScript worth learning if I'm just starting with JavaScript? Or should I master vanilla JS first? The syntax looks intimidating but everyone seems to love it.",
    authorUsername: "islabooks",
    postTitle: "Building Modern Web Applications with React and TypeScript",
  },
  {
    content:
      "New to investing and this is overwhelming but helpful! Should I start with index funds or individual stocks? The crypto section is interesting but seems super risky for a beginner.",
    authorUsername: "chloemusic",
    postTitle: "Investing Basics for Gen Z",
  },
  {
    content:
      "First-time manager, feeling the impostor syndrome hard! The advice about admitting mistakes is scary but makes sense. How do you balance being vulnerable with maintaining authority?",
    authorUsername: "bentechwriter",
    postTitle: "Intro to Leadership for New Managers",
  },
];

// Helper function to hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

// 🌱 MAIN SEED FUNCTION
const seed = async () => {
  try {
    console.log("🚀 Starting seed process...");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
    await Category.deleteMany();

    // 1. Create Categories
    console.log("📂 Creating categories...");
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create category lookup map
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // 2. Create Users WITH hashed passwords
    console.log("👥 Creating users...");
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password),
      }))
    );

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create user lookup map
    const userMap = {};
    createdUsers.forEach((user) => {
      userMap[user.username] = user;
    });

    // 🔗 NEW: Create follower/following relationships
    console.log("🔗 Creating follow relationships...");
    let relationshipCount = 0;

    for (const relationship of followRelationships) {
      const followerUser = userMap[relationship.follower];
      const followingUser = userMap[relationship.following];

      if (followerUser && followingUser) {
        // Add to follower's following list
        await User.findByIdAndUpdate(followerUser._id, {
          $addToSet: { following: followingUser._id },
        });

        // Add to following user's followers list
        await User.findByIdAndUpdate(followingUser._id, {
          $addToSet: { followers: followerUser._id },
        });

        relationshipCount++;
      }
    }

    console.log(`✅ Created ${relationshipCount} follow relationships`);

    // 3. Create Posts (unchanged)
    console.log("📝 Creating posts...");
    const postsToCreate = postsData.map((postData) => {
      const author = userMap[postData.authorUsername];
      const categoryId = categoryMap[postData.categorySlug];

      // REMOVE publishedDays after use!
      const { publishedDays, ...rest } = postData;
      return {
        ...rest,
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        author: author._id,
        categories: [categoryId],
        tags: postData.tags,
        coverImage: postData.coverImage,
        status: "published",
        featured: postData.featured || false,
        views: postData.views || Math.floor(Math.random() * 500),
        publishedAt: new Date(
          Date.now() - (publishedDays || 0) * 24 * 60 * 60 * 1000
        ),
        seoTitle: postData.title,
        seoDescription: postData.excerpt,
      };
    });

    const createdPosts = await Post.insertMany(postsToCreate);
    console.log(`✅ Created ${createdPosts.length} posts`);

    // 4. Add some likes to posts (unchanged)
    console.log("❤️ Adding likes to posts...");
    for (const post of createdPosts) {
      const numLikes = Math.floor(Math.random() * 5) + 1;
      const likers = createdUsers.slice(0, numLikes);

      post.likes = likers.map((user) => ({
        user: user._id,
        createdAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ),
      }));

      await post.save();
    }

    // 5. Create Comments (unchanged)
    console.log("💬 Creating comments...");
    const commentsToCreate = [];

    for (const commentData of commentsData) {
      const post = createdPosts.find((p) => p.title === commentData.postTitle);
      const author = userMap[commentData.authorUsername];

      if (post && author) {
        commentsToCreate.push({
          content: commentData.content,
          author: author._id,
          post: post._id,
          status: "active",
          createdAt: new Date(
            Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000
          ),
        });
      }
    }

    // Add random comments
    for (let i = 0; i < 10; i++) {
      const randomPost =
        createdPosts[Math.floor(Math.random() * createdPosts.length)];
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];

      const randomComments = [
        "Thanks for sharing this valuable information!",
        "This really helped me understand the topic better.",
        "Great insights! I'll definitely implement some of these ideas.",
        "Really well-written article. Looking forward to more content like this.",
        "This is exactly what I was looking for. Much appreciated!",
      ];

      commentsToCreate.push({
        content:
          randomComments[Math.floor(Math.random() * randomComments.length)],
        author: randomUser._id,
        post: randomPost._id,
        status: "active",
        createdAt: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ),
      });
    }

    const createdComments = await Comment.insertMany(commentsToCreate);
    console.log(`✅ Created ${createdComments.length} comments`);

    // 6. Add likes to comments (unchanged)
    console.log("👍 Adding likes to comments...");
    for (const comment of createdComments) {
      const numLikes = Math.floor(Math.random() * 3);
      if (numLikes > 0) {
        const likers = createdUsers.slice(0, numLikes);
        comment.likes = likers.map((user) => ({
          user: user._id,
          createdAt: new Date(
            Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000
          ),
        }));
        await comment.save();
      }
    }

    // 🆕 Display follower statistics
    console.log("📊 Generating user statistics...");
    const userStats = await User.aggregate([
      {
        $project: {
          username: 1,
          followersCount: { $size: "$followers" },
          followingCount: { $size: "$following" },
        },
      },
      { $sort: { followersCount: -1 } },
    ]);

    // 7. Enhanced Summary
    console.log("\n🎉 Seed completed successfully!");
    console.log("==========================================");
    console.log(`📂 Categories: ${createdCategories.length}`);
    console.log(
      `   - Parent categories: ${
        createdCategories.filter((c) => c.isParent).length
      }`
    );
    console.log(
      `   - Child categories: ${
        createdCategories.filter((c) => !c.isParent).length
      }`
    );
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`🔗 Follow relationships: ${relationshipCount}`);
    console.log(`📝 Posts: ${createdPosts.length}`);
    console.log(`💬 Comments: ${createdComments.length}`);

    console.log("\n📊 Top users by followers:");
    userStats.slice(0, 5).forEach((user) => {
      console.log(
        `   ${user.username}: ${user.followersCount} followers, ${user.followingCount} following`
      );
    });

    console.log("\n🔧 Login credentials:");
    console.log("Admin: john@example.com / Password123");
    console.log("Users: sarah@example.com / Password123");
    console.log("       mike@example.com / Password123");
    console.log("       emma@example.com / Password123");
    console.log("==========================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seed();
