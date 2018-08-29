/**
 * Class to convert the current theme, given as a set of CSS rules, 
 * into an injectable CSS string; to be used with Electron's Webviews.
 */

const BACKGROUND_RULE = 'brand-bg';
const LUMINANCE_THRESHOLD = 120;

export class ThemeToCSS {
  public static getCSSInjectString( rules: CSSStyleRule[] ) : string { 
    const variables = this.transformRules(rules);
    // String containing the css code we want to inject into the webview object
    return ( `html, body { background: transparent !important; }
    
    #fullArticle div, h1, h2, h3, h4, h5, p, td, li, strong { color: ${variables['text-color']} !important; }
    
    header { display: none !important; }

    a { color: ${variables['link-color']} !important; }
    
    .category-list a:hover, #docsSearch, .related, .contentWrapper { background-color: ${variables['brand-menu']} !important;
    border-top-color: ${variables['border-color']} !important;
    border-bottom-color: ${variables['border-color']} !important;
    border-right-color: ${variables['border-color']} !important;
    border-left-color: ${variables['border-color']} !important; }

    footer { pointer-events: none; }

    footer a { color: ${variables['text-color']} !important }`);
  }

  private static transformRules(rules: CSSStyleRule[]): { [id: string]: any } {
    return rules
      .filter(rule => (rule.selectorText !== undefined) && rule.selectorText.startsWith('#variable'))
      .reduce((prev, rule) => {
        const [id, type, key] = rule.selectorText.split(' ');
        prev[key.slice(1)] = rule.style[type.slice(1)];
        return prev;
      }, {});
  }
}




