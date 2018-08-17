import * as React from 'react';
import * as _ from 'lodash';
import { translate } from 'react-i18next';
import {ComponentEx, IconBar, ITableRowAction, log, MainPage,
  selectors, Table, TableTextFilter, ToolbarIcon,
  types, util} from 'vortex-api';
import { TutorialButton } from '../controls/TutorialButton'

interface IComponentState {
  notSureYet: {};
}

class TutorialList extends ComponentEx<{}, IComponentState> {
  private staticButtons: types.IActionDefinition[];

  constructor(props) {
    super(props);

    this.staticButtons = [
      {
        component: TutorialButton,
        props: () => {
          return {
            id: 'btn-tutorial-',
            key: 'btn-tutorial-',
            icon: 'icon-video',
            onClick: () => this.OnTutorialBtnClick(),
          };
        },
      },
    ];
  }

  public render(): JSX.Element {
    const { t } = this.props;

    return (
      <MainPage>
        <MainPage.Header>
        </MainPage.Header>
        <MainPage.Body>
        </MainPage.Body>
      </MainPage>
    );
  }

  private OnTutorialBtnClick() {
    
  }
}

export default translate(['common'])(TutorialList);
