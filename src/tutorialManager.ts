import IYoutubeInfo, { createTutorialVideo } from "./types/YoutubeInfo";

// Used when generating the embedding link to use within the tutorial popover window.
const YOUTUBE_LINK = "https://www.youtube.com/embed/";

// Tutorial buttons which are assigned the todo group will registered as
//  todo items on the dashboard.
export const TODO_GROUP = 'todo';

export const TUT_PREFIX = 'Tutorial-';

// Array of iconbar groups which can be used to place tutorial buttons.
const ICONBAR_GROUPS = {
  plugins: 'gamebryo-plugin-icons',
  mods: 'mod-icons'
}; 

// Regex pattern used to test string timestamps and convert them to numbers.
const regexPattern: RegExp = /^([0-5][0-9]|[0-9])(:|\.)[0-5][0-9]$/;

const VIDEO_IDS = {
  intro: 'sD9xKao_u30',
  installing: 'OrZM9LSuDhU',
  fomods: 'dWcHiamHhCA',
  plugins: 'BQj8I5g4Qm4',
};

const TUTORIAL_DATA: Array<IYoutubeInfo> = [
  createTutorialVideo(VIDEO_IDS.intro, 'Vortex Introduction', '2.05', '8.14', TODO_GROUP),

  createTutorialVideo(VIDEO_IDS.installing, TUT_PREFIX + 'Nexus Links', '0.20', '1.02', ICONBAR_GROUPS.mods),
  createTutorialVideo(VIDEO_IDS.installing, TUT_PREFIX + 'Install Mods', '1.02', '7.10', ICONBAR_GROUPS.mods),
  createTutorialVideo(VIDEO_IDS.fomods, TUT_PREFIX + 'Manage Mods', '0.24', '10.41', ICONBAR_GROUPS.mods),
  
  createTutorialVideo(VIDEO_IDS.plugins, TUT_PREFIX + 'Data files', '1.13', '3.36', ICONBAR_GROUPS.plugins),
  createTutorialVideo(VIDEO_IDS.plugins, TUT_PREFIX + 'Master files', '3.37', '6.36', ICONBAR_GROUPS.plugins),
  createTutorialVideo(VIDEO_IDS.plugins, TUT_PREFIX + 'Load Order', '6.37', '9.02', ICONBAR_GROUPS.plugins),
  createTutorialVideo(VIDEO_IDS.plugins, TUT_PREFIX + 'Global priority', '9.53', '14.20', ICONBAR_GROUPS.plugins),
  createTutorialVideo(VIDEO_IDS.plugins, TUT_PREFIX + 'Dependencies', '14.20', '20.00', ICONBAR_GROUPS.plugins),
];

export function getTutorialData() : IYoutubeInfo[] {
  return TUTORIAL_DATA;
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