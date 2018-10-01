/**
 * Class to convert the current theme, given as a set of CSS rules, 
 * into an injectable CSS string; to be used with Electron's Webviews.
 */

export class ThemeToCSS {
  public static getCSSInjectString( rules: CSSStyleRule[] ) : string { 
    const variables = this.transformRules(rules);
    // String containing the css code we want to inject into the webview object
    return ( `html, body { background: transparent !important; }
    
    #fullArticle div, h1, h2, h3, h4, h5, p, td, li, strong { color: ${variables['text-color']} !important; }
    #column-one, .portlet { display: none; }

    #content { 
      width: 80% !important; 
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

    #footer { display: none; }`);
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