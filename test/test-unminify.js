/**
 * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const mocha = require('mocha');
const unminify = require('../utils/unminify');
const sourceMap = require('source-map');
const chai = require('chai');
const sinon = require('sinon');
const Request = require('../utils/request');
const http = require('http');
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;
const expect = chai.expect;


describe('Test unminification', function() {
  const rawSourceMap = {
    version: 3,
    file: 'min.js',
    names: ['bar', 'baz', 'n'],
    sources: ['one.js', 'two.js'],
    sourceRoot: 'http://example.com/www/js/',
    mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA'
  };

  before(function() {
    //sinon.stub(request).yields(null, null, rawSourceMap);
    sinon.stub(Request, 'request').yields(null, null, JSON.stringify(rawSourceMap));
  });

  // tests
  it('Should unminify stack trace lines given source maps', function() {

    const sourceMapConsumer = new sourceMap.SourceMapConsumer(rawSourceMap);
    expect(unminify.unminifyLine(' at https://example.com/www/js/min.js:2:28',
        sourceMapConsumer)).to.equal(
            ' at http://example.com/www/js/two.js:2:10');
  });

  it('Should make only one network request per source map', function() {
    const stackTrace = ['http://example.com/www/js/two.js',
      'http://example.com/www/js/two.js'];
    const promises = unminify.extractSourceMaps(stackTrace);
    console.log(promises);
    expect(promises[0] === promises[1]);
  });

  it('Should use source map from cache if cached', function() {
    const stackTrace = ['https://cdn.ampproject.org/v0.js:2:28',
      'http://example.com/www/js/two.js:2:10',
      'http://example.com/www/js/two.js:15:28'];
    const promises = unminify.extractSourceMaps(stackTrace);
    Promise.all(promises).then(function(values) {
      expect(values[0] === values[1]);
      console.log(values);
    })
  })
});
