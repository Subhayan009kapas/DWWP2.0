export const loadRazorpayScript = () => {
          return new Promise((resolve) => {
              const script = document.createElement("script");
              script.src = "https://checkout.razorpay.com/v1/checkout.js";
              script.onload = () => resolve(true);
              script.onerror = () => resolve(false);
              document.body.appendChild(script);
          });
      };
      
      export const handlePayment = async (userId , amount, quantity, Refill, flag) => {
      
          const res = await loadRazorpayScript();
          if (!res) {
              alert("Razorpay SDK failed to load. Are you online?");
              return null; // Return null if Razorpay fails to load
          }
      
          return new Promise((resolve, reject) => {
                    
                    
              const options = {
                  key: import.meta.env.VITE_RAZORPAY_KEY,
                  amount: amount * 100, // Razorpay requires amount in paise
                  currency: "INR",
                  name: "DWWP Payments",
                  description: ` Payments for ${flag}`,
                  image: "https://i.ibb.co/TDd24C9X/Domestic.png",
                  handler: async function (response) {
                      resolve(response.razorpay_payment_id); // ✅ Return the paymentId
                  },
                  prefill: {
                      name: "User Name",
                      email: userId,
                      contact: "8785559456",
                  },
                  theme: {
                      color: "#1e293b",
                  },
                  modal: {
                      escape: false,
                      ondismiss: function () {
                          console.log("❌ Payment canceled by user.");
                          alert("Payment was canceled.");
                          resolve(null); // Return null if payment is canceled
                      }
                  }
              };
      
              const paymentObject = new window.Razorpay(options);
              paymentObject.open();
          });
      };