import { Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Copyright = () => {
  return (
    <Typography variant="subtitle2" color="grey">
      Copyright © 2023 {" "}
      <Link to="/" color="inherit">
        cooltrainer.
      </Link>
    </Typography>
  );
};

export default Copyright;
