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
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection:'column', alignItems: 'center', width: '100%', height: '70%' }}>
        <tooltip.Icon style={{ marginRight: '0px' }} name='video' buttonType='icon' tooltip={t('Tutorial videos')}/>
        <div className='button-text'>{t('Tutorials')}</div>
      </div>
    );

    let dropdownButton = (
      <DropdownButton style={{ display: 'inline', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', maxWidth: '100%' }} title={titleContent} id={'tutorial-' + groupName}>
        {videos.map((video) => <TutorialButton key={video.group + video.id} dropdown video={video} />)}
      </DropdownButton>
    );

    return dropdownButton;
  }
}

export default translate(['common'])(TutorialDropdown) as React.ComponentClass<{}>;
