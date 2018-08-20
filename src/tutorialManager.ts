import IYoutubeInfo, { createTutorialVideo } from "./types/YoutubeInfo";

// Used when generating the embedding link to use within the tutorial popover window.
const YOUTUBE_LINK = "https://www.youtube.com/embed/";

// Regex pattern used to test string timestamps and convert them to numbers.
const regexPattern: RegExp = /^([0-5][0-9]|[0-9])(:|\.)[0-5][0-9]$/;

const VIDEO_IDS = [
  "sD9xKao_u30",
  "OrZM9LSuDhU",
  "dWcHiamHhCA",
  "BQj8I5g4Qm4",
];

const TUTORIAL_DATA: Array<IYoutubeInfo> = [
  createTutorialVideo( VIDEO_IDS[0], 'Login Tutorial', '2.05', '2.55' ),
  createTutorialVideo( VIDEO_IDS[0], 'Test Tutorial', '2.56', '3.32' ),
  createTutorialVideo( VIDEO_IDS[1], 'Test Tutorial2', '2.56', '3.32' ),
  createTutorialVideo( VIDEO_IDS[2], 'Test Tutorial3', '2.56', '3.32' ),
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