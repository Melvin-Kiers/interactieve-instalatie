import uitleg1 from "../assets/videos/uitlegGame1.mp4";
import uitleg2 from "../assets/videos/uitlegGame2.mp4";
import uitleg3 from "../assets/videos/uitlegGame3.mp4";
import star from "../assets/icons/star.png";
import trophy from "../assets/icons/trophy.png";

const minigamesData = [
  {
    id: 1,
    title: "Rem precies goed",
    description: "Houd je voet bij de rem! Je vliegt door de buis en moet precies in het groene vlak stoppen. Gebruik de spatiebalk om op tijd te remmen. Maar pas op: elke ronde ga je harder en wordt je remweg langer. Kun jij de Hyperloop op tijd stilzetten?",
    video: uitleg1,
    controls: [
      { icon: star, label: "star" },
      { icon: trophy, label: "down" }
    ]
  },
  {
    id: 2,
    title: "Magneet Switch",
    description: "Race door een futuristische tunnel! Je Hyperloop gaat vanzelf vooruit, maar pas op voor de blauwe cirkels (drukgolven). Wissel snel van baan om ze te ontwijken. Hoe verder je komt, maar pas op je gaat steeds sneller. Bij een botsing verlies je punten, dus pas op!",
    video: uitleg2,
    controls: [
      { icon: star, label: "star" },
      { icon: trophy, label: "down" }
    ]
  },
  {
    id: 3,
    title: "Houdt de Hyperloop stabiel",
    description: "Houd de Hyperloop stabiel! Gebruik de spatiebalk om naar voren te vliegen en laat los om weer terug te zakken. Zorg dat je precies in het groene vak staat wanneer de tijd om is voor de maximale score. Pas op: het vak staat elke ronde op een andere plek!",
    video: uitleg3,
    controls: [
      { icon: star, label: "star" },
      { icon: trophy, label: "down" }
    ]
  }
];

export default minigamesData;