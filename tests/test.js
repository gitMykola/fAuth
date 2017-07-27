/**
 * Created by Nick on 21.07.2017.
 */
//mocha --require should C:\xampp\MyProjects\doit.f16.od.ua\tests\test
var  foo = 'bar'
describe('foo variable', function () {
    it('should equal bar', function () {
        foo.should.equal('bar')
    })
})
