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
