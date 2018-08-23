import * as _ from 'lodash';
import { util, tooltip, ComponentEx } from 'vortex-api';
const { MyOverlay } = require('vortex-api') as any;
import { translate } from 'react-i18next';

import { connect } from 'react-redux';
import * as React from 'react';
import { Popover } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';

import getEmbedLink from '../tutorialManager'
import { IYoutubeInfo } from '../types/YoutubeInfo';

export const VIDEO_WIDTH = 560;
export const VIDEO_HEIGHT = 315;

export interface IBaseProps {
  children?: string;
  container?: Element;
  orientation?: 'vertical' | 'horizontal';
}

interface IConnectedProps {
  tutorials: IYoutubeInfo[];
}

type IProps = IBaseProps & IConnectedProps & IYoutubeInfo

export interface IComponentState {
  open: boolean;
}

/**
 * Component will appear as a video icon within iconBars which users can click and view
 *  tutorial videos relevant to the section they're on.
 * 
 * Todo items are supported as well but will not provide a button or button text when rendered; 
 *  these must be provided upon calling the registerTodo extension function. 
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

    this.initState({
      open: false,
    });
  }

  public componentWillReceiveProps(newProps: IConnectedProps) {
    const tutVid = newProps.tutorials[this.props.id];
    if (tutVid && this.props.open !== tutVid.open) {
      this.nextState.open = tutVid.open;
    }
  }

  public render(): JSX.Element {
    const { children, id, ytId, name, start, end, t, group } = this.props;
    const { open } = this.state;

    let iconButton;
    if (group !== 'todo') {
      iconButton = (
        <div style={{ height: '100%' }} className='tutorial-link' ref={this.setRef}>
            <tooltip.IconButton tooltip={t(name)} onClick={this.toggle} icon='video' style={{ height: '100%' }}>
              <div className="button-text">{t(name)}</div>
            </tooltip.IconButton>
        </div>
      );
    } else {
      iconButton = (
        <div className='tutorial-link' ref={this.setRef} />
      );
    }

    let pCounter = 0;
    const popover = (
      <Popover id={`popover-${id}`} className='tutorial-popover' title={t(name)} style={{ maxWidth: '100%' }}>
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
          getBounds={this.getBounds}>
          {popover}
        </MyOverlay>
        {iconButton}
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

function mapStateToProps(state: any): IComponentState {
    return state.session.tutorials;
}

export default translate(['common'])( connect<{}, {}, any>(mapStateToProps, {})(TutorialButton));

// export default
//   translate(['common'], { wait: false })(
//     connect(mapStateToProps)(
//       TutorialButton)) as React.ComponentClass<{}>;
