/**
 * Class to convert the current theme, given as a set of CSS rules, 
 * into an injectable CSS string; to be used with Electron's Webviews.
 */

export class ThemeToCSS {
  public static getCSSInjectString( rules: CSSStyleRule[] ) : string { 
    const variables = this.transformRules(rules);
    // String containing the css code we want to inject into the webview object
    return ( `html, body, #content, #mw-pages > table { background: transparent !important; }
    
    #fullArticle div, h1, h2, h3, h4, h5, p, td, li, strong { color: ${variables['text-color']} !important; }

    .collapsible-nav, #mw-indicator, #mw-head, .noprint, .mw-helplink, .catlinks, #footer, #column-one, .portlet { 
      display: none !important; 
    }

    #content { 
      margin: 0 !important;
      border: none !important;
    }

    #content a { color: ${variables['link-color']}; }

    .external.text { 
      color: ${variables['text-color']} !important; 
      pointer-events: none !important;
      background: none !important;
      background-color: none !important;
      padding-right: 0 !important;
    }

    .noarticletext p a, .catlinks a { 
      pointer-events: none; 
      color: ${variables['text-color']} !important; 
    }
    
    pre {
      overflow: auto;
    }
    `);
  }

  private static transformRules(rules: CSSStyleRule[]): { [id: string]: any } {
    return rules
      .filter(rule => (rule.selectorText !== undefined) && rule.selectorText.startsWith('#variable'))
      .reduce((prev, rule) => {
        const [id, type, key] = rule.selectorText.split(' ');
        prev[key.slice(1)] = rule.style[type.slice(1)];
        return prev;
      }, {});  }
}