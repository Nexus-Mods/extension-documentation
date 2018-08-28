import { remote } from 'electron';
import * as React from 'react';
import { MenuItem, DropdownButton } from 'react-bootstrap';
import { translate } from 'react-i18next';
import { ComponentEx, tooltip } from 'vortex-api';
import TutorialButton from './TutorialButton';
import { getTutorialData } from '../tutorialManager';

import IYoutubeInfo from '../types/YoutubeInfo';

interface IBaseProps {
  groupName: string;
  videos: IYoutubeInfo[];
}

interface IActionProps {
  onAddVideo: (video: IYoutubeInfo) => void;
  onClickVideo: () => void;
}

type IProps = IBaseProps & IActionProps;

class TutorialDropdown extends ComponentEx<IProps, {}> {
  public render(): JSX.Element {
    const { t, groupName, videos } = this.props;

    let titleContent: JSX.Element;
    titleContent = (
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection:'column', alignItems: 'center', width: '100%', height: '70%' }}>
        <tooltip.Icon style={{ marginRight: '0px' }} name='video' buttonType='icon' tooltip={t('Tutorials')}/>
        <div className='button-text'>Tutorials</div>
      </div>
    );

    return (
      <DropdownButton style={{ display: 'inline', alignItems: 'center', width: '100%', height: '100%', maxWidth: '100%' }} title={titleContent} id={'tutorial-' + groupName}>
        {videos.map((video) => {this.renderTutorialButton(video)})}
      </DropdownButton>
    );
  }

  private renderTutorialButton = (video: IYoutubeInfo) => {
    return (
      <TutorialButton dropdown video={video} />
    );
  }
}

export default translate(['common'])(TutorialDropdown) as React.ComponentClass<{}>;
