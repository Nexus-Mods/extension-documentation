import DocumentationView from './views/DocumentationView';
import TutorialButton from './controls/TutorialButton'

import { types, ComponentEx } from 'vortex-api';

function init(context: types.IExtensionContext) {
 
  context.registerMainPage('support', 'Documentation', DocumentationView, {
    hotkey: 'H',
    group: 'global',
  });

  return true;
}



export default init;