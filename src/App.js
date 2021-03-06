import Axios from "axios";
import React, { useState } from "react";
import "./App.css";
import { server } from "./server";

function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handlePaymentSuccess = async (response) => {
    try {
      let myData = new FormData();

      // we will send the response we've got from razorpay to the backend to validate the payment
      myData.append("response", JSON.stringify(response));

      await Axios({
        url: `${server}/api/v1/payment/success/`,
        method: "POST",
        data: myData,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
          .then((res) => {
            console.log("Everything is OK!");
            setName("");
            setAmount("");
          })
          .catch((err) => {
            console.log(err);
          });
    } catch (error) {
      console.log(console.error());
    }
  };

  // this will load a script tag which will open up Razorpay payment card to make transactions
  const loadScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  };

  const showRazorpay = async () => {
    const res = await loadScript();

    let myData = new FormData();

    // we will pass the amount and product name to the backend using form data
    myData.append("amount", amount.toString());
    myData.append("name", name);

    const data = await Axios({
      url: `${server}/api/v1/pay/`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: myData,
    }).then((res) => {
      return res;
    });

    // console.log(data)

    // in data we will receive an object from the backend with the information about the payment
    //that has been made by the user

    var options = {
      key_id: `rzp_test_2ioyu4SMKC1Nvz`,
      key_secret: `PeMxgIjo29GSSXIsPYCtZaiS`,
      amount: data.data.payment.amount,
      currency: "INR",
      name: "My Organisation",
      description: "Test transaction",
      image: "", // add image url
      order_id: data.data.payment.id,
      handler: function (response) {
        // we will handle success by calling handlePayment method and
        // will pass the response that we've got from razorpay
        handlePaymentSuccess(response);
      },
      prefill: {
        name: "Ankush",
        email: "ankush@test.com",
        contact: "9967280727",
      },
      notes: {
        address: "123, Central Avenue",
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
      <div className="container" style={{ marginTop: "20vh" }}>
        <form>
          <h1>Payment page</h1>

          <div className="form-group">
            <label htmlFor="name">Product name</label>
            <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Amount</label>
            <input
                type="text"
                className="form-control"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </form>
        <button onClick={showRazorpay} className="btn btn-primary btn-block mt-2">
          Pay
        </button>
      </div>
  );
}

export default App; 