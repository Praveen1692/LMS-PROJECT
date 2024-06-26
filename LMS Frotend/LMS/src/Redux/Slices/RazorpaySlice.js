import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosinstance";


const initialState = {
  key: "",
  subscription_id: "",
  isPaymnetVerified: false,
  allPayments: {},
  finalMonths: {},
  monthliSalesRecord: [],
};

export const getRazorPayId = createAsyncThunk("razorpay/getId", async () => {
  try {
    const response = await axiosInstance.get("/payments/razorpay-key");
    console.log("frotend correct respnose",response.data);
    return response.data;
  } catch (error) {
    toast.error("Failed to load data");
  }
});

export const verifyUserPayment = createAsyncThunk(
  "payments/verify",
  async (data) => {
    try {
      const response = axiosInstance.post("/payments/verify", {
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_subscription_id: data.razorpay_subscription_id,
        razorpay_signature: data.razorpay_signature,
      });
      return response.data;
    } catch (error) {
      toast.error("Failed to verify payment");
    }
  }
);

export const getPaymentRecord = createAsyncThunk(
  "/payments/record",
  async () => {
    try {
      const response = axiosInstance.get("/payments?count=100");
      toast.promise(response, {
        loading: "Getting the payments record",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to fetch the payment record",
      });
      return (await response).data;
    } catch (error) {
      toast.error("Failed to fetch the payment record");
    }
  }
);

export const cancelCourseBundle = createAsyncThunk(
  "/payments/cancel",
  async () => {
    try {
      const response = axiosInstance.post("/payments/unsubscribe");
      toast.promise(response, {
        loading: "Canceling the subscription",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to cancel the subscription",
      });
      return (await response).data;
    } catch (error) {
      toast.error("Failed to cancel the subscription");
    }
  }
);

export const purchaseCourseBundle = createAsyncThunk(
  "/purchaseCourse",
  async () => {
    try {
     
      const response = await axiosInstance.post("/payments/subscribe");
      //subscribe
      console.log("Frotend updated Response",response.data);
      return response.data;
    } catch (error) {
      toast.error("Failed to purchase course Chnage");
    }
  }
);

const razorpaySlice = createSlice({
  name: "razorpay",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRazorPayId.fulfilled, (state, action) => {
        state.key = action?.payload?.key;
      })
      .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
        state.subscription_id = action?.payload?.subscription_id;
      })
      .addCase(verifyUserPayment.fulfilled, (state, action) => {
        toast.success(action?.payload?.message);
        state.isPaymnetVerified = action?.payload?.success;
      })
      .addCase(verifyUserPayment.rejected, (state, action) => {
        toast.success(action?.payload?.message);
        state.isPaymnetVerified = action?.payload?.success;
      })
      .addCase(getPaymentRecord.fulfilled, (state, action) => {
        state.allPayments = action?.payload?.allPayments;
        state.finalMonths = action?.payload?.finalMonths;
        state.monthliSalesRecord = action?.payload?.monthliSalesRecord;
      });
  },
});

export default razorpaySlice.reducer;
