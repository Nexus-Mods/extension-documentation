import * as _ from 'lodash';
import { tooltip, ComponentEx, Overlay } from 'vortex-api';
import { translate, TranslationFunction } from 'react-i18next';

import { connect } from 'react-redux';
import * as React from 'react';
import { Popover, MenuItem } from 'react-bootstrap';
import * as Redux from 'redux';

import getEmbedLink, { TUT_PREFIX } from '../tutorialManager'
import { IYoutubeInfo } from '../types/YoutubeInfo';
import { setTutorialOpen } from '../actions/session';

export const VIDEO_WIDTH = 560;
export const VIDEO_HEIGHT = 315;

export interface IBaseProps {
  children?: string;
  container?: Element;
  orientation?: 'vertical' | 'horizontal';
  video: IYoutubeInfo;
  dropdown?: boolean;
}

interface IConnectedProps {
  tutorialId: number,
  isOpen: boolean,
}

interface IActionProps {
  onShow: (id: number, open: boolean) => void;
}

type IProps = IBaseProps & IConnectedProps & IActionProps;

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
class TutorialButton extends ComponentEx<IProps, {}> {
  private mRef: Element;

  public render(): JSX.Element {
    const { dropdown, children, video, t, tutorialId, orientation, isOpen } = this.props;

    if (video === undefined) {
      return null;
    }

    let trimmedName = video.name.replace(TUT_PREFIX, '');

    let iconButton;
    if (video.group === 'todo') {
      iconButton = this.renderTodo();
    } else {
      if (dropdown) {
        iconButton = this.renderDropdownButton(t, trimmedName);
      } else {
        iconButton = this.renderButton(t, trimmedName);
      }
    }

    const popOverTitle = (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ fontSize: '14px' }}>{t(trimmedName)}</h3>
        <tooltip.IconButton
          icon='close-slim'
          tooltip={t('Dismiss')}
          className='btn-embed btn-dismiss'
          onClick={this.hide}
          style={{ color: 'white' }} />
      </div>
    );

    const popover = (
      <Popover id={`popover-${video.group}-${video.id}`} className='tutorial-popover' title={popOverTitle} style={{ maxWidth: '100%' }}>
        <div>
          <iframe width={VIDEO_WIDTH} height={VIDEO_HEIGHT} src={getEmbedLink(video.ytId, video.start, video.end)} allowFullScreen />
          {children ? children.split('\n\n').map((paragraph) =>
            <p key={video.id}>{paragraph}</p>) : null}
        </div>
      </Popover>
    );
    //console.log('render', open);
    return (
      <div style={{ display: 'inline', width: { VIDEO_WIDTH } }}>
        <Overlay
          show={tutorialId === video.id && isOpen}
          onHide={this.hide}
          orientation={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
          target={this.getRef}
          getBounds={this.getBounds}>
          {popover}
        </Overlay>
        {iconButton}
      </div>
    );
  }

  private renderTodo(): JSX.Element {
    return (
      <div className='tutorial-link tutorial-link-todo' ref={this.setRef} />
    );
  }

  private renderDropdownButton(t: TranslationFunction, name: string): JSX.Element {
    const { video } = this.props;
    return (
      <MenuItem key={video.group + video.id} ref={this.setRef} onClick={this.show} eventKey={this.show}>{t(name)}</MenuItem>
    )
  }

  private renderButton(t: TranslationFunction, name: string): JSX.Element {
    return (
      <div style={{ height: '100%' }} className='tutorial-link' ref={this.setRef}>
        <tooltip.IconButton tooltip={t(name)} onClick={this.show} icon='video' style={{ height: '100%' }}>
          <div className="button-text">{t(name)}</div>
        </tooltip.IconButton>
      </div>
    )
  }

  private getRef = () => this.mRef;

  private setRef = ref => {
    this.mRef = ref;
  }

  private show = evt => {
    const { onShow, video, isOpen } = this.props;
    evt.preventDefault();
    onShow(video.id, !isOpen);
  }

  private hide = () => {
    const { onShow, video } = this.props;
    onShow(video.id, false);
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

function mapStateToProps(state: any): IConnectedProps {
  return {
    tutorialId: state.session.tutorials.currentTutorial.tutorialId,
    isOpen: state.session.tutorials.currentTutorial.isOpen,
  };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>, ownProps: IProps): IActionProps {
  return {
    onShow: (id: number, open: boolean) => dispatch(setTutorialOpen(id, open)),
  };
}

export default translate(['common'])(
  connect(mapStateToProps, mapDispatchToProps)(TutorialButton)) as React.ComponentClass<IBaseProps>;
