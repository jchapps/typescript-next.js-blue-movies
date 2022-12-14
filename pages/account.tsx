import { getProducts, Product } from "@stripe/firestore-stripe-payments";
import moment from "moment";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import Header from "../components/Header";
import Membership from "../components/Membership";
import useAuth from "../hooks/useAuth";
import useSubscription from "../hooks/useSubscription";
import payments from "../lib/stripe";

interface Props {
  products: Product[];
}

function account({ products }: Props) {
  const { user, logout } = useAuth();
  const subscription = useSubscription(user);
  const subDate = subscription?.created

  return (
    <div>
      <Head>
        <title>Your Icon</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="pt-32 mx-auto max-w-6xl px-5 pb-12 transition-all md:px-10">
        <div className="flex flex-col gap-x-4 justify-between md:flex-row md:items-center">
          <h1 className="text-3xl md:text-4xl">Account</h1>
          <div className="-ml-0.5 flex items-center gap-x-1.5">
            <img
              className="h-10 w-10"
              src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Microsoft_Account.svg"
              alt=""
            />
            <div>
              <p className="text-xs font-semibold">
                Member Since: {moment(subDate).format("MMM Do YYYY")}
              </p>
            </div>
          </div>
        </div>

        <Membership />

        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0">
          <h4 className="text-lg text-[gray]">Plan Details:</h4>
          {/* Find the current plan */}
          <div className="col-span-2 font-medium">
            {
              products.filter(
                (product) => product.id === subscription?.product
              )[0]?.name
            }
          </div>
          <p className="cursor-pointer text-blue-500 hover:underline md:text-right">
            Change plan
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0">
          <h4 className="text-lg text-[gray]">Settings</h4>
          <p
            className="col-span-3 cursor-pointer text-blue-500 hover:underline"
            onClick={logout}
          >
            Logout
          </p>
        </div>
      </main>
    </div>
  );
}

export default account;

// not serverside -- doesn't update everytime. compared to movies which needs to update everytime.
export const getStaticProps: GetStaticProps = async () => {
  const products = await getProducts(payments, {
    includePrices: true,
    activeOnly: true,
  })
    .then((res) => res)
    .catch((error) => console.log(error.message));

  return {
    props: {
      products,
    },
  };
};
