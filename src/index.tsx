import * as path from 'path';
import * as React from 'react';

import { closeTutorials, setTutorialOpen } from './actions/session';
import TutorialButton from './controls/TutorialButton';
import TutorialDropdown from './controls/TutorialDropdown';
import sessionReducer from './reducers/session';
import { getTutorialData, TODO_GROUP } from './tutorialManager';
import DocumentationView from './views/DocumentationView';

import { types, util } from 'vortex-api';

const WIKI_TOPICS = {
  'adding-games': 'Adding_a_new_game_to_Vortex',
  'creating-themes': 'Creating_themes_for_Vortex',
  'deployment-methods': 'Deployment_Methods',
  'downloading': 'Downloading_from_Nexus_Mods_with_Vortex',
  'external-changes': 'External_Changes',
  'keyboard-shortcuts': 'Keyboard_Shortcuts',
  'file-conflicts': 'Managing_File_Conflicts',
  'load-order-about': 'About_Load_Orders',
  'load-order': 'Managing_your_Load_Order',
  'profiles': 'Setting_up_profiles_in_Vortex',
};

const WIKI_URL = 'https://wiki.nexusmods.com/index.php';

function generateUrl(wikiId: string) {
  const topicId = WIKI_TOPICS[wikiId] || undefined;
  if (topicId === undefined) {
    return undefined;
  }
  return `${WIKI_URL}/${topicId}`;
}

export default function init(context: types.IExtensionContext) {
  context.registerReducer(['session', 'tutorials'], sessionReducer);

  context.registerMainPage('details', 'Knowledge Base', DocumentationView, {
    hotkeyRaw: 'F1',
    group: 'global',
  } as any);

  const tutData = getTutorialData();

  Object.keys(tutData).forEach((key) => {
    if (key === TODO_GROUP) {
      const element = tutData[key][0];
      // Add the tutorial video to the TODO dashlet.
      context.registerToDo('todo-tutorial-vid',
        'more', undefined, 'video', 'Introduction Video', () => {
        const { store } = context.api;
        store.dispatch(setTutorialOpen(element.id,
          !util.getSafe(store.getState(),
          ['session', 'tutorials', 'currentTutorial', 'isOpen'], false)));
      }, undefined, (t) => (
        <TutorialButton video={element} />
      ), 5);
    } else {
      if (tutData[key].length === 1) {
        const element = tutData[key][0];
        // Add the tutorial item to the relevant icon group.
        context.registerAction(key, 400, TutorialButton, {}, () => ({
          video: element,
        }));
      } else {
        context.registerAction(key, 400, TutorialDropdown, {}, () => ({
          groupName: key,
          videos: tutData[key],
        }));
      }
    }
  });

  context.once(() => {
    context.api.setStylesheet('documentation', path.join(__dirname, 'documentation.scss'));

    // User has moved onto a different page; we can close any open tutorial
    //  videos.
    context.api.onStateChange(['session', 'base', 'mainPage'], () => {
      const { store } = context.api;
      if (false !== util.getSafe(store.getState(),
        ['session', 'tutorials', 'currentTutorial', 'isOpen'], false)) {
        store.dispatch(closeTutorials());
      }
    });

    context.api.events.on('open-knowledge-base', (wikiId: string) => {
      context.api.events.emit('show-main-page', 'Knowledge Base');
      const url = generateUrl(wikiId);
      if (url !== undefined) {
        setTimeout(() => {
          context.api.events.emit('navigate-knowledgebase', url);
        }, 2000);
      }
    });
  });

  return true;
}
