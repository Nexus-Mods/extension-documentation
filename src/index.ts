import DocumentationView from './views/DocumentationView';
import TutorialButton from './controls/TutorialButton'

import { types, ComponentEx } from 'vortex-api';

function init(context: types.IExtensionContext) {
 
  context.registerMainPage('support', 'Documentation', DocumentationView, {
    hotkey: 'H',
    group: 'global',
  });

  context.optional.registerTutorial = (domRef: any, ytId: string, start: string, end: string ) => {
    buttonPosition.insertAdjacentElement('afterend', 
  }
  //context.registerReducer(['tutorialVideo', 'browser'], tutorialVideoReducer);

  return true;
}



export default init;