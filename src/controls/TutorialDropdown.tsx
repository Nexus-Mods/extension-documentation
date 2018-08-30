import * as React from 'react';
import { DropdownButton } from 'react-bootstrap';
import { translate } from 'react-i18next';
import { ComponentEx, tooltip } from 'vortex-api';
import TutorialButton from './TutorialButton';

import IYoutubeInfo from '../types/YoutubeInfo';

interface IBaseProps {
  groupName: string;
  videos: IYoutubeInfo[];
}

type IProps = IBaseProps;

class TutorialDropdown extends ComponentEx<IProps, {}> {
  public render(): JSX.Element {
    const { t, groupName, videos } = this.props;

    let titleContent: JSX.Element;
    titleContent = (
      <div className='tutorial-dropdown-title'>
        <tooltip.Icon name='video' buttonType='icon' tooltip={t('Tutorial videos')}/>
        <div className='button-text'>{t('Tutorials')}</div>
      </div>
    );

    let dropdownButton = (
      <DropdownButton className='tutorial-dropdown-group' title={titleContent} id={'tutorial-dropdown' + groupName}>
        {videos.map((video) => <TutorialButton key={video.group + video.id} dropdown video={video} />)}
      </DropdownButton>
    );

    return dropdownButton;
  }
}

export default translate(['common'])(TutorialDropdown) as React.ComponentClass<{}>;
