import DocumentationView from './views/DocumentationView';
import * as path from 'path';
import * as React from 'react';
import { types, util } from 'vortex-api';
import sessionReducer from './reducers/session';
import { getTutorialData, TODO_GROUP } from './tutorialManager';
import TutorialButton from './controls/TutorialButton';
import { setTutorialOpen, closeTutorials } from './actions/session';

export default function init(context: types.IExtensionContext) {

  context.registerMainPage('details', 'Support', DocumentationView, {
    hotkey: 'H',
    group: 'global',
  });

  context.registerReducer(['session', 'tutorials'], sessionReducer);

  const tutData = getTutorialData();

  // Populate the store with default video tutorial information.
  tutData.forEach(element => {
    if (element.group === TODO_GROUP) {
      // Add the tutorial video to the TODO dashlet.
      context.registerToDo('todo-tutorial-vid', 'more', undefined, 'video', 'Vortex Introduction', () => {
        const { store } = context.api;
        store.dispatch(setTutorialOpen(element.id, !util.getSafe(store.getState(), ['session', 'tutorials','currentTutorial', 'isOpen'], false)));
      }, undefined, (t) => (
        <TutorialButton video={element} />
      )
        , undefined);
    } else {
      // Add the tutorial item to the relevant icon group.
      context.registerAction(element.group, 300, TutorialButton, {}, () => ({
        video: element }));
    }
  });

  context.once(() => {
    context.api.setStylesheet('documentation', path.join(__dirname, 'documentation.scss'));

    // User has moved onto a different page; we can close any open tutorial
    //  videos.
    context.api.onStateChange(['session', 'base', 'mainPage'], () => {
      context.api.store.dispatch(closeTutorials());
    });
  });

  return true;
};