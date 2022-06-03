import main from "./main";
import gameover from "./gameover";

/**
 * Converts object key names to css property style keynames
 * with the leading "--". Since the "--" is local implemenation detail 
 * for css property definitions. We don't want to rely on the the 
 * server or an outside source to provide this. 
 * 
 * @param {object} properties 
 */
export function ObjectToCSSProperty(properties) {
    const keys = Object.keys(properties);
    const leadingCharacters = "--";
    return keys.reduce((previousValue, currentObjKey) => {
       return {...previousValue, [leadingCharacters + currentObjKey]: properties[currentObjKey]}
    }, {});
}


export default {
    main: ObjectToCSSProperty(main),
    gameover: ObjectToCSSProperty(gameover)
}