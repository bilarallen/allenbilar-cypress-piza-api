/// <reference types="cypress" />


describe('Pizza API Test Suite', function (){

    before('Pre-condition', function(){
        cy.clearJSONFile('cypress/fixtures/responsedata.json')
    })

     it('Test Create Authorization', function(){
         cy.fixture('testdata').then((loginData) =>{
            const username = loginData.pizzaAccess['username']
            const password = loginData.pizzaAccess['password']
            cy.POST_performCreateAccessToken(username, password)
         })
     })

     it('Test POST Request for Order Creation', function(){
          cy.POST_performCreatePizzaOrder()
     })


     it('Test DELETE request to remove created Order', function(){
          cy.DELETE_performRemovePizzaOrder().then((response) =>{
            expect(response).property('status').to.equal(200)
            expect(response).property('body').to.not.be.oneOf([null, ""])
            expect(response.body).property('message').to.equal('Order deleted')
          })
     })
     
    it('Test GET Request to Get list of Orders', function(){
            cy.GET_performReturnListOfPizza().then((response) =>{
            expect(response).property('status').to.equal(200)
            expect(response).property('body').to.not.be.oneOf([null, ""])
        })
    })
})