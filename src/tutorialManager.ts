import IYoutubeInfo, { createTutorialVideo } from "./types/YoutubeInfo";

// Used when generating the embedding link to use within the tutorial popover window.
const YOUTUBE_LINK = "https://www.youtube.com/embed/";

// Tutorial buttons which are assigned the todo group will registered as
//  todo items on the dashboard.
export const TODO_GROUP = 'todo';

// Array of iconbar groups which can be used to place tutorial buttons.
const ICONBAR_GROUPS = [
  'gamebryo-plugin-icons', //0
]; 

// Regex pattern used to test string timestamps and convert them to numbers.
const regexPattern: RegExp = /^([0-5][0-9]|[0-9])(:|\.)[0-5][0-9]$/;

const VIDEO_IDS = [
  'sD9xKao_u30', //0
  'OrZM9LSuDhU', //1
  'dWcHiamHhCA', //2
  'BQj8I5g4Qm4', //3
];

const TUTORIAL_DATA: Array<IYoutubeInfo> = [
  //createTutorialVideo(VIDEO_IDS[0], 'Login tutorial', '2.05', '2.55', ICONBAR_GROUPS[0]),
  //createTutorialVideo(VIDEO_IDS[0], 'Dasboard introduction', '2.56', '3.32', ICONBAR_GROUPS[0]),
  //createTutorialVideo(VIDEO_IDS[0], 'Multi User Mode', '3.33', '4.41', ICONBAR_GROUPS[0]),
  createTutorialVideo(VIDEO_IDS[0], 'Mod management', '2.05', '8.14', TODO_GROUP),

  //createTutorialVideo(VIDEO_IDS[1], 'Handling Nexus Links', '0.20', '1.02'),
  //createTutorialVideo(VIDEO_IDS[1], 'Download/Install automatically', '1.02', '5.05'),
  //createTutorialVideo(VIDEO_IDS[1], 'Download/Install manually', '5.05', '7.10'),
  //createTutorialVideo(VIDEO_IDS[1], 'Remove mods', '7.10', '8.25'),
//
  //createTutorialVideo(VIDEO_IDS[2], 'Scripted Installer overview', '0.24', '1.02'),
  //createTutorialVideo(VIDEO_IDS[2], 'Using scripted installers', '1.02', '4.10'),
  //createTutorialVideo(VIDEO_IDS[2], 'Modifying scripted installer mods', '4.11', '4.47'),
  //createTutorialVideo(VIDEO_IDS[2], 'Disabling mods', '4.48', '6.44'),
  //createTutorialVideo(VIDEO_IDS[2], 'Uninstalling mods', '6.44', '8.27'),
  //createTutorialVideo(VIDEO_IDS[2], 'Deleting mods', '8.30', '9.46'),
  //createTutorialVideo(VIDEO_IDS[2], 'Deleting archives', '9.46', '10.41'),
  //
  //createTutorialVideo(VIDEO_IDS[3], 'Data files', '1.12', '3.36'),
  //createTutorialVideo(VIDEO_IDS[3], 'Master files', '3.36', '6.36'),
  //createTutorialVideo(VIDEO_IDS[3], 'Load order overview', '6.36', '9.02'),
  //createTutorialVideo(VIDEO_IDS[3], 'Global priority', '9.52', '14.20'),
  //createTutorialVideo(VIDEO_IDS[3], 'Reviewing/Setting dependencies', '14.20', '20.00'),
];

export function getTutorialData(id?: number) : IYoutubeInfo|Array<IYoutubeInfo> {
  if (id) {
    return TUTORIAL_DATA.find( x => x.id === id );
  } else {
    return TUTORIAL_DATA;
  }
}

function getEmbedLink(id: string, start: string|number, end: string|number): string {
  let srcLink = YOUTUBE_LINK;
  let startSeconds: number = 0, endSeconds: number = 0;

  if (typeof start === "number") {
    startSeconds = start;
  } else if (typeof start === "string") {
    startSeconds = convertTimeToSeconds(start);
  } else {
    startSeconds = 0;
  }

  if (typeof end === "number") {
    endSeconds = end;
  } else if (typeof start === "string") {
    endSeconds = convertTimeToSeconds(end);
  } else {
    endSeconds = 0;
  }
  
  return srcLink + id + '?autoplay=1&start=' + startSeconds + '&end=' + endSeconds;
}

/**
 * Time string must respect the MM:SS, or M:SS format or it will be rejected.
 *  '.' instead of ':' will also pass the regex test.
 */
function convertTimeToSeconds(time: string) : number {
  if (regexPattern.test(time)) {
    const timeArray = time.split(/(?:\.|\:)+/);
    const totalSeconds = (+timeArray[0]) * 60 + (+timeArray[1]);
    return totalSeconds;
  }
}

export default getEmbedLink;