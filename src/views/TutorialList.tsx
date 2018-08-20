import * as React from 'react';
import * as _ from 'lodash';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import {
  ComponentEx, IconBar, ITableRowAction, log, MainPage,
  selectors, Table, TableTextFilter, ToolbarIcon,
  types, util
} from 'vortex-api';

import YoutubeInfo from '../types/YoutubeInfo';
import TutorialButton from '../controls/TutorialButton';

interface IConnectedProps {
  tutorials: YoutubeInfo[];
}

type IProps = IConnectedProps;

class TutorialList extends ComponentEx<IProps, {}> {
  private mStaticButtons: types.IActionDefinition[];

  constructor(props) {
    super(props);
    this.mStaticButtons = [];
    // Set up the default tutorial buttons.
    //const tutorials: YoutubeInfo[] = getTutorialData() as Array<YoutubeInfo>;
    const tutorials: YoutubeInfo[] = props.tutorials;
  }

  private populateStaticButtons() {
    const { tutorials } = this.props;

    // Currently inserting duplicate values when clicking the tutorials tab for testing purposes.
    tutorials['tutorials'].forEach(element => {
      this.mStaticButtons.push({
        component: TutorialButton,
        props: () => {
          return {
            id: element.id,
            ytId: element.ytId,
            name: element.name,
            start: element.start,
            end: element.end,
          }
        }
      });
    });
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (nextProps.tutorials !== prevState.tutorials){
      return { tutorials: nextProps.tutorials };
    }
    else return null;
  }

  public render(): JSX.Element {
    const { t } = this.props;
    const TutorialIconBar: any = IconBar;
    this.populateStaticButtons();

    return (
      <MainPage>
        <MainPage.Header>
          <div className='Tutorials'>
            <TutorialIconBar
              group='tutorial'
              staticElements={this.mStaticButtons}
              className='menubar'
              t={t}
            >
            </TutorialIconBar>
          </div>
        </MainPage.Header>
        <MainPage.Body>
        </MainPage.Body>
      </MainPage>
    );
  }
}

function mapStateToProps(state: any): IConnectedProps {
  return {
    tutorials: state.session.tutorials,
  };
}

export default
  translate(['common'], { wait: false })(
    connect(mapStateToProps)(
      TutorialList)) as React.ComponentClass<IProps>;
