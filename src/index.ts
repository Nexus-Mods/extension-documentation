import DocumentationView from './views/DocumentationView';
import { setTutorials } from './actions/session';
import { types } from 'vortex-api';
import sessionReducer from './reducers/session';
import { getTutorialData } from './tutorialManager';
import TutorialList from './views/TutorialList';

export default function init(context: types.IExtensionContext) {
 
  context.registerMainPage('support', 'Support', DocumentationView, {
    hotkey: 'H',
    group: 'global',
  });

  context.registerReducer(['session', 'tutorials'], sessionReducer);

  // Populate the store with default video tutorial information.
  const tutData = getTutorialData();
  context.once(() => {
    context.api.store.dispatch(setTutorials(tutData));
  });

  // Temporary mainpage hook used to test displaying of tutorials
  //  will be removed once finished.
  context.registerMainPage('video', 'tutorial', TutorialList, {
    group: 'global',
  });

  return true;
};