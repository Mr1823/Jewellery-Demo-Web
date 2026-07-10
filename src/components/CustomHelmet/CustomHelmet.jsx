import React from "react";
import { Helmet } from "react-helmet-async";

const CustomHelmet = ({ title }) => {
  return (
    <Helmet>
      <title>{title} :: The Jewelz Store</title>
    </Helmet>
  );
};

export default CustomHelmet;
