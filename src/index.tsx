import DocumentationView from './views/DocumentationView';
import * as React from 'react';
import { types } from 'vortex-api';
import sessionReducer from './reducers/session';
import { getTutorialData, TODO_GROUP } from './tutorialManager';
import { IYoutubeInfo } from './types/YoutubeInfo';
import TutorialButton from './controls/TutorialButton';
import { setTutorials, toggleTutorial } from './actions/session';

export default function init(context: types.IExtensionContext) {

  context.registerMainPage('support', 'Support', DocumentationView, {
    hotkey: 'H',
    group: 'global',
  });

  context.registerReducer(['session', 'tutorials'], sessionReducer);

  const tutData = getTutorialData();

  // Populate the store with default video tutorial information.
  context.once(() => {
    context.api.store.dispatch(setTutorials(tutData));
  });

  if (tutData && Array.isArray(tutData)) {
    tutData.forEach(element => {
      if (element.group === TODO_GROUP) {
        // Add the tutorial video to the TODO dashlet.
        context.registerToDo('todo-tutorial-vid', 'more', undefined, 'video', 'Video Tutorial', () => {
          context.api.store.dispatch(toggleTutorial(element.id, element.open));
        }, undefined, (t) => (
              <TutorialButton id={element.id} ytId={element.ytId} start={element.start} end={element.end} name={t(element.name)} group={element.group} />
            )
          , undefined);
      } else {
        // Add the tutorial item to the relevant icon group.
        context.registerAction(element.group, 0, TutorialButton, {}, () => ({
          id: element.id,
          ytId: element.ytId,
          start: element.start,
          end: element.end,
          name: element.name,
          group: element.group,
        }));
      }
    });
  } else {
    const element = (tutData as IYoutubeInfo);
    context.registerAction(element.group, 0, TutorialButton, {}, () => ({
      id: element.id,
      ytId: element.ytId,
      start: element.start,
      end: element.end,
      name: element.name,
      group: element.group,
    }));
  }

  return true;
};