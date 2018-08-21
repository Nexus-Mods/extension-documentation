import * as _ from 'lodash';
import { tooltip, ComponentEx } from 'vortex-api';
const { MyOverlay } = require('vortex-api') as any;
import { translate } from 'react-i18next';

import * as React from 'react';
import { Popover } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';

import getEmbedLink from '../tutorialManager'
import { IYoutubeInfo } from '../types/YoutubeInfo';

const VIDEO_WIDTH = 560;
const VIDEO_HEIGHT = 315;

const getPopOver = (element: IYoutubeInfo ): any => {
  const { ytId, start, end, name, id } = element;

  let pCounter = 0;
  const popover = (
    <Popover id={`popover-${id}`} className='tutorial-popover' title={name} style={{ maxWidth: '100%' }}>
      <div>
        <iframe width={VIDEO_WIDTH} height={VIDEO_HEIGHT} src={getEmbedLink(ytId, start, end)} allowFullScreen/>
      </div>
    </Popover>
  );

  return (
    <div style={{ display: 'inline', width:{VIDEO_WIDTH} }}>
      <MyOverlay
        rootClose
        show={false}
        onHide={this.hide}
        //orientation={orientation}
        target={this.getRef}
        getBounds={this.getBounds}>
        {popover}
      </MyOverlay>
    </div>
  );
}

export default 
  translate(['common'])(getPopOver);
