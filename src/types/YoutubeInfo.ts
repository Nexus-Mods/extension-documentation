import * as React from 'react';

export interface IYoutubeInfo {
  // id to differentiate between different video instances
  id: number;

  // The youtube id of the video we want to embed.
  ytId: string;

  // The name of the video; will be displayed as the popover's title
  name: string;

  // The start and end times of the video slice we want to display
  //  We're expecting a string in the "MM:SS, M:SS, M.SS, MM.SS" format.
  //  OR a number in seconds.
  start: string | number;
  end: string | number;

  // Used to associate this video tutorial to a specific icon group.
  group?: string;
}

class YtInfoImpl implements IYoutubeInfo {
  private static _nextId: number = 0;
  id: number;
  ytId: string;
  name: string;
  start: string | number;
  end: string | number;
  group: string;

  constructor(ytId: string, name: string, start: string|number, end: string|number, group?: string){
    this.id = YtInfoImpl._nextId++;
    this.ytId = ytId;
    this.name = name;
    this.start = start;
    this.end = end;

    if (group) {
      this.group = group;
    } else {
      this.group = 'Tutorials';
    }
  }
}

export function createTutorialVideo(ytId: string, name: string, start: string|number, end: string|number, group?: string) : IYoutubeInfo {
  return new YtInfoImpl(ytId, name, start, end, group);
}

export default IYoutubeInfo;