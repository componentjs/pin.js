
var resolve = require('component-resolver');
var assert = require('assert');
var path = require('path');
var co = require('co');
var fs = require('fs');

var pin = require('..');

var filename = path.resolve('component.json');

describe('pin', function () {
  beforeEach(function (done) {
    fs.unlink(filename, done);
  })

  it('should pin dependencies', co(function* () {
    yield* write({
      name: 'test',
      dependencies: {
        "component/emitter": "~1.0.1"
      }
    });

    var tree = yield* resolve(process.cwd(), {
      install: true,
    });

    yield* pin(tree);

    var json = yield* read();
    assert.equal(json.dependencies['component/emitter'], '1.0.1');
  }))

  it('should pin development dependencies', co(function* () {
    yield* write({
      name: 'test',
      development: {
        dependencies: {
          "component/emitter": "~1.0.1"
        }
      }
    });

    var tree = yield* resolve(process.cwd(), {
      install: true,
    });

    yield* pin(tree, {
      development: true
    });

    var json = yield* read();
    assert.equal(json.development.dependencies['component/emitter'], '1.0.1');
  }))
})

function* write(json) {
  yield fs.writeFile.bind(null, filename, JSON.stringify(json, null, 2));
}

function* read() {
  var string = yield fs.readFile.bind(null, filename, 'utf8');
  return JSON.parse(string);
}