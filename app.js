const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://neeraj:kateel@cluster0.k075h0n.mongodb.net/bankdb");

const bodyParser = require("body-parser");
const express = require("express");
var favicon = require('serve-favicon');
var path = require('path');
const app = express();

var sendersAccNum = 0;
var recieversAccNum = 0;
var amt = 0;
var sendersBal = 1;
var recieversBal = 0;
var bal = 0;

// app.use(favicon(__dirname + '/public/favicon2.ico'));
app.use(favicon(path.join(__dirname, 'public', 'favicon2.ico')))
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

//Created a new mongoose schema

const customerSchema = new mongoose.Schema({
  customer_id: Number,
  name: String,
  email: String,
  accountNo: Number,
  balance: Number
});

//Created a mongoose model for the above schema

const Customer = mongoose.model("Customer", customerSchema);

const transactionSchema = new mongoose.Schema({
  senderAcc: Number,
  recieverAcc: Number,
  amt: Number,
  status: String
});

const Transaction = mongoose.model("Transaction", transactionSchema);

//Defined many data to be inserted into the customer model

const customer1 = new Customer({
  customer_id: 1,
  name: "Neeraj",
  email: "neeraj@gmail.com",
  accountNo: 5634872364,
  balance: 24000
});

const customer2 = new Customer({
  customer_id: 2,
  name: "Pankaj",
  email: "pankaj@gmail.com",
  accountNo: 6456345645,
  balance: 16000
});

const customer3 = new Customer({
  customer_id: 3,
  name: "Dheeraj",
  email: "dheeraj@gmail.com",
  accountNo: 9665456345,
  balance: 240000
});

const customer4 = new Customer({
  customer_id: 4,
  name: "Shashank",
  email: "shashank@gmail.com",
  accountNo: 6543754534,
  balance: 43354
});

const customer5 = new Customer({
  customer_id: 5,
  name: "Pushpak",
  email: "pushpak@gmail.com",
  accountNo: 2346243534,
  balance: 3454563
});

const customer6 = new Customer({
  customer_id: 6,
  name: "Nipun",
  email: "nipun@gmail.com",
  accountNo: 6432452345,
  balance: 24000
});

const customer7 = new Customer({
  customer_id: 7,
  name: "Nishanth",
  email: "nishanth@gmail.com",
  accountNo: 6423543245,
  balance: 232333
});

const customer8 = new Customer({
  customer_id: 8,
  name: "Nandini",
  email: "nandini@gmail.com",
  accountNo: 6432543243,
  balance: 43424
});

const customer9 = new Customer({
  customer_id: 9,
  name: "Kartik",
  email: "kartik@gmail.com",
  accountNo: 6432345433,
  balance: 32342
});

const customer10 = new Customer({
  customer_id: 10,
  name: "Joyson",
  email: "joyson@gmail.com",
  accountNo: 3342454243,
  balance: 3443
});

//Code to insert the above data into the mongodb database

// Customer.insertMany([customer2,customer3,customer4,customer5,customer6,customer7,customer8,customer9,customer10],function(err){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("Successfully saved");
//   }
// });

//Rendering different pages for different buttons

app.post("/", function(req, res) {
  res.render("index");
})

app.post("/transfer", function(req, res) {
  res.render("transfer");
})

app.post("/customer", function(req, res) {
  //Seaching for the customer document from the database and sending it ti the required ejs file.
  Customer.find(function(err, customers) {
    if (err) {
      console.log(err);
    } else {
      res.render("customer", {
        customerInfo: customers
      });
    }
  });
})

app.post("/transaction", function(req, res) {
  //Seaching for the transaction document from the database and sending it ti the required ejs file.
  Transaction.find(function(err, transactions) {
    if (err) {
      console.log(err);
    } else {
      res.render("transactions", {
        transactionInfo: transactions
      });
    }
  });
})

app.post("/about", function(req, res) {
  res.render("about");
})

app.post("/balance", function(req, res) {
  res.render("balance", {
    balanceInfo: ""
  });
})

app.post("/bankBalance", function(req, res) {
  //Getting the text from the input box in the ejs file to app.js to get processed.
  const accNo = req.body.AccNo;
  //Check the balance of any customer using the account number and displaying the balance.
  Customer.find(function(err, customers) {
    if (err) {
      console.log(err);
    } else {
      customers.forEach(function(cus) {
        if (cus.accountNo == accNo) {
          Customer.find({
            accountNo: accNo
          }, function(err, customers) {
            if (err) {
              console.log(err);
            } else {
              customers.forEach(function(cust) {
                bal = cust.balance;
                res.render("balance", {
                  balanceInfo: "Balance : ₹" + bal
                });
              })
            }
          })
        }
      })
    }
  })
})

app.post("/transferDetails", function(req, res) {
  //Getting the text from the input box in the ejs file to app.js to get processed.
  sendersAccNum = req.body.senderAccNo;
  recieversAccNum = req.body.recieverAccNo;
  amt = req.body.amountToTransfer;
  var flag1 = 0;
  var flag2 = 0;

  Customer.find(function(err, customers) {
    if (err) {
      console.log(err);
    } else {
      customers.forEach(function(cus) {
        //Constraints on the data being entered into the database
        //Making sure only the right account number is entered etc.
        if (cus.accountNo == sendersAccNum && sendersAccNum != null && amt > 0 && amt != null && sendersAccNum != recieversAccNum) {
          Customer.find({
            accountNo: sendersAccNum
          }, function(err, customers) {
            if (err) {
              console.log(err);
            } else {
              customers.forEach(function(cust) {
                sendersBal = cust.balance;
                // console.log(sendersBal);
              });
            }
          });

          flag1 = 1;
        }
        if (cus.accountNo == recieversAccNum && recieversAccNum != null && amt > 0 && amt != null && sendersAccNum != recieversAccNum) {
          Customer.find({
            accountNo: recieversAccNum
          }, function(err, customers) {
            if (err) {
              console.log(err);
            } else {
              customers.forEach(function(cust) {
                recieversBal = cust.balance;
                // console.log(recieversBal);
              });
            }
          });

          flag2 = 1;
        }
      })

      if (flag1 == 1 && flag2 == 1) {
        //Using set timeout to wait for 1 second to execute this piece of code as the above code
        //usually takes lots of time to execute and this code depends on the above code.
        setTimeout(function() {
          if (sendersBal >= amt) {

            var sendersUpdatedBalance = (sendersBal - amt);
            //As the number was concatinating we used parseFloat
            var recieversUpdatedBalance = (parseFloat(recieversBal) + parseFloat(amt));
            //Update the balance of the sender
            Customer.updateOne({
              accountNo: sendersAccNum
            }, {
              balance: sendersUpdatedBalance
            }, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully updated");
              }
            })

            //Update the balance of the reciever
            Customer.updateOne({
              accountNo: recieversAccNum
            }, {
              balance: recieversUpdatedBalance
            }, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully updated");
              }
            })
            //If successfully updated render the success page
            res.render("success");

            setTimeout(function() {
              const transaction = new Transaction({
                senderAcc: sendersAccNum,
                recieverAcc: recieversAccNum,
                amt: amt,
                status: "Succeed"
              });

              transaction.save();

            }, 1000);

          } else {
            //If uncessful updated render the failed page
            res.render("failed", {
              failedTitle: "Insufficient Balance in Account!"
            });

            setTimeout(function() {
              const transaction = new Transaction({
                senderAcc: sendersAccNum,
                recieverAcc: recieversAccNum,
                amt: amt,
                status: "Failed"
              });

              transaction.save();

            }, 1000);
          }
        }, 1000);


      } else {
        //If uncessful updated render the failed page
        res.render("failed", {
          failedTitle: "Invalid Account Number"
        });

        setTimeout(function() {
          const transaction = new Transaction({
            senderAcc: sendersAccNum,
            recieverAcc: recieversAccNum,
            amt: amt,
            status: "Failed"
          });

          transaction.save();

        }, 1000);
      }
    }
  });
})

app.get("/", function(req, res) {
  res.render("index");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully.");
});
