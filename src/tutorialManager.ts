// Used when generating the embedding link to use within the tutorial modal window.
const YOUTUBE_LINK = "https://www.youtube.com/embed/";

// Regex pattern used to test string timestamps and convert them to numbers.
const regexPattern: RegExp = /^([0-5][0-9]|[0-9])(:|\.)[0-5][0-9]$/;

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