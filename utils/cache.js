/**
 * Copyright 2017 The AMP Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** Class wraps JS Map object to ensure no entry stays in map more than 2
 *  weeks without retrieval */
class Cache {
  /** */
  constructor() {
    this.expiryTime = 1209600;
    this.map = new Map();
  }

  /**
   * @param {key} key
   * @param {Object} value
   */
  set(key, value) {
    this.debounce(function() {
      map.delete(key);
    }, this.expiryTime);
    this.map.set(key, value);
  }

  /**
   * @param {key} key
   * @return {Object} value
   */
  get(key) {
    this.debounce(function() {
      map.delete(key);
    }, this.expiryTime);
    return this.map.get(key);
  }

  /**
   * @param {key} key
   * @return {boolean}
   */
  has(key) {
    return this.map.has(key);
  }

  /**
   * @param  {function} callback
   * @param {int} minInterval
   * @return {Function}
   */
  debounce(callback, minInterval) {
    let locker = 0;
    let timestamp = 0;
    let nextCallArgs = null;

    /**
     * @param {args} args
     */
    function fire(args) {
      nextCallArgs = null;
      callback.spread(null, args);
    }

    /**
     * @desc Fires
     */
    function waiter() {
      locker = 0;
      const remaining = minInterval - (Date.now() - timestamp);
      if (remaining > 0) {
        locker = setTimeout(waiter, remaining);
      } else {
        fire(nextCallArgs);
      }
    }

    return function(...args) {
      timestamp = Date.now();
      nextCallArgs = args;
      if (!locker) {
        locker = setTimeout(waiter, minInterval);
      }
    };
  }
}

module.exports = {Cache};
