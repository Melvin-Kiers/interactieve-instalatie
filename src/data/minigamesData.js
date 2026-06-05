import uitleg1 from "../assets/videos/uitlegGame1.mp4";
import uitleg2 from "../assets/videos/uitlegGame2.mp4";
import uitleg3 from "../assets/videos/uitlegGame3.mp4";
import star from "../assets/icons/star.png";
import trophy from "../assets/icons/trophy.png";
import buttonBlue from "../assets/icons/buttonBlue.png";
import buttonBlack from "../assets/icons/buttonBlack.png";
import buttonGreen from "../assets/icons/buttonGreen.png";

const minigamesData = [
  {
    id: 1,
    title: "Rem precies goed",
    description: "Houd je voet bij de rem! Je vliegt door de buis en moet precies in het groene vlak stoppen. Gebruik de spatiebalk om op tijd te remmen. Maar pas op: elke ronde ga je harder en wordt je remweg langer. Kun jij de Hyperloop op tijd stilzetten?",
    video: uitleg1,
    controls: [
      { icon: buttonBlue, label: "Door op de blauwe knop te drukken rem je!", size: "50px" }
    ],
  },
  {
    id: 2,
    title: "Magneet Switch",
    description: "Race door een futuristische tunnel! Je Hyperloop gaat vanzelf vooruit, maar pas op voor de blauwe cirkels (drukgolven). Wissel snel van baan om ze te ontwijken. Maar pas op je gaat steeds sneller als je verder komt. Bij een botsing verlies je punten, dus pas op!",
    video: uitleg2,
    controls: [
      { icon: buttonGreen, label: "Druk op de groene knop om omhoog te gaan!", size: "50px" },
      { icon: buttonBlack, label: "Druk op de zwarte knop om omlaag te gaan!", size: "50px" }
    ]
  },
  {
    id: 3,
    title: "Centreer de Hyperloop",
    description: "Houd de Hyperloop stabiel! Gebruik de spatiebalk om naar voren te vliegen en laat los om weer terug te zakken. Zorg dat je precies in het groene vak staat wanneer de tijd om is voor de maximale score. Pas op: het vak staat elke ronde op een andere plek!",
    video: uitleg3,
    controls: [
      { icon: buttonBlue, label: "Houdt de blauwe knop ingedrukt om vooruit te gaan, laat los om terug te gaan!", size: "40px" }
    ]
  }
];

export default minigamesData;