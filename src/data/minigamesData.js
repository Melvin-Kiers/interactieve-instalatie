import uitleg1 from "../assets/videos/uitlegGame1NEW.mp4";
import uitleg2 from "../assets/videos/uitlegGame2NEW.mp4";
import uitleg3 from "../assets/videos/uitlegGame3NEW.mp4";
import star from "../assets/icons/star.png";
import trophy from "../assets/icons/trophy.png";
import buttonBlue from "../assets/icons/buttonBlue.png";
import buttonBlack from "../assets/icons/buttonBlack.png";
import buttonGreen from "../assets/icons/buttonGreen.png";

const minigamesData = [
  {
    id: 1,
    title: "Rem precies goed",
    description: "Rem op tijd en stop in het groene vlak. Maar let op: elke ronde ga je sneller",
    video: uitleg1,
    controls: [
      { icon: buttonBlue, label: "Door op de blauwe knop te drukken rem je!", size: "40px" }
    ],
  },
  {
    id: 2,
    title: "Magneet Wisselen",
    description: "Stuur je Hyperloop door de juiste baan en raak zoveel mogelijk cirkels. Let op, je gaat steeds sneller!",
    video: uitleg2,
    controls: [
      { icon: buttonGreen, label: "Druk op de groene knop om omhoog te gaan!", size: "40px" },
      { icon: buttonBlack, label: "Druk op de zwarte knop om omlaag te gaan!", size: "40px" }
    ]
  },
  {
    id: 3,
    title: "Centreer de Hyperloop",
    description: "Kun jij je Hyperloop precies op de juiste plek houden? Eindig in het groene vak voor de meeste punten nadat de tijd om 0 staat!",
    video: uitleg3,
    controls: [
      { icon: buttonBlue, label: "Houdt de blauwe knop ingedrukt om vooruit te gaan, laat los om terug te gaan!", size: "40px" }
    ]
  }
];

export default minigamesData;