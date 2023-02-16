const eventsList = [
  {
    name: "Gravity",
    route: "gravity",
    details: {
      to: "/details/gravity",
      description:
        "Are you an IT student ready to showcase your skills and prove you're the crème de la crème? Look no further, the “Gravity” competition is the perfect opportunity for you to step up and show your potential as IT specialists what you're made of!. It’s time to put your knowledge to the test and show off that brain power with an intriguing rounds.",
      img: "/icons/manager.svg",
      direction: "flex-row-reverse",
      color: "btn-warning",
      text: "text-warning",
      eventType: "general",
    },
    description:
      "Are you an IT student ready to showcase your skills and prove you're the crème de la crème? Look no further, the “Gravity” competition is the perfect opportunity for you to step up and show your potential as IT specialists what you're made of! This competition is exclusively for undergraduate and postgraduate students enrolled in BCA or MCA. It's time to put your knowledge to the test and show off that brain power with intriguing rounds. The winner takes home a cash prize and the title of the “Mr/Ms Earth” IT managers in the program. Don't miss out on this chance to make your mark in the industry and show everyone you're the one to watch.",
    img: "/src/assets/eventdetails/manager.jpg",
    rules: [
      "Solo participation.",
      "Dress up at your best with a professional look which will add on to points.",
      "Make sure you are present 10 minutes prior to the stated schedule.",
      "Participants should be available on both the days(3rd & 4th of March).",
    ],
    requirements: [
      "Participants should know the basics of OOP's.",
      "Participants should carry a laptop.",
    ],
    contacts: [
      {
        type: "Student Coordinator",
        name: "Shireesha KB",
        email: "shireeshakb.mca21@rvce.edu.in",
        phone: "+91 9880063997",
      },
    ],

    maxPoints: 10,
    maxTeamSize: 1,
    isOpenEvent: false,
  },
  {
    name: "Big Bang",
    route: "bigbang",
    details: {
      to: "/details/bigbang",
      description:
        "The art of communication is the language of leadership. So hold on to your mics and get the best version of yourself to showcase your orator skills at Exception 2023-BIG BANG",
      img: "/icons/debate.svg",
      direction: "flex-row-reverse",
      color: "btn-success",
      text: "text-success",
      eventType: "general",
    },
    description:
      "The power of sound has always been greater than the power of sense; One who wants to persuade should put his/her trust not in the right argument, but in the right word. That's all about BIG BANG. Thou who keeps his point by words and takes over the mic shall win the title THE ASTEROID.",
    img: "/src/assets/eventdetails/debate.jpg",
    rules: [
      "Solo participation.",
      "Participant should be good at communication.",
      "Every round of the event will have a definite time period which will not be altered.",
      "All the participants are required to assemble at the event venue 15 minutes prior to the stated time.",
    ],
    requirements: [
      "Participants should have knowledge about current technology and current affairs.",
    ],
    contacts: [
      {
        type: "Student Coordinator",
        name: "Krupa Arjunwadkar",
        email: "krupasa.mca21@rvce.edu.in",
        phone: "+91 9972308056",
      },
    ],

    maxPoints: 20,
    maxTeamSize: 1,
    isOpenEvent: false,
  },
  {
    name: "Gen - Geeks",
    route: "gengeeks",
    details: {
      to: "/details/gengeeks",
      description:
        "Bring your cognitive skills to the arena as Exception is back with its highly anticipated quiz. Strap in  for a crazy ride into the energetic universe of quizzing.",
      img: "/icons/quiz.svg",
      direction: "flex-row",
      color: "btn-primary",
      text: "text-primary",
      eventType: "general",
    },
    description:
      "Hola Geeks! Bring your cognitive skills to the arena as Exception is back with its highly anticipated quiz. Strap in for a crazy ride into the energetic universe of quizzing.",
    img: "/src/assets/eventdetails/quiz.jpg",
    rules: [
      "Team of 2 members.",
      "The judge's decision will be final.",
      "Malpractice will lead to disqualification.",
      "Participants are required to assemble at the event venue 15 minutes prior to the stated time.",
    ],
    requirements: ["Participants should have fair knowledge in all areas."],
    contacts: [
      {
        type: "Student Coordinator",
        name: "Bhakthi Prabhu",
        email: "bhaktiprabhu.mca21@rvce.edu.in",
        phone: "+91 8088308112",
      },
    ],

    maxPoints: 30,
    maxTeamSize: 2,
    isOpenEvent: false,
  },
  {
    name: "Zest",
    route: "zest",
    details: {
      to: "/details/zest",
      description:
        "Presenting to you an event which promotes creative ways of thinking to teach technology to common folks. Idea of this event is to project a few basics of technology through a creative medium. Zest is an event where a group of people have to think and come up with an idea to project the specific technology basics to the present crowd. The medium can be a game, video, drama, song or any creative mode. The most entertaining and creative participant wins.",
      img: "/icons/zest.svg",
      direction: "flex-row-reverse",
      color: "btn-primary",
      text: "text-primary",
      eventType: "general",
    },
    description:
      "Presenting to you an event which promotes creative ways of thinking to teach technology to common folks. Idea of this event is to project a few basics of technology through a creative medium. Zest is an event where a group of people have to think and come up with an idea to project the specific technology basics to the present crowd. The medium can be a game, video, drama, song or any creative mode. The most entertaining and creative participant wins.",
    img: "/src/assets/eventdetails/zest.jpg",
    rules: [
      "There will be two rounds.",
      "The judge's decision will be final.",
      "Time limit will be given on the day of the event.",
      "Participants to be present 10 minutes prior to the stated schedule.",
    ],
    requirements: ["Participants should have fair knowledge in all areas."],
    contacts: [
      {
        type: "Student Coordinator",
        name: "Sumanth C R",
        email: "sumanthcr.mca21@rvce.edu.in",
        phone: "+91 789263225",
      },
    ],

    maxPoints: 15,
    maxTeamSize: 2,
    isOpenEvent: false,
  },
  {
    name: "Constellation",
    route: "constellation",
    details: {
      to: "/details/constellation",
      description:
        "Ideas shouldn't be kept, something must be done about it so bring out your inner creativity and imagination into action here at Exceptions 2023 - Constellation(UI/UX designing)",
      img: "/icons/ui.svg",
      direction: "flex-row",
      color: "btn-primary",
      text: "text-primary",
      eventType: "general",
    },
    description:
      "'Ideas shouldn't be kept, something must be done about it'. So bring out your inner creativity and imagination into action here at CONSTELLATION event.",
    img: "/src/assets/eventdetails/uiux.jpg",
    rules: [
      "No elimination in any rounds. Result will be decided on the basis of cumulative scoring.",
      "Each team must consist of 2 members.",
      "Internet usage permitted only to download required resources(ex: images/software updates).",
      "Can only use open source software for all the rounds (any one of your choice).",
      "Using other technologies other than open source Softwares is strictly prohibited.",
      "Proper Schedule is to be followed.",
      "Participants shall carry their own phone and laptop chargers.",
      "Install required software prior to the event",
    ],
    requirements: [],
    contacts: [
      {
        type: "Student Coordinator",
        name: "Aishwarya Kamble",
        email: "aishwaryakk.mca21@rvce.edu.in",
        phone: "+91 7026239982",
      },
    ],

    maxPoints: 25,
    maxTeamSize: 2,
    isOpenEvent: false,
  },
  {
    name: "Nebula X",
    route: "nebulax",
    details: {
      to: "/details/nebulax",
      description:
        "Are you ready for the most anticipated event of the year? Yes, you heard it right. The biggest coding fest is knocking at the door. The Nebula X is here So, Get ready ahead of time. Brush up on your concepts, hold your morals high and count down the moments!",
      img: "/icons/coding.svg",
      direction: "flex-row",
      color: "btn-accent",
      text: "text-accent",
      eventType: "general",
    },
    description:
      "Calling all coders! Are you ready for the most anticipated event of the year? Yes, you heard it right. The biggest coding fest is knocking at the door. The Nebula X is here So, Get ready ahead of time. Brush up on your concepts, hold your morals high and count down the moments! Don't miss this opportunity. Register now",
    img: "/src/assets/eventdetails/coding.jpg",
    rules: [
      "Solo Participant",
      "Participants will be given questions/puzzles in each round.",
      "Participants need to finish the task within the given time constraint.",
      "Participants must not engage in any form of malpractice, or use any unauthorized software or tools during the event. If found, he/she will be disqualified immediately.",
      "All the participants are required to assemble at the event venue 15 minutes prior to the stated time.",
    ],
    requirements: [
      "Data Structures & Algorithms.",
      "Basic computer science concepts.",
      "Languages: C/C++, Java, Python.",
      "Participants are expected to bring their laptops, and charging cables.",
      "Tools required: Eclipse, VS Code or any Editor/IDE the participant is comfortable with.",
    ],
    contacts: [
      {
        type: "Student Coordinator",
        name: "Dashline Jove D Souza",
        email: "dashlineds.mca21@rvce.edu.in",
        phone: "+91 8762127308",
      },
    ],

    maxPoints: 22,
    maxTeamSize: 1,
    isOpenEvent: false,
  },
  {
    name: "Strike Force",
    route: "strikeforce",
    details: {
      to: "/details/strikeforce",
      description:
        "Join us for an exciting gaming event featuring the popular first-person shooter game,Valorant. Compete against other players in intense, fast-paced matches and show off your skills on the battlefield. With a prize pool up for grabs, the competition will be fierce, but the thrill of victory will make it all worth it",
      img: "/icons/gaming.svg",
      direction: "flex-row-reverse",
      color: "btn-warning",
      text: "text-warning",
      eventType: "open",
    },
    description:
      "Join us for an exciting gaming event featuring the popular first-person shooter game, Valorant. Compete against other players in intense, fast-paced matches and show off your skills on the battlefield. With a prize pool up for grabs, the competition will be fierce, but the thrill of victory will make it all worth it. Don't miss out on the chance to prove yourself as a top player in the Valorant community. Register now and get ready to frag!",
    img: "/src/assets/eventdetails/gaming.jpg",
    rules: [
      "All games will be played on official Valorant servers to maintain authenticity.",
      "Games will be played with the default settings for competition. If a game is played with non-default settings, the match will be replayed with corrections.",
      "Games will be played on the current competitive map pool. Map pick will be contingent",
      "On who wins a coin flip. CT/T side will also be contingent on a separate coinflip.",
    ],
    requirements: [
      "Participants should have a steam account",
      "Participants should bring their own accessories (Keyboards, Mouse, Earphones)",
    ],
    contacts: [
      {
        type: "Student Coordinator",
        name: "Sohan Gowda C",
        email: "sohangowdac.mca21@rvce.edu.in",
        phone: "+91 9380023145",
      },
    ],

    maxPoints: 30,
    maxTeamSize: 4,
    isOpenEvent: true,
  },
  {
    name: "Infinity & Beyond",
    route: "infinity&beyond",
    details: {
      to: "/details/infinity&beyond",
      description:
        "Calling all tech wizards and IoT enthusiasts! Get ready to EXCEPTION-ally amaze us with your innovative ideas! Because the one of a kind 'IOT to infinity and beyond!' event is waiting for you to shine BEYOND beliefs. Submit your entries now and let's see what you've got!",
      img: "/icons/iot.svg",
      direction: "flex-row-reverse",
      color: "btn-accent",
      text: "text-accent",
      eventType: "open",
    },
    description:
      "Calling all tech-savvy, innovation-loving, and prize-hunting students! Are you ready to show off your skills and prove you're the best in the game? Well, buckle up because we're hosting an IoT competition and it's time to put your knowledge to the test! This is your chance to let your creativity run wild and come up with some mind-blowing solutions using IoT technology. Trust us, this is not an average boring competition, we're talking about cash prizes, recognition, and the opportunity to make a real impact in the world of tech. So, what are you waiting for? Submit your entries and let's see if you got what it takes to be called “IoT's Orbital Overlord”!",
    img: "/src/assets/eventdetails/iot.jpg",
    rules: [
      "Team should consist of 2 to maximum 3 participants.",
      "Team must be present 20 minutes prior to the scheduled event time for reporting.",
      "A list of available IOT devices will be provided during registration and students are also allowed to bring their own devices that are not present in the list.",
      "Mandatory IOT Component disclosure will be provided online which should be accepted and a Refundable amount of Rs. 1000/- is to be paid that will be withheld in case of component damage.",
      "Raspberry pi’s provided should be returned as it is, and SD card exchanging will result in team disqualification.",
      "Internet services will be provided where contestants are allowed to search and find solutions.",
      "Participants are supposed to bring their own laptops and charging cords.",
      "All solutions must be created during the competition and cannot have been previously developed.",
      "Participants are expected to act ethically and refrain from any illegal or unethical behavior such as hacking or cheating.",
      "Team members should inform one of the organizers before leaving the venue, failure to do so will result in disqualification of the entire team.",
    ],
    requirements: [],
    contacts: [
      {
        type: "Student Coordinator",
        name: "Prajwal K",
        email: "prajwalk.mca21@rvce.edu.in",
        phone: "+91 8105830328",
      },
    ],

    maxPoints: 33,
    maxTeamSize: 2,
    isOpenEvent: true,
  },
  {
    id: 11,
    name: "SOLVEATHON",
    route: "solveathon",
    details: {
      to: "/details/solveathon",
      description: `Solve-a-thon is a solution event focused on building an AI/ML and
              vision based android application, where enrolled teams will get to
              solve real time problems that could be planet changing tech. It is
              an opportunity for students to showcase their skills, learn new
              technologies and potentially develop a project into a product.`,
      img: "/icons/solveathon.svg",
      direction: "flex-row-reverse",
      color: "btn-primary",
      text: "text-warning",
      eventType: "open",
    },
    description:
      "Solve-a-thon is a solution event focused on building an AI/ML and vision based android application, where enrolled teams will get to solve real time problems that could be planet changing tech. It is an opportunity for students to showcase their skills, learn new technologies and potentially develop a project into a product",
    img: "/src/assets/eventdetails/hackathon.jpg",
    rules: [
      "Team Size: 2 Members",
      "Problem statements will be provided in the brochure, Enrolled teams will have till 3rd March 2023 to submit their working model",
      "The teams must adhere to ethics and responsible AI practices",
      "Submissions should include a detailed report and demonstration of the working model",
      "The decision of the judges is final",
      "The winning team will be awarded based on the criteria specified by the organizers",
      "The teams must comply with the deadline for submissions",
    ],
    requirements: [],
    contacts: [
      {
        type: "Faculty Coordinator",
        name: "Dr Preethi Patil",
        email: "preethinpatil@rvce.edu.in",
        phone: "+91 9900970235",
      },
      {
        type: "Student Coordinator",
        name: "Ranjith Kumar J",
        email: "ranjithkj.mca21@rvce.edu.in",
        phone: "+91 8884601647",
      },
    ],
    maxPoints: 33,
    maxTeamSize: 2,
    isOpenEvent: true,
  },
  {
    name: "Mystery Event",
    route: "eventx",
    img: "/src/assets/eventdetails/mystery.jpg",
    description: "You Never Know What you Might have in the Store?",
    rules: [],
    requirements: [],
    contacts: [],
    maxPoints: 10,
    maxTeamSize: 7,
    isOpenEvent: false,
  },
];

module.exports = { eventsList };
