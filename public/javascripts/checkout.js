// Render the PayPal button

[
  { price: "9.99", id: "#paypal-button1" },
  { price: "24.99", id: "#paypal-button2" },
  { price: "49.99", id: "#paypal-button3" }
].forEach(p => {
  paypal.Button.render(
    {
      // Set your environment

      env: "sandbox", // sandbox || production

      // Specify the style of the button

      style: {
        label: "pay",
        //fundingicons: true, // optional
        branding: true, // optional
        size: "small", // small | medium | large | responsive
        shape: "pill", // pill | rect
        color: "gold" // gold | blue | silve | black
      },

      // PayPal Client IDs - replace with your own
      // Create a PayPal app: https://developer.paypal.com/developer/applications/create

      client: {
        sandbox:
          "AYuEqzJuazUc7_0OXpJ9PG6gvndsAfQ57kmuoAe3bu7hPAwlooT6gr56G28p1iImkgg_gKDl4J3EXnwA",
        production: ""
      },

      // Wait for the PayPal button to be clicked

      payment: function(data, actions) {
        return actions.payment.create({
          payment: {
            transactions: [
              {
                amount: { total: p.price, currency: "USD" }
              }
            ],
            redirect_urls: {
              return_url: "https://sonobang.herokuapp.com/composer/thankyou?key=" + key
              //cancel_url: 'https://example.com'
            }
          }
        });
      },

      commit: true, // Optional: show a 'Pay Now' button in the checkout flow

      // Wait for the payment to be authorized by the customer

      onAuthorize: function(data, actions) {
        return actions.payment.get().then(function(paymentDetails) {
          $.post("/composer/pricing", { key: key, price: p.price }).done(function(data) {
            console.log(paymentDetails);
            actions.redirect();
          });

          

          //   document
          //     .querySelector("#confirm-button")
          //     .addEventListener("click", function() {
          //       // Execute the payment
          //       return actions.payment.execute().then(function() {
          //         actions.redirect();
          //       });
          //     });
        });
      },

      onCancel: function(data, actions) {
        // Show a cancel page or return to cart
        //console.log(data);
        //console.log(actions);
      },

      onError: function(err) {
        // alert(err);
        // Show an error page here, when an error occurs
      }
    },
    p.id // '#paypal-button1'
  );
});
