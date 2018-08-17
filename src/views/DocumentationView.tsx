import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';  
import { ComponentEx, tooltip, Spinner, Webview, MainPage, FlexLayout } from 'vortex-api';
import { translate } from 'react-i18next';
import { ThemeToCSS } from '../ThemeToCSS';
import TutorialButton from '../controls/TutorialButton';

// Default documentation webview "landing".
const VORTEX_DOCUMENTS_URL = 'https://help.nexusmods.com/category/46-vortex';

interface IComponentState {
  loading: boolean;
  url: string;
  history: string[];
  historyIdx: number;
}

interface IConnectedProps {
  url: string;
}

type IProps = IConnectedProps;

class DocumentationView extends ComponentEx<IProps, IComponentState> {
  private mRef: Webview = null;
  private mWebView: Element;
  private mCallbacks: { [event: string]: () => void };

  constructor(props: IProps) {
    super(props);
    this.initState({
      loading: false,
      url: VORTEX_DOCUMENTS_URL,
      history: [VORTEX_DOCUMENTS_URL],
      historyIdx: 0,
    });

    this.mCallbacks = {
      'did-finish-load': () => {
        const newUrl: string = (this.mWebView as any).getURL();
        this.nextState.url = newUrl;
        if (newUrl !== this.nextState.history[this.nextState.historyIdx]) {
          this.nextState.history.splice(this.nextState.historyIdx + 1, 9999, newUrl);
          ++this.nextState.historyIdx;
        }

        const cssString = ThemeToCSS.getCSSInjectString(this.getThemeSheet());
        (this.mWebView as any).insertCSS(cssString);
      },
    };
  }

  public render(): JSX.Element {
    const { t } = this.props;
    const { loading, history, historyIdx, url } = this.state;

    return (
      <MainPage>
        <MainPage.Header>
          <div className='header-navigation'>
            <tooltip.IconButton
              icon='nav-back'
              onClick={this.navBack}
              disabled={historyIdx === 0}
              tooltip={t('Back')}
            />
            <tooltip.IconButton
              icon='nav-forward'
              onClick={this.navForward}
              disabled={historyIdx === history.length - 1}
              tooltip={t('Forward')}
            />
            <TutorialButton id='tutorial-login' ytId='sD9xKao_u30' start='2.05' end='2.55' name={t('Login tutorial')} />
            <TutorialButton id='tutorial-dashboard' ytId='sD9xKao_u30' start='2.56' end='3.32' name={t('Dasboard introduction')} />
            <TutorialButton id='tutorial-multiuser' ytId='sD9xKao_u30' start='3.33' end='4.41' name={t('Multi User Mode')} />
            <TutorialButton id='tutorial-managemods' ytId='sD9xKao_u30' start='4.42' end='8.15' name={t('Mod management')} />

            <TutorialButton id='tutorial-nexuslinks' ytId='OrZM9LSuDhU' start='0.20' end='1.02' name={t('Handling Nexus Links')} />
            <TutorialButton id='tutorial-autodownload' ytId='OrZM9LSuDhU' start='1.02' end='5.05' name={t('Download/Install automatically')} />
            <TutorialButton id='tutorial-manualdownload' ytId='OrZM9LSuDhU' start='5.05' end='7.10' name={t('Download/Install manually')} />
            <TutorialButton id='tutorial-removemod' ytId='OrZM9LSuDhU' start='7.10' end='8.25' name={t('Remove mods')} />

            <TutorialButton id='tutorial-scriptinst' ytId='dWcHiamHhCA' start='0.24' end='1.02' name={t('Scripted Installer overview')} />
            <TutorialButton id='tutorial-scriptinst-install' ytId='dWcHiamHhCA' start='1.02' end='4.10' name={t('Using scripted installers')} />
            <TutorialButton id='tutorial-scriptinst-modify' ytId='dWcHiamHhCA' start='4.11' end='4.47' name={t('Modifying scripted installer mods')} />
            <TutorialButton id='tutorial-disablemod' ytId='dWcHiamHhCA' start='4.48' end='6.44' name={t('Disabling mods')} />
            <TutorialButton id='tutorial-uninstallmod' ytId='dWcHiamHhCA' start='6.44' end='8.27' name={t('Uninstalling mods')} />
            <TutorialButton id='tutorial-deletemod' ytId='dWcHiamHhCA' start='8.30' end='9.46' name={t('Deleting mods')} />
            <TutorialButton id='tutorial-deletearchive' ytId='dWcHiamHhCA' start='9.46' end='10.41' name={t('Deleting archives')} />

            <TutorialButton id='tutorial-datafiles' ytId='BQj8I5g4Qm4' start='1.12' end='3.36' name={t('Data files')} />
            <TutorialButton id='tutorial-masterfiles' ytId='BQj8I5g4Qm4' start='3.36' end='6.36' name={t('Master files')} />
            <TutorialButton id='tutorial-loadorder-overview' ytId='BQj8I5g4Qm4' start='6.36' end='9.02' name={t('Load order overview')} />
            <TutorialButton id='tutorial-loadorder-priority' ytId='BQj8I5g4Qm4' start='9.52' end='14.20' name={t('Global priority')} />
            <TutorialButton id='tutorial-loadorder-dependencies' ytId='BQj8I5g4Qm4' start='14.20' end='20.00' name={t('Reviewing/Setting dependencies')} />

          </div>

          <div className='flex-fill' />
        </MainPage.Header>
        <MainPage.Body>
          {loading ? this.renderWait() : null}
          <FlexLayout type='column' className='documentation'>
            <Webview
              style={{ width: '100%', height: '100%' }}
              src={url}
              onLoading={this.onLoading}
              ref={this.setRef}
            />
          </FlexLayout>
        </MainPage.Body>
      </MainPage>
    )
  }

  private onLoading = (loading: boolean) => {
    this.setState({ loading });
  }

  private renderWait() {
    return (
      <Spinner
        style={{
          width: '64px',
          height: '64px',
          position: 'absolute',
          top: 'auto',
          bottom: 'auto',
          left: 'auto',
          right: 'auto',
        }}
      />
    );
  }

  private navBack = () => {
    const { history, historyIdx } = this.state;
    const newPos = Math.max(0, historyIdx - 1);
    this.nextState.historyIdx = newPos;
    this.nextState.url = history[newPos];
  }

  private navForward = () => {
    const { history, historyIdx } = this.state;
    const newPos = Math.min(history.length - 1, historyIdx + 1);
    this.nextState.historyIdx = newPos;
    this.nextState.url = history[newPos];
  }

  private setRef = ref => {
    this.mRef = ref;
    if (ref !== null) {
      this.mWebView = ReactDOM.findDOMNode(this.mRef);
      Object.keys(this.mCallbacks).forEach(event => {
        this.mWebView.addEventListener(event, this.mCallbacks[event]);
      });
    } else {
      Object.keys(this.mCallbacks).forEach(event => {
        this.mWebView.removeEventListener(event, this.mCallbacks[event]);
      });
    }
  }

  private getThemeSheet(): CSSStyleRule[] {
    for (let i = 0; i < document.styleSheets.length; ++i) {
      if ((document.styleSheets[i].ownerNode as any).id === 'theme') {
        return Array.from((document.styleSheets[i] as any).rules);
      }
    }
    return [];
  }
}

export default 
  translate(['common'])(DocumentationView);
