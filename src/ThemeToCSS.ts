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
    let cssString = `html, body { background-color: ${variables[BACKGROUND_RULE]} !important; }
    
    #fullArticle div, h1, h2, h3, h4, h5, p, td, li, strong { color: ${variables['text-color']} !important; }
    
    a { color: ${variables['link-color']} !important; }
    
    .category-list a:hover, #docsSearch, .related, .contentWrapper { background-color: ${variables['brand-menu']} !important;
    border-top-color: ${variables['border-color']} !important;
    border-bottom-color: ${variables['border-color']} !important;
    border-right-color: ${variables['border-color']} !important;
    border-left-color: ${variables['border-color']} !important; }

    svg .theme-primary: { fill: #da8e35 }

    footer { pointer-events: none; }

    footer a { color: ${variables['text-color']} !important }`;

    if (this.isDarkTheme(rules)){
      //const nexusIcon = `background: url("data:image/svg+xml;charset=UTF-8,%3csvg style=%7b%7b width: 148, height: 35 %7d%7d viewBox='0 0 698.3 162.5'%3e%3cpath d='M44.4,162.5c-0.6,0-1.3,0-1.9-0.1c-1.5-0.2-2.9-0.5-4.5-1c-2.8-0.9-5.2-2.2-6.9-3.2c-3.8-2.2-7.7-4.9-11.8-8.3 c-1.8-1.5-3.6-3.1-5.3-4.7l-1.4-1.4c-1-0.9-1.9-1.9-2.6-3c-1.3-2-2.4-4.6-2.5-8c-0.1-1.1-0.2-2.2-0.2-3.4c0-2.4,0.1-5,0.5-7.5 c0.7-5.2,2.4-9.8,3.7-13.3c0.1-0.3,0.2-0.6,0.3-0.9c-0.4-0.9-0.7-1.9-1.1-2.9C8.9,99.6,7.7,93.8,7.1,88 c-0.6-6.1-0.4-12.3,0.5-18.4c0.2-1.3,0.4-2.6,0.7-3.8C5.9,62.3,2.9,57.3,1,51.5l0-0.1c-0.4-1.2-1.4-4.2-0.8-8 c0.2-1.4,0.5-2.8,1-4.3c0.9-2.8,2.2-5.1,3.2-6.8c2.2-3.8,4.9-7.6,8.2-11.7c1.5-1.8,3-3.6,4.6-5.2l1.4-1.4 c0.7-0.8,1.5-1.5,2.4-2.1c2-1.5,4.8-2.8,8.6-2.9c1.2-0.1,2.5-0.2,3.8-0.2h0.1c2.5,0,5.2,0.2,7.8,0.6c4,0.6,7.6,1.7,10.8,2.9 c2.1-0.9,4.3-1.7,6.6-2.5C64.1,8,69.9,6.8,75.7,6.4C81.8,5.9,88,6.2,93.9,7.2c1.4,0.2,2.8,0.5,4.2,0.8c4.7-3.2,9-5.5,13.5-6.9 l0.1,0c1-0.4,3.2-1.1,6.1-1.1c0.6,0,1.3,0,1.9,0.1c1.5,0.2,2.9,0.5,4.5,1c2.8,0.9,5.2,2.2,6.9,3.2c3.8,2.2,7.7,4.9,11.8,8.3 c1.8,1.5,3.6,3.1,5.3,4.7l1.4,1.4c0.7,0.6,1.4,1.3,1.9,2.1c1.8,2.3,3.2,5.6,3.3,10.2c0.1,1.6,0.1,3.3,0,5 c-0.2,3.7-0.7,7.2-1.6,10.4c-0.7,2.4-1.5,4.8-2.4,7.2c1.8,4.5,3.1,9.1,4,13.8c1.8,9.9,1.6,20.1-0.6,29.9c1.3,1.9,2.5,3.7,3.5,5.5 c1.7,3,3.1,6.1,4.1,9.3c0.4,1.2,1.3,4.2,0.7,8.2c-0.2,1.4-0.6,2.7-1.1,4.2c-1.8,5.1-4.6,9.3-7.1,12.8c-2.7,3.8-5.8,7.5-9,10.9 l-1.2,1.2c-0.7,0.8-1.5,1.5-2.4,2.2c-2,1.5-4.8,2.7-8.6,2.9c-1.2,0.1-2.5,0.2-3.8,0.2h-0.1c-2.7,0-5.4-0.2-8.2-0.7 c-4.5-0.7-8.5-2.1-12.1-3.5c-1.9,0.8-3.9,1.5-5.8,2.1c-5.6,1.7-11.5,2.8-17.4,3.1c-6.1,0.4-12.3-0.1-18.3-1.2 c-0.7-0.1-1.5-0.3-2.2-0.4c-5.2,3.7-9.8,6.1-14.6,7.7l-0.1,0C49.5,161.7,47.3,162.5,44.4,162.5L44.4,162.5z M24.6,134.1l10.6,3.7 c0.9-2.6,1-5.4,0.4-8c0,0.2,0,0.5,0.1,0.7c0,0.3,0.1,0.7,0.1,1.1c-0.1-2-0.8-4.6-2.6-7c-0.7-0.9-1.5-1.7-2.4-2.4l0.5,0.4l0.9,0.9 c-0.8-0.8-1.7-1.6-2.7-2.3L24.6,134.1L24.6,134.1z M123.7,129.4c-0.8,0.8-1.6,1.6-2.3,2.7l11.9,4.6l0-11.1c0,0,0,0,0,0 c-1.1,0-2.2,0.1-3.2,0.4c0.2,0,0.4,0,0.6,0c0.3,0,0.7-0.1,1.1-0.1c-1.8,0.1-4.2,0.7-6.4,2.1c-1.2,0.8-2.2,1.7-3.1,2.9l0.4-0.5 L123.7,129.4L123.7,129.4z M35.8,126.8c0.5,0.4,1,0.8,1.5,1.3c2.6,2.2,5,3.9,7.2,5.2c1.4-0.7,3-1.7,4.7-3 c0.5-0.3,0.9-0.7,1.4-1.1c0.3-0.2,0.5-0.5,0.8-0.7c0.1-0.1,0.3-0.3,0.4-0.4l6.2-6.3l8.4,2.9c0.3,0.1,0.6,0.2,0.8,0.3 c1.8,0.6,3.6,1,5.4,1.4c3.7,0.7,7.6,1,11.4,0.7c3.6-0.2,7.3-0.9,10.7-1.9c1.7-0.5,3.4-1.1,5-1.9c0.8-0.3,1.6-0.7,2.3-1.1 c2-1,4.3-1.6,6.6-1.6c3.6,0,6.3,1.3,7.6,2c0.4,0.2,0.8,0.4,1.3,0.5c2.5,1,5.4,2.2,8,2.6c0.4,0.1,0.9,0.1,1.3,0.2 c1.5-1.7,2.9-3.5,4.2-5.3c0.8-1.1,1.6-2.2,2.3-3.3c-0.1-0.2-0.2-0.4-0.4-0.7c-0.7-1.2-1.5-2.4-2.5-3.9c-0.3-0.5-0.7-0.9-1.1-1.4 c-0.2-0.2-0.3-0.4-0.5-0.6c-4.1-4-5.5-9.7-3.6-15.1c0.1-0.3,0.2-0.6,0.3-0.8c2.3-7.2,2.7-14.9,1.4-22.3c-0.7-3.5-1.7-7-3.2-10.3 c-0.1-0.3-0.3-0.6-0.4-0.9c-3.3-6.1-1.9-11.3-0.7-13.8c0.5-1,0.9-2.1,1.3-3.1c0.8-1.9,1.4-3.9,2-5.7c0.2-0.9,0.4-1.8,0.5-2.9 c-0.5-0.4-1-0.8-1.5-1.3c-2.7-2.2-5-3.9-7.2-5.2c-1.4,0.8-3,1.8-4.8,3c-0.5,0.4-1,0.8-1.5,1.2c-0.1,0.1-0.3,0.2-0.4,0.4 c-2.7,2.6-6.3,4-10,4c-1.8,0-3.5-0.3-5.2-1c-0.4-0.1-0.8-0.3-1.2-0.4c-1.8-0.5-3.6-1-5.5-1.3c-3.7-0.6-7.6-0.8-11.4-0.5 c-3.6,0.3-7.2,1-10.6,2.1c-1.7,0.5-3.3,1.2-4.9,1.9c-0.8,0.3-1.5,0.7-2.3,1.1L59.5,40c-2.1,1.2-4.6,1.8-7,1.8 c-2.2,0-4.4-0.5-6.5-1.5c-0.5-0.2-0.9-0.4-1.4-0.6c-2.4-1-5.3-2.1-7.8-2.4c-0.4-0.1-0.8-0.1-1.1-0.2c-0.4,0.5-0.8,1-1.2,1.4 c-2.2,2.7-3.9,5-5.2,7.3c0.7,1.4,1.7,2.9,2.9,4.7c0.3,0.5,0.7,1,1.1,1.4c0.2,0.3,0.5,0.5,0.7,0.8l5.8,6.1l-2.5,8 c-0.2,0.5-0.3,1-0.5,1.5c-0.5,1.8-0.9,3.7-1.2,5.6c-0.6,3.8-0.7,7.6-0.3,11.5c0.3,3.6,1.1,7.2,2.3,10.6c0.6,1.7,1.3,3.3,2,4.9 c0.1,0.2,0.2,0.4,0.3,0.6c2.1,4.3,2.1,9.1-0.1,13.4c-0.2,0.4-0.4,0.8-0.5,1.2c-0.4,1-0.9,2-1.3,3c-0.8,2.2-1.8,4.8-2.1,7.1 C35.9,126.3,35.8,126.6,35.8,126.8L35.8,126.8z M129.9,38.8c0.8,0.8,1.7,1.6,2.8,2.4l4.9-12.9L127,24.6c-0.9,2.6-1,5.4-0.4,8 c0-0.1,0-0.2,0-0.3c0-0.3,0-0.8,0-1.3v-0.1c0,1.5,0.5,4,2.1,6.4c0.8,1.1,1.7,2.1,2.8,3l-0.5-0.4L129.9,38.8L129.9,38.8z M29.3,26.3l0,11.1c1.1,0,2.2-0.1,3.2-0.4c-0.2,0-0.4,0-0.6,0c-0.3,0-0.7,0.1-1.1,0.1c1.8-0.1,4.2-0.7,6.4-2.1 c1.2-0.8,2.2-1.7,3.1-2.9l-0.4,0.5l-0.9,1c0.8-0.8,1.6-1.7,2.3-2.7L29.3,26.3L29.3,26.3z' /%3e%3cpath className='theme-secondary' d='M56.3,88.4l0.7,28.3l-7-5.7c-7.8,12.7-10.3,25-6.6,34.1l1.3,3.2l-3.2-1.4c-7.3-3.2-13.9-7.7-19.4-13.5 l-0.3-0.3l-0.1-0.5c-0.4-3.5-0.2-7.3,0.7-11.2l0-0.1c1.3-4.9,3.2-9.8,5.6-14.7c1.5-3.1,3.3-6.2,5.3-9.2l-6.1-5L56.3,88.4z' /%3e%3cpath className='theme-secondary' d='M105.9,74.1l-0.7-28.3l7,5.7c7.8-12.7,10.3-25,6.6-34.1l-1.3-3.2l3.2,1.4c7.3,3.2,13.9,7.7,19.4,13.5 l0.3,0.3l0.1,0.5c0.4,3.5,0.2,7.3-0.7,11.2l0,0.1c-1.3,4.9-3.2,9.8-5.6,14.7c-1.5,3.1-3.3,6.2-5.3,9.2l6.1,5L105.9,74.1z' /%3e%3cpath className='theme-secondary' d='M88.5,105.4l28.3-0.7l-5.7,7c12.7,7.8,25,10.3,34.1,6.6l3.2-1.3l-1.4,3.2c-3.2,7.3-7.7,13.9-13.5,19.4 l-0.3,0.3l-0.5,0.1c-3.5,0.4-7.3,0.2-11.2-0.7l-0.1,0c-4.9-1.3-9.8-3.2-14.7-5.6c-3.1-1.5-6.2-3.3-9.2-5.3l-5,6.1L88.5,105.4z' /%3e%3cpath className='theme-secondary' d='M74.1,57.6l-28.3,0.7l5.7-7c-12.7-7.8-25-10.3-34.1-6.6L14.3,46l1.4-3.2c3.2-7.3,7.7-13.9,13.5-19.4 l0.3-0.3L30,23c3.5-0.4,7.3-0.2,11.2,0.7l0.1,0c4.9,1.3,9.8,3.2,14.7,5.6c3.1,1.5,6.2,3.3,9.2,5.3l5-6.1L74.1,57.6z' /%3e%3ccircle className='theme-primary' cx='81.4' cy='80.8' r='60.5' /%3e%3cpath d='M59.3,59.5c-3.5-1.6-6.1-3.2-8.7-5.1c-4-2.8-7.7-5.9-10.8-9.2c-7.6-7.7-11.6-15.6-10.5-22.1L27,25.6 c-5.5,5.8-12.8,16-12.9,20.4c0.1,0.5,0.1,0.5,0.1,0.5c1,3.4,2.6,6.8,4.9,10.1l0,0.1c3,4.8,8.9,12.7,29.9,21.9l-3.7,7l28.3-7.6 L63.5,51.5L59.3,59.5z' fill='%23fff' /%3e%3cpath d='M103.3,103.5c3.5,1.6,6.1,3.2,8.7,5.1c4,2.8,7.7,5.9,10.8,9.2c7.6,7.7,11.6,15.6,10.5,22.1l2.3-2.4 c5.5-5.8,12.8-16,12.9-20.4c-0.1-0.5-0.1-0.5-0.1-0.5c-1-3.4-2.6-6.8-4.9-10.1l0-0.1c-3-4.8-8.9-12.7-29.9-21.9l3.7-7l-28.3,7.6 l10.2,26.2L103.3,103.5z' fill='%23fff' /%3e%3cpath d='M104,59.3c1.6-3.5,3.2-6.1,5.1-8.7c2.8-4,5.9-7.7,9.2-10.8c7.7-7.6,15.6-11.6,22.1-10.5L138,27 c-5.8-5.5-16-12.8-20.4-12.9c-0.5,0.1-0.5,0.1-0.5,0.1c-3.4,1-6.8,2.6-10.1,4.9l-0.1,0c-4.8,3-12.7,8.9-21.9,29.9l-7-3.7 l7.6,28.3L112,63.6L104,59.3z' fill='%23fff' /%3e%3cpath d='M58.2,103.2c-1.6,3.5-3.2,6.1-5.1,8.7c-2.8,4-5.9,7.7-9.2,10.8c-7.7,7.6-15.6,11.6-22.1,10.5l2.4,2.3 c5.8,5.5,16,12.8,20.4,12.9c0.5-0.1,0.5-0.1,0.5-0.1c3.4-1,6.8-2.6,10.1-4.9l0.1,0c4.8-3,12.7-8.9,21.9-29.9l7,3.7l-7.6-28.3 L50.3,98.9L58.2,103.2z' fill='%23fff' /%3e%3cg%3e%3cpath d='M198.6,131.3h-6V31.9h8.5l29.8,83.9V31.9h6v99.4h-7.2l-31.1-88.6V131.3z' fill='%23fff' /%3e%3cpath d='M281.1,77.9v6h-27.1v41.5h32.7v6h-39.2V31.9h39.2v6h-32.7v40H281.1z' fill='%23fff' /%3e%3cpath d='M321.8,85l-20.2,46.3h-6.4l22.4-51.5l-20.9-47.8h6.8l18.7,42.7l18.9-42.7h6.2l-20.9,47.8l22.3,51.5h-7 L321.8,85z' fill='%23fff' /%3e%3cpath d='M364.5,107.3c0,10.6,4,18.9,14.9,18.9s14.9-8.2,14.9-18.9V31.9h6.1V107c0,14.2-6,25.1-21.2,25.1 c-15.2,0-21.3-10.9-21.3-25.1V31.9h6.5V107.3z' fill='%23fff' /%3e%3cpath d='M452.8,55.9v2.1h-6.2v-2.6c0-10.5-4-18.5-14.8-18.5c-10.8,0-14.8,7.8-14.8,18.3c0,24.1,35.9,24.6,35.9,52 c0,14.3-6.2,24.8-21.4,24.8s-21.4-10.5-21.4-24.8v-5.1h6.2v5.5c0,10.6,4.1,18.3,15,18.3s15-7.7,15-18.3c0-23.9-35.9-24.3-35.9-52 c0-14.9,6.5-24.6,21.2-24.7C446.7,31.1,452.8,41.6,452.8,55.9z' fill='%23fff' /%3e%3cpath className='theme-primary' d='M495.8,102.5l10.6-70.6h21.7v99.4h-14.8V60.1l-10.8,71.3h-14.8l-11.6-70.3v70.3h-13.6V31.9h21.7L495.8,102.5z' /%3e%3cpath className='theme-primary' d='M537.6,55.8c0-15.9,8.4-25,23.7-25c15.3,0,23.7,9.1,23.7,25v51.7c0,15.9-8.4,25-23.7,25 c-15.3,0-23.7-9.1-23.7-25V55.8z M553.2,108.5c0,7.1,3.1,9.8,8.1,9.8s8.1-2.7,8.1-9.8V54.8c0-7.1-3.1-9.8-8.1-9.8s-8.1,2.7-8.1,9.8 V108.5z' /%3e%3cpath className='theme-primary' d='M594.4,31.9h24.7c15.6,0,23.3,8.7,23.3,24.6v50.3c0,15.9-7.7,24.6-23.3,24.6h-24.7V31.9z M610,46.1v71h8.8 c5,0,7.9-2.6,7.9-9.7V55.8c0-7.1-3-9.7-7.9-9.7H610z' /%3e%3cpath className='theme-primary' d='M672.6,30.8c15.2,0,23,9.1,23,25v3.1h-14.8v-4.1c0-7.1-2.8-9.8-7.8-9.8c-5,0-7.8,2.7-7.8,9.8 c0,20.4,30.5,24.3,30.5,52.7c0,15.9-8,25-23.3,25c-15.3,0-23.3-9.1-23.3-25v-6.1h14.8v7.1c0,7.1,3.1,9.7,8.1,9.7s8.1-2.6,8.1-9.7 c0-20.4-30.5-24.3-30.5-52.7C649.6,39.9,657.4,30.8,672.6,30.8z' /%3e%3c/g%3e%3c/svg%3e");`
      
      //cssString = cssString.concat(`a.brand img { display:none !important; } a.brand { ${nexusIcon} }!important; width:300px; height:70px }`);

      // Very hacky way of changing the nexus mods logo...
      cssString = cssString.concat( ' a.brand { background:url("https://sinsoftheprophets.com/img/nexusmods.png") !important; width:300px; height:70px } a.brand img { display:none !important; }' );
    }

    return cssString;
  }

  public static isDarkTheme(rules: CSSStyleRule[]): boolean {
    let regexp = new RegExp(`#variable.*color.*${BACKGROUND_RULE}`);
    let result = undefined;
    rules
    .find((rule) => {
      if ((rule.selectorText !== undefined) && regexp.test(rule.selectorText)) {
        let [r, g, b] = (rule.style.color.match(/[^a-z\(\)\,]+/gi));

        // Determine RGB luminance
        // Note: This algorithm is an approximation formula to convert RGB values to Luma
        //  We can assume that any value below the LUMINANCE_THRESHOLD constant is considered dark; while any value above
        //  should be considered as light.
        let luminance = (0.33 * parseInt(r)) + (0.5 * parseInt(g)) + (0.16 * parseInt(b));
        if ( luminance > LUMINANCE_THRESHOLD ) {
          result = false;
        } else {
          result = true;
        }

        return result;
      }
    });

    return result;
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




