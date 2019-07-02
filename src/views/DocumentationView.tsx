import * as _ from 'lodash';
import * as React from 'react';
import { Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { withTranslation } from 'react-i18next';
import { ComponentEx, FlexLayout, MainPage, Spinner, tooltip, util, Webview } from 'vortex-api';
import { ThemeToCSS } from '../ThemeToCSS';

// Default documentation webview "landing".
const VORTEX_DOCUMENTS_URL = 'https://wiki.nexusmods.com/index.php/Category:Vortex';

interface IComponentState {
  loading: boolean;
  url: string;
  history: string[];
  historyIdx: number;
}

interface IProps {}

class DocumentationView extends ComponentEx<IProps, IComponentState> {
  private mRef: Webview = null;
  private mWebView: Element;
  private mCallbacks: { [event: string]: () => void };
  private mMounted: boolean;

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

  public componentDidMount() {
    this.mMounted = true;
    this.context.api.events.on('navigate-knowledgebase', this.navigate);
  }

  public componentWillUnmount() {
    this.context.api.events.removeListener('navigate-knowledgebase', this.navigate);
    this.mMounted = false;
  }

  public render(): JSX.Element {
    const { t } = this.props;
    const { loading, history, historyIdx, url } = this.state;

    const PanelX: any = Panel;

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
              icon='highlight-home'
              onClick={this.navHome}
              disabled={url === VORTEX_DOCUMENTS_URL}
              tooltip={t('Home')}
            />
            <tooltip.IconButton
              icon='nav-forward'
              onClick={this.navForward}
              disabled={historyIdx === history.length - 1}
              tooltip={t('Forward')}
            />
          </div>
          <div className='flex-fill' />
          <div className='header-navigation-right'>
            <tooltip.IconButton
              icon='open-in-browser'
              onClick={this.openBrowser}
              disabled={url === undefined}
              tooltip={t('Open in Browser')}
            />
          </div>

        </MainPage.Header>
        <MainPage.Body>
          <FlexLayout type='column' className='documentation'>
            <Panel>
              <PanelX.Body>
                {loading ? this.renderWait() : null}
                <Webview
                  style={{ visibility: loading ? 'hidden' : 'visible', width: '100%', height: loading ? 0 : '100%'}}
                  src={url}
                  onLoading={this.onLoading}
                  ref={this.setRef}
                />
              </PanelX.Body>
            </Panel>
          </FlexLayout>
        </MainPage.Body>
      </MainPage>
    )
  }

  private onLoading = (loading: boolean) => {
    this.nextState.loading = loading;
  }

  private navigate = (url: string) => {
    if (this.mMounted) {
      (this.mWebView as any).stop();
      this.nextState.url = url;
    }
  }

  private renderWait() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spinner
          style={{
            width: '64px',
            height: '64px',
          }}
        />
      </div>
    );
  }

  private navBack = () => {
    const { history, historyIdx } = this.state;
    const newPos = Math.max(0, historyIdx - 1);
    this.nextState.historyIdx = newPos;
    this.nextState.url = history[newPos];
  }

  private navHome = () => {
    const { history, historyIdx } = this.state;
    const newPos = Math.min(history.length - 1, historyIdx + 1);
    this.nextState.historyIdx = newPos;
    this.nextState.url = VORTEX_DOCUMENTS_URL;
  }

  private navForward = () => {
    const { history, historyIdx } = this.state;
    const newPos = Math.min(history.length - 1, historyIdx + 1);
    this.nextState.historyIdx = newPos;
    this.nextState.url = history[newPos];
  }

  private openBrowser = () => {
    const { url } = this.state;
    util.opn(url).catch(err => null);
  }

  private setRef = ref => {
    this.mRef = ref;
    if (ref !== null) {
      this.mWebView = ReactDOM.findDOMNode(this.mRef) as Element;
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
  withTranslation(['common'])(DocumentationView as any) as React.ComponentClass<{}>;
