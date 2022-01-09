// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
function generateRandomNumber() {
    var number = "";
    var possible = "0123";
  
    for (var i = 0; i < 4; i++)
    number += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return number;
  }

Cypress.Commands.add('GET_performReturnListOfPizza', () =>{
    cy.request({
        method: 'GET',
        url: '/api/orders',
        headers:{
            'content-type': 'application/json;charset=UTF-8'
        }
    })
})

Cypress.Commands.add('POST_performCreateAccessToken', (username, password) =>{
    cy.request({
        method: 'POST',
        url: '/api/auth',
        headers:{
            'content-type': 'application/json;charset=UTF-8'
        },
        body:{
            'password': username,
            'username': password
        }
    }).then((response) =>{
        expect(response).property('status').to.equal(200)
        expect(response).property('body').to.not.be.oneOf([null, ""])
        cy.writeFile('cypress/fixtures/responsedata.json', {
            tokenValue: response.body.access_token,
        } 
        )
    })
})

Cypress.Commands.add('POST_performCreatePizzaOrder', () =>{
    const tableId = generateRandomNumber()
    cy.readFile('cypress/fixtures/responsedata.json').then((input) =>{
        cy.request({
            method: 'POST',
            url: '/api/orders',
            headers:{
                'content-type': 'application/json;charset=UTF-8',
                'authorization': 'Bearer '+input.tokenValue.replace(/^"|"$/g, ''),
            },
            body:{
                'Crust': 'Extra-thin',
                'Flavor': 'Vegetarian',
                'Size': 'Party-size',
                'Table_No': parseInt(tableId)
            }
        }).then((response) =>{
            expect(response).property('status').to.equal(201)
            expect(response).property('body').to.not.be.oneOf([null, ""])

             cy.readFile('cypress/fixtures/responsedata.json').then((orderId) =>{
             orderId.orderId = response.body.Order_ID
             cy.writeFile('cypress/fixtures/responsedata.json', orderId)
             })
        })
        
    }) 
})

Cypress.Commands.add('DELETE_performRemovePizzaOrder', () =>{
    cy.readFile('cypress/fixtures/responsedata.json').then((orderId) =>{
        cy.request({
            method: 'DELETE',
            url: '/api/orders/'+orderId.orderId,
            headers:{
                'content-type': 'application/json;charset=UTF-8'
            }
        })
    })
    
})

Cypress.Commands.add('clearJSONFile', path =>{cy.writeFile(path, '{}')})