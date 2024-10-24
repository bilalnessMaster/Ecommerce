import { Check, CheckCircle, MoveRight } from "lucide-react";
import React, { useState  ,useEffect} from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { ClearCart } = useCartStore();
  const [Error, setError] = useState(null);
  useEffect(() => {
    const handleSuccess = async (sessionId) => {
      try {
        await axios.post("/payments/checkout-success", { sessionId });
        ClearCart();
      } catch (error) {
        console.log(error);
      } finally {
        setIsProcessing(false);
      }
    };
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (sessionId) {
      handleSuccess(sessionId);
    } else {
      setIsProcessing(false);
      setError("No session id found");
    }
  },[ClearCart]);
  if(isProcessing) return  "..Processing"
  if(Error) return Error
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center px-4 py-5 gap-5 ">
      <div className="flex flex-col items-center justify-center bg-white px-4 py-5 gap-4 rounded">
        <div className="flex flex-col items-center justify-center gap-2  ">
          <CheckCircle size={70} color="green" />
          <h1 className="text-4xl font-bold">Purchase Successful</h1>
          <p className="text-lg text-gray-300">
            Thank you for your purchase. We're processing your order.
          </p>
          <p className="text-sm text-green-400  ">
            Check your email for details
          </p>
        </div>
        <div className="bg-gray-200 rounded-lg w-full px-2 py-3 ">
          <div className="flex items-center justify-between text-lg text-gray-500 font-medium border-b pb-2 border-black/5">
            <p>Order number : </p>
            <p className=" text-gray-500">123456</p>
          </div>
          <div className="flex items-center justify-between text-lg text-gray-500 font-medium pt-2">
            <p>Order date : </p>
            <p className="text-sm text-gray-500">12/12/2022</p>
          </div>
        </div>
        <div className="bg-green-400 text-white font-semibold w-full flex justify-center items-center rounded-lg px-2 py-3">
          <p>Thanks for shopping with us</p>
        </div>
        <div>
          <Link
            to={"/"}
            className=" text-green-400 font-medium flex items-center gap-2 "
          >
            continue shopping <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
