import * as _ from 'lodash';
import { tooltip, ComponentEx } from 'vortex-api';
const { MyOverlay } = require('vortex-api') as any;
import { translate } from 'react-i18next';

import * as React from 'react';
import { Popover } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';

import getEmbedLink from '../tutorialManager'

const VIDEO_WIDTH = 560;
const VIDEO_HEIGHT = 315;

export interface IProps {
  // The youtube id of the video we want to embed.
  ytId: string;

  // The start and end times of the video slice we want to display
  //  We're expecting a string in the "MM:SS, M:SS, M.SS, MM.SS" format.
  //  OR a number in seconds.
  start: string | number;
  end: string | number;

  id: string;
  name: string;
  children?: string;
  container?: Element;
  orientation?: 'vertical' | 'horizontal';
}

export interface IComponentState {
  open: boolean;
}

/**
 * Component to make additional information available to the user without taking much
 * space. The user only sees a clickable question mark. On click it will show a popover
 * with the info.
 *
 * double-linebreaks can be used in the text to start a new paragraph.
 *
 * @param {IProps} props
 * @returns
 */
class TutorialButton extends ComponentEx<IProps, IComponentState> {
  private mRef: Element;

  constructor(props: IProps) {
    super(props);

    this.state = {
      open: false,
    };
  }

  public render(): JSX.Element {
    const { children, id, ytId, name, start, end, t } = this.props;
    const { open } = this.state;

    let pCounter = 0;
    const popover = (
      <Popover id={`popover-${id}`} className='tutorial-popover' title={name} style={{ maxWidth: '100%' }}>
        <div>
          <iframe width={VIDEO_WIDTH} height={VIDEO_HEIGHT} src={getEmbedLink(ytId, start, end)} allowFullScreen/>
          {children ? children.split('\n\n').map((paragraph) =>
            <p key={pCounter++}>{paragraph}</p>) : null}
        </div>
      </Popover>
    );
    return (
      <div style={{ display: 'inline', width:{VIDEO_WIDTH} }}>
        <MyOverlay
          rootClose
          show={open}
          onHide={this.hide}
          //orientation={orientation}
          target={this.getRef}
          getBounds={this.getBounds}
        >
          {popover}
        </MyOverlay>
        <div className='tutorial-link' ref={this.setRef}>
          <tooltip.IconButton tooltip={t('Tutorial Video')} onClick={this.toggle} icon='video' />
        </div>
      </div>
    );
  }

  private getRef = () => this.mRef;

  private setRef = ref => {
    this.mRef = ref;
  }

  private toggle = evt => {
    evt.preventDefault();
    this.setState({ open: !this.state.open });
  }

  private hide = () => {
    this.setState({ open: false });
  }

  private getBounds = (): ClientRect => {
    const { container } = this.props;

    return container !== undefined ? container.getBoundingClientRect() : {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      right: window.innerWidth,
      bottom: window.innerHeight,
    };
  }
}

export default 
  translate(['common'])(TutorialButton);
