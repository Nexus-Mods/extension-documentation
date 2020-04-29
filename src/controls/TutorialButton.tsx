import { TranslationFunction } from 'i18next';
import * as React from 'react';
import { Popover } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as Redux from 'redux';

import { setTutorialOpen } from '../actions/session';
import getEmbedLink from '../tutorialManager';
import { IYoutubeInfo } from '../types/YoutubeInfo';

import { ComponentEx, Icon, Overlay, tooltip, util, Webview } from 'vortex-api';

export const VIDEO_WIDTH = 560;
export const VIDEO_HEIGHT = 315;

export interface IBaseProps {
  children?: string;
  container?: Element;
  orientation?: 'vertical' | 'horizontal';
  video: IYoutubeInfo;
  dropdown?: boolean;

  // An optional callback function executed whenever
  //  the users clicks the button.
  onClick?: (value: boolean) => void;
}

interface IConnectedProps {
  tutorialId: number;
  isOpen: boolean;
}

interface IActionProps {
  onShow: (id: number, open: boolean) => void;
}

type IProps = IBaseProps & IConnectedProps & IActionProps;

/**
 * Component will appear as a single video icon within iconBars which users can click and view
 *  tutorial videos relevant to the section they're on.
 *
 * A Dropdown button will be created when multiple tutorial videos are linked to the same icon
 *  bar.
 *
 * Todo items are supported as well but will not provide a button or button text when rendered;
 *  these must be provided upon calling the registerTodo extension function.
 *
 * double-linebreaks can be used in the text to start a new paragraph.
 *
 * @param {IProps} props
 * @returns
 */
class TutorialButton extends ComponentEx<IProps, { fullscreen: boolean }> {
  private mRef: Element;

  constructor(props: IProps) {
    super(props);

    this.initState({
      fullscreen: false,
    });
  }

  public render(): JSX.Element {
    const { dropdown, children, video, t, tutorialId, orientation, isOpen } = this.props;
    const { fullscreen } = this.state;

    if (video === undefined) {
      return null;
    }

    let iconButton;
    if (video.group === 'todo') {
      iconButton = this.renderTodo();
    } else {
      if (dropdown) {
        iconButton = this.renderDropdownButton(t, video.name);
      } else {
        iconButton = this.renderButton(t, video.name);
      }
    }

    const popOverTitle = (
      <div className='popover-title-container'>
        <h3>{t(video.name)}</h3>
        <tooltip.IconButton
          icon='close-slim'
          tooltip={t('Dismiss')}
          className='btn-embed btn-dismiss'
          onClick={this.hide}
        />
      </div>
    );

    const popover = (
      <Popover
        id={`popover-${video.group}-${video.id}`}
        className={`tutorial-popover ${fullscreen ? 'tutorial-popover-fullscreen' : ''}`}
        title={popOverTitle}
        onClick={this.stopClickEvent}
      >
        <div>
          <Webview
            style={{width: VIDEO_WIDTH, height: VIDEO_HEIGHT}}
            src={getEmbedLink(video.ytId, video.start, video.end)}
            allowFullScreen
            onNewWindow={this.onNewWindow}
            onFullscreen={this.onFullscreen}
            ref={this.setRef}
          />
          {children ? children.split('\n\n').map((paragraph) =>
            <p key={video.id}>{paragraph}</p>) : null}
        </div>
        <div className='tutorial-footer'>
          <a onClick={this.openLink}>
            <Icon name='open-in-browser'/>
            {' '}{t('More Videos by {{author}}', { replace: {author: video.attribution.author} })}
          </a>
        </div>
      </Popover>
    );

    const overlay = (
      <Overlay
        show={tutorialId === video.id && isOpen}
        onHide={this.hide}
        orientation={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
        target={this.getRef}
        getBounds={this.getBounds}
      >
        {popover}
      </Overlay>
    );

    if (dropdown) {
      return (
        <li className='tutorial-button-instance' role='presentation'>
          {overlay}
          {iconButton}
        </li>
      );
    } else {
      return (
        <div className='tutorial-button-instance'>
          {overlay}
          {iconButton}
        </div>
      );
    }
  }

  private onFullscreen = (fullscreen: boolean) => {
    this.nextState.fullscreen = fullscreen;
  }

  private onNewWindow = (url: string) => {
    util.opn(url).catch(() => null);
  }

  private stopClickEvent = (e) => {
    e.stopPropagation();
  }

  private renderTodo(): JSX.Element {
    return (
      <div className='tutorial-link tutorial-link-todo' ref={this.setRef} />
    );
  }

  private renderDropdownButton(t: TranslationFunction, name: string): JSX.Element {
    const { container } = this.props;
    return (
      <a
        ref={container !== undefined ? null : this.setRef}
        onClick={this.show}
        role='menuitem'
      >
        {t(name)}
      </a>
    );
  }

  private renderButton(t: TranslationFunction, name: string): JSX.Element {
    return (
      <div className='tutorial-link' ref={this.setRef}>
        <tooltip.IconButton tooltip={t(name)} onClick={this.show} icon='video'>
          <div className='button-text'>{t(name)}</div>
        </tooltip.IconButton>
      </div>
    );
  }

  private openLink = () => {
    util.opn(this.props.video.attribution.link).catch(err => null);
  }

  private getRef = () => {
    const { container } = this.props;
    if (container !== undefined) {
      return container;
    }

    return this.mRef;
  }

  private setRef = ref => {
    this.mRef = ref;
    if (ref !== null) {
      this.mRef = ReactDOM.findDOMNode(this.mRef) as Element;
    }
  }

  private show = evt => {
    const { onClick, onShow, video, isOpen } = this.props;
    evt.preventDefault();
    onShow(video.id, !isOpen);

    if (onClick) {
      onClick(false);
    }
  }

  private hide = evt => {
    const { onShow, video } = this.props;
    evt.preventDefault();
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

function mapDispatchToProps(dispatch: Redux.Dispatch<any>): IActionProps {
  return {
    onShow: (id: number, open: boolean) => dispatch(setTutorialOpen(id, open)),
  };
}

export default withTranslation(['common'])(
  connect(mapStateToProps, mapDispatchToProps)(
    TutorialButton) as any) as React.ComponentClass<IBaseProps>;
