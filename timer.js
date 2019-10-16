/**  video submission timeout, 2 minutes usually (in ms)
 * @type {Number} 
*/

/**  
 * Is submission timed out? Can only submit 1 video every X minutes
 * @type {Boolean}
 */
let interVar = false;

/**  
 * starts video timeout timer, errors if already in timeout
 * @param {function(Boolean,String):void} callback
*/
module.exports.setTimer = (INTERVAL_TIME = 120000, callback) => {

  if (interVar)
    callback(null, 'Already in timeout');

  // start timeout
  interVar = true;

  const timer = setTimeout(() => {

    interVar = false;

    callback(true);

    console.log('Timer Ended');

  }, INTERVAL_TIME);

};

/**
 * checks if okay to submit video/outside timeout period
 * @return {Boolean} FALSE = okay to submit, TRUE = still in timeout
 */
module.exports.submitTimeout = () => interVar;